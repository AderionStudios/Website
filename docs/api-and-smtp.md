# API Endpoints & SMTP Configuration

The site includes two form-submission endpoints (`api/contact.php` and `api/apply.php`) backed by a standalone SMTP socket client (`api/mailer_lib.php`) and a server error logger (`api/error_logger.php`).

## Endpoints & Shared Helpers

### `api/contact.php`
- **Method**: `POST` only (returns `405` otherwise).
- **Input**: Accepts JSON (`{ name, email, message }`) or `$_POST` form data, capped at 16 KB (`413` if exceeded).
- **Protection**: Same-origin check against `HTTP_ORIGIN` / `HTTP_HOST` (`403` on mismatch), silent honeypot field (`website`), and 30-second per-IP rate limiting via `aderionRateRemaining()` / `aderionRateMark()`.
- **Delivery**: Sends an HTML email via `SimpleSmtpClient` with `From` set to the configured SMTP user and `Reply-To` set to the visitor's address.

### `api/apply.php`
- **Method**: `POST` only (returns `405` otherwise).
- **Input**: Accepts `$_POST` fields (`name`, `email`, `role`, `portfolio`, `experience`, `message`) from `join.html`, capped at 16 KB.
- **Validation**: Validates name, email (`FILTER_VALIDATE_EMAIL`), `http://`/`https://` portfolio URL via `aderionNormalizeUrl()`, role/experience mappings, and message length. Includes the same origin check, `website` honeypot, and 30-second per-IP rate limit.

### `api/mailer_lib.php`
Provides shared helpers used by both `api/contact.php` and `api/apply.php`:
- `aderionClientIp()`: Resolves `REMOTE_ADDR`, or a configured proxy header (`trust_proxy_header`, e.g., `HTTP_CF_CONNECTING_IP`) only when explicitly enabled in `api/smtp_config.php`.
- `aderionRateRemaining()` / `aderionRateMark()`: Read-only rate-limit check followed by cooldown marking in `sys_get_temp_dir()` only after input validation passes.
- `aderionHeaderSafe()` & `aderionNormalizeUrl()`: Prevents header injection and restricts portfolio links to `http`/`https`.
- `SimpleSmtpClient`: Standalone SMTP client supporting implicit TLS (`'secure' => 'ssl'`, port `465`) and STARTTLS (`'secure' => 'tls'`, port `587`), with TLS certificate verification (`verify_tls => true` by default, optional `peer_name`), CRLF normalization, and dot-stuffing. Does **not** rely on PHP `mail()`.

### `api/error_logger.php` (`.error.log`)
- `logServerError($source, $code, $detail, $context = [])` appends sanitized, single-line log entries to `.error.log` in the website root (`__DIR__ . '/../.error.log'`).
- Control characters are stripped and keys matching `pass(word)?|secret|token|auth` are redacted as `[REDACTED]`.
- `.error.log` is a dotfile intentionally; `.htaccess` denies external HTTP access to dotfiles and `*.log` files (`403`). In cPanel File Manager, enable **Show Hidden Files** to inspect `.error.log`.

## Configuring `api/smtp_config.php` on cPanel

`api/smtp_config.php` is listed in `.gitignore` and excluded from FTPS deployment in `.github/workflows/deploy.yml`, so credentials are never committed or overwritten.

1. On the cPanel server (inside `public_html/api/`), copy `api/smtp_config.example.php` to `api/smtp_config.php`.
2. Fill in the mailbox settings:
   - `'host'`: Mail server hostname (e.g., `mail.aderionstudios.com` or `localhost`).
   - `'port'` & `'secure'`: `465` with `'ssl'` (implicit TLS) or `587` with `'tls'` (STARTTLS).
   - `'username'` & `'password'`: Your cPanel email account credentials (e.g., `contact@aderionstudios.com`). Escape `'` or `\` if using single-quoted PHP strings.
   - `'to'` & `'fromName'`: Recipient address and sender display name.
   - `'verify_tls'`: Keep `true`. If the server certificate uses a different hostname, set `'peer_name'` instead of disabling verification.
   - `'trust_proxy_header'`: Set to `'HTTP_CF_CONNECTING_IP'` only if behind Cloudflare (or another trusted reverse proxy); otherwise leave `''`.

> **Note**: `api/.htaccess` also blocks direct browser access to `smtp_config.php`, `discord_config.php`, `.env`, `.tmp`, and `*.log` files.

## Testing SMTP with `scripts/smtp-test.py`

Run `scripts/smtp-test.py` from your local machine to verify whether the mailbox credentials work independently of the website:

```bash
# Test AUTH PLAIN / AUTH LOGIN over implicit TLS (port 465, default)
python3 scripts/smtp-test.py

# Test STARTTLS on port 587
python3 scripts/smtp-test.py --port 587 --starttls

# Also send a test email to the same mailbox after successful login
python3 scripts/smtp-test.py --send
```

The script prompts for the password securely via `getpass`, warns about leading/trailing whitespace, non-ASCII characters, or unescaped `'`/`\` characters, and makes at most two login attempts (`AUTH PLAIN` then `AUTH LOGIN`) to avoid triggering brute-force locks.
