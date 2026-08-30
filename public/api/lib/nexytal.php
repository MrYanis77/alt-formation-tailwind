<?php

function resolveSiteId(): int
{
    $allowQueryOverride = env('ALLOW_SITE_ID_QUERY', '0') === '1';
    if ($allowQueryOverride && isset($_GET['site_id'])) {
        return max(1, (int) $_GET['site_id']);
    }
    return siteId();
}

function getSiteRow(PDO $pdo, int $siteId): ?array
{
    if (!tableExists($pdo, 'core_sites')) {
        return null;
    }
    $rows = fetchAll(
        $pdo,
        'SELECT id, name, slug, site_code, domain, is_active FROM core_sites WHERE id = ? LIMIT 1',
        [$siteId]
    );
    return $rows[0] ?? null;
}

function mediaBaseUrl(): string
{
    return rtrim(env('MEDIA_BASE_URL', 'https://connexion.nexytal.com'), '/');
}

function normalizePublicMediaUrl(?string $value): ?string
{
    $result = null;
    if ($value !== null) {
        $value = trim(html_entity_decode($value, ENT_QUOTES | ENT_HTML5, 'UTF-8'));
        if ($value !== '') {
            $result = $value;
            if (!preg_match('#^https?://#i', $value)
                && !str_starts_with($value, 'data:')
                && str_starts_with($value, '/api/uploads/')) {
                $base = mediaBaseUrl();
                if ($base !== '') {
                    $result = $base . $value;
                }
            }
        }
    }

    return $result;
}

function normalizeCourseMedia(array &$course): void
{
    if (array_key_exists('video_url', $course)) {
        $course['video_url'] = normalizePublicMediaUrl($course['video_url']);
    }
    if (array_key_exists('presentation_image_url', $course)) {
        $course['presentation_image_url'] = normalizePublicMediaUrl($course['presentation_image_url']);
    }
}

function normalizeBlogMedia(array &$post): void
{
    if (array_key_exists('cover_image_url', $post)) {
        $post['cover_image_url'] = normalizePublicMediaUrl($post['cover_image_url']);
    }
    if (array_key_exists('author_avatar_url', $post)) {
        $post['author_avatar_url'] = normalizePublicMediaUrl($post['author_avatar_url']);
    }
}
function getFormationCategories(PDO $pdo, int $siteId, bool $activeOnly = true): array
{
    if (!tableExists($pdo, 'formation_categories')) {
        return [];
    }

    $sql = 'SELECT * FROM formation_categories WHERE site_id = ?';
    if ($activeOnly && columnExists($pdo, 'formation_categories', 'is_active')) {
        $sql .= ' AND is_active = 1';
    }
    $sql .= columnExists($pdo, 'formation_categories', 'sort_order')
        ? ' ORDER BY sort_order ASC, id ASC'
        : ' ORDER BY id ASC';

    return fetchAll($pdo, $sql, [$siteId]);
}

function fetchFormationRelationRows(PDO $pdo, string $table, int $courseId): array
{
    if (!tableExists($pdo, $table)) {
        return [];
    }

    $order = columnExists($pdo, $table, 'sort_order') ? 'sort_order ASC, id ASC' : 'id ASC';

    return fetchAll(
        $pdo,
        'SELECT * FROM `' . $table . '` WHERE course_id = ? ORDER BY ' . $order,
        [$courseId]
    );
}

function getFormationInfoBlocks(PDO $pdo, int $courseId): array
{
    if (!tableExists($pdo, 'formation_info_blocks')) {
        return [];
    }

    $blocks = fetchFormationRelationRows($pdo, 'formation_info_blocks', $courseId);
    if ($blocks === [] || !tableExists($pdo, 'formation_info_points')) {
        return $blocks;
    }

    foreach ($blocks as &$block) {
        $blockId = (int) ($block['id'] ?? 0);
        $order = columnExists($pdo, 'formation_info_points', 'sort_order')
            ? 'sort_order ASC, id ASC'
            : 'id ASC';
        $block['points'] = $blockId > 0
            ? fetchAll(
                $pdo,
                'SELECT * FROM formation_info_points WHERE block_id = ? ORDER BY ' . $order,
                [$blockId]
            )
            : [];
    }
    unset($block);

    return $blocks;
}

