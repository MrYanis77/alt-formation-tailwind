<?php
declare(strict_types=1);

error_reporting(E_ALL);
ini_set('display_errors', '0');

function formationsJson(array $payload, int $status = 200): void
{
    if (!headers_sent()) {
        http_response_code($status);
        header('Content-Type: application/json; charset=UTF-8');
    }

    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

register_shutdown_function(static function (): void {
    $err = error_get_last();
    if ($err === null || !in_array($err['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR], true)) {
        return;
    }

    formationsJson([
        'ok' => false,
        'error' => 'Internal Server Error',
        'message' => $err['message'] ?? 'Fatal error',
    ], 500);
});

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/site.php';
require_once __DIR__ . '/helpers.php';

function fetchFormationRows(PDO $pdo, string $table, int $courseId): array
{
    if (!tableExists($pdo, $table)) {
        return [];
    }

    $order = columnExists($pdo, $table, 'sort_order') ? 'sort_order ASC, id ASC' : 'id ASC';
    $stmt = $pdo->prepare('SELECT * FROM `' . $table . '` WHERE course_id = :course_id ORDER BY ' . $order);
    $stmt->execute(['course_id' => $courseId]);

    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

function fetchFormationInfoBlocks(PDO $pdo, int $courseId): array
{
    if (!tableExists($pdo, 'formation_info_blocks')) {
        return [];
    }

    $blocks = fetchFormationRows($pdo, 'formation_info_blocks', $courseId);
    if ($blocks === [] || !tableExists($pdo, 'formation_info_points')) {
        return $blocks;
    }

    foreach ($blocks as &$block) {
        $blockId = (int)($block['id'] ?? 0);
        $order = columnExists($pdo, 'formation_info_points', 'sort_order') ? 'sort_order ASC, id ASC' : 'id ASC';
        $stmt = $pdo->prepare('SELECT * FROM formation_info_points WHERE block_id = :block_id ORDER BY ' . $order);
        $stmt->execute(['block_id' => $blockId]);
        $block['points'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
    unset($block);

    return $blocks;
}

function attachFormationRows(PDO $pdo, array &$course): void
{
    $courseId = (int)($course['id'] ?? 0);
    if ($courseId <= 0) {
        return;
    }

    $course['modules'] = fetchFormationRows($pdo, 'formation_modules', $courseId);
    $course['skills'] = fetchFormationRows($pdo, 'formation_skills', $courseId);
    $course['jobs'] = fetchFormationRows($pdo, 'formation_jobs', $courseId);
    $course['stats'] = fetchFormationRows($pdo, 'formation_course_stats', $courseId);
    $course['objectives'] = fetchFormationRows($pdo, 'formation_objectives', $courseId);
    $course['info_blocks'] = fetchFormationInfoBlocks($pdo, $courseId);
}

try {
    $pdo = getPdo();
    bootstrapSiteId($pdo);

    if (!tableExists($pdo, 'formation_courses')) {
        formationsJson([
            'ok' => false,
            'error' => 'Table formation_courses absente',
            'site_id' => SITE_ID,
        ], 503);
    }

    $slug = isset($_GET['slug']) ? trim((string)$_GET['slug']) : null;
    $id = isset($_GET['id']) ? (int)$_GET['id'] : null;
    $type = isset($_GET['type']) ? trim((string)$_GET['type']) : null;
    $publishedOnly = !isset($_GET['all']) || $_GET['all'] !== '1';

    if ($type !== null && $type !== '' && !in_array($type, ['diplomante', 'certifiante', 'elearning'], true)) {
        formationsJson(['ok' => false, 'error' => 'Type formation invalide'], 400);
    }

    $categories = [];
    if (tableExists($pdo, 'formation_categories')) {
        $catSql = 'SELECT * FROM formation_categories WHERE site_id = :site_id';
        if ($publishedOnly && columnExists($pdo, 'formation_categories', 'is_active')) {
            $catSql .= ' AND is_active = 1';
        }
        $catSql .= columnExists($pdo, 'formation_categories', 'sort_order')
            ? ' ORDER BY sort_order ASC, id ASC'
            : ' ORDER BY id ASC';
        $stmtCat = $pdo->prepare($catSql);
        $stmtCat->execute(['site_id' => SITE_ID]);
        $categories = $stmtCat->fetchAll(PDO::FETCH_ASSOC);
    }

    $sql = '
        SELECT c.*, cat.name AS category_name, cat.slug AS category_slug
        FROM formation_courses c
        LEFT JOIN formation_categories cat ON cat.id = c.category_id
        WHERE c.site_id = :site_id
    ';
    $params = ['site_id' => SITE_ID];

    if ($id !== null && $id > 0) {
        $sql .= ' AND c.id = :id';
        $params['id'] = $id;
    }
    if ($slug !== null && $slug !== '') {
        $sql .= ' AND c.slug = :slug';
        $params['slug'] = $slug;
    }
    if ($publishedOnly && columnExists($pdo, 'formation_courses', 'status')) {
        $sql .= " AND c.status = 'published'";
    }
    if ($type !== null && $type !== '' && columnExists($pdo, 'formation_courses', 'course_type')) {
        $sql .= ' AND c.course_type = :type';
        $params['type'] = $type;
    }

    $sql .= columnExists($pdo, 'formation_courses', 'sort_order')
        ? ' ORDER BY c.sort_order ASC, c.id ASC'
        : ' ORDER BY c.id ASC';

    if (($id !== null && $id > 0) || ($slug !== null && $slug !== '')) {
        $sql .= ' LIMIT 1';
    }

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $courses = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($courses as &$course) {
        attachFormationRows($pdo, $course);
    }
    unset($course);

    if ((($id !== null && $id > 0) || ($slug !== null && $slug !== '')) && count($courses) === 0) {
        formationsJson([
            'ok' => false,
            'error' => 'Formation introuvable',
            'site_id' => SITE_ID,
        ], 404);
    }

    formationsJson([
        'ok' => true,
        'generated_at' => date('c'),
        'site_id' => SITE_ID,
        'site' => coreSiteRow($pdo),
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
} catch (PDOException $e) {
    formationsJson(['ok' => false, 'error' => 'Database Error', 'message' => portalPublicErrorMessage($e)], 500);
} catch (Throwable $e) {
    formationsJson(['ok' => false, 'error' => 'Server Error', 'message' => portalPublicErrorMessage($e)], 500);
}
