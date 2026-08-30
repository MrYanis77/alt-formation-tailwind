<?php
declare(strict_types=1);

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/helpers.php';

header('Content-Type: application/json; charset=utf-8');
portalApplyCors();
portalHandleOptions();

require_once __DIR__ . '/site.php';

function healthJson(array $payload, int $status = 200): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

function safeRootCount(PDO $pdo, string $sql, array $params = []): int
{
    try {
        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        return (int)$stmt->fetchColumn();
    } catch (Throwable $e) {
        return 0;
    }
}

try {
    $pdo = getPdo();
    bootstrapSiteId($pdo);

    $version = $pdo->query('SELECT VERSION() AS version')->fetch(PDO::FETCH_ASSOC);
    $now = $pdo->query('SELECT NOW() AS server_time')->fetch(PDO::FETCH_ASSOC);

    $requiredTables = [
        'core_sites',
        'formation_categories',
        'formation_courses',
        'formation_modules',
        'formation_skills',
        'formation_jobs',
        'blog_posts',
        'newsletter_subscribers',
        'site_pricing_plans',
    ];

    $tables = [];
    foreach ($requiredTables as $table) {
        $tables[$table] = tableExists($pdo, $table);
    }

    $counts = [];
    if ($tables['formation_categories']) {
        $counts['formation_categories'] = safeRootCount(
            $pdo,
            'SELECT COUNT(*) FROM formation_categories WHERE site_id = :site_id',
            ['site_id' => SITE_ID]
        );
    }
    if ($tables['formation_courses']) {
        $counts['formation_courses_total'] = safeRootCount(
            $pdo,
            'SELECT COUNT(*) FROM formation_courses WHERE site_id = :site_id',
            ['site_id' => SITE_ID]
        );
        $counts['formation_courses_published'] = columnExists($pdo, 'formation_courses', 'status')
            ? safeRootCount(
                $pdo,
                "SELECT COUNT(*) FROM formation_courses WHERE site_id = :site_id AND status = 'published'",
                ['site_id' => SITE_ID]
            )
            : $counts['formation_courses_total'];
    }
    if ($tables['formation_modules'] && $tables['formation_courses']) {
        $counts['formation_modules'] = safeRootCount(
            $pdo,
            'SELECT COUNT(*) FROM formation_modules m INNER JOIN formation_courses c ON c.id = m.course_id WHERE c.site_id = :site_id',
            ['site_id' => SITE_ID]
        );
    }
    if ($tables['formation_skills'] && $tables['formation_courses']) {
        $counts['formation_skills'] = safeRootCount(
            $pdo,
            'SELECT COUNT(*) FROM formation_skills s INNER JOIN formation_courses c ON c.id = s.course_id WHERE c.site_id = :site_id',
            ['site_id' => SITE_ID]
        );
    }
    if ($tables['formation_jobs'] && $tables['formation_courses']) {
        $counts['formation_jobs'] = safeRootCount(
            $pdo,
            'SELECT COUNT(*) FROM formation_jobs j INNER JOIN formation_courses c ON c.id = j.course_id WHERE c.site_id = :site_id',
            ['site_id' => SITE_ID]
        );
    }

    $isProduction = (env('APP_ENV', 'production') ?? 'production') === 'production';
    $payload = [
        'ok' => true,
        'success' => true,
        'message' => 'Connexion MariaDB OK',
        'site_id' => SITE_ID,
        'site_code' => SITE_CODE,
        'server_time' => $now['server_time'] ?? null,
        'endpoints' => [
            'formations' => '/api/formations.php',
            'health' => '/api/health.php',
        ],
    ];

    if (!$isProduction) {
        $payload['core_site'] = coreSiteRow($pdo);
        $payload['database'] = env('DB_NAME');
        $payload['app_env'] = env('APP_ENV', 'production');
        $payload['mariadb_version'] = $version['version'] ?? null;
        $payload['tables'] = $tables;
        $payload['counts'] = $counts;
        $payload['diagnostics'] = getConnectionDiagnostics();
        $payload['endpoints']['formations_all'] = '/api/formations.php?all=1';
    }

    healthJson($payload);
} catch (Throwable $e) {
    $error = $e->getMessage();
    $hint = 'Verifiez le fichier .env/db.env et core_sites.id=1.';
    $isProduction = (env('APP_ENV', 'production') ?? 'production') === 'production';

    if (str_contains($error, '1045')) {
        $hint = 'Erreur 1045 = mauvais mot de passe ou mauvais DB_HOST.';
    } elseif (str_contains($error, 'introuvable') || str_contains($error, 'DB_NAME')) {
        $hint = 'Fichier .env/db.env absent ou incomplet.';
    }

    $payload = [
        'ok' => false,
        'success' => false,
        'message' => 'Echec connexion MariaDB',
    ];

    if (!$isProduction) {
        $payload['error'] = $error;
        $payload['hint'] = $hint;
        $payload['diagnostics'] = getConnectionDiagnostics();
    }

    healthJson($payload, 500);
}
