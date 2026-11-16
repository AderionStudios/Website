# Team Credits & Live Discord Profiles

The Credits page (`credits.html`) renders team departments and member cards from `data/credits.json` and enriches them with live Discord profile data served by `api/discord.php`.

## `data/credits.json` Structure

`data/credits.json` defines a top-level `departments` array. Each department object contains:

- `id`, `code`, `badge`: Department identifier and display badge (e.g., `"DEP // 01"`).
- `title_tr` / `title_en`: Localized department headings.
- `members`: Array of member objects.

Each member object supports:

- `id`: Unique slug.
- `discordId`: 17–20 digit Discord snowflake ID (validated by `scripts/qa-check.py` and `api/discord.php`).
- `roleBadge`, `role_tr` / `role_en`, `meta_tr` / `meta_en`, `pronouns`: Role and metadata labels.
- `name`, `handle`, `avatarExt`, `bannerExt`: Static fallback profile metadata and local asset extensions (`assets/images/team/`).
- `bubble_tr` / `bubble_en`: Fallback status bubble text shown when no live Discord custom status is available.
- `banner` *(optional)*: Pinned banner image or GIF path (e.g., `"assets/images/team/custom.gif"` or an `https://` URL).
- `links` *(optional)*: Key-value map of external profile URLs (GitHub, Steam, website, etc.).

## Live Discord Profile Endpoint (`api/discord.php`)

`assets/pages.js` fetches `GET api/discord.php` on load and refreshes every 90 seconds (`LIVE_REFRESH_MS = 90000`). The browser never connects to Discord directly—`api/discord.php` queries upstream APIs server-side and caches results in `sys_get_temp_dir()` (`aderion_discord_<hash>.json`).

- **Allowlisted IDs only**: `api/discord.php` reads `data/credits.json` and only queries `discordId` values present there (matching `/^\d{16,24}$/`). It is not an open proxy.
- **Caching**: Profile data (`username`, `globalName`, `avatarUrl`, `bannerUrl`, `bannerColor`, `decorationUrl`) is cached for `profile_ttl` (default `600` seconds). Presence/custom status is cached for `presence_ttl` (default `60` seconds).

### Profile & Status Data Sources

`api/discord.php` resolves member data in the following order:

1. **Official Discord API** (`https://discord.com/api/v10/users/{id}`): Used when `bot_token` is configured in `api/discord_config.php`. No Gateway intents or server membership are required.
2. **`japi.rest` fallback** (`https://japi.rest/discord/v1/user/{id}`): Unofficial public fallback used when `bot_token` is empty or the official API request fails (controlled by `japi_fallback`, default `true`).
3. **Lanyard presence** (`https://api.lanyard.rest/v1/users/{id}`): Optional live presence and custom status (`type === 4` activity) when `lanyard` is `true`. Each member who wants live custom status must join the Lanyard Discord server (`discord.gg/lanyard`) once.

### Banner & Color Priority

On the client (`assets/pages.js`), member card banners follow this priority order:

1. **Pinned `banner` in `data/credits.json`** (local image/GIF or `https://` URL — overrides Discord).
2. **Discord banner image** (`bannerUrl` from `api/discord.php`, for Nitro profiles).
3. **Discord banner / accent color** (`bannerColor` from `api/discord.php`).
4. **Dominant avatar color** (`dominantColor()` computed on a 16×16 canvas from the avatar image).

### Optional Server Configuration (`api/discord_config.php`)

To use an official Discord bot token on cPanel:

1. Copy `api/discord_config.example.php` to `api/discord_config.php` on the server (this file is gitignored and excluded from FTPS deploy).
2. Create an application in the Discord Developer Portal, open the **Bot** tab, click **Reset Token**, and paste the token into `'bot_token'`.
3. Optionally adjust `lanyard`, `japi_fallback`, `profile_ttl`, or `presence_ttl`.

## Offline Asset Sync (`scripts/update-credits.py`)

`scripts/update-credits.py` (and `update-credits.bat` on Windows) can download fallback avatars/banners into `assets/images/team/` for offline or static-only previews, and `scripts/sync-credits.py` regenerates `assets/credits-data.js` from `data/credits.json`. Live production pages do not depend on these scripts when `api/discord.php` is active.
