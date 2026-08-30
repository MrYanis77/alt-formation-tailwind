<?php
declare(strict_types=1);

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/helpers.php';

header('Content-Type: application/json; charset=UTF-8');
portalApplyCors();
portalHandleOptions();

require_once __DIR__ . '/site.php';
require_once __DIR__ . '/media.php';

function formatBlogPost(array $post, MediaResolver $media): array
{
    $months = ['Janvier', 'FÃ©vrier', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'AoÃ»t', 'Septembre', 'Octobre', 'Novembre', 'DÃ©cembre'];

    $author = trim((string)($post['author'] ?? ''));
    if ($author === '') {
        $author = 'L\'Ã©quipe Alt Formation';
    }

    $date = 'RÃ©cent';
    $publishedAt = $post['published_at'] ?? null;
    if ($publishedAt) {
        $ts = strtotime((string)$publishedAt);
        if ($ts !== false) {
            $m = $months[(int)date('m', $ts) - 1];
            $date = date('d', $ts) . ' ' . $m . ' ' . date('Y', $ts);
        }
    }

    $readMins = (int)($post['read_time_mins'] ?? 0);
    if ($readMins <= 0 && !empty($post['content'])) {
        $text = trim(strip_tags((string)$post['content']));
        if ($text !== '') {
            $readMins = max(1, (int)ceil(str_word_count($text) / 200));
        }
    }
    $readTime = $readMins > 0 ? $readMins . ' min' : '3 min';

    $title = (string)($post['title'] ?? '');
    $resolved = $media->resolve($post['cover_image_url'] ?? null, $title !== '' ? $title : null);
    $imageUrl = $resolved['url'] ?? null;
    $imageAlt = $resolved['alt'] ?? ($post['image_alt'] ?? $title);

    return [
        'id' => (int)$post['id'],
        'slug' => $post['slug'],
        'title' => $title,
        'excerpt' => $post['excerpt'] ?? '',
        'content' => $post['content'] ?? '',
        'author' => $author,
        'date' => $date,
        'readTime' => $readTime,
        'image' => $imageUrl,
        'image_alt' => $imageAlt,
        'has_image' => $imageUrl !== null && $imageUrl !== '',
        'category' => $post['category'] ?: 'ActualitÃ©s',
        'is_featured' => (bool)($post['is_featured'] ?? false),
        'featured' => (bool)($post['is_featured'] ?? false),
        'tags' => $post['tags'] ?? [],
    ];
}

function fetchPostTags(PDO $pdo, int $postId): array
{
    if (!tableExists($pdo, 'blog_post_tags') || !tableExists($pdo, 'blog_tags')) {
        return [];
    }

    $stmt = $pdo->prepare('
        SELECT t.name
        FROM blog_tags t
        INNER JOIN blog_post_tags pt ON pt.tag_id = t.id
        WHERE pt.post_id = :post_id
        ORDER BY t.name ASC
    ');
    $stmt->execute(['post_id' => $postId]);

    return $stmt->fetchAll(PDO::FETCH_COLUMN);
}

function buildBlogPostsSelect(PDO $pdo): string
{
    $readTime = columnExists($pdo, 'blog_posts', 'read_time_mins')
        ? 'p.read_time_mins'
        : 'NULL AS read_time_mins';
    $cover = columnExists($pdo, 'blog_posts', 'cover_image_url')
        ? 'p.cover_image_url'
        : 'NULL AS cover_image_url';

    $categoryCol = tableExists($pdo, 'blog_categories')
        ? 'c.name AS category'
        : 'NULL AS category';
    $authorCol = tableExists($pdo, 'blog_authors')
        ? 'CONCAT(a.first_name, " ", a.last_name) AS author'
        : 'NULL AS author';

    $joinCategory = tableExists($pdo, 'blog_categories')
        ? 'LEFT JOIN blog_categories c ON c.id = p.category_id AND c.site_id = p.site_id'
        : '';
    $joinAuthor = tableExists($pdo, 'blog_authors')
        ? 'LEFT JOIN blog_authors a ON a.id = p.author_id AND a.site_id = p.site_id'
        : '';

    $where = ['p.site_id = :site_id'];

    if (columnExists($pdo, 'blog_posts', 'status')) {
        $where[] = 'p.status = "published"';
    }

    if (columnExists($pdo, 'blog_posts', 'deleted_at')) {
        $where[] = 'p.deleted_at IS NULL';
    }

    return '
        SELECT
            p.id,
            p.title,
            p.slug,
            ' . $categoryCol . ',
            p.excerpt,
            p.content,
            ' . $authorCol . ',
            p.published_at,
            ' . $readTime . ',
            ' . $cover . ',
            p.title AS image_alt,
            p.is_featured
        FROM blog_posts p
        ' . $joinCategory . '
        ' . $joinAuthor . '
        WHERE ' . implode(' AND ', $where) . '
    ';
}

try {
    $pdo = getPdo();
    bootstrapSiteId($pdo);
    $slug = isset($_GET['slug']) ? trim((string)$_GET['slug']) : null;
    $media = new MediaResolver($pdo);

    if (!tableExists($pdo, 'blog_posts')) {
        http_response_code(503);
        echo json_encode([
            'error' => 'Service Unavailable',
            'message' => 'Table blog_posts absente. VÃ©rifiez database/schema.sql (blog_posts, core_sites.site_code=formation).',
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $baseSelect = buildBlogPostsSelect($pdo);

    if ($slug !== null && $slug !== '') {
        $stmt = $pdo->prepare($baseSelect . ' AND p.slug = :slug LIMIT 1');
        $stmt->execute(['site_id' => SITE_ID, 'slug' => $slug]);
        $article = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$article) {
            http_response_code(404);
            echo json_encode(['error' => 'Article non trouvÃ©'], JSON_UNESCAPED_UNICODE);
            exit;
        }

        $article['tags'] = fetchPostTags($pdo, (int)$article['id']);
        echo json_encode(formatBlogPost($article, $media), JSON_UNESCAPED_UNICODE);
        exit;
    }

    $stmt = $pdo->prepare($baseSelect . ' ORDER BY p.is_featured DESC, p.published_at DESC');
    $stmt->execute(['site_id' => SITE_ID]);
    $articles = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (tableExists($pdo, 'media_library')) {
        $media->preload(array_column($articles, 'cover_image_url'));
    }

    $posts = array_map(static function (array $row) use ($pdo, $media): array {
        $row['tags'] = fetchPostTags($pdo, (int)$row['id']);
        return formatBlogPost($row, $media);
    }, $articles);

    echo json_encode($posts, JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Erreur serveur',
        'message' => portalPublicErrorMessage($e),
    ], JSON_UNESCAPED_UNICODE);
}
