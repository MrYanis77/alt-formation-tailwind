<?php
declare(strict_types=1);

require_once __DIR__ . '/config.php';

function isProduction(): bool
{
    return (env('APP_ENV', 'production') ?? 'production') === 'production';
}

function clientIpForLimit(): string
{
    $forwarded = env('TRUST_PROXY', 'false') === 'true'
        ? ($_SERVER['HTTP_X_FORWARDED_FOR'] ?? '')
        : '';
    if ($forwarded !== '') {
        return trim(explode(',', $forwarded)[0]);
    }

    return $_SERVER['REMOTE_ADDR'] ?? '0.0.0.0';
}

/** Limite simple par IP (fichier temp) â€” adaptÃ© hÃ©bergement mutualisÃ© */
function enforceRateLimit(string $endpoint, int $maxAttempts = 8, int $windowSeconds = 900): void
{
    $dir = sys_get_temp_dir() . '/alt_formation_rate';
    if (!is_dir($dir) && !@mkdir($dir, 0700, true) && !is_dir($dir)) {
        return;
    }

    $key = hash('sha256', clientIpForLimit() . '|' . $endpoint);
    $file = $dir . '/' . $key . '.json';
    $now = time();
    $data = ['count' => 0, 'start' => $now];

    if (is_file($file)) {
        $decoded = json_decode((string)file_get_contents($file), true);
        if (is_array($decoded)) {
            $data = $decoded;
        }
        if ($now - (int)($data['start'] ?? 0) > $windowSeconds) {
            $data = ['count' => 0, 'start' => $now];
        }
    }

    $data['count'] = (int)($data['count'] ?? 0) + 1;
    @file_put_contents($file, json_encode($data), LOCK_EX);

    if ($data['count'] > $maxAttempts) {
        http_response_code(429);
        header(PORTAL_JSON_CONTENT_TYPE_HEADER);
        echo json_encode([
            'error' => 'Too Many Requests',
            'message' => 'Trop de tentatives. RÃ©essayez dans quelques minutes.',
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
}

function rejectHoneypot(array $body): void
{
    $trap = trim((string)($body['website'] ?? $body['url'] ?? ''));
    if ($trap !== '') {
        http_response_code(422);
        header(PORTAL_JSON_CONTENT_TYPE_HEADER);
        echo json_encode([
            'error' => 'Validation Error',
            'message' => 'RequÃªte rejetÃ©e.',
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }
}

function safeMailSubject(string $value, int $max = 200): string
{
    $value = preg_replace("/[\r\n\0]/", '', trim($value)) ?? '';
    return mb_substr($value, 0, $max);
}

function apiErrorMessage(Throwable $e): string
{
    if (isProduction()) {
        return 'Une erreur est survenue. RÃ©essayez plus tard.';
    }

    return $e->getMessage();
}

const PORTAL_PASSWORD_MIN_LENGTH = 10;

/** RÃ¨gles : 10+ caractÃ¨res, majuscule, minuscule, chiffre, caractÃ¨re spÃ©cial */
function validateSecurePassword(string $password): ?string // NOSONAR: ordered guards provide precise validation messages
{
    if (strlen($password) < PORTAL_PASSWORD_MIN_LENGTH) {
        return 'Le mot de passe doit contenir au moins ' . PORTAL_PASSWORD_MIN_LENGTH . ' caractÃ¨res.';
    }
    if (!preg_match('/[a-z]/', $password)) {
        return 'Le mot de passe doit contenir au moins une minuscule.';
    }
    if (!preg_match('/[A-Z]/', $password)) {
        return 'Le mot de passe doit contenir au moins une majuscule.';
    }
    if (!preg_match('/\d/', $password)) {
        return 'Le mot de passe doit contenir au moins un chiffre.';
    }
    if (!preg_match('/[^A-Za-z0-9]/', $password)) {
        return 'Le mot de passe doit contenir au moins un caractÃ¨re spÃ©cial.';
    }

    return null;
}

function rejectWeakPassword(string $password): void
{
    $error = validateSecurePassword($password);
    if ($error === null) {
        return;
    }

    http_response_code(400);
    header(PORTAL_JSON_CONTENT_TYPE_HEADER);
    echo json_encode([
        'error' => 'Weak password',
        'message' => $error,
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

function hashPortalPassword(string $password): string
{
    if (defined('PASSWORD_ARGON2ID')) {
        return password_hash($password, PASSWORD_ARGON2ID, [
            'memory_cost' => 65536,
            'time_cost' => 4,
            'threads' => 1,
        ]);
    }

    return password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
}
