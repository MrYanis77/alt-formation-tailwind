<?php
/**
 * Offres carriere internes - GET /api/careers.php
 * Parametres : ?slug=xxx - ?department=collaborateur|formateur - ?all=1
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
    $department = apiCleanSlugParam(isset($_GET['department']) ? (string) $_GET['department'] : null, 'department', 40);
    $publishedOnly = !isset($_GET['all']) || $_GET['all'] !== '1';

    if ($slug !== null && $slug !== '') {
        $offer = getCareerJobOfferBySlug($pdo, $sid, $slug, $publishedOnly);
        if ($offer === null) {
            apiJsonResponse(['ok' => false, 'error' => 'Offre introuvable'], 404);
        }

        apiJsonResponse([
            'ok' => true,
            'generated_at' => date('c'),
            'site_id' => $sid,
            'site' => getSiteRow($pdo, $sid),
            'data' => ['offer' => $offer],
        ]);
    }

    if ($department !== null && $department !== '' && !in_array($department, ['collaborateur', 'formateur'], true)) {
        apiJsonResponse(['ok' => false, 'error' => 'department invalide'], 400);
    }

    $offers = getCareerJobOffers($pdo, $sid, $department ?: null, $publishedOnly);

    $byDepartment = [
        'collaborateur' => [],
        'formateur' => [],
    ];
    foreach ($offers as $offer) {
        $dept = $offer['department'] ?? 'collaborateur';
        if (isset($byDepartment[$dept])) {
            $byDepartment[$dept][] = $offer;
        }
    }

    apiJsonResponse([
        'ok' => true,
        'generated_at' => date('c'),
        'site_id' => $sid,
        'site' => getSiteRow($pdo, $sid),
        'data' => [
            'offers' => $offers,
            'by_department' => $byDepartment,
        ],
        'count' => count($offers),
    ]);
} catch (Throwable $e) {
    apiServerError($e, ['endpoint' => basename(__FILE__)]);
}
