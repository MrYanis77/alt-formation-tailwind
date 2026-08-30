<?php
/**
 * Formations Nexytal - GET /api/formations.php
 * Parametres : ?slug=xxx (une formation) - ?all=1 (inclure brouillons, diagnostic)
 */
require_once __DIR__ . '/lib/bootstrap.php';
require_once __DIR__ . '/lib/db.php';
require_once __DIR__ . '/lib/logger.php';
require_once __DIR__ . '/lib/cors.php';
require_once __DIR__ . '/lib/nexytal.php';

apiCorsHeaders();
apiHandleOptions();
apiRequireMethod('GET');

try {
    $pdo = db();
    $sid = resolveSiteId();
    $slug = apiCleanSlugParam(isset($_GET['slug']) ? (string) $_GET['slug'] : null);
    $type = apiCleanSlugParam(isset($_GET['type']) ? (string) $_GET['type'] : null, 'type', 40);
    $publishedOnly = !isset($_GET['all']) || $_GET['all'] !== '1';

    if ($type !== null && $type !== '' && !in_array($type, ['diplomante', 'certifiante', 'elearning'], true)) {
        apiJsonResponse(['ok' => false, 'error' => 'Type formation invalide'], 400);
    }

    $categories = getFormationCategories($pdo, $sid, $publishedOnly);
    $courses = getFormationCourses($pdo, $sid, $slug ?: null, $publishedOnly, $type ?: null);
    attachFormationPricesFromPlans($pdo, $sid, $courses);

    if ($slug && count($courses) === 0) {
        apiJsonResponse([
            'ok' => false,
            'error' => 'Formation introuvable',
            'slug' => $slug,
            'site_id' => $sid,
        ], 404);
    }

    apiJsonResponse([
        'ok' => true,
        'generated_at' => date('c'),
        'site_id' => $sid,
        'site' => getSiteRow($pdo, $sid),
        'filters' => [
            'type' => $type,
            'published_only' => $publishedOnly,
        ],
        'data' => [
            'categories' => $categories,
            'courses' => $courses,
            'formations' => $courses,
        ],
        'count' => count($courses),
    ]);
} catch (Throwable $e) {
    apiServerError($e, ['endpoint' => basename(__FILE__)]);
}
