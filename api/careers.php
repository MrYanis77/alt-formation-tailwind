<?php
declare(strict_types=1);

error_reporting(E_ALL);
ini_set('display_errors', '0');

function careersJsonError(int $status, string $error, ?string $message = null): void
{
    if (!headers_sent()) {
        http_response_code($status);
        header(PORTAL_JSON_CONTENT_TYPE_HEADER);
    }

    echo json_encode(array_filter([
        'ok' => false,
        'error' => $error,
        'hint' => $message,
    ], static fn ($value) => $value !== null), JSON_UNESCAPED_UNICODE);
    exit;
}

register_shutdown_function(static function (): void {
    $err = error_get_last();
    if ($err === null || !in_array($err['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR], true)) {
        return;
    }

    careersJsonError(500, 'Internal Server Error', $err['message'] ?? 'Fatal error');
});

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/site.php';
require_once __DIR__ . '/helpers.php';

try {
    $pdo = getPdo();
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $slug = isset($_GET['slug']) ? trim($_GET['slug']) : null;
    $department = isset($_GET['department']) ? trim($_GET['department']) : null;
    $all = isset($_GET['all']) && $_GET['all'] === '1';

    if ($slug) {
        // Fetch a single offer
        $stmt = $pdo->prepare("
            SELECT id, site_id, department, titre as title, slug, type_contrat as contract_type, ville as location, description as short_description, date_publication as published_at, created_at, sort_order
            FROM offres_emploi
            WHERE site_id = :site_id AND slug = :slug AND statut = 'publiee'
            LIMIT 1
        ");
        $stmt->execute(['site_id' => SITE_ID, 'slug' => $slug]);
        $offer = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$offer) {
            careersJsonError(404, 'Offre introuvable');
        }

        header(PORTAL_JSON_CONTENT_TYPE_HEADER);
        echo json_encode(['ok' => true, 'data' => $offer], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // Fetch list of offers
    $where = "site_id = :site_id AND statut = 'publiee' AND slug NOT IN ('candidature-spontanee-collaborateur', 'candidature-spontanee-formateur') AND (date_expiration IS NULL OR date_expiration >= NOW())";
    $params = ['site_id' => SITE_ID];

    if ($department) {
        $where .= " AND department = :department";
        $params['department'] = $department;
    }

    $stmt = $pdo->prepare("
        SELECT id, site_id, department, titre as title, slug, type_contrat as contract_type, ville as location, description as short_description, date_publication as published_at, created_at, sort_order
        FROM offres_emploi
        WHERE $where
        ORDER BY sort_order ASC, date_publication DESC, created_at DESC
    ");
    $stmt->execute($params);
    $offers = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Group by department
    $by_department = [
        'collaborateur' => [],
        'formateur' => [],
    ];

    foreach ($offers as $offer) {
        $dept = $offer['department'];
        if (!isset($by_department[$dept])) {
            $by_department[$dept] = [];
        }
        $by_department[$dept][] = $offer;
    }

    header(PORTAL_JSON_CONTENT_TYPE_HEADER);
    echo json_encode([
        'ok' => true,
        'data' => [
            'by_department' => $by_department
        ]
    ], JSON_UNESCAPED_UNICODE);

} catch (PDOException $e) {
    careersJsonError(500, 'Database Error', portalPublicErrorMessage($e));
} catch (Throwable $e) {
    careersJsonError(500, 'Server Error', portalPublicErrorMessage($e));
}
