<?php
/**
 * ============================================================================
 * ADERION STUDIOS — Production Application Mailer Endpoint (SMTP Architecture)
 * Secure, rate-limited, honeypot-protected, standalone SMTP socket client.
 * Does NOT rely on PHP mail() function (which is disabled on shared hosts).
 * ============================================================================
 */
declare(strict_types=1);

require_once __DIR__ . '/error_logger.php';

// 1. Strict Security & Caching Headers
header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
header('X-Frame-Options: DENY');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Pragma: no-cache');

// Helper to return consistent JSON responses
function jsonResponse(int $statusCode, bool $ok, string $code, string $message, array $extra = []): void {
    http_response_code($statusCode);
    echo json_encode(array_merge([
        'ok' => $ok,
        'code' => $code,
        'message' => $message,
        'timestamp' => time()
    ], $extra), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

// 2. HTTP Method Gate
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    jsonResponse(405, false, 'method_not_allowed', 'Yalnızca POST istekleri kabul edilir.');
}

// 3. Payload Size Limitation (16KB max)
$contentLength = (int)($_SERVER['CONTENT_LENGTH'] ?? 0);
if ($contentLength > 16384) {
    jsonResponse(413, false, 'payload_too_large', 'Gönderilen veri boyutu çok büyük.');
}

// 4. Same-Origin & Referer Verification (CSRF Protection)
$httpOrigin = $_SERVER['HTTP_ORIGIN'] ?? '';
$httpHost = $_SERVER['HTTP_HOST'] ?? '';
if (!empty($httpOrigin)) {
    $originHost = parse_url($httpOrigin, PHP_URL_HOST);
    $serverHost = explode(':', (string)$httpHost)[0];
    if ($originHost && !empty($serverHost)) {
        // Strip leading www. for comparison
        $cleanOrigin = preg_replace('/^www\./i', '', (string)$originHost);
        $cleanServer = preg_replace('/^www\./i', '', (string)$serverHost);
        if (strcasecmp($cleanOrigin, $cleanServer) !== 0) {
            jsonResponse(403, false, 'forbidden_origin', 'Geçersiz istek kaynağı.');
        }
    }
}

// 5. Bot-Trap (Honeypot) Check
if (!empty($_POST['website'])) {
    jsonResponse(200, true, 'success', 'Başvurunuz başarıyla alındı.');
}

// 6. Rate Limiting via local temp file (45s cooldown per IP)
$clientIp = $_SERVER['HTTP_CF_CONNECTING_IP'] 
    ?? $_SERVER['HTTP_X_FORWARDED_FOR'] 
    ?? $_SERVER['REMOTE_ADDR'] 
    ?? '127.0.0.1';
$clientIp = explode(',', (string)$clientIp)[0];
$clientIpClean = preg_replace('/[^a-zA-Z0-9_.-]/', '_', trim($clientIp));

$tempDir = sys_get_temp_dir();
$rateFile = $tempDir . '/aderion_apply_' . md5('apply_rate_' . $clientIpClean) . '.tmp';
$now = time();
$cooldownSeconds = 30;

if (@file_exists($rateFile)) {
    $lastTime = (int)@file_get_contents($rateFile);
    if (($now - $lastTime) < $cooldownSeconds) {
        $waitRemaining = $cooldownSeconds - ($now - $lastTime);
        jsonResponse(429, false, 'rate_limited', "Lütfen tekrar göndermeden önce {$waitRemaining} saniye bekleyin.");
    }
}
@file_put_contents($rateFile, (string)$now, LOCK_EX);

// 7. Sanitization & Input Validation
function cleanSingleLine(?string $val, int $max = 120): string {
    $val = trim((string)$val);
    $val = str_replace(["\r", "\n", "\t", "\0"], ' ', $val);
    $val = strip_tags($val);
    if (mb_strlen($val, 'UTF-8') > $max) {
        $val = mb_substr($val, 0, $max, 'UTF-8');
    }
    return $val;
}

$name = cleanSingleLine($_POST['name'] ?? '', 100);
$rawEmail = cleanSingleLine($_POST['email'] ?? '', 180);
$roleKey = cleanSingleLine($_POST['role'] ?? '', 60);
$portfolio = cleanSingleLine($_POST['portfolio'] ?? '', 500);
$experienceKey = cleanSingleLine($_POST['experience'] ?? '', 40);
$rawMessage = trim((string)($_POST['message'] ?? ''));

// Validate Name
if (mb_strlen($name, 'UTF-8') < 2) {
    jsonResponse(422, false, 'invalid_name', 'Lütfen geçerli bir isim girin.');
}

// Validate Email
$cleanEmail = filter_var($rawEmail, FILTER_VALIDATE_EMAIL);
if (!$cleanEmail) {
    jsonResponse(422, false, 'invalid_email', 'Lütfen geçerli bir e-posta adresi girin.');
}

// Roles Dictionary & Mapping
$rolesCatalog = [
    'character-artist'   => '2D Karakter Çizeri (2D Character Artist)',
    'background-artist'  => 'Arka Plan & Çevre Sanatçısı (Background Artist)',
    'voxel-artist'       => 'Voxel Sanatçısı (Voxel Artist)',
    'narrative-designer' => 'Hikâye Yazarı & Narrative Designer',
    'visual-novel-dev'   => 'Visual Novel Geliştiricisi (VN Developer)',
    '2d-game-dev'        => '2D Oyun Geliştiricisi (2D Gameplay Dev)',
    'uiux'               => 'Oyun UI/UX Tasarımcısı (UI/UX Designer)',
    'sound'              => 'Besteci & Ses Tasarımcısı (Composer & Sound)',
];
$roleTitle = $rolesCatalog[$roleKey] ?? 'Genel / Belirtilmemiş Pozisyon (' . $roleKey . ')';

// Experience Mapping
$expCatalog = [
    'beginner'    => 'Yeni başlıyorum (Beginner)',
    'some'        => 'Birkaç proje yaptım (Intermediate)',
    'experienced' => 'Deneyimliyim (Experienced)',
];
$experienceTitle = $expCatalog[$experienceKey] ?? 'Belirtilmedi';

// Validate Message
if (mb_strlen($rawMessage, 'UTF-8') < 10) {
    jsonResponse(422, false, 'invalid_message', 'Lütfen kendinizden bahseden en az birkaç cümle yazın.');
}
if (mb_strlen($rawMessage, 'UTF-8') > 3000) {
    $rawMessage = mb_substr($rawMessage, 0, 3000, 'UTF-8');
}

// 8. Load SMTP Configuration
$configFile = __DIR__ . '/smtp_config.php';
if (!file_exists($configFile)) {
    logServerError('apply', 'config_missing', 'SMTP configuration file api/smtp_config.php is missing.');
    jsonResponse(500, false, 'server_error', 'Bir hata oluştu, en yakın sürede güncelleyeceğiz.', ['error' => 'server_error']);
}
$smtpConfig = require $configFile;

$smtpHost = (string)($smtpConfig['host'] ?? 'mail.aderionstudios.com');
$smtpPort = (int)($smtpConfig['port'] ?? 465);
$smtpSecure = (string)($smtpConfig['secure'] ?? 'ssl');
$smtpUser = (string)($smtpConfig['username'] ?? 'contact@aderionstudios.com');
$smtpPass = (string)($smtpConfig['password'] ?? '');
$toEmail = (string)($smtpConfig['to'] ?? 'contact@aderionstudios.com');
$fromName = (string)($smtpConfig['fromName'] ?? 'Aderion Studios Web');

if (empty($smtpPass) || $smtpPass === 'BURAYA_EPOSTA_SIFRENIZI_YAZIN') {
    logServerError('apply', 'smtp_credentials_required', 'SMTP password in api/smtp_config.php is not configured.', [
        'host' => $smtpHost,
        'port' => $smtpPort,
        'user' => $smtpUser,
    ]);
    jsonResponse(500, false, 'server_error', 'Bir hata oluştu, en yakın sürede güncelleyeceğiz.', ['error' => 'server_error']);
}

// 9. Construct Professional HTML Email
$subject = "Yeni Ekip Başvurusu: {$name} — {$roleTitle}";
$encodedSubject = "=?UTF-8?B?" . base64_encode($subject) . "?=";

$safeName = htmlspecialchars($name, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$safeEmail = htmlspecialchars($cleanEmail, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$safeRole = htmlspecialchars($roleTitle, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$safePortfolio = htmlspecialchars($portfolio, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$safeExp = htmlspecialchars($experienceTitle, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
$safeMessage = nl2br(htmlspecialchars($rawMessage, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'));
$dateFormatted = date('d.m.Y H:i:s (T)');

$htmlBody = <<<HTML
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <title>Aderion Studios Başvuru Bildirimi</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0c121c; color: #e4edf8; margin: 0; padding: 24px; line-height: 1.6; }
    .wrapper { max-width: 620px; margin: 0 auto; background-color: #152234; border: 1px solid #283a51; border-radius: 12px; overflow: hidden; box-shadow: 0 16px 40px rgba(0,0,0,0.35); }
    .header { background: linear-gradient(135deg, #1b2e47 0%, #29476f 100%); padding: 32px 30px; border-bottom: 2px solid #3d6399; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 800; letter-spacing: 0.1em; color: #ffffff; text-transform: uppercase; }
    .header p { margin: 8px 0 0; font-size: 13px; color: #a4c2ea; }
    .content { padding: 30px; }
    .badge { display: inline-block; background-color: #2b456b; color: #b7d5ff; font-size: 11px; font-weight: 800; padding: 4px 10px; border-radius: 4px; letter-spacing: 0.05em; text-transform: uppercase; margin-bottom: 16px; }
    .table-details { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    .table-details td { padding: 12px 14px; border-bottom: 1px solid #23354c; font-size: 14px; }
    .table-details td.label { width: 32%; color: #8ba5c7; font-weight: 700; }
    .table-details td.value { color: #f1f6fc; }
    .table-details a { color: #62a1fc; text-decoration: none; font-weight: 600; }
    .message-box { background-color: #101a27; border-left: 4px solid #5893e6; padding: 18px 20px; border-radius: 0 8px 8px 0; margin-top: 10px; color: #dbe7f5; font-size: 14px; white-space: pre-wrap; word-break: break-word; }
    .footer { padding: 20px 30px; background-color: #0f1824; border-top: 1px solid #23354c; font-size: 12px; color: #6b84a3; text-align: center; }
    .footer strong { color: #8eaecf; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>ADERION STUDIOS</h1>
      <p>Web Platformu — Yeni Ekip & Yaratıcı Ön Başvuru</p>
    </div>
    <div class="content">
      <span class="badge">Ön Başvuru Bildirimi</span>
      <table class="table-details">
        <tr>
          <td class="label">Ad Soyad</td>
          <td class="value"><strong>{$safeName}</strong></td>
        </tr>
        <tr>
          <td class="label">E-posta</td>
          <td class="value"><a href="mailto:{$safeEmail}">{$safeEmail}</a></td>
        </tr>
        <tr>
          <td class="label">İlgilenilen Alan</td>
          <td class="value"><strong style="color: #8ac0ff;">{$safeRole}</strong></td>
        </tr>
        <tr>
          <td class="label">Deneyim Düzeyi</td>
          <td class="value">{$safeExp}</td>
        </tr>
        <tr>
          <td class="label">Portföy / Çalışmalar</td>
          <td class="value"><a href="{$safePortfolio}" target="_blank" rel="noopener noreferrer">{$safePortfolio} ↗</a></td>
        </tr>
        <tr>
          <td class="label">Gönderim Tarihi</td>
          <td class="value" style="color: #7b94b3; font-size: 12px;">{$dateFormatted}</td>
        </tr>
      </table>

      <div style="font-size: 13px; font-weight: 700; color: #8ba5c7; margin-top: 20px;">Başvuranın Mesajı & Notu:</div>
      <div class="message-box">{$safeMessage}</div>
    </div>
    <div class="footer">
      Bu mesaj <strong>aderionstudios.com</strong> web sitesi üzerinden gönderilmiştir.<br>
      Adaya doğrudan yanıt vermek için bu e-postayı normal şekilde yanıtlayabilirsiniz.
    </div>
  </div>
</body>
</html>
HTML;

// 10. Standalone Pure PHP SMTP Socket Client
class SimpleSmtpClient {
    private string $host;
    private int $port;
    private string $secure;
    private string $user;
    private string $pass;
    private int $timeout;
    private $socket = null;
    private string $lastError = '';

    public function __construct(string $host, int $port, string $secure, string $user, string $pass, int $timeout = 15) {
        $this->host = $host;
        $this->port = $port;
        $this->secure = strtolower($secure);
        $this->user = $user;
        $this->pass = $pass;
        $this->timeout = $timeout;
    }

    public function getLastError(): string {
        return $this->lastError;
    }

    private function readResponse(): string {
        $data = '';
        while (!@feof($this->socket)) {
            $str = @fgets($this->socket, 515);
            if ($str === false) break;
            $data .= $str;
            if (isset($str[3]) && $str[3] === ' ') break;
        }
        return trim($data);
    }

    private function sendCmd(string $cmd): string {
        @fputs($this->socket, $cmd . "\r\n");
        return $this->readResponse();
    }

    public function send(string $from, string $to, string $subject, string $htmlBody, array $extraHeaders = []): bool {
        $prefix = ($this->secure === 'ssl') ? 'ssl://' : '';
        $target = $prefix . $this->host;

        $context = stream_context_create([
            'ssl' => [
                'verify_peer' => false,
                'verify_peer_name' => false,
                'allow_self_signed' => true
            ]
        ]);

        $this->socket = @stream_socket_client(
            "{$target}:{$this->port}",
            $errno,
            $errstr,
            $this->timeout,
            STREAM_CLIENT_CONNECT,
            $context
        );

        if (!$this->socket) {
            $this->lastError = "SMTP sunucusuna bağlanılamadı ({$target}:{$this->port}): {$errstr} [Hata Kodu: {$errno}]";
            return false;
        }

        @stream_set_timeout($this->socket, $this->timeout);
        $res = $this->readResponse();
        if (!str_starts_with($res, '220')) {
            $this->lastError = "Sunucu karşılama hatası: " . $res;
            return false;
        }

        $clientDomain = !empty($_SERVER['HTTP_HOST']) ? explode(':', $_SERVER['HTTP_HOST'])[0] : 'localhost';
        $res = $this->sendCmd("EHLO {$clientDomain}");
        if (!str_starts_with($res, '250')) {
            $res = $this->sendCmd("HELO {$clientDomain}");
            if (!str_starts_with($res, '250')) {
                $this->lastError = "EHLO/HELO reddedildi: " . $res;
                return false;
            }
        }

        // STARTTLS negotiation if required
        if ($this->secure === 'tls') {
            $res = $this->sendCmd("STARTTLS");
            if (!str_starts_with($res, '220')) {
                $this->lastError = "STARTTLS reddedildi: " . $res;
                return false;
            }
            if (!@stream_socket_enable_crypto($this->socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
                $this->lastError = "TLS şifreleme el sıkışması başarısız oldu.";
                return false;
            }
            $res = $this->sendCmd("EHLO {$clientDomain}");
            if (!str_starts_with($res, '250')) {
                $this->lastError = "TLS sonrası EHLO reddedildi: " . $res;
                return false;
            }
        }

        // Authentication via AUTH LOGIN
        if (!empty($this->user) && !empty($this->pass)) {
            $res = $this->sendCmd("AUTH LOGIN");
            if (!str_starts_with($res, '334')) {
                $this->lastError = "AUTH LOGIN komutu reddedildi: " . $res;
                return false;
            }

            $res = $this->sendCmd(base64_encode($this->user));
            if (!str_starts_with($res, '334')) {
                $this->lastError = "Kullanıcı adı kabul edilmedi: " . $res;
                return false;
            }

            $res = $this->sendCmd(base64_encode($this->pass));
            if (!str_starts_with($res, '235')) {
                $this->lastError = "SMTP Kimlik doğrulama başarısız! E-posta adresi veya şifre hatalı: " . $res;
                return false;
            }
        }

        // MAIL FROM
        $res = $this->sendCmd("MAIL FROM:<{$from}>");
        if (!str_starts_with($res, '250')) {
            $this->lastError = "Gönderici (MAIL FROM) adresi reddedildi: " . $res;
            return false;
        }

        // RCPT TO
        $res = $this->sendCmd("RCPT TO:<{$to}>");
        if (!str_starts_with($res, '250')) {
            $this->lastError = "Alıcı (RCPT TO) adresi reddedildi: " . $res;
            return false;
        }

        // DATA
        $res = $this->sendCmd("DATA");
        if (!str_starts_with($res, '354')) {
            $this->lastError = "DATA komutu reddedildi: " . $res;
            return false;
        }

        $headersStr = implode("\r\n", $extraHeaders);
        $payload = "Subject: {$subject}\r\n{$headersStr}\r\n\r\n{$htmlBody}\r\n.";
        $res = $this->sendCmd($payload);
        if (!str_starts_with($res, '250')) {
            $this->lastError = "E-posta içeriği sunucu tarafından kabul edilmedi: " . $res;
            return false;
        }

        $this->sendCmd("QUIT");
        @fclose($this->socket);
        return true;
    }
}

// 11. Dispatch Email via SMTP
$encodedFromName = "=?UTF-8?B?" . base64_encode($fromName) . "?=";
$encodedReplyName = "=?UTF-8?B?" . base64_encode($name) . "?=";

$extraHeaders = [
    "From: {$encodedFromName} <{$smtpUser}>",
    "Reply-To: {$encodedReplyName} <{$cleanEmail}>",
    "Return-Path: <{$smtpUser}>",
    "MIME-Version: 1.0",
    "Content-Type: text/html; charset=UTF-8",
    "Content-Transfer-Encoding: 8bit",
    "X-Mailer: AderionStudios-SMTP/2.0"
];

$smtpClient = new SimpleSmtpClient(
    $smtpHost,
    $smtpPort,
    $smtpSecure,
    $smtpUser,
    $smtpPass,
    15
);

$success = $smtpClient->send(
    $smtpUser,
    $toEmail,
    $encodedSubject,
    $htmlBody,
    $extraHeaders
);

if ($success) {
    jsonResponse(200, true, 'success', 'Başvurunuz stüdyoya başarıyla iletildi! En kısa sürede e-posta ile dönüş yapacağız.');
} else {
    $err = $smtpClient->getLastError();
    logServerError('apply', 'smtp_error', $err, [
        'host' => $smtpHost,
        'port' => $smtpPort,
        'secure' => $smtpSecure,
    ]);
    jsonResponse(500, false, 'server_error', 'Bir hata oluştu, en yakın sürede güncelleyeceğiz.', ['error' => 'server_error']);
}
