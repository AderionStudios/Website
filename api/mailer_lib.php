<?php

/**
 * ============================================================================
 * ADERION STUDIOS — Shared mailer helpers (SMTP client, client IP, rate limit)
 * Used by api/apply.php and api/contact.php.
 * ============================================================================
 */

declare(strict_types=1);

/**
 * Resolve the client IP.
 *
 * Proxy headers (CF-Connecting-IP / X-Forwarded-For) can be forged by anyone,
 * so they are ONLY honoured when smtp_config.php sets 'trust_proxy_header'
 * (e.g. 'HTTP_CF_CONNECTING_IP' when the site really sits behind Cloudflare).
 * Every candidate must be a syntactically valid IP address.
 *
 * @param array<mixed, mixed> $config
 */
function aderionClientIp(array $config = []): string
{
    $remote = is_string($_SERVER['REMOTE_ADDR'] ?? null) ? $_SERVER['REMOTE_ADDR'] : '';
    $header = is_string($config['trust_proxy_header'] ?? null) ? $config['trust_proxy_header'] : '';

    if (
        $header !== ''
        && preg_match('/^HTTP_[A-Z0-9_]+$/', $header)
        && is_string($_SERVER[$header] ?? null)
        && $_SERVER[$header] !== ''
    ) {
        $candidate = trim(explode(',', $_SERVER[$header])[0]);
        if (filter_var($candidate, FILTER_VALIDATE_IP) !== false) {
            return $candidate;
        }
    }
    if (filter_var($remote, FILTER_VALIDATE_IP) !== false) {
        return $remote;
    }
    return '0.0.0.0';
}

function aderionRateFile(string $bucket, string $ip): string
{
    return sys_get_temp_dir() . '/aderion_' . $bucket . '_' . md5($bucket . '_rate_' . $ip) . '.tmp';
}

/**
 * Returns the number of seconds the client still has to wait (0 = allowed).
 * Read-only: it does NOT start the cooldown (see aderionRateMark()).
 */
function aderionRateRemaining(string $bucket, string $ip, int $cooldown = 30): int
{
    $file = aderionRateFile($bucket, $ip);
    if (@file_exists($file)) {
        $last = (int) @file_get_contents($file);
        $elapsed = time() - $last;
        if ($elapsed >= 0 && $elapsed < $cooldown) {
            return $cooldown - $elapsed;
        }
    }
    return 0;
}

/** Starts the cooldown. Call only once the input has passed validation. */
function aderionRateMark(string $bucket, string $ip): void
{
    @file_put_contents(aderionRateFile($bucket, $ip), (string) time(), LOCK_EX);
}

/** Strip CR/LF/NUL so a value can never break out of a mail header line. */
function aderionHeaderSafe(string $value): string
{
    return trim(str_replace(["\r", "\n", "\0"], ' ', $value));
}

/**
 * Accepts only absolute http(s) URLs. A bare "example.com/x" gets https://.
 * Returns the normalised URL or null when it is not acceptable.
 */
function aderionNormalizeUrl(string $raw, int $maxLen = 500): ?string
{
    $url = trim($raw);
    if ($url === '' || strlen($url) > $maxLen) {
        return null;
    }
    if (!preg_match('#^[a-z][a-z0-9+.\-]*:#i', $url)) {
        $url = 'https://' . $url;
    }
    if (preg_match('/[\x00-\x20\x7F"\'<>\\\\`]/', $url)) {
        return null;
    }
    $parts = parse_url($url);
    if ($parts === false || empty($parts['scheme']) || empty($parts['host'])) {
        return null;
    }
    if (!in_array(strtolower($parts['scheme']), ['http', 'https'], true)) {
        return null;
    }
    if (filter_var($url, FILTER_VALIDATE_URL) === false) {
        return null;
    }
    return $url;
}

