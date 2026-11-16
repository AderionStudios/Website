#!/usr/bin/env python3
"""Repository QA check script for Aderion Studios website."""

from __future__ import annotations

import json
import re
import sys
from html.parser import HTMLParser
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent

HTML_FILES: tuple[str, ...] = (
    "index.html",
    "visual-novel.html",
    "studio.html",
    "credits.html",
    "join.html",
)
SITE_HTML_FILES: tuple[str, ...] = (
    "index.html",
    "visual-novel.html",
    "studio.html",
    "credits.html",
    "join.html",
)
CONFLICT_EXTENSIONS: frozenset[str] = frozenset(
    {".html", ".css", ".js", ".php", ".json", ".xml", ".md", ".yml", ".yaml"}
)
IGNORED_DIRS: frozenset[str] = frozenset({".git", "node_modules"})
IGNORED_LINK_PREFIXES: tuple[str, ...] = (
    "#",
    "http://",
    "https://",
    "mailto:",
    "tel:",
    "data:",
)
SITE_I18N_ATTRS: frozenset[str] = frozenset(
    {"data-t", "data-t-html", "data-t-aria", "data-t-alt"}
)

VERSION_RE = re.compile(r"^\d+\.\d+\.\d+$")
DISCORD_ID_RE = re.compile(r"^\d{17,20}$")
CONFLICT_RE = re.compile(r"^(?:<{7}|={7}|>{7})(?:\s|$)", re.MULTILINE)
JS_KEY_RE = re.compile(
    r"(?:^|[,{])\s*(?:['\"]([a-zA-Z0-9_.-]+)['\"]|([a-zA-Z0-9_$-]+))\s*:",
    re.MULTILINE,
)


class HtmlAuditParser(HTMLParser):
    """Parse HTML files for relative links, CSP violations, and i18n keys."""

    def __init__(self) -> None:
        """Initialize empty audit counters and key sets."""
        super().__init__()
        self.links: list[str] = []
        self.style_tags = 0
        self.inline_script_tags = 0
        self.inline_style_attrs = 0
        self.on_event_attrs: list[str] = []
        self.site_i18n_keys: set[str] = set()
        self.paint_i18n_keys: set[str] = set()

    def handle_starttag(
        self,
        tag: str,
        attrs: list[tuple[str, str | None]],
    ) -> None:
        """Inspect start tag for CSP compliance, links, and i18n attributes."""
        lower_tag = tag.lower()
        if lower_tag == "style":
            self.style_tags += 1
        elif lower_tag == "script" and not any(k == "src" for k, _ in attrs):
            self.inline_script_tags += 1

        for key, value in attrs:
            self._inspect_attribute(key.lower(), value)

    def _inspect_attribute(self, key: str, value: str | None) -> None:
        """Record CSP, link, and i18n metadata for a single attribute."""
        if key == "style":
            self.inline_style_attrs += 1
        if key.startswith("on"):
            self.on_event_attrs.append(key)
        if (
            key in {"src", "href"}
            and value
            and not value.startswith(IGNORED_LINK_PREFIXES)
        ):
            self.links.append(value)
        if key in SITE_I18N_ATTRS and value:
            self.site_i18n_keys.add(value)
        if key.startswith("data-i18n") and value:
            self.paint_i18n_keys.add(value)


def check_version(root: Path) -> list[str]:
    """Verify VERSION exists and matches semantic versioning X.Y.Z."""
    version_path = root / "VERSION"
    if not version_path.is_file():
        return ["VERSION file is missing."]
    content = version_path.read_text(encoding="utf-8").strip()
    if not VERSION_RE.match(content):
        return [f"VERSION '{content}' does not match '^\\d+\\.\\d+\\.\\d+$'."]
    return []


def check_conflict_markers(root: Path) -> list[str]:
    """Scan tracked-type text files for git merge conflict markers."""
    errors: list[str] = []
    for path in sorted(root.rglob("*")):
        if any(part in IGNORED_DIRS for part in path.parts):
            continue
        if not path.is_file() or path.suffix.lower() not in CONFLICT_EXTENSIONS:
            continue
        text = path.read_text(encoding="utf-8", errors="replace")
        if CONFLICT_RE.search(text):
            rel = path.relative_to(root)
            errors.append(f"Merge conflict marker found in {rel}.")
    return errors


