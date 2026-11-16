# Deployment, Versioning & CI/CD

The repository uses semantic versioning (`VERSION`), automated QA/linting/SAST checks, strict Apache security headers (`.htaccess`), and tag-based FTPS deployment via GitHub Actions (`.github/workflows/deploy.yml`).

## Versioning & Release Tags

- **`VERSION`**: Single-line file at the repository root containing the current `X.Y.Z` semantic version.
- **`scripts/bump-version.py`**: Reads `VERSION` and increments the semantic version (`patch`, `minor`, or `major`; defaults to `patch`) without running any git commands:

```bash
# Increment patch (default), minor, or major in VERSION
python3 scripts/bump-version.py
python3 scripts/bump-version.py patch
python3 scripts/bump-version.py minor
python3 scripts/bump-version.py major
```

After updating `VERSION`, commit the change and create/push a matching `vX.Y.Z` tag manually (for example, `git tag vX.Y.Z && git push origin main --tags`) to trigger the deployment job.

## QA, Linters & SAST

### Repository QA (`scripts/qa-check.py`)
Runs with Python's standard library (zero third-party dependencies):

```bash
python3 scripts/qa-check.py
```

It validates `VERSION` format, checks for git merge conflict markers, validates `data/credits.json` (structure and 17–20 digit `discordId` values), checks Python syntax across `scripts/*.py`, and audits HTML files for CSP violations (`<style>`, inline `<script>`, `style=""`, `on*` handlers), broken relative links, and i18n key consistency.

### Strict CI Checks (`.github/workflows/deploy.yml`)
The `qa` job runs on pushes to `main`, `v*` tags, pull requests to `main`, and `workflow_dispatch`:

- **Python** (`requirements-dev.txt`): `ruff`, `flake8`, `mypy --strict`, `bandit` on `scripts/qa-check.py` and `scripts/bump-version.py`.
- **PHP 8.2**: `php -l` on `api/*.php`, `phpcs --standard=phpcs.xml`, `phpstan analyse --configuration=phpstan.neon`, `php-cs-fixer fix --dry-run --config=.php-cs-fixer.dist.php`.
- **JS / CSS / JSON / HTML / XML**:
  - `biome check --error-on-warnings` (`biome.json`)
  - `eslint . --max-warnings=0` (`eslint.config.mjs`)
  - `stylelint "assets/*.css" --max-warnings=0` (`.stylelintrc.json`)
  - `htmlhint index.html visual-novel.html studio.html credits.html join.html` (`.htmlhintrc`)
  - `xmllint --noout sitemap.xml`
- **SAST**: `semgrep scan --config=auto --error --severity=WARNING .`

## `.htaccess` & Content Security Policy (CSP)

`.htaccess` enforces HTTPS, blocks dotfiles (except `/.well-known/` for AutoSSL/Let's Encrypt), blocks `*.log` files and uncompiled `src/`, sets `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, and sets a strict CSP:

```apache
Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'"
```

Because `script-src` and `style-src` do not allow `'unsafe-inline'`, all scripts and styles must live in external files under `assets/`. `connect-src 'self'` keeps browser requests same-origin (Discord data is fetched server-side by `api/discord.php`).

## Tag-Based FTPS Deploy

The `deploy` job in `.github/workflows/deploy.yml` depends on `qa` and runs only on `refs/tags/v*` or manual `workflow_dispatch`:

1. **Tag verification**: Strips the leading `v` from the tag name and verifies it matches the `VERSION` file exactly.
2. **FTPS sync**: Uses `SamKirkland/FTP-Deploy-Action` with `FTP_SERVER`, `FTP_USERNAME`, and `FTP_PASSWORD` repository secrets (`protocol: ftps`, `security: loose`, `server-dir: ./`).
3. **Exclusions**: Development files, linters, `scripts/**`, `docs/**`, `*.md`, `*.log`, `api/smtp_config.php`, and `api/discord_config.php` are excluded so neither docs nor live server secrets are overwritten.