/**
 * Minimal SMTP client (implicit TLS "ssl" or STARTTLS "tls").
 *
 * Security notes:
 *  - TLS certificates are verified by default. If the server presents a
 *    certificate for a different host name, set 'peer_name' in
 *    smtp_config.php instead of disabling verification.
 *  - The message body is normalised to CRLF and dot-stuffed, so a line that
 *    consists of "." inside user input can never terminate DATA early and
 *    smuggle extra SMTP commands.
 *  - Every SMTP command argument is checked for CR/LF.
 */
class SimpleSmtpClient
{
    private string $host;
    private int $port;
    private string $secure;
    private string $user;
    private string $pass;
    private int $timeout;
    private bool $verifyTls;
    private string $peerName;

    /** @var resource|null */
    private $socket = null;

    private string $lastError = '';

    public function __construct(
        string $host,
        int $port,
        string $secure,
        string $user,
        string $pass,
        int $timeout = 15,
        bool $verifyTls = true,
        string $peerName = ''
    ) {
        $this->host = $host;
        $this->port = $port;
        $this->secure = strtolower($secure);
        $this->user = $user;
        $this->pass = $pass;
        $this->timeout = $timeout;
        $this->verifyTls = $verifyTls;
        $this->peerName = $peerName !== '' ? $peerName : $host;
    }

    public function getLastError(): string
    {
        return $this->lastError;
    }

    private function readResponse(): string
    {
        if (!is_resource($this->socket)) {
            return '';
        }
        $data = '';
        while (!@feof($this->socket)) {
            $str = @fgets($this->socket, 515);
            if ($str === false) {
                break;
            }
            $data .= $str;
            if (isset($str[3]) && $str[3] === ' ') {
                break;
            }
            if (strlen($str) < 4) { // malformed short line, stop reading
                break;
            }
        }
        return trim($data);
    }

    private function sendCmd(string $cmd): string
    {
        if (!is_resource($this->socket)) {
            return '';
        }
        @fwrite($this->socket, $cmd . "\r\n");
        return $this->readResponse();
    }

    private static function hasLineBreak(string $v): bool
    {
        return strpbrk($v, "\r\n\0") !== false;
    }

    /** Normalise to CRLF and dot-stuff (RFC 5321 §4.5.2). */
    public static function prepareData(string $data): string
    {
        $data = str_replace(["\r\n", "\r"], "\n", $data);
        $data = str_replace("\n", "\r\n", $data);
        $data = preg_replace('/^\./m', '..', $data) ?? $data;
        return $data;
    }

    private function fail(string $message): bool
    {
        $this->lastError = $message;
        if (is_resource($this->socket)) {
            @fwrite($this->socket, "QUIT\r\n");
            @fclose($this->socket);
        }
        $this->socket = null;
        return false;
    }

