<?php

/**
 * ============================================================================
 * ADERION STUDIOS — Live Discord profile endpoint (GET api/discord.php)
 *
 * Returns the live Discord profile (name, avatar, banner / banner colour,
 * avatar decoration, custom status) of every member listed in data/credits.json.
 * Only IDs found in credits.json are ever queried (this is not an open proxy).
 * Results are cached server-side so Discord is hit at most once per TTL.
 * See api/discord_config.example.php for the settings.
 * ============================================================================
 */

declare(strict_types=1);

require_once __DIR__ . '/error_logger.php';

header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: public, max-age=30');

/**
 * @param array<string, mixed> $payload
 */
function discordJson(int $status, array $payload): never
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'GET') {
    header('Allow: GET');
    header('Cache-Control: no-store');
    discordJson(405, ['ok' => false, 'code' => 'method_not_allowed']);
}

// ---------------------------------------------------------------- config ----
$cfg = [];
$cfgFile = __DIR__ . '/discord_config.php';
if (is_file($cfgFile)) {
    $loaded = require $cfgFile;
    if (is_array($loaded)) {
        $cfg = $loaded;
    }
}
$cfgStr = static fn(string $k, string $default = ''): string => (
    isset($cfg[$k]) && is_string($cfg[$k]) ? $cfg[$k] : $default
);
$cfgBool = static fn(string $k, bool $default): bool => (
    isset($cfg[$k]) ? (bool) $cfg[$k] : $default
);
$cfgInt = static fn(string $k, int $default): int => (
    isset($cfg[$k]) && (is_int($cfg[$k]) || is_numeric($cfg[$k])) ? (int) $cfg[$k] : $default
);

$botToken    = trim($cfgStr('bot_token'));
$useLanyard  = $cfgBool('lanyard', true);
$useJapi     = $cfgBool('japi_fallback', true);
$profileTtl  = max(30, $cfgInt('profile_ttl', 600));
$presenceTtl = max(15, $cfgInt('presence_ttl', 60));
$discordBase = rtrim($cfgStr('discord_base', 'https://discord.com/api/v10'), '/');
$lanyardBase = rtrim($cfgStr('lanyard_base', 'https://api.lanyard.rest/v1'), '/');
$japiBase    = rtrim($cfgStr('japi_base', 'https://japi.rest/discord/v1'), '/');

// ------------------------------------------------------- member id list ----
$creditsFile = __DIR__ . '/../data/credits.json';
$ids = [];
$credits = is_file($creditsFile) ? json_decode((string) file_get_contents($creditsFile), true) : null;
if (is_array($credits) && isset($credits['departments']) && is_array($credits['departments'])) {
    foreach ($credits['departments'] as $dept) {
        if (!is_array($dept) || !isset($dept['members']) || !is_array($dept['members'])) {
            continue;
        }
        foreach ($dept['members'] as $member) {
            $id = (is_array($member) && is_string($member['discordId'] ?? null))
                ? $member['discordId']
                : '';
            if (preg_match('/^\d{16,24}$/', $id)) {
                $ids[$id] = true;
            }
        }
    }
}
$ids = array_map('strval', array_keys($ids)); // numeric-string array keys come back as ints
if (!$ids) {
    discordJson(200, ['ok' => true, 'users' => new stdClass(), 'fetchedAt' => time()]);
}

// ------------------------------------------------------------ HTTP helper ----
/**
 * @param list<string> $headers
 *
 * @return array{status: int, json: array<mixed, mixed>|null}
 */
