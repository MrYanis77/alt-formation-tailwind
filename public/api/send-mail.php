<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Méthode non autorisée']);
    exit;
}

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/PHPMailer/Exception.php';
require_once __DIR__ . '/PHPMailer/PHPMailer.php';
require_once __DIR__ . '/PHPMailer/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$body = json_decode(file_get_contents('php://input'), true);

$nom       = trim($body['nom']       ?? '');
$prenom    = trim($body['prenom']    ?? '');
$email     = trim($body['email']     ?? '');
$telephone = trim($body['telephone'] ?? '');
$sujet     = trim($body['sujet']     ?? '');
$message   = trim($body['message']   ?? '');
$honeypot  = trim($body['honeypot']  ?? '');

// Anti-bot honeypot
if ($honeypot !== '') {
    echo json_encode(['success' => true]);
    exit;
}

// Validation
if (!$nom || !$prenom || !$email || !$message) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Tous les champs obligatoires sont requis']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Adresse email invalide']);
    exit;
}

$sujetFinal = $sujet ?: "Demande de contact – $prenom $nom";

function h($str) { return htmlspecialchars($str, ENT_QUOTES, 'UTF-8'); }

$html = '
<div style="font-family:sans-serif;color:#1a202c;max-width:600px;margin:0 auto;border:1px solid #e2e8f0;border-radius:8px;padding:20px;">
  <div style="background:#1e2f47;padding:20px 24px;border-radius:6px 6px 0 0;margin:-20px -20px 20px;">
    <h1 style="color:#fca311;margin:0;font-size:20px;text-transform:uppercase;letter-spacing:2px;">Alt RH Formations</h1>
    <p style="color:#fff;margin:4px 0 0;font-size:13px;">Nouveau message de contact</p>
  </div>
  <table style="width:100%;border-collapse:collapse;margin-top:10px;">
    <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;width:140px;color:#718096;font-size:13px;">Nom</td>
        <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-weight:600;">' . h($prenom) . ' ' . h($nom) . '</td></tr>
    <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#718096;font-size:13px;">Email</td>
        <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;"><a href="mailto:' . h($email) . '" style="color:#fca311;">' . h($email) . '</a></td></tr>
    <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#718096;font-size:13px;">Téléphone</td>
        <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;">' . ($telephone ? h($telephone) : '<em style="color:#aaa;">Non renseigné</em>') . '</td></tr>
    <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#718096;font-size:13px;">Sujet</td>
        <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;">' . h($sujetFinal) . '</td></tr>
  </table>
  <div style="margin-top:24px;">
    <p style="font-weight:700;margin-bottom:8px;color:#1e2f47;">Message :</p>
    <div style="background:#f8fafc;padding:16px;border-radius:6px;white-space:pre-wrap;line-height:1.6;">' . h($message) . '</div>
  </div>
  <p style="margin-top:24px;font-size:11px;color:#aaa;border-top:1px solid #e2e8f0;padding-top:12px;">
    Message reçu via le formulaire de contact du site alt-rh.com
  </p>
</div>';

try {
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->Host       = SMTP_HOST;
    $mail->SMTPAuth   = true;
    $mail->Username   = SMTP_USER;
    $mail->Password   = SMTP_PASS;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
    $mail->Port       = SMTP_PORT;
    $mail->CharSet    = 'UTF-8';

    $mail->setFrom(SMTP_USER, SMTP_FROM_NAME);
    $mail->addAddress(MAIL_RECIPIENT);
    $mail->addReplyTo($email, "$prenom $nom");

    $mail->isHTML(true);
    $mail->Subject = "Nouveau message : $sujetFinal";
    $mail->Body    = $html;
    $mail->AltBody = "$prenom $nom <$email>\n\n$message";

    $mail->send();
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Erreur envoi email : ' . $mail->ErrorInfo]);
}
