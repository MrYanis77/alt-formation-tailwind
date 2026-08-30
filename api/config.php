<?php
declare(strict_types=1);

class PortalConfigurationException extends RuntimeException
{
}

class PortalDatabaseConnectionException extends RuntimeException
{
}

const PORTAL_JSON_CONTENT_TYPE_HEADER = 'Content-Type: application/json; charset=UTF-8';

/** Polyfills PHP 7.4 (hébergement Ionos) — natifs en PHP 8.0+ */
if (!function_exists('str_starts_with')) {
    function str_starts_with(string $haystack, string $needle): bool // NOSONAR: native polyfill name
    {
        return $needle === '' || strncmp($haystack, $needle, strlen($needle)) === 0;
    }
}

if (!function_exists('str_contains')) {
    function str_contains(string $haystack, string $needle): bool // NOSONAR: native polyfill name
    {
        return $needle === '' || strpos($haystack, $needle) !== false;
    }
}

/** @var array<string, string> $env */
$env = [];

function envCandidates(): array
{
    return [
        dirname(__DIR__) . '/db.env',
        dirname(__DIR__) . '/.env',
        __DIR__ . '/db.env',
    ];
}

function loadEnvFile(string $path): void
{
    global $env;

    if (!is_readable($path)) {
        return;
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    if ($lines === false) {
        return;
    }

    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#') || !str_contains($line, '=')) {
            continue;
        }

        [$key, $value] = explode('=', $line, 2);
        $key = trim($key);
        $value = trim($value, " \t\"'");

        $env[$key] = $value;
        putenv("$key=$value");
        $_ENV[$key] = $value;
    }
}

function bootstrapEnv(): void
{
    foreach (envCandidates() as $path) {
        if (file_exists($path)) {
            loadEnvFile($path);
        }
    }
}

function env(string $key, ?string $default = null): ?string
{
    global $env;
    return $env[$key] ?? $_ENV[$key] ?? getenv($key) ?: $default;
}

/** @deprecated use env() — kept for legacy api scripts */
function envValue(string $key, ?string $default = null): ?string
{
    return env($key, $default);
}

function getDbConfig(): array
{
    bootstrapEnv();

    $hosts = array_values(array_filter(array_map(
        static fn (string $host): string => trim($host),
        explode(',', env('DB_HOST', 'localhost') ?? 'localhost')
    )));

    if ($hosts === []) {
        $hosts = ['localhost'];
    }

    return [
        'hosts' => $hosts,
        'port' => env('DB_PORT', '3306') ?? '3306',
        'name' => env('DB_NAME'),
        'user' => env('DB_USER'),
        'pass' => env('DB_PASSWORD', '') ?? '',
        'charset' => env('DB_CHARSET', 'utf8mb4') ?? 'utf8mb4',
    ];
}

function getPdo(): PDO
{
    static $pdo = null;

    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $config = getDbConfig();

    if (!$config['name'] || !$config['user']) {
        throw new PortalConfigurationException('DB_NAME et DB_USER requis dans .env');
    }

    $options = [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ];

    $lastError = null;

    foreach ($config['hosts'] as $host) {
        try {
            $dsn = sprintf(
                'mysql:host=%s;port=%s;dbname=%s;charset=%s',
                $host,
                $config['port'],
                $config['name'],
                $config['charset']
            );

            $pdo = new PDO($dsn, $config['user'], $config['pass'], $options);

            if (file_exists(__DIR__ . '/site.php')) {
                require_once __DIR__ . '/site.php';
                bootstrapSiteId($pdo);
            }

            return $pdo;
        } catch (PDOException $e) {
            $lastError = $e;
        }
    }

    throw $lastError ?? new PortalDatabaseConnectionException('Impossible de se connecter à MariaDB');
}

function getConnectionDiagnostics(): array
{
    $checks = [];

    foreach (envCandidates() as $path) {
        $checks[] = ['path' => $path, 'exists' => file_exists($path)];
    }

    try {
        $config = getDbConfig();
    } catch (Throwable $e) {
        return [
            'env_files' => $checks,
            'config_loaded' => false,
            'error' => $e->getMessage(),
        ];
    }

    $attempts = [];

    foreach ($config['hosts'] as $host) {
        try {
            $dsn = sprintf(
                'mysql:host=%s;port=%s;dbname=%s;charset=%s',
                $host,
                $config['port'],
                $config['name'],
                $config['charset']
            );

            $probe = new PDO($dsn, $config['user'], $config['pass'], [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_TIMEOUT => 5,
            ]);

            $version = $probe->query('SELECT VERSION() AS v')->fetch();

            $attempts[] = [
                'host' => $host,
                'success' => true,
                'version' => $version['v'] ?? null,
            ];
        } catch (PDOException $e) {
            $attempts[] = [
                'host' => $host,
                'success' => false,
                'error' => $e->getMessage(),
            ];
        }
    }

    return [
        'env_files' => $checks,
        'config_loaded' => true,
        'db_user' => $config['user'],
        'db_name' => $config['name'],
        'db_hosts' => $config['hosts'],
        'password_set' => $config['pass'] !== '',
        'pdo_mysql_loaded' => extension_loaded('pdo_mysql'),
        'attempts' => $attempts,
    ];
}

bootstrapEnv();
