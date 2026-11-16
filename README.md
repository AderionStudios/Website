# Aderion Studios Website

Static-first studio website for **Aderion Studios** with bilingual TR/EN support, light/dark theme persistence, live Discord-backed team credits, and SMTP-powered contact/application forms.

## Directory Structure

```text
├── index.html, visual-novel.html, studio.html, credits.html, join.html
├── mini-paint.html
├── assets/                 # Compiled CSS, JS, fonts, favicons, and team/studio images
├── api/                    # PHP 8.2 endpoints (contact, apply, discord, SMTP & logging)
├── data/                   # JSON data sources (credits.json)
├── docs/                   # Project documentation
├── scripts/                # QA, version bumping, SMTP testing, and credits helpers
├── .github/workflows/      # CI QA & FTPS deployment workflow
├── .htaccess               # Apache security headers, CSP, HTTPS, and caching rules
└── VERSION                 # Semantic version (X.Y.Z)
```

## Local Development

Because the site uses PHP endpoints (`api/contact.php`, `api/apply.php`, `api/discord.php`) and strict CSP/origin checks, preview it over HTTP with a PHP server rather than `file://` or `python3 -m http.server`.

Using Podman with the workspace mounted to `/var/www/html`:

```bash
podman run --rm -it -p 8080:8080 -v "$PWD:/var/www/html:Z" -w /var/www/html php:8.2-cli php -S 0.0.0.0:8080
```

Then open `http://localhost:8080`.

> **Note**: Real SMTP delivery requires `api/smtp_config.php` with valid mail server credentials; without it, form submissions return a server error and log details to `.error.log`.

## Documentation

- [Team Credits & Live Discord Profiles](docs/credits.md) — `data/credits.json`, `api/discord.php`, banner/color priority, `api/discord_config.php`, `japi.rest`, and Lanyard.
- [API Endpoints & SMTP Configuration](docs/api-and-smtp.md) — `api/contact.php`, `api/apply.php`, `api/mailer_lib.php`, `.error.log`, cPanel `api/smtp_config.php`, and `scripts/smtp-test.py`.
- [Deployment, Versioning & CI/CD](docs/deployment-and-ci.md) — `VERSION`, `scripts/bump-version.py`, `scripts/qa-check.py`, linters/SAST, `.htaccess` CSP, and FTPS GitHub Actions deploy.
