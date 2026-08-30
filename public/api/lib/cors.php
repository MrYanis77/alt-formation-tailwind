<?php

function apiCorsHeaders(string $methods = 'GET, OPTIONS'): void
{
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    $configured = $_ENV['API_CORS_ORIGINS'] ?? getenv('API_CORS_ORIGINS') ?: ($_ENV['CORS_ORIGINS'] ?? getenv('CORS_ORIGINS') ?: '');
    $allowed = array_values(array_filter(array_map('trim', explode(',', (string) $configured))));

    if ($allowed === []) {
        $allowed = [
            'https://alt-formation.fr',
            'https://www.alt-formation.fr',
            'http://localhost:5173',
            'http://127.0.0.1:5173',
            'http://127.0.0.1:8000',
        ];
    }

    if ($origin !== '' && in_array($origin, $allowed, true)) {
        header('Access-Control-Allow-Origin: ' . $origin);
        header('Vary: Origin');
    }

    header('Access-Control-Allow-Methods: ' . $methods);
    header('Access-Control-Allow-Headers: Content-Type, X-Requested-With');
    header('X-Content-Type-Options: nosniff');
    header('Referrer-Policy: strict-origin-when-cross-origin');
}

function apiHandleOptions(): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        http_response_code(200);
        exit;
    }
}

function apiRequireMethod(string $method): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? '') !== strtoupper($method)) {
        apiJsonResponse(['ok' => false, 'error' => 'Methode non autorisee'], 405);
    }
}
