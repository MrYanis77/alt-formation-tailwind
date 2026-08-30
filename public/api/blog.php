<?php
/**
 * Blog Nexytal - GET /api/blog.php
 * Parametres : ?slug=xxx (un article) - ?all=1 (inclure brouillons, diagnostic)
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
    $publishedOnly = !isset($_GET['all']) || $_GET['all'] !== '1';

    $posts = getBlogPosts($pdo, $sid, $slug ?: null, $publishedOnly);

    if ($slug && count($posts) === 0) {
        apiJsonResponse([
            'ok' => false,
            'error' => 'Article introuvable',
            'slug' => $slug,
            'site_id' => $sid,
        ], 404);
    }

    apiJsonResponse([
        'ok' => true,
        'generated_at' => date('c'),
        'site_id' => $sid,
        'site' => getSiteRow($pdo, $sid),
        'data' => [
            'categories' => getBlogCategories($pdo, $sid),
            'authors' => getBlogAuthors($pdo, $sid),
            'posts' => $posts,
            'tags' => getBlogTags($pdo, $sid),
        ],
        'count' => count($posts),
    ]);
} catch (Throwable $e) {
    apiServerError($e, ['endpoint' => basename(__FILE__)]);
}
