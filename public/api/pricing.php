<?php
/**
 * Tarifs multi-sites - GET /api/pricing.php
 * Parametres : ?entity_type=service&entity_slug=bilan-competences
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
    $entityType = apiCleanSlugParam(isset($_GET['entity_type']) ? (string) $_GET['entity_type'] : null, 'entity_type', 60);
    $entitySlug = apiCleanSlugParam(isset($_GET['entity_slug']) ? (string) $_GET['entity_slug'] : null, 'entity_slug', 160);

    $plans = getSitePricingPlans($pdo, $sid, $entityType ?: null, $entitySlug ?: null, true);

    $grouped = [];
    foreach ($plans as $plan) {
        $key = $plan['entity_type'] . ':' . $plan['entity_slug'];
        if (!isset($grouped[$key])) {
            $grouped[$key] = [
                'entity_type' => $plan['entity_type'],
                'entity_slug' => $plan['entity_slug'],
                'plans' => [],
            ];
        }
        $grouped[$key]['plans'][] = $plan;
    }

    apiJsonResponse([
        'ok' => true,
        'generated_at' => date('c'),
        'site_id' => $sid,
        'site' => getSiteRow($pdo, $sid),
        'data' => [
            'plans' => $plans,
            'grouped' => array_values($grouped),
        ],
        'count' => count($plans),
    ]);
} catch (Throwable $e) {
    apiServerError($e, ['endpoint' => basename(__FILE__)]);
}
