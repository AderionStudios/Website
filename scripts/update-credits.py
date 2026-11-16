#!/usr/bin/env python3
"""Aderion credits media updater. No tokens or third-party packages required.

Order (default): existing website images -> original project's local cache ->
JAPI Discord public profile API -> initial/gradient fallbacks on the website.
Use --force to try refreshing images from the API before reusing local files.
"""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlparse
from urllib.request import Request, urlopen

ROOT = Path(__file__).resolve().parents[1]
DEST = ROOT / 'assets' / 'images' / 'team'
OLD_CACHE = ROOT / 'assets' / 'img' / 'team' / 'discord_cache'
CREDITS = ROOT / 'data' / 'credits.json'
FALLBACK_JS = ROOT / 'assets' / 'credits-data.js'
PROFILE_API = 'https://japi.rest/discord/v1/user/'
MAX_IMAGE_BYTES = 15 * 1024 * 1024
EXTS = ('gif', 'png', 'webp', 'jpg')
USER_AGENT = 'AderionStudios-Credits/2.0'


def image_format(blob: bytes):
    if blob.startswith(b'GIF87a') or blob.startswith(b'GIF89a'):
        return 'gif'
    if blob.startswith(b'\x89PNG\r\n\x1a\n'):
        return 'png'
    if blob.startswith(b'RIFF') and blob[8:12] == b'WEBP':
        return 'webp'
    if blob.startswith(b'\xff\xd8\xff'):
        return 'jpg'
    return None


def safe_image_url(value):
    if not isinstance(value, str):
        return None
    parsed = urlparse(value)
    # URLs come from public profile API, but restrict to Discord-owned image CDNs.
    allowed = {'cdn.discordapp.com', 'media.discordapp.net', 'cdn.discord.com'}
    if parsed.scheme != 'https' or parsed.hostname not in allowed:
        return None
    return value


def image_on_disk(folder: Path, discord_id: str, kind: str):
    """Return a valid existing image path, preferring newer files if multiple."""
    matches = []
    for ext in EXTS:
        path = folder / f'{discord_id}_{kind}.{ext}'
        if path.is_file():
            try:
                contents = path.read_bytes()
                if len(contents) <= MAX_IMAGE_BYTES and image_format(contents):
                    matches.append(path)
            except OSError:
                pass
    return max(matches, key=lambda p: p.stat().st_mtime) if matches else None


def store_image(blob: bytes, discord_id: str, kind: str):
    fmt = image_format(blob)
    if not fmt or len(blob) > MAX_IMAGE_BYTES:
        raise ValueError('The response was not a supported PNG/GIF/JPEG/WebP image')
    destination = DEST / f'{discord_id}_{kind}.{fmt}'
    destination.write_bytes(blob)
    # Remove older variants so we do not accidentally serve stale photos.
    for ext in EXTS:
        other = DEST / f'{discord_id}_{kind}.{ext}'
        if other != destination and other.is_file():
            other.unlink()
    return destination


def use_local_file(source: Path, discord_id: str, kind: str):
    try:
        result = store_image(source.read_bytes(), discord_id, kind)
        print(f'  OK: local cache -> assets/images/team/{result.name}')
        return result
    except (OSError, ValueError) as exc:
        print(f'  Local cache invalid: {exc}')
        return None


def cached_profile(discord_id: str):
    """Use original repository metadata if the public profile service is unavailable."""
    location = OLD_CACHE / f'{discord_id}_profile.json'
    try:
        raw = json.loads(location.read_text(encoding='utf-8'))
        user = raw.get('data') if isinstance(raw, dict) else None
        if isinstance(user, dict) and (not user.get('id') or str(user['id']) == discord_id):
            print('  Using original project cached Discord profile metadata')
            return user
    except (OSError, ValueError, TypeError):
        pass
    return None


def fetch_profile(discord_id: str):
    print(f'  Discord profile: {PROFILE_API}{discord_id}')
    req = Request(PROFILE_API + discord_id, headers={'User-Agent': USER_AGENT, 'Accept': 'application/json'})
    try:
        with urlopen(req, timeout=16) as r:  # nosec B310  # nosemgrep: python.lang.security.audit.dynamic-urllib-use-detected.dynamic-urllib-use-detected
            if int(getattr(r, 'status', 200)) != 200:
                raise ValueError(f'HTTP {r.status}')
            raw = r.read(2 * 1024 * 1024)
        profile = json.loads(raw.decode('utf-8'))
        user = profile.get('data') if isinstance(profile, dict) else None
        if not isinstance(user, dict):
            raise ValueError('Discord profile response contains no data')
        if user.get('id') and str(user['id']) != discord_id:
            raise ValueError('Discord profile user ID mismatch')
        return user
    except (HTTPError, URLError, TimeoutError, ValueError, UnicodeError, OSError) as exc:
        print(f'  Cannot fetch public Discord profile: {exc}')
        return cached_profile(discord_id)


