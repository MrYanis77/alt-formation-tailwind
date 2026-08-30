<?php
spl_autoload_register(function ($class) {
    $prefix = "PHPMailer\\PHPMailer\\";
    $base = __DIR__ . "/phpmailer/phpmailer/src/";
    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) return;
    $file = $base . str_replace("\\", "/", substr($class, $len)) . ".php";
    if (file_exists($file)) require $file;
});
