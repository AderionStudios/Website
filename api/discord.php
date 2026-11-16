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

function discordJson(int $status, array $payload): void {
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
$botToken     = trim((string)($cfg['bot_token'] ?? ''));
$useLanyard   = (bool)($cfg['lanyard'] ?? true);
$useJapi      = (bool)($cfg['japi_fallback'] ?? true);
$profileTtl   = max(30, (int)($cfg['profile_ttl'] ?? 600));
$presenceTtl  = max(15, (int)($cfg['presence_ttl'] ?? 60));
$discordBase  = rtrim((string)($cfg['discord_base'] ?? 'https://discord.com/api/v10'), '/');
$lanyardBase  = rtrim((string)($cfg['lanyard_base'] ?? 'https://api.lanyard.rest/v1'), '/');
$japiBase     = rtrim((string)($cfg['japi_base'] ?? 'https://japi.rest/discord/v1'), '/');

// ------------------------------------------------------- member id list ----
$creditsFile = __DIR__ . '/../data/credits.json';
$ids = [];
$credits = is_file($creditsFile) ? json_decode((string)file_get_contents($creditsFile), true) : null;
if (is_array($credits) && isset($credits['departments']) && is_array($credits['departments'])) {
    foreach ($credits['departments'] as $dept) {
        foreach (($dept['members'] ?? []) as $member) {
            $id = is_array($member) ? (string)($member['discordId'] ?? '') : '';
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
/** @return array{status:int, json:?array} */
function discordHttpGet(string $url, array $headers = [], int $timeout = 4): array {
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
        $status = (int)curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
        curl_close($ch);
    } else {
        $ctx = stream_context_create(['http' => [
            'method' => 'GET', 'header' => implode("\r\n", $headers),
            'timeout' => $timeout, 'ignore_errors' => true, 'follow_location' => 0,
        ]]);
        $body = @file_get_contents($url, false, $ctx, 0, 262144);
        $status = 0;
        foreach (($http_response_header ?? []) as $line) {
            if (preg_match('#^HTTP/\S+\s+(\d{3})#', $line, $m)) {
                $status = (int)$m[1];
            }
        }
    }
    $json = is_string($body) ? json_decode($body, true) : null;
    return ['status' => $status, 'json' => is_array($json) ? $json : null];
}

// ------------------------------------------------------------- sanitizers ----
function discordHash(mixed $v): ?string {
    return (is_string($v) && preg_match('/^(a_)?[a-f0-9]{16,64}$/', $v)) ? $v : null;
}
function discordText(mixed $v, int $max): string {
    $s = is_string($v) ? $v : '';
    $s = preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $s) ?? '';
    $s = trim($s);
    return mb_strlen($s, 'UTF-8') > $max ? mb_substr($s, 0, $max, 'UTF-8') : $s;
}
function discordHexColor(mixed $v): ?string {
    if (is_int($v) && $v >= 0 && $v <= 0xFFFFFF) {
        return sprintf('#%06x', $v);
    }
    if (is_string($v) && preg_match('/^#[0-9a-fA-F]{6}$/', $v)) {
        return strtolower($v);
    }
    return null;
}

/** Normalise a raw Discord-style user object (official API, japi or Lanyard). */
function discordNormalizeUser(string $id, array $u): array {
    $avatar = discordHash($u['avatar'] ?? null);
    $banner = discordHash($u['banner'] ?? null);
    $asset  = $u['avatar_decoration_data']['asset'] ?? null;
    $asset  = (is_string($asset) && preg_match('/^[A-Za-z0-9_]{1,64}$/', $asset)) ? $asset : null;
    $cdn = 'https://cdn.discordapp.com';
    return [
        'username'      => discordText($u['username'] ?? '', 64),
        'globalName'    => discordText($u['global_name'] ?? '', 64),
        'avatarUrl'     => $avatar ? "$cdn/avatars/$id/$avatar." . (str_starts_with($avatar, 'a_') ? 'gif' : 'png') . '?size=256' : null,
        'bannerUrl'     => $banner ? "$cdn/banners/$id/$banner." . (str_starts_with($banner, 'a_') ? 'gif' : 'png') . '?size=1024' : null,
        'bannerColor'   => discordHexColor($u['banner_color'] ?? null) ?? discordHexColor($u['accent_color'] ?? null),
        'decorationUrl' => $asset ? "$cdn/avatar-decoration-presets/$asset.png" : null,
    ];
}

// ------------------------------------------------------------------ cache ----
$cacheFile = sys_get_temp_dir() . '/aderion_discord_' . md5(__DIR__) . '.json';
$cache = ['users' => []];
if (is_file($cacheFile)) {
    $c = json_decode((string)@file_get_contents($cacheFile), true);
    if (is_array($c) && isset($c['users']) && is_array($c['users'])) {
        $cache = $c;
    }
}

$now = time();
$lockFp = @fopen($cacheFile . '.lock', 'c');
$haveLock = $lockFp && @flock($lockFp, LOCK_EX | LOCK_NB);
$dirty = false;

if ($haveLock) {
    foreach ($ids as $id) {
        $entry = $cache['users'][$id] ?? ['profile' => null, 'profile_at' => 0, 'presence' => null, 'presence_at' => 0];

        // ---- profile (official API with bot token, then japi, then Lanyard's user object)
        if (($now - (int)$entry['profile_at']) >= $profileTtl) {
            $profile = null;
            $source = null;
            if ($botToken !== '') {
                $r = discordHttpGet("$discordBase/users/$id", ["Authorization: Bot $botToken"]);
                if ($r['status'] === 200 && isset($r['json']['id'])) {
                    $profile = discordNormalizeUser($id, $r['json']);
                    $source = 'discord';
                } else {
                    logServerError('discord', 'bot_api_error', "Discord API returned HTTP {$r['status']} for a member lookup.", ['status' => $r['status']]);
                }
            }
            if ($profile === null && $useJapi) {
                $r = discordHttpGet("$japiBase/user/$id");
                $data = $r['json']['data'] ?? null;
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
            if (($now - (int)$entry['presence_at']) >= $ttl) {
                $r = discordHttpGet("$lanyardBase/users/$id");
                if ($r['status'] === 200 && ($r['json']['success'] ?? false) === true && is_array($r['json']['data'] ?? null)) {
                    $d = $r['json']['data'];
                    $custom = null;
                    foreach (($d['activities'] ?? []) as $act) {
                        if (is_array($act) && (int)($act['type'] ?? -1) === 4) {
                            $text  = discordText($act['state'] ?? '', 128);
                            $emoji = (is_array($act['emoji'] ?? null) && empty($act['emoji']['id'])) ? discordText($act['emoji']['name'] ?? '', 16) : '';
                            if ($text !== '' || $emoji !== '') {
                                $custom = ['text' => $text, 'emoji' => $emoji];
                            }
                            break;
                        }
                    }
                    $st = (string)($d['discord_status'] ?? '');
                    $entry['presence'] = [
                        'status' => in_array($st, ['online', 'idle', 'dnd', 'offline'], true) ? $st : 'offline',
                        'custom' => $custom,
                        'user'   => is_array($d['discord_user'] ?? null) ? discordNormalizeUser($id, $d['discord_user']) : null,
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
    if (!$entry) {
        continue;
    }
    $p = $entry['profile'] ?? null;
    $lu = $entry['presence']['user'] ?? null; // Lanyard's user object as last resort
    if ($p === null && $lu === null) {
        continue;
    }
    $base = $p ?? $lu;
    $users[$id] = [
        'username'      => $base['username'] ?: ($lu['username'] ?? ''),
        'globalName'    => $base['globalName'] ?: ($lu['globalName'] ?? ''),
        'avatarUrl'     => $base['avatarUrl'] ?? ($lu['avatarUrl'] ?? null),
        'bannerUrl'     => $p['bannerUrl'] ?? null,
        'bannerColor'   => $p['bannerColor'] ?? null,
        'decorationUrl' => $base['decorationUrl'] ?? ($lu['decorationUrl'] ?? null),
        'status'        => $entry['presence']['custom'] ?? null,
        'presence'      => $entry['presence']['status'] ?? null,
        'source'        => $p['source'] ?? ($lu ? 'lanyard' : null),
    ];
}

discordJson(200, ['ok' => true, 'users' => $users ?: new stdClass(), 'fetchedAt' => $now]);