def download_discord_image(url: str, discord_id: str, kind: str):
    safe = safe_image_url(url)
    if not safe:
        print(f'  No usable {kind} URL in public profile')
        return None
    # Discord CDN supports size; preserve any other query parameters.
    req = Request(safe, headers={'User-Agent': USER_AGENT, 'Accept': 'image/*'})
    try:
        with urlopen(req, timeout=20) as r:  # nosec B310  # nosemgrep: python.lang.security.audit.dynamic-urllib-use-detected.dynamic-urllib-use-detected
            data = r.read(MAX_IMAGE_BYTES + 1)
        if len(data) > MAX_IMAGE_BYTES:
            raise ValueError('image exceeds 15 MB')
        path = store_image(data, discord_id, kind)
        print(f'  OK: downloaded {kind} -> assets/images/team/{path.name}')
        return path
    except (HTTPError, URLError, TimeoutError, ValueError, OSError) as exc:
        print(f'  Could not download {kind}: {exc}')
        return None


def generate_fallback(data):
    FALLBACK_JS.write_text(
        '/* Auto-generated from data/credits.json. */\nwindow.ADERION_CREDITS = '
        + json.dumps(data, ensure_ascii=False, indent=2) + ';\n', encoding='utf-8')
    print(f'Wrote assets/credits-data.js')


def main(argv=None):
    parser = argparse.ArgumentParser(description='Update Credits avatar and banner images')
    parser.add_argument('--force', action='store_true', help='Try live Discord first (refresh existing images)')
    args = parser.parse_args(argv)
    try:
        data = json.loads(CREDITS.read_text(encoding='utf-8'))
        departments = data['departments']
        if not isinstance(departments, list):
            raise ValueError('departments must be an array')
    except (OSError, ValueError, KeyError, TypeError) as exc:
        print(f'ERROR: Cannot read data/credits.json: {exc}')
        return 2

    DEST.mkdir(parents=True, exist_ok=True)
    available, missing, updated = 0, 0, 0
    for dept in departments:
        for member in dept.get('members', []):
            discord_id = str(member.get('discordId', ''))
            if not discord_id.isdigit() or not 16 <= len(discord_id) <= 24:
                print(f'Skip {member.get("id", "member")}: missing/invalid discordId')
                continue
            print(f'\nMember: {member.get("name") or member.get("id") or discord_id}')
            # Fetch once per user, only when needed.
            live_data = None
            attempted_live = False
            for kind in ('avatar', 'banner'):
                existing = image_on_disk(DEST, discord_id, kind)
                legacy = image_on_disk(OLD_CACHE, discord_id, kind)
                result = None
                if not args.force:
                    if existing:
                        print(f'  OK: already in site -> {existing.name}')
                        result = existing
                    elif legacy:
                        result = use_local_file(legacy, discord_id, kind)
                if result is None:
                    if not attempted_live:
                        live_data = fetch_profile(discord_id)
                        attempted_live = True
                    url = live_data.get(kind + 'URL') if live_data else None
                    if url:
                        result = download_discord_image(url, discord_id, kind)
                # If API is not accessible, keep already available media.
                if not result and args.force:
                    if existing:
                        print(f'  Kept previous website image: {existing.name}')
                        result = existing
                    elif legacy:
                        result = use_local_file(legacy, discord_id, kind)
                if result:
                    available += 1
                    # The actual downloaded format may differ from avatarExt/bannerExt.
                    ext_key = kind + 'Ext'
                    if member.get(ext_key) != result.suffix[1:]:
                        member[ext_key] = result.suffix[1:]
                        updated += 1
                else:
                    missing += 1
                    print(f'  MISSING: {kind}. Site will use its initials / gradient fallback.')

    if updated:
        CREDITS.write_text(json.dumps(data, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
        print(f'Updated {updated} file extensions in data/credits.json')
    generate_fallback(data)
    print(f'\nResult: {available} images ready, {missing} missing.')
    print('Publish assets/images/team/, data/credits.json, and assets/credits-data.js to cPanel.')
    if missing:
        print('TIP: If the profile service is unavailable, add images manually to assets/images/team/.')
    return 0 if missing == 0 else 1


if __name__ == '__main__':
    sys.exit(main())
