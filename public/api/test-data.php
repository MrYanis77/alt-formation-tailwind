<?php
/**
 * Export JSON Nexytal — formations, blog, newsletter (site_id depuis .env).
 * GET /api/test-data.php · ?all=0 pour le contenu publié uniquement
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
    $includeAllStatuses = !isset($_GET['all']) || $_GET['all'] !== '0';

    apiJsonResponse(buildNexytalExport($pdo, $sid, $includeAllStatuses));
} catch (Throwable $e) {
    apiServerError($e, ['endpoint' => basename(__FILE__)]);
}