function attachFormationRelations(PDO $pdo, array &$course): void
{
    $cid = (int) ($course['id'] ?? 0);
    if ($cid <= 0) {
        return;
    }

    $course['modules'] = fetchFormationRelationRows($pdo, 'formation_modules', $cid);
    $course['skills'] = fetchFormationRelationRows($pdo, 'formation_skills', $cid);
    $course['jobs'] = fetchFormationRelationRows($pdo, 'formation_jobs', $cid);
    $course['stats'] = fetchFormationRelationRows($pdo, 'formation_course_stats', $cid);
    $course['objectives'] = fetchFormationRelationRows($pdo, 'formation_objectives', $cid);
    $course['info_blocks'] = getFormationInfoBlocks($pdo, $cid);
}

function getFormationCourses(
    PDO $pdo,
    int $siteId,
    ?string $slug = null,
    bool $publishedOnly = true,
    ?string $courseType = null
): array {
    if (!tableExists($pdo, 'formation_courses')) {
        return [];
    }

    $sql = "
        SELECT fc.*,
               cat.slug AS category_slug,
               cat.name AS category_name
        FROM formation_courses fc
        LEFT JOIN formation_categories cat ON cat.id = fc.category_id
        WHERE fc.site_id = ?
    ";
    $params = [$siteId];

    if ($publishedOnly && columnExists($pdo, 'formation_courses', 'status')) {
        $sql .= " AND fc.status = 'published'";
    }
    if ($slug !== null && $slug !== '') {
        $sql .= ' AND fc.slug = ?';
        $params[] = $slug;
    }
    if (
        $courseType !== null
        && $courseType !== ''
        && columnExists($pdo, 'formation_courses', 'course_type')
    ) {
        $sql .= ' AND fc.course_type = ?';
        $params[] = $courseType;
    }

    $sql .= columnExists($pdo, 'formation_courses', 'sort_order')
        ? ' ORDER BY fc.sort_order ASC, fc.id ASC'
        : ' ORDER BY fc.id ASC';

    $courses = fetchAll($pdo, $sql, $params);
    foreach ($courses as &$course) {
        normalizeCourseMedia($course);
        attachFormationRelations($pdo, $course);
    }
    unset($course);

    return $courses;
}

function getBlogCategories(PDO $pdo, int $siteId): array
{
    if (!tableExists($pdo, 'blog_categories')) {
        return [];
    }
    return fetchAll(
        $pdo,
        'SELECT * FROM blog_categories WHERE site_id = ? AND is_active = 1 ORDER BY sort_order ASC, id ASC',
        [$siteId]
    );
}

function getBlogAuthors(PDO $pdo, int $siteId): array
{
    if (!tableExists($pdo, 'blog_authors')) {
        return [];
    }
    return fetchAll(
        $pdo,
        'SELECT * FROM blog_authors WHERE site_id = ? AND is_active = 1 ORDER BY id ASC',
        [$siteId]
    );
}

function getBlogPosts(
    PDO $pdo,
    int $siteId,
    ?string $slug = null,
    bool $publishedOnly = true
): array {
    if (!tableExists($pdo, 'blog_posts')) {
        return [];
    }

    $sql = "
        SELECT p.*,
               c.slug AS category_slug,
               c.name AS category_name,
               CONCAT(COALESCE(a.first_name, ''), ' ', COALESCE(a.last_name, '')) AS author_name,
               a.slug AS author_slug,
               a.avatar_url AS author_avatar_url
        FROM blog_posts p
        LEFT JOIN blog_categories c ON c.id = p.category_id
        LEFT JOIN blog_authors a ON a.id = p.author_id
        WHERE p.site_id = ? AND p.deleted_at IS NULL
    ";
    $params = [$siteId];

    if ($publishedOnly) {
        $sql .= " AND p.status = 'published'";
    }
    if ($slug !== null && $slug !== '') {
        $sql .= ' AND p.slug = ?';
        $params[] = $slug;
    }

    $sql .= ' ORDER BY COALESCE(p.published_at, p.created_at) DESC, p.id DESC';

    $posts = fetchAll($pdo, $sql, $params);
    foreach ($posts as &$post) {
        normalizeBlogMedia($post);
    }
    unset($post);

    return $posts;
}

