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
require_once __DIR__ . '/mailer_lib.php';

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

// 6. Rate Limiting (30s cooldown per IP). This is a read-only check; the
//    cooldown only starts after the input passed validation (see aderionRateMark).
$ipConfig = [];
$ipConfigFile = __DIR__ . '/smtp_config.php';
if (is_file($ipConfigFile)) {
    $loadedIpConfig = require $ipConfigFile;
    if (is_array($loadedIpConfig)) {
        $ipConfig = $loadedIpConfig;
    }
}
$clientIp = aderionClientIp($ipConfig);
$waitRemaining = aderionRateRemaining('apply', $clientIp, 30);
if ($waitRemaining > 0) {
    jsonResponse(429, false, 'rate_limited', "Lütfen tekrar göndermeden önce {$waitRemaining} saniye bekleyin.");
}

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

// Non-string values (e.g. name[]=x) are treated as empty instead of crashing.
$postStr = static fn(string $k): string => (isset($_POST[$k]) && is_string($_POST[$k])) ? $_POST[$k] : '';
$name = cleanSingleLine($postStr('name'), 100);
$rawEmail = cleanSingleLine($postStr('email'), 180);
$roleKey = cleanSingleLine($postStr('role'), 60);
$portfolio = cleanSingleLine($postStr('portfolio'), 500);
$experienceKey = cleanSingleLine($postStr('experience'), 40);
$rawMessage = trim($postStr('message'));

// Validate Name
if (mb_strlen($name, 'UTF-8') < 2) {
    jsonResponse(422, false, 'invalid_name', 'Lütfen geçerli bir isim girin.');
}

// Validate Email
$cleanEmail = filter_var($rawEmail, FILTER_VALIDATE_EMAIL);
if (!$cleanEmail) {
    jsonResponse(422, false, 'invalid_email', 'Lütfen geçerli bir e-posta adresi girin.');
}

// Validate Portfolio URL (http/https only; blocks javascript:, data:, etc.)
$portfolioUrl = aderionNormalizeUrl($portfolio, 500);
if ($portfolioUrl === null) {
    jsonResponse(422, false, 'invalid_portfolio', 'Lütfen geçerli bir portföy bağlantısı girin (http:// veya https://).');
}
$portfolio = $portfolioUrl;

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

// Input is valid: start the cooldown now.
aderionRateMark('apply', $clientIp);

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
    15,
    (bool)($smtpConfig['verify_tls'] ?? true),
    (string)($smtpConfig['peer_name'] ?? '')
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
