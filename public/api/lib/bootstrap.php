<?php
/**
 * Garantit une reponse JSON meme en cas d'erreur fatale PHP.
 */
ini_set('display_errors', '0');
error_reporting(E_ALL);

if (!function_exists('str_contains')) {
    function str_contains(string $haystack, string $needle): bool // NOSONAR: native polyfill name
    {
        return $needle === '' || strpos($haystack, $needle) !== false;
    }
}

if (!function_exists('str_starts_with')) {
    function str_starts_with(string $haystack, string $needle): bool // NOSONAR: native polyfill name
    {
        return $needle === '' || strncmp($haystack, $needle, strlen($needle)) === 0;
    }
}

function apiRuntimeEnv(): string
{
    return $_ENV['APP_ENV'] ?? getenv('APP_ENV') ?: 'production';
}

function sanitizeForJson($data)
{
    $result = $data;
    if (is_array($data)) {
        $result = [];
        foreach ($data as $key => $value) {
            $result[$key] = sanitizeForJson($value);
        }
    } elseif (is_string($data)) {
        $result = preg_replace('/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/', '', $data) ?? $data;
        if (function_exists('mb_convert_encoding')) {
            $clean = mb_convert_encoding($data, 'UTF-8', 'UTF-8');
            if ($clean !== false) {
                $result = $clean;
            }
        }
    }

    return $result;
}

function safeJsonEncode(array $payload): string
{
    $flags = JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT;
    if (defined('JSON_INVALID_UTF8_SUBSTITUTE')) {
        $flags |= JSON_INVALID_UTF8_SUBSTITUTE;
    }
    $json = json_encode(sanitizeForJson($payload), $flags);
    if ($json !== false) {
        return $json;
    }
    return json_encode([
        'ok' => false,
        'error' => 'Encodage JSON impossible',
        'json_error' => json_last_error_msg(),
    ], $flags) ?: '{"ok":false,"error":"json_encode_failed"}';
}

function apiCleanSlugParam(?string $value, string $field = 'slug', int $max = 160): ?string
{
    if ($value === null) {
        return null;
    }

    $value = trim($value);
    if ($value === '') {
        return null;
    }

    if (strlen($value) > $max || !preg_match('/^[a-z0-9][a-z0-9_-]*$/i', $value)) {
        apiJsonResponse(['ok' => false, 'error' => $field . ' invalide'], 400);
    }

    return $value;
}

function apiJsonResponse(array $payload, int $status = 200): void
{
    if (!headers_sent()) {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        header('Cache-Control: no-store');
    }
    echo safeJsonEncode($payload);
    exit;
}

register_shutdown_function(function (): void {
    $err = error_get_last();
    if (!$err || !in_array($err['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR], true)) {
        return;
    }
    if (headers_sent()) {
        return;
    }

    $env = apiRuntimeEnv();
    $payload = [
        'ok' => false,
        'error' => $env === 'production' ? 'Une erreur est survenue. Reessayez plus tard.' : $err['message'],
    ];
    if ($env !== 'production') {
        $payload['detail'] = basename($err['file']) . ':' . $err['line'];
    }

    apiJsonResponse($payload, 500);
});

set_exception_handler(function (Throwable $e): void {
    $env = apiRuntimeEnv();
    $payload = [
        'ok' => false,
        'error' => $env === 'production' ? 'Une erreur est survenue. Reessayez plus tard.' : $e->getMessage(),
    ];

    if ($env !== 'production' && (str_contains($e->getMessage(), 'getaddrinfo') || str_contains($e->getMessage(), '2002'))) {
        $payload['hint'] = 'La BDD Ionos est inaccessible depuis cette machine. Lancez npm run php + npm run dev en local pour tester l API, ou testez sur le FTP Ionos. Activez l acces distant MySQL dans Ionos si besoin.';
    }
    if ($env !== 'production' && function_exists('dbConfigDiagnostics')) {
        $payload['diagnostics'] = dbConfigDiagnostics();
    }

    apiJsonResponse($payload, 500);
});