function getBlogComments(PDO $pdo, int $siteId): array
{
    if (!tableExists($pdo, 'blog_comments')) {
        return [];
    }
    return fetchAll($pdo, "
        SELECT cm.*
        FROM blog_comments cm
        INNER JOIN blog_posts p ON p.id = cm.post_id
        WHERE p.site_id = ?
        ORDER BY cm.id DESC
    ", [$siteId]);
}

function getBlogTags(PDO $pdo, int $siteId): array
{
    if (!tableExists($pdo, 'blog_tags')) {
        return [];
    }
    return fetchAll(
        $pdo,
        'SELECT * FROM blog_tags WHERE site_id = ? ORDER BY name ASC',
        [$siteId]
    );
}

function getNewsletterSubscribers(PDO $pdo, int $siteId, int $limit = 100): array
{
    if (!tableExists($pdo, 'newsletter_subscribers')) {
        return [];
    }
    return fetchAll($pdo, "
        SELECT id, email, first_name, last_name, source, status,
               rgpd_consent_at, confirmed_at, unsubscribed_at, created_at
        FROM newsletter_subscribers
        WHERE site_id = ?
        ORDER BY id DESC
        LIMIT " . max(1, $limit) . "
    ", [$siteId]);
}

function hydratePricingMeta(array &$rows): void
{
    foreach ($rows as &$row) {
        if (!empty($row['meta_json']) && is_string($row['meta_json'])) {
            $decoded = json_decode($row['meta_json'], true);
            $row['meta'] = is_array($decoded) ? $decoded : null;
        }
    }
    unset($row);
}

function getSitePricingPlans(
    PDO $pdo,
    int $siteId,
    ?string $entityType = null,
    ?string $entitySlug = null,
    bool $activeOnly = true
): array {
    if (!tableExists($pdo, 'site_pricing_plans')) {
        return [];
    }

    $sql = 'SELECT * FROM site_pricing_plans WHERE site_id = ?';
    $params = [$siteId];

    if ($activeOnly) {
        $sql .= ' AND is_active = 1';
    }
    if ($entityType !== null && $entityType !== '') {
        $sql .= ' AND entity_type = ?';
        $params[] = $entityType;
    }
    if ($entitySlug !== null && $entitySlug !== '') {
        $sql .= ' AND entity_slug = ?';
        $params[] = $entitySlug;
    }

    $sql .= ' ORDER BY entity_type ASC, entity_slug ASC, plan_code ASC, id ASC';

    $rows = fetchAll($pdo, $sql, $params);
    if (columnExists($pdo, 'site_pricing_plans', 'meta_json')) {
        hydratePricingMeta($rows);
    }

    return $rows;
}

function attachFormationPricesFromPlans(PDO $pdo, int $siteId, array &$courses): void
{
    if (!tableExists($pdo, 'site_pricing_plans') || $courses === []) {
        return;
    }

    $plans = getSitePricingPlans($pdo, $siteId, 'formation', null, true);
    $priceBySlug = [];
    foreach ($plans as $plan) {
        $slug = (string) ($plan['entity_slug'] ?? '');
        if ($slug === '') {
            continue;
        }
        if (($plan['plan_code'] ?? 'default') !== 'default') {
            continue;
        }
        $priceBySlug[$slug] = $plan['amount_eur'];
    }

    foreach ($courses as &$course) {
        $slug = (string) ($course['slug'] ?? '');
        if ($slug !== '' && isset($priceBySlug[$slug])) {
            $course['price'] = $priceBySlug[$slug];
        }
    }
    unset($course);
}

function formatCareerContractType(string $type): string
{
    return match (strtolower($type)) {
        'cdi' => 'CDI',
        'cdd' => 'CDD',
        'interim' => 'Interim',
        'alternance' => 'Alternance',
        'freelance' => 'Freelance',
        'stage' => 'Stage',
        default => strtoupper($type),
    };
}

function mapOffreEmploiToCareerOffer(array $row): array
{
    return [
        'id' => (int) ($row['id'] ?? 0),
        'slug' => (string) ($row['slug'] ?? ''),
        'department' => (string) ($row['department'] ?? 'collaborateur'),
        'title' => (string) ($row['titre'] ?? ''),
        'contract_type' => formatCareerContractType((string) ($row['type_contrat'] ?? '')),
        'location' => (string) ($row['ville'] ?? ''),
        'short_description' => $row['profil_recherche'] ?? null,
        'full_description' => (string) ($row['description'] ?? ''),
        'published_at' => $row['date_publication'] ?? $row['created_at'] ?? null,
        'created_at' => $row['created_at'] ?? null,
        'status' => ($row['statut'] ?? '') === 'publiee' ? 'published' : (string) ($row['statut'] ?? ''),
        'source_table' => 'offres_emploi',
    ];
}

function careerOffersUseOffresEmploi(PDO $pdo): bool
{
    return tableExists($pdo, 'offres_emploi') && columnExists($pdo, 'offres_emploi', 'department');
}

function careerOfferListSqlSuffix(bool $publishedOnly): string
{
    $sql = "
        AND o.department IS NOT NULL
        AND o.slug NOT IN ('candidature-spontanee-collaborateur', 'candidature-spontanee-formateur')
    ";

    if ($publishedOnly) {
        $sql .= " AND o.statut = 'publiee'";
        $sql .= ' AND (o.date_expiration IS NULL OR o.date_expiration >= NOW())';
    }

    return $sql;
}

function getCareerJobOffers(
    PDO $pdo,
    int $siteId,
    ?string $department = null,
    bool $publishedOnly = true
): array {
    if (!careerOffersUseOffresEmploi($pdo)) {
        return [];
    }

    $sql = 'SELECT o.* FROM offres_emploi o WHERE o.site_id = ?';
    $params = [$siteId];
    $sql .= careerOfferListSqlSuffix($publishedOnly);

    if ($department !== null && $department !== '') {
        $sql .= ' AND o.department = ?';
        $params[] = $department;
    }

    $sql .= ' ORDER BY o.sort_order ASC, o.date_publication DESC, o.id DESC';

    $rows = fetchAll($pdo, $sql, $params);

    return array_map('mapOffreEmploiToCareerOffer', $rows);
}

function buildCareerAudit(PDO $pdo, int $siteId): array // NOSONAR: audit aggregation intentionally evaluates every reason
{
    if (!careerOffersUseOffresEmploi($pdo)) {
        return ['available' => false, 'message' => 'Colonne department absente - executez schema-alt-formation-migration-ionos.sql'];
    }

    $all = fetchAll(
        $pdo,
        'SELECT id, slug, titre, department, statut, date_expiration, entreprise_id
         FROM offres_emploi WHERE site_id = ? ORDER BY department, sort_order, id',
        [$siteId]
    );

    $visible = getCareerJobOffers($pdo, $siteId, null, true);
    $visibleSlugs = array_flip(array_column($visible, 'slug'));

    $byDeptVisible = ['collaborateur' => 0, 'formateur' => 0];
    foreach ($visible as $offer) {
        $dept = $offer['department'] ?? 'collaborateur';
        if (isset($byDeptVisible[$dept])) {
            $byDeptVisible[$dept]++;
        }
    }

    $hidden = [];
    foreach ($all as $row) {
        $slug = (string) ($row['slug'] ?? '');
        if ($slug === '' || isset($visibleSlugs[$slug])) {
            continue;
        }

        $reasons = [];
        if ((int) ($row['id'] ?? 0) === 0) {
            $reasons[] = 'id_zero';
        }
        if (($row['department'] ?? null) === null || $row['department'] === '') {
            $reasons[] = 'department_null';
        }
        if (in_array($slug, ['candidature-spontanee-collaborateur', 'candidature-spontanee-formateur'], true)) {
            $reasons[] = 'candidature_spontanee_ok';
        }
        if (($row['statut'] ?? '') !== 'publiee') {
            $reasons[] = 'statut_' . ($row['statut'] ?? 'inconnu');
        }
        if (!empty($row['date_expiration']) && strtotime((string) $row['date_expiration']) < time()) {
            $reasons[] = 'date_expiration_passee';
        }
        if ((int) ($row['entreprise_id'] ?? 0) <= 0) {
            $reasons[] = 'entreprise_id_invalide';
        }
        if ($reasons === [] || $reasons === ['candidature_spontanee_ok']) {
            continue;
        }

        $hidden[] = [
            'id' => (int) ($row['id'] ?? 0),
            'slug' => $slug,
            'titre' => (string) ($row['titre'] ?? ''),
            'department' => $row['department'],
            'statut' => $row['statut'] ?? null,
            'date_expiration' => $row['date_expiration'] ?? null,
            'reasons' => $reasons,
        ];
    }

    return [
        'available' => true,
        'expected_visible' => 7,
        'total_in_db' => count($all),
        'api_visible_count' => count($visible),
        'by_department_visible' => $byDeptVisible,
        'visible_slugs' => array_keys($visibleSlugs),
        'hidden_from_api' => $hidden,
    ];
}

function getCareerJobOfferBySlug(
    PDO $pdo,
    int $siteId,
    string $slug,
    bool $publishedOnly = true
): ?array {
    $result = null;
    $isSpontaneous = in_array(
        $slug,
        ['candidature-spontanee-collaborateur', 'candidature-spontanee-formateur'],
        true
    );
    if (careerOffersUseOffresEmploi($pdo) && $slug !== '' && !$isSpontaneous) {
        $sql = 'SELECT o.* FROM offres_emploi o WHERE o.site_id = ? AND o.slug = ? AND o.department IS NOT NULL';
        $sql .= careerOfferListSqlSuffix($publishedOnly) . ' LIMIT 1';
        $rows = fetchAll($pdo, $sql, [$siteId, $slug]);
        if (!empty($rows)) {
            $result = mapOffreEmploiToCareerOffer($rows[0]);
        }
    }

    return $result;
}

function getCareerJobOfferById(PDO $pdo, int $siteId, int $offerId, bool $allowSpontaneous = false): ?array
{
    if (!careerOffersUseOffresEmploi($pdo) || $offerId <= 0) {
        return null;
    }

    $sql = 'SELECT o.* FROM offres_emploi o WHERE o.site_id = ? AND o.id = ? AND o.department IS NOT NULL';
    $params = [$siteId, $offerId];

    if (!$allowSpontaneous) {
        $sql .= " AND o.slug NOT IN ('candidature-spontanee-collaborateur', 'candidature-spontanee-formateur')";
    }

    $sql .= ' LIMIT 1';

    $rows = fetchAll($pdo, $sql, $params);

    return isset($rows[0]) ? mapOffreEmploiToCareerOffer($rows[0]) : null;
}

function resolveSpontaneousCareerOfferId(PDO $pdo, int $siteId, string $applicationType): ?int
{
    if (!careerOffersUseOffresEmploi($pdo)) {
        return null;
    }

    $slug = $applicationType === 'formateur'
        ? 'candidature-spontanee-formateur'
        : 'candidature-spontanee-collaborateur';

    $rows = fetchAll(
        $pdo,
        "SELECT id FROM offres_emploi
         WHERE site_id = ? AND slug = ? AND department IS NOT NULL AND statut = 'publiee'
         LIMIT 1",
        [$siteId, $slug]
    );

    return isset($rows[0]['id']) ? (int) $rows[0]['id'] : null;
}

function resolveCareerApplicationOfferId(
    PDO $pdo,
    int $siteId,
    ?int $offerId,
    string $offerSlug,
    string $applicationType
): ?int {
    if ($offerId !== null && $offerId > 0) {
        $offer = getCareerJobOfferById($pdo, $siteId, $offerId, true);
        if ($offer !== null) {
            return (int) $offer['id'];
        }
    }

    if ($offerSlug !== '') {
        $offer = getCareerJobOfferBySlug($pdo, $siteId, $offerSlug, true);
        if ($offer !== null) {
            return (int) $offer['id'];
        }
    }

    return resolveSpontaneousCareerOfferId($pdo, $siteId, $applicationType);
}

function insertCareerExternalApplication(PDO $pdo, array $payload): ?int
{
    if (!tableExists($pdo, 'candidatures_externes')) {
        return null;
    }

    $stmt = $pdo->prepare('
        INSERT INTO candidatures_externes (
            offre_id, site_id, prenom, nom, email, telephone,
            lettre_motivation, statut, rgpd_consent_at,
            cv_filename, competences_reponses, created_at
        ) VALUES (
            ?, ?, ?, ?, ?, ?,
            ?, \'recue\', ?,
            ?, ?, NOW()
        )
    ');

    $stmt->execute([
        $payload['offre_id'],
        $payload['site_id'],
        $payload['prenom'],
        $payload['nom'],
        $payload['email'],
        $payload['telephone'],
        $payload['lettre_motivation'] ?? null,
        $payload['rgpd_consent_at'],
        $payload['cv_filename'],
        $payload['competences_reponses'] ?? null,
    ]);

    return (int) $pdo->lastInsertId();
}

function buildNexytalExport(PDO $pdo, int $siteId, bool $includeAllStatuses = true): array
{
    $out = [
        'ok' => true,
        'generated_at' => date('c'),
        'db' => env('DB_NAME'),
        'host' => env('DB_HOST'),
        'site_id' => $siteId,
        'site' => getSiteRow($pdo, $siteId),
        'tables_found' => [],
        'data' => [],
    ];

    if (tableExists($pdo, 'formation_courses')) {
        $out['tables_found'][] = 'formations';
        $out['data']['formation_categories'] = getFormationCategories($pdo, $siteId, false);
        $out['data']['formation_courses'] = getFormationCourses($pdo, $siteId, null, !$includeAllStatuses);
    }

    if (tableExists($pdo, 'blog_posts')) {
        $out['tables_found'][] = 'blog';
        $out['data']['blog_categories'] = getBlogCategories($pdo, $siteId);
        $out['data']['blog_authors'] = getBlogAuthors($pdo, $siteId);
        $out['data']['blog_posts'] = getBlogPosts($pdo, $siteId, null, !$includeAllStatuses);
        $out['data']['blog_comments'] = getBlogComments($pdo, $siteId);
        $out['data']['blog_tags'] = getBlogTags($pdo, $siteId);
    }

    if (tableExists($pdo, 'newsletter_subscribers')) {
        $out['tables_found'][] = 'newsletter';
        $out['data']['newsletter_subscribers'] = getNewsletterSubscribers($pdo, $siteId);
    }

    if (tableExists($pdo, 'site_pricing_plans')) {
        $out['tables_found'][] = 'pricing';
        $out['data']['site_pricing_plans'] = getSitePricingPlans($pdo, $siteId, null, null, !$includeAllStatuses);
    }

    if (careerOffersUseOffresEmploi($pdo)) {
        $out['tables_found'][] = 'careers';
        $out['data']['offres_emploi_careers'] = getCareerJobOffers($pdo, $siteId, null, !$includeAllStatuses);
    }

    $out['counts'] = [
        'formation_categories' => count($out['data']['formation_categories'] ?? []),
        'formation_courses' => count($out['data']['formation_courses'] ?? []),
        'blog_posts' => count($out['data']['blog_posts'] ?? []),
        'newsletter_subscribers' => count($out['data']['newsletter_subscribers'] ?? []),
        'site_pricing_plans' => count($out['data']['site_pricing_plans'] ?? []),
        'career_offers' => count($out['data']['offres_emploi_careers'] ?? []),
    ];

    return $out;
}



