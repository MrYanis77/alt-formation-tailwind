<?php
/**
 * Compatibilité legacy — préférez les variables SMTP_* dans api/config/.env
 */
require_once __DIR__ . '/lib/db.php';

loadAllEnv();

if (!defined('SMTP_HOST')) {
    define('SMTP_HOST', env('SMTP_HOST', ''));
}
if (!defined('SMTP_PORT')) {
    define('SMTP_PORT', (int) env('SMTP_PORT', '465'));
}
if (!defined('SMTP_USER')) {
    define('SMTP_USER', env('SMTP_USER', ''));
}
if (!defined('SMTP_PASS')) {
    define('SMTP_PASS', env('SMTP_PASSWORD', env('SMTP_PASS', '')));
}
if (!defined('SMTP_FROM_NAME')) {
    define('SMTP_FROM_NAME', env('SMTP_FROM_NAME', 'Alt RH Formations'));
}
if (!defined('MAIL_RECIPIENT')) {
    define('MAIL_RECIPIENT', env('MAIL_RECIPIENT', 'contact@nexytal.com'));
}
