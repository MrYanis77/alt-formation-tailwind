<?php
/**
 * Test simple de connexion BDD — uploadez sur le FTP puis ouvrez :
 * https://alt-rh.com/test-connexion.php
 */
header('Content-Type: text/html; charset=utf-8');

require_once __DIR__ . '/api/lib/db.php';

$host = env('DB_HOST', '?');
$port = (int) env('DB_PORT', '3306');
$dbName = env('DB_NAME', '?');
$dbUser = env('DB_USER', '?');
$dbPass = env('DB_PASSWORD', '');
?>
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Test connexion BDD</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 560px; margin: 48px auto; padding: 0 20px; color: #1a1a1a; }
    h1 { font-size: 1.35rem; }
    .box { padding: 20px 24px; border-radius: 10px; margin-top: 20px; line-height: 1.5; }
    .wait { background: #fff8e1; border: 1px solid #ffe082; color: #5d4037; }
    .ok  { background: #e8f5e9; border: 1px solid #a5d6a7; color: #1b5e20; }
    .err { background: #ffebee; border: 1px solid #ef9a9a; color: #b71c1c; }
    code { background: #f5f5f5; padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
    dl { margin: 12px 0 0; }
    dt { font-weight: 600; margin-top: 8px; }
    dd { margin: 4px 0 0; }
  </style>
</head>
<body>
  <h1>Test connexion base de données</h1>
  <p>Configuration lue dans <code>api/config/.env</code></p>
  <div class="box wait" id="status">Tentative de connexion en cours (max 5 s)…</div>
<?php
if (function_exists('ob_get_level')) {
    while (ob_get_level() > 0) {
        ob_end_flush();
    }
}
flush();

if (!function_exists('mysqli_init')) {
    echo '<script>document.getElementById("status").outerHTML = ' . json_encode(
        '<div class="box err"><p><strong>Extension mysqli absente.</strong></p></div>'
    ) . ';</script></body></html>';
    exit;
}

$link = mysqli_init();
mysqli_options($link, MYSQLI_OPT_CONNECT_TIMEOUT, 5);

$connected = @mysqli_real_connect($link, $host, $dbUser, $dbPass, $dbName, $port);

if ($connected) {
    $version = mysqli_get_server_info($link);
    $tablesRes = mysqli_query($link, 'SELECT COUNT(*) AS c FROM information_schema.tables WHERE table_schema = DATABASE()');
    $tables = $tablesRes ? (int) mysqli_fetch_assoc($tablesRes)['c'] : 0;
    mysqli_close($link);

    $html = '<div class="box ok">';
    $html .= '<p><strong>Connexion au serveur MySQL établie avec succès.</strong></p>';
    $html .= '<dl>';
    $html .= '<dt>Hôte</dt><dd>' . htmlspecialchars($host) . '</dd>';
    $html .= '<dt>Base</dt><dd>' . htmlspecialchars($dbName) . '</dd>';
    $html .= '<dt>Utilisateur</dt><dd>' . htmlspecialchars($dbUser) . '</dd>';
    $html .= '<dt>Version</dt><dd>' . htmlspecialchars($version) . '</dd>';
    $html .= '<dt>Tables dans la base</dt><dd>' . $tables . '</dd>';
    $html .= '</dl>';
    $html .= '<p style="margin-top:16px"><a href="/api/health.php">health.php</a> · <a href="/test-bdd">Page test données</a></p>';
    $html .= '</div>';
} else {
    $err = mysqli_connect_error() ?: 'Connexion impossible (timeout ou hôte incorrect).';
    $html = '<div class="box err">';
    $html .= '<p><strong>La connexion au serveur MySQL a échoué.</strong></p>';
    $html .= '<p>' . htmlspecialchars($err) . '</p>';
    $html .= '<dl>';
    $html .= '<dt>Hôte configuré</dt><dd>' . htmlspecialchars($host) . '</dd>';
    $html .= '<dt>Base</dt><dd>' . htmlspecialchars($dbName) . '</dd>';
    $html .= '<dt>Utilisateur</dt><dd>' . htmlspecialchars($dbUser) . '</dd>';
    $html .= '</dl>';
    $html .= '<p style="margin-top:16px">Essayez dans <code>api/config/.env</code> :<br>';
    $html .= '• <code>DB_HOST=db5020658636.hosting-data.io</code> (valeur Ionos)<br>';
    $html .= '• ou <code>DB_HOST=127.0.0.1</code></p>';
    $html .= '</div>';
}

echo '<script>document.getElementById("status").outerHTML = ' . json_encode($html) . ';</script>';
?>
</body>
</html>
