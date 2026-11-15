<?php
/**
 * ============================================================================
 * ADERION STUDIOS — Server Error Logger
 * Appends sanitized single-line error entries to root error.log.
 * ============================================================================
 */
declare(strict_types=1);

/**
 * Sanitize a string for single-line log output by replacing control characters.
 */
function sanitizeLogValue(string $value): string {
    $clean = preg_replace('/[\x00-\x1F\x7F]+/u', ' ', $value);
    if ($clean === null) {
        $clean = str_replace(["\r", "\n", "\t", "\0"], ' ', $value);
    }
    return trim($clean);
}

/**
 * Recursively sanitize context data and redact sensitive keys.
 */
function sanitizeLogContext(array $context): array {
    $sanitized = [];
    foreach ($context as $key => $value) {
        $cleanKey = sanitizeLogValue((string)$key);
        if (preg_match('/pass(word)?|secret|token|auth/i', $cleanKey)) {
            $sanitized[$cleanKey] = '[REDACTED]';
            continue;
        }
        if (is_array($value)) {
            $sanitized[$cleanKey] = sanitizeLogContext($value);
        } elseif (is_string($value)) {
            $sanitized[$cleanKey] = sanitizeLogValue($value);
        } elseif (is_bool($value) || is_int($value) || is_float($value) || $value === null) {
            $sanitized[$cleanKey] = $value;
        } else {
            $sanitized[$cleanKey] = sanitizeLogValue((string)$value);
        }
    }
    return $sanitized;
}

/**
 * Append a sanitized, single-line error entry to the root error.log file.
 */
function logServerError(string $source, string $code, string $detail, array $context = []): void {
    $logFile = __DIR__ . '/../error.log';
    $timestamp = date('Y-m-d H:i:s P');
    $safeSource = sanitizeLogValue($source);
    $safeCode = sanitizeLogValue($code);
    $safeDetail = sanitizeLogValue($detail);

    $line = "[{$timestamp}] [{$safeSource}] [{$safeCode}] {$safeDetail}";

    if (!empty($context)) {
        $encoded = json_encode(
            sanitizeLogContext($context),
            JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
        );
        if ($encoded !== false) {
            $line .= ' | context=' . sanitizeLogValue($encoded);
        }
    }

    @file_put_contents($logFile, $line . PHP_EOL, FILE_APPEND | LOCK_EX);
}
