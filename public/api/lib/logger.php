<?php
declare(strict_types=1);

const SYSTEM_LOG_LEVELS = ['info', 'warning', 'error', 'critical'];
const SYSTEM_LOG_SOURCES = ['frontend', 'api', 'database'];

function systemLogClientIp(): ?string
{
    $ip = $_SERVER['REMOTE_ADDR'] ?? null;
    if (!is_string($ip) || trim($ip) === '') {
        return null;
    }

    return substr(trim($ip), 0, 45);
}

function normalizeSystemLogLevel(string $level): string
{
    $level = strtolower(trim($level));
    return in_array($level, SYSTEM_LOG_LEVELS, true) ? $level : 'error';
}

function normalizeSystemLogSource(string $source): string
{
    $source = strtolower(trim($source));
    return in_array($source, SYSTEM_LOG_SOURCES, true) ? $source : 'api';
}

function cleanSystemLogMessage(string $message): string
{
    $message = trim(strip_tags($message));
    $message = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/u', '', $message) ?? '';
    if ($message === '') {
        $message = 'Log sans message';
    }

    return function_exists('mb_substr')
        ? mb_substr($message, 0, 2000, 'UTF-8')
        : substr($message, 0, 2000);
}

function truncateSystemLogValue(string $value, int $maxLength): string
{
    if (function_exists('mb_substr')) {
        return mb_substr($value, 0, $maxLength, 'UTF-8');
    }

    return substr($value, 0, $maxLength);
}

function normalizeSystemLogContext(array $context): array
{
    $safe = [];

    foreach ($context as $key => $value) {
        if (!is_string($key) && !is_int($key)) {
            continue;
        }

        $safeKey = truncateSystemLogValue((string)$key, 80);

        if (is_array($value)) {
            $safe[$safeKey] = normalizeSystemLogContext($value);
            continue;
        }

        if (is_scalar($value) || $value === null) {
            $safe[$safeKey] = is_string($value)
                ? truncateSystemLogValue($value, 1000)
                : $value;
        }
    }

    $encoded = json_encode($safe, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($encoded !== false && strlen($encoded) <= 10000) {
        return $safe;
    }

    return ['truncated' => true, 'reason' => 'context_too_large'];
}

function systemLogsTableReady(PDO $pdo): bool
{
    try {
        if (function_exists('tableExists')) {
            return tableExists($pdo, 'system_logs');
        }

        $stmt = $pdo->query("SHOW TABLES LIKE 'system_logs'");
        return $stmt !== false && $stmt->fetchColumn() !== false;
    } catch (Throwable $e) {
        error_log('[SystemLogs] Table check failed: ' . $e->getMessage());
        return false;
    }
}

/**
 * @return int|false Insert id on success, false on failure.
 */
function logSystemError(string $level, string $source, string $message, array $context = [])
{
    $result = false;
    try {
        if (function_exists('db')) {
            $pdo = db();
            if (systemLogsTableReady($pdo)) {
                $context = normalizeSystemLogContext($context);
                $contextJson = json_encode($context, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
                $stmt = $pdo->prepare('
                    INSERT INTO system_logs (site_id, level, source, message, context, ip_address)
                    VALUES (:site_id, :level, :source, :message, :context, :ip_address)
                ');
                $inserted = $stmt->execute([
                    'site_id' => function_exists('siteId') ? siteId() : null,
                    'level' => normalizeSystemLogLevel($level),
                    'source' => normalizeSystemLogSource($source),
                    'message' => cleanSystemLogMessage($message),
                    'context' => $contextJson !== false ? $contextJson : '{}',
                    'ip_address' => systemLogClientIp(),
                ]);
                $result = $inserted ? (int)$pdo->lastInsertId() : false;
            } else {
                error_log('[SystemLogs] Table system_logs introuvable');
            }
        }
    } catch (Throwable $e) {
        error_log('[SystemLogs] ' . $e->getMessage());
    }

    return $result;
}

function logSystemException(Throwable $e, string $source = 'api', array $context = [])
{
    $context['exception'] = get_class($e);
    $context['file'] = basename($e->getFile());
    $context['line'] = $e->getLine();

    return logSystemError('error', $source, $e->getMessage(), $context);
}

function apiPublicErrorMessage(Throwable $e): string
{
    $env = function_exists('env') ? (env('APP_ENV', 'production') ?? 'production') : 'production';
    if ($env !== 'production') {
        return $e->getMessage();
    }

    return 'Une erreur est survenue. Reessayez plus tard.';
}

function apiServerError(Throwable $e, array $context = []): void
{
    $logId = logSystemException($e, 'api', $context);
    apiJsonResponse([
        'ok' => false,
        'error' => apiPublicErrorMessage($e),
        'log_id' => $logId !== false ? $logId : null,
    ], 500);
}
