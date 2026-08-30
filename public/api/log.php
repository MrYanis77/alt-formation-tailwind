<?php
declare(strict_types=1);

require_once __DIR__ . '/lib/bootstrap.php';
require_once __DIR__ . '/lib/db.php';
require_once __DIR__ . '/lib/cors.php';
require_once __DIR__ . '/lib/logger.php';

apiCorsHeaders('POST, OPTIONS');
apiHandleOptions();
apiRequireMethod('POST');

function requireJsonContentType(): void
{
    $contentType = trim((string) ($_SERVER['CONTENT_TYPE'] ?? ''));
    if ($contentType === '' || stripos($contentType, 'application/json') !== 0) {
        apiJsonResponse([
            'ok' => false,
            'error' => 'Le contenu doit etre au format JSON.',
        ], 415);
    }
}

function readLogJsonBody(int $maxBytes = 12000): array
{
    $raw = file_get_contents('php://input', false, null, 0, $maxBytes + 1);
    if ($raw === false || trim($raw) === '') {
        apiJsonResponse(['ok' => false, 'error' => 'Corps JSON manquant.'], 400);
    }
    if (strlen($raw) > $maxBytes) {
        apiJsonResponse(['ok' => false, 'error' => 'Payload trop volumineux.'], 413);
    }

    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) {
        apiJsonResponse(['ok' => false, 'error' => 'JSON invalide.'], 400);
    }

    return $decoded;
}

function enforceLogRateLimit(int $maxAttempts = 30, int $windowSeconds = 300): void
{
    $dir = sys_get_temp_dir() . '/alt_formation_system_logs';
    if (!is_dir($dir) && !@mkdir($dir, 0700, true) && !is_dir($dir)) {
        return;
    }

    $key = hash('sha256', (systemLogClientIp() ?? 'unknown') . '|frontend-log');
    $file = $dir . '/' . $key . '.json';
    $now = time();
    $data = ['count' => 0, 'start' => $now];

    if (is_file($file)) {
        $decoded = json_decode((string) file_get_contents($file), true);
        if (is_array($decoded)) {
            $data = $decoded;
        }
        if ($now - (int) ($data['start'] ?? 0) > $windowSeconds) {
            $data = ['count' => 0, 'start' => $now];
        }
    }

    $data['count'] = (int) ($data['count'] ?? 0) + 1;
    @file_put_contents($file, json_encode($data), LOCK_EX);

    if ($data['count'] > $maxAttempts) {
        apiJsonResponse(['ok' => false, 'error' => 'Trop de logs envoyes.'], 429);
    }
}

try {
    requireJsonContentType();
    enforceLogRateLimit();

    $input = readLogJsonBody();
    if (!isset($input['message'], $input['level'])) {
        apiJsonResponse(['ok' => false, 'error' => 'Donnees de log invalides.'], 400);
    }

    $context = isset($input['context']) && is_array($input['context']) ? $input['context'] : [];
    $logId = logSystemError((string) $input['level'], 'frontend', (string) $input['message'], $context);
    if ($logId === false) {
        apiJsonResponse(['ok' => false, 'error' => 'Erreur lors de l enregistrement du log.'], 500);
    }

    apiJsonResponse(['ok' => true, 'success' => true, 'log_id' => $logId]);
} catch (Throwable $e) {
    apiServerError($e, ['endpoint' => 'log']);
}
