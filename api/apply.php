<?php
/**
 * Aderion Studios / Join Us — cPanel PHP mail endpoint.
 * Set up contact@aderionstudios.com as a working sender on your hosting plan.
 * mail() returning true means queued by the server, NOT confirmed delivered.
 */
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function reply(int $http, string $code, bool $ok = false): void {
    http_response_code($http);
    echo json_encode(['ok' => $ok, 'code' => $code]);
    exit;
}
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    reply(405, 'method_not_allowed');
}
if ((int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 12000) reply(413, 'payload_too_large');

// Reject other-site form posts. Hosts generally send no Origin on same-origin native requests.
if (!empty($_SERVER['HTTP_ORIGIN'])) {
    $originHost = parse_url($_SERVER['HTTP_ORIGIN'], PHP_URL_HOST);
    $requestHost = explode(':', (string)($_SERVER['HTTP_HOST'] ?? ''))[0];
    if (!$originHost || strcasecmp((string)$originHost, $requestHost) !== 0) reply(403, 'forbidden');
}

// Honeypot fields are invisible to ordinary applicants.
if (!empty($_POST['website'])) reply(200, 'accepted', true);
if (($_POST['consent'] ?? '') !== 'yes') reply(422, 'consent_required');

function textField(string $key, int $limit): ?string {
    if (!isset($_POST[$key]) || !is_string($_POST[$key])) return null;
    $value = trim($_POST[$key]);
    if ($value === '' || strlen($value) > $limit || !preg_match('//u', $value)) return null;
    return preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $value);
}
$name = textField('name', 250);
$email = textField('email', 180);
$role = textField('role', 80);
$portfolio = textField('portfolio', 500);
$message = textField('message', 6000);
$experience = isset($_POST['experience']) && is_string($_POST['experience']) ? $_POST['experience'] : 'beginner';
$roles = [
    'character-artist' => '2D Character Artist',
    'background-artist' => 'Background & Environment Artist',
    'voxel-artist' => 'Voxel Artist',
    'narrative-designer' => 'Narrative Designer & Writer',
    'visual-novel-dev' => 'Visual Novel Developer',
    '2d-game-dev' => '2D Gameplay Developer',
    'uiux' => 'Game UI/UX Designer',
    'sound' => 'Sound Designer & Composer'
];
if (!$name || !$email || !$role || !$portfolio || !$message ||
    !filter_var($email, FILTER_VALIDATE_EMAIL) ||
    !filter_var($portfolio, FILTER_VALIDATE_URL) ||
    !in_array(strtolower((string)parse_url($portfolio, PHP_URL_SCHEME)), ['http', 'https'], true) ||
    !array_key_exists($role, $roles) ||
    !in_array($experience, ['beginner', 'some', 'experienced'], true)) {
    reply(422, 'invalid_fields');
}

// Basic abuse protection, does not store application content or raw IP addresses.
$ip = (string)($_SERVER['REMOTE_ADDR'] ?? 'unknown');
$filename = sys_get_temp_dir() . '/aderion_apply_' . hash('sha256', $ip . '|aderion-studios');
$rateFile = @fopen($filename, 'c+');
if ($rateFile !== false && flock($rateFile, LOCK_EX)) {
    $existing = stream_get_contents($rateFile);
    $history = json_decode($existing ?: '[]', true);
    if (!is_array($history)) $history = [];
    $now = time();
    $history = array_values(array_filter($history, fn($timestamp) => is_int($timestamp) && $timestamp > $now - 3600));
    if (count($history) >= 8) {
        flock($rateFile, LOCK_UN);
        fclose($rateFile);
        reply(429, 'rate_limited');
    }
    $history[] = $now;
    ftruncate($rateFile, 0);
    rewind($rateFile);
    fwrite($rateFile, json_encode($history));
    fflush($rateFile);
    flock($rateFile, LOCK_UN);
}
if ($rateFile !== false) fclose($rateFile);

$to = 'contact@aderionstudios.com';
$subject = 'Aderion Studios | Join Us Application | ' . $roles[$role];
$body = "New Aderion Studios Join Us application\n\n" .
    "Name: $name\nEmail: $email\nPosition: {$roles[$role]}\n" .
    "Portfolio: $portfolio\nExperience: $experience\n\n" .
    "Message:\n$message\n\n----\nSent through the Aderion Studios application form.\n";
$headers = [
    'From: Aderion Studios <contact@aderionstudios.com>',
    'Reply-To: ' . $email,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8'
];
$accepted = @mail($to, $subject, $body, implode("\r\n", $headers));
if (!$accepted) reply(503, 'mail_unavailable');
reply(200, 'accepted', true);
