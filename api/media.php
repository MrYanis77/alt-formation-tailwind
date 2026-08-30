<?php

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/helpers.php';

/** Hébergement partagé des uploads Nexytal (admin / connexion) */
const DEFAULT_MEDIA_BASE_URL = 'https://connexion.nexytal.com';
const HTTP_URL_PATTERN = '#^https?://#i';

function mediaBaseUrl(): string
{
    $mediaBase = env('MEDIA_BASE_URL');
    if ($mediaBase) {
        return rtrim($mediaBase, '/');
    }

    return DEFAULT_MEDIA_BASE_URL;
}

function looksLikeImage(string $value): bool
{
    return (bool)preg_match('#\.(jpe?g|png|gif|webp|svg|avif)(\?|#|$)#i', $value);
}

class MediaResolver
{
    private PDO $pdo;
    private string $baseUrl;
    private bool $hasMediaTable;
    private bool $hasAltTextColumn;
    /** @var array<string, array|null> */
    private array $cache = [];

    public function __construct(PDO $pdo, ?string $baseUrl = null)
    {
        $this->pdo = $pdo;
        $this->baseUrl = $baseUrl ?? mediaBaseUrl();
        $this->hasMediaTable = tableExists($pdo, 'media_library');
        $this->hasAltTextColumn = $this->hasMediaTable && columnExists($pdo, 'media_library', 'alt_text');
    }

    private function mediaSelectColumns(): string
    {
        $cols = 'id, site_id, filename, `path`';

        if ($this->hasAltTextColumn) {
            $cols .= ', alt_text';
        }

        return $cols;
    }

    private function mediaSelectFrom(): string
    {
        return 'SELECT ' . $this->mediaSelectColumns() . ' FROM media_library';
    }

    private function classifyPreloadValue(?string $value): array
    {
        $result = ['id' => null, 'name' => null, 'path' => null];
        if ($value === null || trim($value) === '') {
            return $result;
        }

        $value = trim($value);
        if (preg_match(HTTP_URL_PATTERN, $value)) {
            return $result;
        }
        if (ctype_digit($value)) {
            $result['id'] = (int)$value;
        } else {
            if (strpos($value, '/') === false) {
                $result['name'] = $value;
            }
            $result['path'] = $this->normalizePath($value);
        }

        return $result;
    }

    /**
     * @param array<int, string|null> $paths
     */
    public function preload(array $paths): void
    {
        if (!$this->hasMediaTable) {
            return;
        }

        $normalized = [];
        $standaloneNames = [];
        $ids = [];

        foreach ($paths as $path) {
            $classified = $this->classifyPreloadValue($path);
            if ($classified['id'] !== null) {
                $ids[] = $classified['id'];
            }
            if ($classified['name'] !== null) {
                $standaloneNames[] = $classified['name'];
            }
            if ($classified['path'] !== null) {
                $normalized[] = $classified['path'];
            }
        }

        foreach (array_unique($ids) as $id) {
            $this->findMediaById($id);
        }

        $normalized = array_values(array_unique($normalized));
        $standaloneNames = array_values(array_unique($standaloneNames));

        if ($normalized === [] && $standaloneNames === []) {
            return;
        }

        $conditions = [];
        $params = [];

        if ($normalized !== []) {
            $pathPlaceholders = implode(',', array_fill(0, count($normalized), '?'));
            $conditions[] = "`path` IN ($pathPlaceholders)";
            $params = array_merge($params, $normalized);
        }

        if ($standaloneNames !== []) {
            $namePlaceholders = implode(',', array_fill(0, count($standaloneNames), '?'));
            $conditions[] = "`filename` IN ($namePlaceholders)";
            $params = array_merge($params, $standaloneNames);
        }

        $sql = $this->mediaSelectFrom() . ' WHERE ' . implode(' OR ', $conditions);

        $stmt = $this->pdo->prepare($sql);
        $stmt->execute($params);
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($rows as $row) {
            $this->cacheMediaRow($row);
        }
    }

    /**
     * Résolution photo formateur : ID média, URL externe, chemin upload.
     *
     * @return array{url: string|null, alt: string|null, from_media: bool}
     */
    public function resolveAvatar(?string $value, ?string $defaultAlt = null): array
    {
        $result = ['url' => null, 'alt' => $defaultAlt, 'from_media' => false];
        if ($value === null || trim($value) === '') {
            return $result;
        }

        $value = trim($value);
        $media = null;
        if (ctype_digit($value)) {
            $media = $this->findMediaById((int)$value);
        }

        if ($media === null && strpos($value, '/') === false) {
            $media = $this->findMediaByFileName($value);
        }

        if ($media !== null) {
            $result = [
                'url' => $this->absoluteUrl($media['path']),
                'alt' => $this->mediaAlt($media, $defaultAlt),
                'from_media' => true,
            ];
        } elseif (preg_match(HTTP_URL_PATTERN, $value)) {
            $result['url'] = $value;
        } elseif (preg_match('#^(?:www\.)?[a-z0-9.-]+\.[a-z]{2,}(?:/|$)#i', $value) && strpos($value, '/') !== 0) {
            $result['url'] = 'https://' . ltrim($value, '/');
        } else {
            $result = $this->resolve($value, $defaultAlt);
        }

        return $result;
    }

