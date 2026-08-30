<?php
declare(strict_types=1);

require_once __DIR__ . '/../../public/api/lib/logger.php';

function assertSameValue($expected, $actual, string $message): void
{
    if ($expected !== $actual) {
        throw new RuntimeException($message . ' Expected ' . var_export($expected, true) . ', got ' . var_export($actual, true));
    }
}

assertSameValue('warning', normalizeSystemLogLevel('warning'), 'Valid level should be kept.');
assertSameValue('error', normalizeSystemLogLevel('debug'), 'Invalid level should fallback to error.');
assertSameValue('frontend', normalizeSystemLogSource('frontend'), 'Valid source should be kept.');
assertSameValue('api', normalizeSystemLogSource('cli'), 'Invalid source should fallback to api.');

$message = cleanSystemLogMessage(" <script>alert(1)</script>\x00 ");
assertSameValue('alert(1)', $message, 'Message should be stripped and cleaned.');

$context = normalizeSystemLogContext([
    'token' => str_repeat('x', 1200),
    'nested' => ['ok' => true, 'resource' => fopen(__FILE__, 'r')],
    'object' => new stdClass(),
]);
assertSameValue(1000, strlen($context['token']), 'Context strings should be truncated.');
assertSameValue(['ok' => true], $context['nested'], 'Nested arrays should keep scalar data only.');
assertSameValue(false, array_key_exists('object', $context), 'Objects should be ignored.');

echo "logger_test ok\n";