def check_credits_json(root: Path) -> list[str]:
    """Validate data/credits.json structure and member discordId values."""
    credits_path = root / "data" / "credits.json"
    if not credits_path.is_file():
        return ["data/credits.json is missing."]
    try:
        payload: object = json.loads(credits_path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        return [f"data/credits.json is invalid JSON: {exc}"]

    if not isinstance(payload, dict):
        return ["data/credits.json root must be a JSON object."]
    departments = payload.get("departments")
    if not isinstance(departments, list) or not departments:
        return ["data/credits.json must contain a non-empty 'departments' list."]

    errors: list[str] = []
    for dep_idx, dep in enumerate(departments):
        errors.extend(_validate_department(dep_idx, dep))
    return errors


def _validate_department(dep_idx: int, dep: object) -> list[str]:
    """Validate a single department entry and its members' discordId fields."""
    if not isinstance(dep, dict):
        return [f"data/credits.json departments[{dep_idx}] must be an object."]
    members = dep.get("members")
    if not isinstance(members, list):
        return [f"data/credits.json departments[{dep_idx}].members must be a list."]

    errors: list[str] = []
    for mem_idx, member in enumerate(members):
        if not isinstance(member, dict):
            errors.append(
                f"data/credits.json departments[{dep_idx}].members[{mem_idx}] "
                "must be an object."
            )
            continue
        discord_id = member.get("discordId")
        if not isinstance(discord_id, str) or not DISCORD_ID_RE.match(discord_id):
            member_id = member.get("id", f"index {mem_idx}")
            errors.append(
                f"data/credits.json invalid discordId for member '{member_id}': "
                f"{discord_id!r}"
            )
    return errors


def _skip_non_code(text: str, idx: int) -> int | None:
    """Return index past a JS string literal or comment, or None if code."""
    ch = text[idx]
    if ch in ("'", '"', "`"):
        pos = idx + 1
        while pos < len(text):
            if text[pos] == "\\":
                pos += 2
                continue
            if text[pos] == ch:
                return pos + 1
            pos += 1
        return len(text)
    if text.startswith("//", idx):
        nl = text.find("\n", idx + 2)
        return len(text) if nl == -1 else nl + 1
    if text.startswith("/*", idx):
        end = text.find("*/", idx + 2)
        return len(text) if end == -1 else end + 2
    return None


def _extract_brace_block(text: str, open_idx: int) -> str:
    """Extract balanced {...} block starting at open_idx."""
    depth = 0
    idx = open_idx
    while idx < len(text):
        skipped = _skip_non_code(text, idx)
        if skipped is not None:
            idx = skipped
            continue
        if text[idx] == "{":
            depth += 1
        elif text[idx] == "}":
            depth -= 1
            if depth == 0:
                return text[open_idx : idx + 1]
        idx += 1
    raise ValueError("Unbalanced braces while parsing JS object.")


def _extract_object_keys(text: str, marker_pattern: str) -> set[str]:
    """Find JS object matching marker_pattern and return its keys."""
    match = re.search(marker_pattern, text)
    if not match:
        raise ValueError(f"Could not locate JS object matching {marker_pattern!r}")
    open_idx = text.find("{", match.start())
    block = _extract_brace_block(text, open_idx)
    keys: set[str] = set()
    for key_match in JS_KEY_RE.finditer(block):
        key = key_match.group(1) or key_match.group(2)
        if key:
            keys.add(key)
    return keys


def _parse_html_file(path: Path) -> HtmlAuditParser:
    """Parse an HTML file and return its populated HtmlAuditParser."""
    parser = HtmlAuditParser()
    parser.feed(path.read_text(encoding="utf-8"))
    parser.close()
    return parser


def check_html_links_and_csp(
    root: Path,
) -> tuple[list[str], dict[str, HtmlAuditParser]]:
    """Verify relative links and strict CSP compliance across all HTML files."""
    errors: list[str] = []
    parsed: dict[str, HtmlAuditParser] = {}

    for rel_name in HTML_FILES:
        file_path = root / rel_name
        if not file_path.is_file():
            errors.append(f"HTML file missing: {rel_name}")
            continue
        parser = _parse_html_file(file_path)
        parsed[rel_name] = parser
        errors.extend(_check_links_for_file(root, rel_name, parser.links))
        errors.extend(_check_csp_for_file(rel_name, parser))

    return errors, parsed


def _check_links_for_file(root: Path, rel_name: str, links: list[str]) -> list[str]:
    """Verify all relative src/href targets resolve to existing files."""
    errors: list[str] = []
    for link in links:
        clean = link.split("?", maxsplit=1)[0].split("#", maxsplit=1)[0]
        if not clean:
            continue
        target = (root / clean.lstrip("/")).resolve()
        if not target.exists():
            errors.append(f"{rel_name}: broken relative link '{link}'")
    return errors


def _check_csp_for_file(rel_name: str, parser: HtmlAuditParser) -> list[str]:
    """Verify zero inline styles, inline scripts, or on* event handlers."""
    errors: list[str] = []
    if parser.style_tags:
        errors.append(f"{rel_name}: found {parser.style_tags} <style> tag(s)")
    if parser.inline_script_tags:
        errors.append(
            f"{rel_name}: found {parser.inline_script_tags} inline <script> tag(s)"
        )
    if parser.inline_style_attrs:
        errors.append(
            f"{rel_name}: found {parser.inline_style_attrs} inline style attribute(s)"
        )
    if parser.on_event_attrs:
        attrs_list = ", ".join(sorted(set(parser.on_event_attrs)))
        errors.append(f"{rel_name}: found inline event handler(s): {attrs_list}")
    return errors


def check_i18n_coverage(
    root: Path,
    parsed_html: dict[str, HtmlAuditParser],
) -> list[str]:
    """Verify full TR/EN i18n key coverage for site pages and mini-paint."""
    errors: list[str] = []
    main_js = (root / "assets" / "main.js").read_text(encoding="utf-8")
    pages_js = (root / "assets" / "pages.js").read_text(encoding="utf-8")
    paint_js = (root / "assets" / "mini-paint.js").read_text(encoding="utf-8")

    site_tr = _extract_object_keys(main_js, r"\btr\s*:\s*\{") | _extract_object_keys(
        pages_js, r"\bconst\s+extraTr\s*=\s*\{"
    )
    site_en = _extract_object_keys(main_js, r"\ben\s*:\s*\{") | _extract_object_keys(
        pages_js, r"\bconst\s+extraEn\s*=\s*\{"
    )

    site_keys: set[str] = set()
    for name in SITE_HTML_FILES:
        if name in parsed_html:
            site_keys |= parsed_html[name].site_i18n_keys

    errors.extend(_missing_key_errors("site TR", site_keys, site_tr))
    errors.extend(_missing_key_errors("site EN", site_keys, site_en))

    paint_tr = _extract_object_keys(paint_js, r"\btr\s*:\s*\{")
    paint_en = _extract_object_keys(paint_js, r"\ben\s*:\s*\{")
    paint_keys = (
        parsed_html["mini-paint.html"].paint_i18n_keys
        if "mini-paint.html" in parsed_html
        else set()
    )

    errors.extend(_missing_key_errors("mini-paint TR", paint_keys, paint_tr))
    errors.extend(_missing_key_errors("mini-paint EN", paint_keys, paint_en))
    return errors


def _missing_key_errors(
    scope: str,
    required_keys: set[str],
    available_keys: set[str],
) -> list[str]:
    """Return formatted errors for any required i18n keys missing from a locale."""
    missing = sorted(required_keys - available_keys)
    return [f"Missing {scope} i18n key: '{key}'" for key in missing]


def main() -> int:
    """Run all QA checks and return 0 on success or 1 on failure."""
    errors: list[str] = []
    errors.extend(check_version(ROOT_DIR))
    errors.extend(check_conflict_markers(ROOT_DIR))
    errors.extend(check_credits_json(ROOT_DIR))

    html_errors, parsed_html = check_html_links_and_csp(ROOT_DIR)
    errors.extend(html_errors)
    errors.extend(check_i18n_coverage(ROOT_DIR, parsed_html))

    if errors:
        print(f"QA check FAILED with {len(errors)} error(s):", file=sys.stderr)
        for err in errors:
            print(f"  - {err}", file=sys.stderr)
        return 1

    print("QA check PASSED: VERSION, conflicts, credits.json, links, CSP, and i18n OK.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