    /**
     * @return array{url: string|null, alt: string|null, from_media: bool}
     */
    public function resolve(?string $pathOrUrl, ?string $defaultAlt = null): array
    {
        $result = ['url' => null, 'alt' => $defaultAlt, 'from_media' => false];
        if ($pathOrUrl !== null && trim($pathOrUrl) !== '') {
            $pathOrUrl = trim($pathOrUrl);

            if (preg_match(HTTP_URL_PATTERN, $pathOrUrl)) {
                if (looksLikeImage($pathOrUrl)) {
                    $result['url'] = $pathOrUrl;
                }
            } else {
                $path = $this->normalizePath($pathOrUrl);
                $media = $this->findMedia($path);

                if ($media) {
                    $result = [
                        'url' => $this->absoluteUrl($media['path']),
                        'alt' => $this->mediaAlt($media, $defaultAlt),
                        'from_media' => true,
                    ];
                } elseif (looksLikeImage($path)) {
                    $result['url'] = $this->absoluteUrl($path);
                }
            }
        }

        return $result;
    }

    private function findMediaById(int $id): ?array
    {
        if (!$this->hasMediaTable) {
            return null;
        }

        $key = 'id:' . $id;
        if (array_key_exists($key, $this->cache)) {
            return $this->cache[$key];
        }

        $stmt = $this->pdo->prepare($this->mediaSelectFrom() . ' WHERE id = :id LIMIT 1');
        $stmt->execute(['id' => $id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC) ?: null;

        if ($row) {
            $this->cacheMediaRow($row);
        } else {
            $this->cache[$key] = null;
        }

        return $row;
    }

    private function findMediaByFileName(string $fileName): ?array
    {
        if (!$this->hasMediaTable) {
            return null;
        }

        $key = 'name:' . $fileName;
        if (array_key_exists($key, $this->cache)) {
            return $this->cache[$key];
        }

        $stmt = $this->pdo->prepare(
            $this->mediaSelectFrom() . ' WHERE filename = :filename ORDER BY id DESC LIMIT 1'
        );
        $stmt->execute(['filename' => $fileName]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC) ?: null;

        if ($row) {
            $this->cacheMediaRow($row);
        } else {
            $this->cache[$key] = null;
        }

        return $row;
    }

    private function normalizePath(string $path): string
    {
        if ($path[0] !== '/') {
            $path = '/' . $path;
        }

        return $path;
    }

    private function findMedia(string $path): ?array
    {
        $result = null;
        if (!$this->hasMediaTable) {
            return $result;
        }

        if (array_key_exists($path, $this->cache)) {
            $result = $this->cache[$path];
        } else {
            $basename = basename($path);
            $nameKey = 'name:' . $basename;
            if (array_key_exists($nameKey, $this->cache)) {
                $result = $this->cache[$nameKey];
            } else {
                $sql = $this->mediaSelectFrom()
                    . ' WHERE `path` = :path OR filename = :basename OR `path` LIKE :like_path';
                $params = [
                    'path' => $path,
                    'basename' => $basename,
                    'like_path' => '%' . $basename,
                    'path_exact' => $path,
                ];
                $sql .= ' ORDER BY (`path` = :path_exact) DESC, id DESC LIMIT 1';
                $stmt = $this->pdo->prepare($sql);
                $stmt->execute($params);
                $result = $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
                $this->cache[$path] = $result;
            }
        }

        return $result;
    }

    private function absoluteUrl(string $path): string
    {
        if (preg_match(HTTP_URL_PATTERN, $path)) {
            return $path;
        }

        return $this->baseUrl . $this->normalizePath($path);
    }

    /** @param array<string, mixed> $row */
    private function cacheMediaRow(array $row): void
    {
        $this->cache[$row['path']] = $row;
        $this->cache['name:' . $row['filename']] = $row;
        $this->cache['id:' . $row['id']] = $row;
    }

    /** @param array<string, mixed> $media */
    private function mediaAlt(array $media, ?string $defaultAlt): ?string
    {
        $alt = trim((string)($media['alt_text'] ?? ''));
        if ($alt !== '') {
            return $alt;
        }

        $filename = trim((string)($media['filename'] ?? ''));
        if ($filename !== '') {
            return $filename;
        }

        return $defaultAlt;
    }
}