function discordHttpGet(string $url, array $headers = [], int $timeout = 4): array
{
    $headers[] = 'Accept: application/json';
    $headers[] = 'User-Agent: DiscordBot (https://aderionstudios.com, 1.0)';
    if (function_exists('curl_init')) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => $timeout,
            CURLOPT_CONNECTTIMEOUT => $timeout,
            CURLOPT_HTTPHEADER     => $headers,
            CURLOPT_FOLLOWLOCATION => false,
            CURLOPT_MAXFILESIZE    => 262144,
        ]);
        $body = curl_exec($ch);
        $status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
        curl_close($ch);
    } else {
        $ctx = stream_context_create(['http' => [
            'method' => 'GET',
            'header' => implode("\r\n", $headers),
            'timeout' => $timeout,
            'ignore_errors' => true,
            'follow_location' => 0,
        ]]);
        $http_response_header = [];
        $body = @file_get_contents($url, false, $ctx, 0, 262144);
        $status = 0;
        foreach ($http_response_header as $line) {
            if (preg_match('#^HTTP/\S+\s+(\d{3})#', $line, $m)) {
                $status = (int) $m[1];
            }
        }
    }
    $json = is_string($body) ? json_decode($body, true) : null;
    return ['status' => $status, 'json' => is_array($json) ? $json : null];
}

// ------------------------------------------------------------- sanitizers ----
function discordHash(mixed $v): ?string
{
    return (is_string($v) && preg_match('/^(a_)?[a-f0-9]{16,64}$/', $v)) ? $v : null;
}

function discordText(mixed $v, int $max): string
{
    $s = is_string($v) ? $v : '';
    $s = preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $s) ?? '';
    $s = trim($s);
    return mb_strlen($s, 'UTF-8') > $max ? mb_substr($s, 0, $max, 'UTF-8') : $s;
}

function discordHexColor(mixed $v): ?string
{
    if (is_int($v) && $v >= 0 && $v <= 0xFFFFFF) {
        return sprintf('#%06x', $v);
    }
    if (is_string($v) && preg_match('/^#[0-9a-fA-F]{6}$/', $v)) {
        return strtolower($v);
    }
    return null;
}

/**
 * Normalise a raw Discord-style user object (official API, japi or Lanyard).
 *
 * @param array<mixed, mixed> $u
 *
 * @return array{
 *     username: string,
 *     globalName: string,
 *     avatarUrl: string|null,
 *     bannerUrl: string|null,
 *     bannerColor: string|null,
 *     decorationUrl: string|null,
 * }
 */
function discordNormalizeUser(string $id, array $u): array
{
    $avatar = discordHash($u['avatar'] ?? null);
    $banner = discordHash($u['banner'] ?? null);
    $decoData = $u['avatar_decoration_data'] ?? null;
    $asset = is_array($decoData) ? ($decoData['asset'] ?? null) : null;
    $asset = (is_string($asset) && preg_match('/^[A-Za-z0-9_]{1,64}$/', $asset)) ? $asset : null;
    $cdn = 'https://cdn.discordapp.com';
    $avatarExt = ($avatar !== null && str_starts_with($avatar, 'a_')) ? 'gif' : 'png';
    $bannerExt = ($banner !== null && str_starts_with($banner, 'a_')) ? 'gif' : 'png';

    return [
        'username'      => discordText($u['username'] ?? '', 64),
        'globalName'    => discordText($u['global_name'] ?? '', 64),
        'avatarUrl'     => $avatar !== null ? "{$cdn}/avatars/{$id}/{$avatar}.{$avatarExt}?size=256" : null,
        'bannerUrl'     => $banner !== null ? "{$cdn}/banners/{$id}/{$banner}.{$bannerExt}?size=1024" : null,
        'bannerColor'   => discordHexColor($u['banner_color'] ?? null)
            ?? discordHexColor($u['accent_color'] ?? null),
        'decorationUrl' => $asset !== null ? "{$cdn}/avatar-decoration-presets/{$asset}.png" : null,
    ];
}

/**
 * Normalise one cached user entry from disk.
 *
 * @return array{
 *     profile: array<mixed, mixed>|null,
 *     profile_at: int,
 *     presence: array<mixed, mixed>|null,
 *     presence_at: int,
 * }
 */
