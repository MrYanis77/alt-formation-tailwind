<?php

require_once __DIR__ . '/lib/bootstrap.php';
require_once __DIR__ . '/lib/db.php';
require_once __DIR__ . '/lib/logger.php';
require_once __DIR__ . '/lib/cors.php';
require_once __DIR__ . '/lib/nexytal.php';
require_once __DIR__ . '/lib/mail.php';

apiCorsHeaders();
apiHandleOptions();
apiRequireMethod('GET');

function safeHealthCount(PDO $pdo, string $sql, array $params = []): int
{
    try {
        return fetchScalar($pdo, $sql, $params);
    } catch (Throwable $e) {
        return 0;
    }
}

try {
    $pdo = db();
    $pdo->query('SELECT 1');
    $version = $pdo->query('SELECT VERSION()')->fetchColumn();
    $sid = resolveSiteId();

    $requiredTables = [
        'core_sites',
        'formation_categories',
        'formation_courses',
        'formation_modules',
        'formation_skills',
        'formation_jobs',
        'offres_emploi',
        'candidatures_externes',
        'site_pricing_plans',
        'blog_posts',
        'newsletter_subscribers',
    ];

    $tables = [];
    foreach ($requiredTables as $table) {
        $tables[$table] = tableExists($pdo, $table);
    }

    $counts = [];

    if ($tables['formation_categories']) {
        $counts['formation_categories'] = safeHealthCount(
            $pdo,
            'SELECT COUNT(*) FROM formation_categories WHERE site_id = ?',
            [$sid]
        );
    }

    if ($tables['formation_courses']) {
        $counts['formation_courses_total'] = safeHealthCount(
            $pdo,
            'SELECT COUNT(*) FROM formation_courses WHERE site_id = ?',
            [$sid]
        );
        $counts['formation_courses_published'] = columnExists($pdo, 'formation_courses', 'status')
            ? safeHealthCount(
                $pdo,
                "SELECT COUNT(*) FROM formation_courses WHERE site_id = ? AND status = 'published'",
                [$sid]
            )
            : $counts['formation_courses_total'];
    }

    if ($tables['formation_modules'] && $tables['formation_courses']) {
        $counts['formation_modules'] = safeHealthCount(
            $pdo,
            'SELECT COUNT(*) FROM formation_modules m INNER JOIN formation_courses c ON c.id = m.course_id WHERE c.site_id = ?',
            [$sid]
        );
    }

    if ($tables['formation_skills'] && $tables['formation_courses']) {
        $counts['formation_skills'] = safeHealthCount(
            $pdo,
            'SELECT COUNT(*) FROM formation_skills s INNER JOIN formation_courses c ON c.id = s.course_id WHERE c.site_id = ?',
            [$sid]
        );
    }

    if ($tables['formation_jobs'] && $tables['formation_courses']) {
        $counts['formation_jobs'] = safeHealthCount(
            $pdo,
            'SELECT COUNT(*) FROM formation_jobs j INNER JOIN formation_courses c ON c.id = j.course_id WHERE c.site_id = ?',
            [$sid]
        );
    }

    $careerAudit = null;
    if ($tables['offres_emploi'] && columnExists($pdo, 'offres_emploi', 'department')) {
        $careerAudit = buildCareerAudit($pdo, $sid);
        $counts['career_offers_published'] = $careerAudit['api_visible_count'] ?? 0;
    }

    if ($tables['site_pricing_plans']) {
        $counts['site_pricing_plans'] = safeHealthCount(
            $pdo,
            'SELECT COUNT(*) FROM site_pricing_plans WHERE site_id = ? AND is_active = 1',
            [$sid]
        );
    }

    if ($tables['blog_posts']) {
        $counts['blog_posts_total'] = safeHealthCount(
            $pdo,
            'SELECT COUNT(*) FROM blog_posts WHERE site_id = ? AND deleted_at IS NULL',
            [$sid]
        );
        $counts['blog_posts_published'] = safeHealthCount(
            $pdo,
            "SELECT COUNT(*) FROM blog_posts WHERE site_id = ? AND deleted_at IS NULL AND status = 'published'",
            [$sid]
        );
    }

    if ($tables['newsletter_subscribers']) {
        $counts['newsletter_subscribers'] = safeHealthCount(
            $pdo,
            'SELECT COUNT(*) FROM newsletter_subscribers WHERE site_id = ?',
            [$sid]
        );
    }

    $debugDiagnostics = (env('APP_ENV', 'production') ?? 'production') !== 'production' || (!empty($_GET['debug']) && isLocalDevHost());

    apiJsonResponse([
        'ok' => true,
        'db' => $debugDiagnostics ? env('DB_NAME') : null,
        'host' => $debugDiagnostics ? env('DB_HOST') : null,
        'server_version' => $debugDiagnostics ? $version : null,
        'env' => env('APP_ENV', 'production'),
        'site_id' => $sid,
        'site' => getSiteRow($pdo, $sid),
        'pdo_mysql' => extension_loaded('pdo_mysql'),
        'tables' => $tables,
        'formation_backend' => $tables['formation_categories']
            && $tables['formation_courses']
            && $tables['formation_modules']
            && $tables['formation_skills']
            && $tables['formation_jobs']
                ? 'formation_categories + formation_courses + formation_modules + formation_skills + formation_jobs'
                : 'tables formation incompletes',
        'career_backend' => $tables['offres_emploi'] && columnExists($pdo, 'offres_emploi', 'department')
            ? 'offres_emploi + candidatures_externes'
            : 'migration SQL requise (schema-alt-formation-migration-ionos.sql)',
        'counts' => $counts,
        'career_audit' => $careerAudit,
        'diagnostics' => $debugDiagnostics ? array_merge(dbConfigDiagnostics(), ['smtp' => mailConfigDiagnostics()]) : null,
        'endpoints' => [
            'formations' => '/api/formations.php',
            'formations_all' => '/api/formations.php?all=1',
            'formations_certifiantes' => '/api/formations.php?type=certifiante',
            'formations_elearning' => '/api/formations.php?type=elearning',
            'blog' => '/api/blog.php',
            'pricing' => '/api/pricing.php',
            'pricing_bilan' => '/api/pricing.php?entity_type=service&entity_slug=bilan-competences',
            'careers' => '/api/careers.php',
            'apply_career' => '/api/apply-career.php (POST multipart)',
            'test_data' => '/api/test-data.php',
        ],
    ]);
} catch (Throwable $e) {
    apiServerError($e, ['endpoint' => basename(__FILE__)]);
}