    /**
     * @param list<string> $extraHeaders
     */
    public function send(
        string $from,
        string $to,
        string $subject,
        string $htmlBody,
        array $extraHeaders = []
    ): bool {
        foreach ([$from, $to, $subject] as $v) {
            if (self::hasLineBreak($v)) {
                $this->lastError = 'Geçersiz karakter (satır sonu) tespit edildi.';
                return false;
            }
        }
        foreach ($extraHeaders as $h) {
            if (self::hasLineBreak($h)) {
                $this->lastError = 'Geçersiz başlık (satır sonu) tespit edildi.';
                return false;
            }
        }

        $prefix = ($this->secure === 'ssl') ? 'ssl://' : 'tcp://';
        $target = $prefix . $this->host;

        $sslOptions = [
            'verify_peer'       => $this->verifyTls,
            'verify_peer_name'  => $this->verifyTls,
            'allow_self_signed' => false,
            'peer_name'         => $this->peerName,
            'SNI_enabled'       => true,
            'SNI_server_name'   => $this->peerName,
        ];
        $context = stream_context_create(['ssl' => $sslOptions]);

        $errno = 0;
        $errstr = '';
        $socket = @stream_socket_client(
            "{$target}:{$this->port}",
            $errno,
            $errstr,
            $this->timeout,
            STREAM_CLIENT_CONNECT,
            $context
        );

        if ($socket === false) {
            $this->socket = null;
            $this->lastError = "SMTP sunucusuna bağlanılamadı ({$target}:{$this->port}): "
                . "{$errstr} [Hata Kodu: {$errno}]";
            return false;
        }
        $this->socket = $socket;

        @stream_set_timeout($this->socket, $this->timeout);
        $res = $this->readResponse();
        if (!str_starts_with($res, '220')) {
            return $this->fail('Sunucu karşılama hatası: ' . $res);
        }

        $clientDomain = 'localhost';
        $rawHost = $_SERVER['HTTP_HOST'] ?? null;
        if (is_string($rawHost) && $rawHost !== '') {
            $candidate = explode(':', $rawHost)[0];
            if (preg_match('/^[A-Za-z0-9.\-]{1,253}$/', $candidate)) {
                $clientDomain = $candidate;
            }
        }

        $res = $this->sendCmd("EHLO {$clientDomain}");
        if (!str_starts_with($res, '250')) {
            $res = $this->sendCmd("HELO {$clientDomain}");
            if (!str_starts_with($res, '250')) {
                return $this->fail('EHLO/HELO reddedildi: ' . $res);
            }
        }

        if ($this->secure === 'tls') {
            $res = $this->sendCmd('STARTTLS');
            if (!str_starts_with($res, '220')) {
                return $this->fail('STARTTLS reddedildi: ' . $res);
            }
            if (
                !is_resource($this->socket)
                || !@stream_socket_enable_crypto($this->socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)
            ) {
                return $this->fail('TLS şifreleme el sıkışması başarısız oldu (sertifika doğrulanamadı olabilir).');
            }
            $res = $this->sendCmd("EHLO {$clientDomain}");
            if (!str_starts_with($res, '250')) {
                return $this->fail('TLS sonrası EHLO reddedildi: ' . $res);
            }
        }

        if ($this->user !== '' && $this->pass !== '') {
            $res = $this->sendCmd('AUTH LOGIN');
            if (!str_starts_with($res, '334')) {
                return $this->fail('AUTH LOGIN komutu reddedildi: ' . $res);
            }
            $res = $this->sendCmd(base64_encode($this->user));
            if (!str_starts_with($res, '334')) {
                return $this->fail('Kullanıcı adı kabul edilmedi: ' . $res);
            }
            $res = $this->sendCmd(base64_encode($this->pass));
            if (!str_starts_with($res, '235')) {
                return $this->fail('SMTP Kimlik doğrulama başarısız! E-posta adresi veya şifre hatalı: ' . $res);
            }
        }

        $res = $this->sendCmd("MAIL FROM:<{$from}>");
        if (!str_starts_with($res, '250')) {
            return $this->fail('Gönderici (MAIL FROM) adresi reddedildi: ' . $res);
        }

        $res = $this->sendCmd("RCPT TO:<{$to}>");
        if (!str_starts_with($res, '250')) {
            return $this->fail('Alıcı (RCPT TO) adresi reddedildi: ' . $res);
        }

        $res = $this->sendCmd('DATA');
        if (!str_starts_with($res, '354')) {
            return $this->fail('DATA komutu reddedildi: ' . $res);
        }

        $headersStr = implode("\r\n", $extraHeaders);
        $message = "Subject: {$subject}\r\n{$headersStr}\r\n\r\n" . $htmlBody;
        $payload = self::prepareData($message) . "\r\n.";
        $res = $this->sendCmd($payload);
        if (!str_starts_with($res, '250')) {
            return $this->fail('E-posta içeriği sunucu tarafından kabul edilmedi: ' . $res);
        }

        $this->sendCmd('QUIT');
        if (is_resource($this->socket)) {
            @fclose($this->socket);
        }
        $this->socket = null;
        return true;
    }
}
