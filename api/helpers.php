<?php
declare(strict_types=1);

/**
 * Applique une politique CORS par liste blanche. Une requete sans en-tete Origin
 * est une requete serveur/same-origin et ne necessite aucun en-tete CORS.
 */
function portalApplyCors(string $methods = 'GET, OPTIONS'): void
{
    $origin = trim((string)($_SERVER['HTTP_ORIGIN'] ?? ''));
    $configured = getenv('CORS_ORIGINS') ?: '';
    if (function_exists('env')) {
        $configured = env('CORS_ORIGINS', '') ?? '';
    }
    $allowedOrigins = array_values(array_filter(array_map('trim', explode(',', $configured))));

    if ($allowedOrigins === []) {
        $allowedOrigins = [
            'https://alt-formation.fr',
            'https://www.alt-formation.fr',
            'http://localhost:5173',
            'http://127.0.0.1:5173',
        ];
    }

    if ($origin !== '' && in_array($origin, $allowedOrigins, true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Vary: Origin');
    }

    header('Access-Control-Allow-Methods: ' . $methods);
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-Site-Id');
    header('X-Content-Type-Options: nosniff');
}

function portalHandleOptions(): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'OPTIONS') {
        return;
    }

    http_response_code(204);
    exit;
}

function portalPublicErrorMessage(Throwable $error): string
{
    $appEnv = function_exists('env') ? (env('APP_ENV', 'production') ?? 'production') : 'production';
    return $appEnv === 'production'
        ? 'Une erreur est survenue. Reessayez plus tard.'
        : $error->getMessage();
}

function portalJsonError(int $status, string $error, ?string $message = null): void
{
    if (!headers_sent()) {
        http_response_code($status);
        header('Content-Type: application/json; charset=UTF-8');
        portalApplyCors();
    }

    echo json_encode(array_filter([
        'error' => $error,
        'message' => $message,
    ], static function ($value) {
        return $value !== null;
    }), JSON_UNESCAPED_UNICODE);
    exit;
}

function portalRegisterFatalHandler(): void
{
    static $registered = false;

    if ($registered) {
        return;
    }

    $registered = true;

    register_shutdown_function(static function (): void {
        $err = error_get_last();
        if ($err === null || !in_array($err['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR], true)) {
            return;
        }

        portalJsonError(500, 'Internal Server Error', $err['message'] ?? 'Fatal error');
    });
}

function readJsonBody(): array
{
    $raw = file_get_contents('php://input');
    if ($raw === false || trim($raw) === '') {
        return $_POST;
    }

    $decoded = json_decode($raw, true);
    return is_array($decoded) ? $decoded : $_POST;
}

function clientIp(): string
{
    $trustProxy = function_exists('env') && env('TRUST_PROXY', 'false') === 'true';
    $forwarded = $trustProxy ? ($_SERVER['HTTP_X_FORWARDED_FOR'] ?? '') : '';
    if ($forwarded !== '') {
        return trim(explode(',', $forwarded)[0]);
    }

    return $_SERVER['REMOTE_ADDR'] ?? '';
}

function splitCsv(?string $value): array
{
    if ($value === null || trim($value) === '') {
        return [];
    }

    return array_values(array_filter(array_map('trim', explode(',', $value))));
}

function formatFrenchDate(string $date): string
{
    $timestamp = strtotime($date);
    if ($timestamp === false) {
        return $date;
    }

    $days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
    $months = ['', 'janvier', 'fevrier', 'mars', 'avril', 'mai', 'juin', 'juillet', 'aout', 'septembre', 'octobre', 'novembre', 'decembre'];

    $dayName = $days[(int)date('w', $timestamp)];
    $day = (int)date('j', $timestamp);
    $month = $months[(int)date('n', $timestamp)];

    return ucfirst($dayName) . ' ' . $day . ' ' . $month;
}

function formatTime(string $time): string
{
    return substr($time, 0, 5);
}

function slugify(string $value): string
{
    $value = iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $value) ?: $value;
    $value = strtolower(preg_replace('/[^a-z0-9]+/', '-', $value) ?? '');
    return trim($value, '-') ?: 'item';
}

function tableExists(PDO $pdo, string $table): bool
{
    try {
        $stmt = $pdo->prepare('
            SELECT 1
            FROM information_schema.tables
            WHERE table_schema = DATABASE()
              AND table_name = :table
            LIMIT 1
        ');
        $stmt->execute(['table' => $table]);

        if ($stmt->fetchColumn()) {
            return true;
        }
    } catch (Throwable $e) {
        // information_schema can be restricted on shared hosting.
    }

    try {
        $stmt = $pdo->query('SHOW TABLES LIKE ' . $pdo->quote($table));

        return $stmt !== false && $stmt->fetch() !== false;
    } catch (Throwable $e) {
        return false;
    }
}

function columnExists(PDO $pdo, string $table, string $column): bool
{
    try {
        $stmt = $pdo->prepare('
            SELECT 1
            FROM information_schema.columns
            WHERE table_schema = DATABASE()
              AND table_name = :table
              AND column_name = :column
            LIMIT 1
        ');
        $stmt->execute(['table' => $table, 'column' => $column]);

        if ($stmt->fetchColumn()) {
            return true;
        }
    } catch (Throwable $e) {
        // information_schema can be restricted on shared hosting.
    }

    try {
        $stmt = $pdo->query('SHOW COLUMNS FROM `' . str_replace('`', '``', $table) . '` LIKE ' . $pdo->quote($column));

        return $stmt !== false && $stmt->fetch() !== false;
    } catch (Throwable $e) {
        return false;
    }
}

function logGdprConsent(PDO $pdo, string $email, string $consentType, ?int $referenceId = null, bool $granted = true): void
{
    if (!tableExists($pdo, 'gdpr_consents_log')) {
        return;
    }

    $columns = ['site_id', 'user_email', 'consent_type', 'granted'];
    $placeholders = [':site_id', ':email', ':consent_type', ':granted'];
    $params = [
        'site_id' => defined('SITE_ID') ? SITE_ID : 1,
        'email' => $email,
        'consent_type' => $consentType,
        'granted' => $granted ? 1 : 0,
    ];

    if (columnExists($pdo, 'gdpr_consents_log', 'ip_address')) {
        $columns[] = 'ip_address';
        $placeholders[] = ':ip';
        $params['ip'] = clientIp();
    }

    if (columnExists($pdo, 'gdpr_consents_log', 'user_agent')) {
        $columns[] = 'user_agent';
        $placeholders[] = ':user_agent';
        $params['user_agent'] = substr((string)($_SERVER['HTTP_USER_AGENT'] ?? ''), 0, 255);
    }

    if ($referenceId !== null && columnExists($pdo, 'gdpr_consents_log', 'reference_id')) {
        $columns[] = 'reference_id';
        $placeholders[] = ':reference_id';
        $params['reference_id'] = $referenceId;
    }

    $sql = sprintf(
        'INSERT INTO gdpr_consents_log (%s) VALUES (%s)',
        implode(', ', $columns),
        implode(', ', $placeholders)
    );
    $pdo->prepare($sql)->execute($params);
}
