<?php

const UPLOAD_MAX_BYTES = 5 * 1024 * 1024; // 5 Mo

class UploadStorageException extends RuntimeException
{
}

const UPLOAD_ALLOWED_CV = [
    'application/pdf' => 'pdf',
    'application/msword' => 'doc',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document' => 'docx',
];

function candidatureUploadRoot(): string
{
    return dirname(__DIR__) . '/uploads/candidatures';
}

function careerUploadRoot(): string
{
    return candidatureUploadRoot();
}

function ensureDirectory(string $path): void
{
    if (!is_dir($path) && !mkdir($path, 0755, true) && !is_dir($path)) {
        throw new UploadStorageException('Impossible de créer le dossier upload : ' . $path);
    }
}

function detectUploadMime(string $tmpPath, string $fallbackName): string
{
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime = $finfo ? finfo_file($finfo, $tmpPath) : false;
    if ($finfo) {
        finfo_close($finfo);
    }
    if ($mime) {
        return $mime;
    }
    $ext = strtolower(pathinfo($fallbackName, PATHINFO_EXTENSION));
    return match ($ext) {
        'pdf' => 'application/pdf',
        'doc' => 'application/msword',
        'docx' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        default => 'application/octet-stream',
    };
}

/**
 * @return array{relative: string, absolute: string, original: string}
 */
function saveCareerUpload(array $file, int $siteId, string $prefix, bool $required = true): ?array
{
    if (($file['error'] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE) {
        if ($required) {
            throw new InvalidArgumentException('Fichier requis manquant.');
        }
        return null;
    }

    if (($file['error'] ?? UPLOAD_ERR_OK) !== UPLOAD_ERR_OK) {
        throw new UploadStorageException('Erreur lors de l\'upload du fichier.');
    }

    if (($file['size'] ?? 0) > UPLOAD_MAX_BYTES) {
        throw new InvalidArgumentException('Fichier trop volumineux (max 5 Mo).');
    }

    $tmp = $file['tmp_name'] ?? '';
    if (!$tmp || !is_uploaded_file($tmp)) {
        throw new UploadStorageException('Upload invalide.');
    }

    $original = basename((string) ($file['name'] ?? 'document'));
    $mime = detectUploadMime($tmp, $original);
    if (!isset(UPLOAD_ALLOWED_CV[$mime])) {
        throw new InvalidArgumentException('Format de fichier non autorisé (PDF, DOC, DOCX uniquement).');
    }

    $ext = UPLOAD_ALLOWED_CV[$mime];
    $dir = candidatureUploadRoot() . '/' . $siteId;
    ensureDirectory($dir);

    $safeName = 'cand-' . $prefix . '-' . bin2hex(random_bytes(8)) . '.' . $ext;
    $absolute = $dir . '/' . $safeName;
    if (!move_uploaded_file($tmp, $absolute)) {
        throw new UploadStorageException('Impossible d\'enregistrer le fichier uploadé.');
    }

    return [
        'relative' => 'uploads/candidatures/' . $siteId . '/' . $safeName,
        'absolute' => $absolute,
        'original' => $original,
    ];
}

/**
 * Compatibilite avec l'ancien endpoint JSON. Le contenu base64 subit les memes
 * limites de taille et de type MIME que l'upload multipart moderne.
 *
 * @return array{relative: string, absolute: string, original: string}|null
 */
function saveLegacyCareerAttachment(?array $attachment, int $siteId): ?array
{
    if ($attachment === null) {
        return null;
    }

    $encoded = $attachment['content'] ?? null;
    $original = basename((string)($attachment['filename'] ?? ''));
    if (!is_string($encoded) || $encoded === '' || $original === '') {
        throw new InvalidArgumentException('Piece jointe invalide.');
    }

    $maxEncodedBytes = (int)ceil(UPLOAD_MAX_BYTES * 4 / 3) + 4;
    if (strlen($encoded) > $maxEncodedBytes) {
        throw new InvalidArgumentException('Fichier trop volumineux (max 5 Mo).');
    }

    $content = base64_decode($encoded, true);
    if ($content === false || strlen($content) > UPLOAD_MAX_BYTES) {
        throw new InvalidArgumentException('Contenu base64 invalide ou trop volumineux.');
    }

    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mime = $finfo ? finfo_buffer($finfo, $content) : false;
    if ($finfo) {
        finfo_close($finfo);
    }
    if (!$mime || !isset(UPLOAD_ALLOWED_CV[$mime])) {
        throw new InvalidArgumentException('Format de fichier non autorise (PDF, DOC, DOCX uniquement).');
    }

    $dir = candidatureUploadRoot() . '/' . $siteId;
    ensureDirectory($dir);
    $safeName = 'cand-cv-' . bin2hex(random_bytes(8)) . '.' . UPLOAD_ALLOWED_CV[$mime];
    $absolute = $dir . '/' . $safeName;
    if (file_put_contents($absolute, $content, LOCK_EX) === false) {
        throw new UploadStorageException('Impossible d enregistrer la piece jointe.');
    }

    return [
        'relative' => 'uploads/candidatures/' . $siteId . '/' . $safeName,
        'absolute' => $absolute,
        'original' => $original,
    ];
}

function clientIpAddress(): ?string
{
    $trustProxy = function_exists('env') && env('TRUST_PROXY', 'false') === 'true';
    if ($trustProxy && !empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        return trim(explode(',', $_SERVER['HTTP_X_FORWARDED_FOR'])[0]);
    }

    return $_SERVER['REMOTE_ADDR'] ?? null;
}
