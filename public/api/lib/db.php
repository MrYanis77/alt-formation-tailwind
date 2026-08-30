<?php
class DatabaseConfigurationException extends RuntimeException
{
}

class DatabaseConnectionException extends RuntimeException
{
}

const API_ENV_FILE = '/.env';
/**
 * Connexion PDO — lit uniquement public/api/config/.env
 * Surcharge .env.local seulement si USE_LOCAL_ENV=1 dans .env (dev XAMPP).
 */
function loadEnv(string $path): void
{
    if (!is_readable($path)) {
        return;
    }
    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($lines === false) {
        return;
    }
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || $line[0] === '#' || strpos($line, '=') === false) {
            continue;
        }
        [$key, $value] = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value, " \t\"'");
        $_ENV[$key] = $value;
        putenv($key . '=' . $value);
    }
}

function isLocalDevHost(): bool
{
    $host = strtolower((string) ($_SERVER['HTTP_HOST'] ?? $_SERVER['SERVER_NAME'] ?? ''));
    if ($host === '') {
        return PHP_SAPI === 'cli' || PHP_SAPI === 'cli-server';
    }
    return str_contains($host, 'localhost')
        || str_contains($host, '127.0.0.1')
        || str_starts_with($host, '192.168.')
        || str_starts_with($host, '10.');
}

function loadAllEnv(): void
{
    static $loaded = false;
    if ($loaded) {
        return;
    }

    $configDir = __DIR__ . '/../config';
    loadEnv($configDir . API_ENV_FILE);

    $useLocal = ($_ENV['USE_LOCAL_ENV'] ?? getenv('USE_LOCAL_ENV') ?: '0') === '1';
    if ($useLocal && isLocalDevHost() && is_readable($configDir . '/.env.local')) {
        loadEnv($configDir . '/.env.local');
    }

    $loaded = true;
}

function env(string $key, ?string $default = null): ?string
{
    loadAllEnv();
    $v = $_ENV[$key] ?? getenv($key);
    if ($v === false || $v === '') {
        return $default;
    }
    return (string) $v;
}

function dbConfigDiagnostics(): array
{
    loadAllEnv();
    $configDir = __DIR__ . '/../config';
    return [
        'env_file' => $configDir . API_ENV_FILE,
        'env_readable' => is_readable($configDir . API_ENV_FILE),
        'local_env_applied' => (($_ENV['USE_LOCAL_ENV'] ?? '0') === '1') && isLocalDevHost(),
        'runtime' => [
            'is_local_dev' => isLocalDevHost(),
            'php_sapi' => PHP_SAPI,
            'http_host' => $_SERVER['HTTP_HOST'] ?? null,
        ],
        'db' => [
            'host' => env('DB_HOST'),
            'port' => env('DB_PORT', '3306'),
            'name' => env('DB_NAME'),
            'user' => env('DB_USER'),
            'charset' => env('DB_CHARSET', 'utf8mb4'),
            'site_id' => siteId(),
        ],
    ];
}

function db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    loadAllEnv();

    $host = trim((string) env('DB_HOST', ''));
    $port = env('DB_PORT', '3306');
    $name = env('DB_NAME');
    $user = env('DB_USER');
    $pass = env('DB_PASSWORD', '');
    $charset = env('DB_CHARSET', 'utf8mb4');

    if (!$host || !$name || !$user) {
        throw new DatabaseConfigurationException(
            'Configuration incomplete dans api/config/.env (DB_HOST, DB_NAME, DB_USER requis).'
        );
    }

    if (str_contains($host, ':') && !str_contains($host, '/')) {
        [$hostPart, $portPart] = explode(':', $host, 2);
        if (ctype_digit($portPart)) {
            $host = $hostPart;
            $port = $portPart;
        }
    }

    $dsn = sprintf(
        'mysql:host=%s;port=%s;dbname=%s;charset=%s;connect_timeout=10',
        $host,
        $port,
        $name,
        $charset
    );

    try {
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ];
        if (defined('PDO::MYSQL_ATTR_CONNECT_TIMEOUT')) {
            $options[PDO::MYSQL_ATTR_CONNECT_TIMEOUT] = 5;
        }
        $pdo = new PDO($dsn, $user, $pass, $options);
    } catch (PDOException $e) {
        throw new DatabaseConnectionException(
            'Connexion BDD echouee (' . $host . '/' . $name . ') : ' . $e->getMessage(),
            0,
            $e
        );
    }

    return $pdo;
}

function tableExists(PDO $pdo, string $table): bool
{
    $stmt = $pdo->prepare(
        'SELECT COUNT(*) FROM information_schema.tables
         WHERE table_schema = DATABASE() AND table_name = ?'
    );
    $stmt->execute([$table]);
    return (int) $stmt->fetchColumn() > 0;
}

function columnExists(PDO $pdo, string $table, string $column): bool
{
    $stmt = $pdo->prepare(
        'SELECT COUNT(*) FROM information_schema.columns
         WHERE table_schema = DATABASE() AND table_name = ? AND column_name = ?'
    );
    $stmt->execute([$table, $column]);
    return (int) $stmt->fetchColumn() > 0;
}

function fetchAll(PDO $pdo, string $sql, array $params = []): array
{
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    return $stmt->fetchAll();
}

function fetchScalar(PDO $pdo, string $sql, array $params = []): int
{
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    return (int) $stmt->fetchColumn();
}

function siteId(): int
{
    return max(1, (int) env('SITE_ID', '1'));
}
