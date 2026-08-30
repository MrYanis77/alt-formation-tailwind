<?php
declare(strict_types=1);

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/helpers.php';

header('Content-Type: application/json; charset=UTF-8');
portalApplyCors('GET, POST, OPTIONS');
portalHandleOptions();

try {
    $pdo = getPdo();
    if (file_exists(__DIR__ . '/site.php')) {
        require_once __DIR__ . '/site.php';
        bootstrapSiteId($pdo);
    }
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Connection error',
        'message' => portalPublicErrorMessage($e),
    ], JSON_UNESCAPED_UNICODE);
    exit;
}