function discordNormalizeCacheEntry(mixed $raw): array
{
    if (!is_array($raw)) {
        return [
            'profile'     => null,
            'profile_at'  => 0,
            'presence'    => null,
            'presence_at' => 0,
        ];
    }
    $profile = $raw['profile'] ?? null;
    $profileAt = $raw['profile_at'] ?? 0;
    $presence = $raw['presence'] ?? null;
    $presenceAt = $raw['presence_at'] ?? 0;

    return [
        'profile'     => is_array($profile) ? $profile : null,
        'profile_at'  => is_int($profileAt) ? $profileAt : (is_numeric($profileAt) ? (int) $profileAt : 0),
        'presence'    => is_array($presence) ? $presence : null,
        'presence_at' => is_int($presenceAt) ? $presenceAt : (is_numeric($presenceAt) ? (int) $presenceAt : 0),
    ];
}

/**
 * @param array<mixed, mixed>|null $arr
 */
function discordArrStr(?array $arr, string $key): string
{
    return ($arr !== null && is_string($arr[$key] ?? null)) ? $arr[$key] : '';
}

/**
 * @param array<mixed, mixed>|null $arr
 */
function discordArrOptStr(?array $arr, string $key): ?string
{
    return ($arr !== null && is_string($arr[$key] ?? null)) ? $arr[$key] : null;
}

// ------------------------------------------------------------------ cache ----
$cacheFile = sys_get_temp_dir() . '/aderion_discord_' . md5(__DIR__) . '.json';
/** @var array<string, array{profile: array<mixed, mixed>|null, profile_at: int, presence: array<mixed, mixed>|null, presence_at: int}> $cacheUsers */
$cacheUsers = [];
if (is_file($cacheFile)) {
    $c = json_decode((string) @file_get_contents($cacheFile), true);
    if (is_array($c) && isset($c['users']) && is_array($c['users'])) {
        foreach ($c['users'] as $uid => $rawEntry) {
            $cacheUsers[(string) $uid] = discordNormalizeCacheEntry($rawEntry);
        }
    }
}
$cache = ['users' => $cacheUsers];

$now = time();
$lockFp = @fopen($cacheFile . '.lock', 'c');
$haveLock = $lockFp && @flock($lockFp, LOCK_EX | LOCK_NB);
$dirty = false;

