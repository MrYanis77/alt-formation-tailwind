<?php
declare(strict_types=1);

/** Valeur de repli si core_sites.site_code = formation est absent */
const DEFAULT_SITE_ID = 1;

/** ClÃ© core_sites.site_code pour Alt Formation */
const SITE_CODE = 'formation';

const SITE_SLUG = 'alt-formation';
const SITE_DOMAIN = 'alt-formation.fr';
const NEWSLETTER_LIST_SLUG = 'generale';

class SiteResolutionException extends RuntimeException
{
}

function siteEnv(string $key, ?string $default = null): ?string
{
    if (function_exists('env')) {
        return env($key, $default);
    }

    $value = getenv($key);

    return $value !== false ? $value : $default;
}

/**
 * RÃ©sout core_sites.id pour Alt Formation :
 * 1. variable d'environnement SITE_ID
 * 2. core_sites.site_code = formation
 * 3. core_sites.domain (SITE_URL ou alt-formation.fr)
 * 4. DEFAULT_SITE_ID
 */
function resolveSiteId(PDO $pdo): int // NOSONAR: ordered infrastructure fallbacks stop after the first match
{
    static $resolved = null;

    if ($resolved !== null) {
        return $resolved;
    }

    $envId = siteEnv('SITE_ID');
    if ($envId !== null && $envId !== '' && ctype_digit($envId)) {
        return $resolved = (int)$envId;
    }

    try {
        $stmt = $pdo->prepare('
            SELECT id
            FROM core_sites
            WHERE site_code = :site_code AND is_active = 1
            LIMIT 1
        ');
        $stmt->execute(['site_code' => SITE_CODE]);
        $id = $stmt->fetchColumn();
        if ($id !== false && $id !== null) {
            return $resolved = (int)$id;
        }

        $siteUrl = siteEnv('SITE_URL', 'https://' . SITE_DOMAIN) ?? ('https://' . SITE_DOMAIN);
        $host = parse_url($siteUrl, PHP_URL_HOST);
        $domain = is_string($host) && $host !== '' ? $host : SITE_DOMAIN;

        $stmt = $pdo->prepare('
            SELECT id
            FROM core_sites
            WHERE domain = :domain AND is_active = 1
            LIMIT 1
        ');
        $stmt->execute(['domain' => $domain]);
        $id = $stmt->fetchColumn();
        if ($id !== false && $id !== null) {
            return $resolved = (int)$id;
        }

        $stmt = $pdo->prepare('
            SELECT id
            FROM core_sites
            WHERE slug = :slug AND is_active = 1
            LIMIT 1
        ');
        $stmt->execute(['slug' => SITE_SLUG]);
        $id = $stmt->fetchColumn();
        if ($id !== false && $id !== null) {
            return $resolved = (int)$id;
        }
    } catch (Throwable $e) {
        // core_sites peut Ãªtre absent en dev minimal
    }

    return $resolved = DEFAULT_SITE_ID;
}

function bootstrapSiteId(PDO $pdo): void
{
    if (defined('SITE_ID')) {
        return;
    }

    define('SITE_ID', resolveSiteId($pdo));
}

function coreSiteRow(PDO $pdo, ?int $siteId = null): ?array
{
    $siteId ??= defined('SITE_ID') ? SITE_ID : resolveSiteId($pdo);

    try {
        $stmt = $pdo->prepare('
            SELECT id, name, slug, site_code, domain, is_active
            FROM core_sites
            WHERE id = :id
            LIMIT 1
        ');
        $stmt->execute(['id' => $siteId]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        return $row ?: null;
    } catch (Throwable $e) {
        return null;
    }
}

function assertCoreSiteExists(PDO $pdo, ?int $siteId = null): void
{
    $siteId ??= defined('SITE_ID') ? SITE_ID : resolveSiteId($pdo);

    if (coreSiteRow($pdo, $siteId) !== null) {
        return;
    }

    throw new SiteResolutionException(
        'Site Alt Formation introuvable dans core_sites (id=' . $siteId . ', site_code=' . SITE_CODE . '). '
        . 'ExÃ©cutez la migration core_sites correspondante ou insÃ©rez la ligne core_sites manuellement.'
    );
}