if ($haveLock) {
    foreach ($ids as $id) {
        $entry = $cache['users'][$id] ?? discordNormalizeCacheEntry(null);

        // ---- profile (official API with bot token, then japi, then Lanyard's user object)
        if (($now - $entry['profile_at']) >= $profileTtl) {
            $profile = null;
            $source = null;
            if ($botToken !== '') {
                $r = discordHttpGet("{$discordBase}/users/{$id}", ["Authorization: Bot {$botToken}"]);
                if ($r['status'] === 200 && is_array($r['json']) && isset($r['json']['id'])) {
                    $profile = discordNormalizeUser($id, $r['json']);
                    $source = 'discord';
                } else {
                    logServerError(
                        'discord',
                        'bot_api_error',
                        "Discord API returned HTTP {$r['status']} for a member lookup.",
                        ['status' => $r['status']]
                    );
                }
            }
            if ($profile === null && $useJapi) {
                $r = discordHttpGet("{$japiBase}/user/{$id}");
                $data = is_array($r['json']) ? ($r['json']['data'] ?? null) : null;
                if ($r['status'] === 200 && is_array($data) && isset($data['id'])) {
                    $profile = discordNormalizeUser($id, $data);
                    $source = 'japi';
                }
            }
            if ($profile !== null) {
                $entry['profile'] = $profile + ['source' => $source];
                $entry['profile_at'] = $now;
                $dirty = true;
            } else {
                // Keep serving the stale profile, but retry soon (not on every request).
                $entry['profile_at'] = $now - $profileTtl + 60;
                $dirty = true;
            }
        }

        // ---- presence / custom status (Lanyard)
        if ($useLanyard) {
            $monitored = $entry['presence'] !== null;
            $ttl = $monitored ? $presenceTtl : $profileTtl; // don't hammer for users Lanyard doesn't track
            if (($now - $entry['presence_at']) >= $ttl) {
                $r = discordHttpGet("{$lanyardBase}/users/{$id}");
                $rJson = $r['json'];
                $rData = is_array($rJson) ? ($rJson['data'] ?? null) : null;
                if (
                    $r['status'] === 200
                    && is_array($rJson)
                    && ($rJson['success'] ?? false) === true
                    && is_array($rData)
                ) {
                    $d = $rData;
                    $custom = null;
                    $activities = is_array($d['activities'] ?? null) ? $d['activities'] : [];
                    foreach ($activities as $act) {
                        $actType = is_array($act) ? ($act['type'] ?? -1) : -1;
                        if (is_array($act) && (is_int($actType) || is_numeric($actType)) && (int) $actType === 4) {
                            $text = discordText($act['state'] ?? '', 128);
                            $rawEmoji = $act['emoji'] ?? null;
                            $emoji = (is_array($rawEmoji) && empty($rawEmoji['id']))
                                ? discordText($rawEmoji['name'] ?? '', 16)
                                : '';
                            if ($text !== '' || $emoji !== '') {
                                $custom = ['text' => $text, 'emoji' => $emoji];
                            }
                            break;
                        }
                    }
                    $st = is_string($d['discord_status'] ?? null) ? $d['discord_status'] : '';
                    $discordUser = $d['discord_user'] ?? null;
                    $entry['presence'] = [
                        'status' => in_array($st, ['online', 'idle', 'dnd', 'offline'], true) ? $st : 'offline',
                        'custom' => $custom,
                        'user'   => is_array($discordUser) ? discordNormalizeUser($id, $discordUser) : null,
                    ];
                    $entry['presence_at'] = $now;
                    $dirty = true;
                } elseif ($r['status'] === 404 || $r['status'] === 200) {
                    $entry['presence'] = null; // not monitored by Lanyard
                    $entry['presence_at'] = $now;
                    $dirty = true;
                } else {
                    $entry['presence_at'] = $now - $ttl + 30; // upstream error: retry shortly
                    $dirty = true;
                }
            }
        }

        $cache['users'][$id] = $entry;
    }

    if ($dirty) {
        $tmp = $cacheFile . '.' . bin2hex(random_bytes(4));
        if (@file_put_contents($tmp, json_encode($cache)) !== false) {
            @rename($tmp, $cacheFile);
        }
    }
    @flock($lockFp, LOCK_UN);
}
if ($lockFp) {
    @fclose($lockFp);
}

// ----------------------------------------------------------------- output ----
$users = [];
foreach ($ids as $id) {
    $entry = $cache['users'][$id] ?? null;
    if ($entry === null) {
        continue;
    }
    $p = $entry['profile'];
    $presence = $entry['presence'];
    $rawLu = is_array($presence) ? ($presence['user'] ?? null) : null;
    $lu = is_array($rawLu) ? $rawLu : null; // Lanyard's user object as last resort
    if ($p === null && $lu === null) {
        continue;
    }
    $base = $p ?? $lu;
    $username = discordArrStr($base, 'username');
    $globalName = discordArrStr($base, 'globalName');
    $rawCustom = is_array($presence) ? ($presence['custom'] ?? null) : null;
    $rawStatus = is_array($presence) ? ($presence['status'] ?? null) : null;

    $users[$id] = [
        'username'      => $username !== '' ? $username : discordArrStr($lu, 'username'),
        'globalName'    => $globalName !== '' ? $globalName : discordArrStr($lu, 'globalName'),
        'avatarUrl'     => discordArrOptStr($base, 'avatarUrl') ?? discordArrOptStr($lu, 'avatarUrl'),
        'bannerUrl'     => discordArrOptStr($p, 'bannerUrl'),
        'bannerColor'   => discordArrOptStr($p, 'bannerColor'),
        'decorationUrl' => discordArrOptStr($base, 'decorationUrl') ?? discordArrOptStr($lu, 'decorationUrl'),
        'status'        => is_array($rawCustom) ? $rawCustom : null,
        'presence'      => is_string($rawStatus) ? $rawStatus : null,
        'source'        => discordArrOptStr($p, 'source') ?? ($lu !== null ? 'lanyard' : null),
    ];
}

discordJson(200, ['ok' => true, 'users' => $users ?: new stdClass(), 'fetchedAt' => $now]);
