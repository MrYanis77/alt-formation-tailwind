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

$prenom    = trim($body['prenom']    ?? '');
$nom       = trim($body['nom']       ?? '');
$email     = trim($body['email']     ?? '');
$formation = trim($body['formation'] ?? '');
$date      = trim($body['date']      ?? '');
$lieu      = trim($body['lieu']      ?? '');

// Validation
if (!$prenom || !$nom || !$email || !$formation) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Champs obligatoires manquants']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Adresse email invalide']);
    exit;
}

function h($str) { return htmlspecialchars($str, ENT_QUOTES, 'UTF-8'); }

// --- Template email stagiaire (confirmation) ---
$htmlStagiaire = '
<div style="font-family:sans-serif;color:#1a202c;max-width:600px;margin:0 auto;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
  <div style="background:#1e2f47;padding:32px 24px;text-align:center;">
    <h1 style="color:#fca311;margin:0;font-size:24px;text-transform:uppercase;letter-spacing:2px;">Alt Formations</h1>
    <p style="color:#cbd5e0;margin:8px 0 0;font-size:14px;">Confirmation d\'inscription</p>
  </div>
  <div style="padding:32px 24px;">
    <p style="font-size:16px;margin-bottom:24px;">Bonjour <strong>' . h($prenom) . ' ' . h($nom) . '</strong>,</p>
    <p style="line-height:1.7;color:#4a5568;">
      Nous avons bien enregistré votre inscription à la formation suivante. Vous trouverez ci-dessous le récapitulatif de votre inscription.
    </p>
    <div style="background:#f8fafc;border-left:4px solid #fca311;border-radius:4px;padding:20px 24px;margin:24px 0;">
      <h2 style="color:#1e2f47;margin:0 0 16px;font-size:18px;">' . h($formation) . '</h2>
      <table style="width:100%;border-collapse:collapse;">
        ' . ($date ? '<tr>
          <td style="padding:6px 0;color:#718096;font-size:13px;width:100px;">Date</td>
          <td style="padding:6px 0;font-weight:600;">' . h($date) . '</td>
        </tr>' : '') . '
        ' . ($lieu ? '<tr>
          <td style="padding:6px 0;color:#718096;font-size:13px;">Lieu</td>
          <td style="padding:6px 0;font-weight:600;">' . h($lieu) . '</td>
        </tr>' : '') . '
        <tr>
          <td style="padding:6px 0;color:#718096;font-size:13px;">Stagiaire</td>
          <td style="padding:6px 0;font-weight:600;">' . h($prenom) . ' ' . h($nom) . '</td>
        </tr>
      </table>
    </div>
    <p style="line-height:1.7;color:#4a5568;">
      Notre équipe prendra contact avec vous prochainement pour vous communiquer les informations pratiques (convocation, documents à apporter, etc.).
    </p>
    <p style="line-height:1.7;color:#4a5568;">
      Pour toute question, n\'hésitez pas à nous contacter par email à 
      <a href="mailto:formations@alt-rh.com" style="color:#fca311;font-weight:600;">formations@alt-rh.com</a> 
      ou par téléphone au <strong>01 60 43 94 30</strong>.
    </p>
    <p style="margin-top:32px;color:#1e2f47;font-weight:600;">L\'équipe Alt Formations</p>
  </div>
  <div style="background:#f8fafc;padding:16px 24px;text-align:center;border-top:1px solid #e2e8f0;">
    <p style="margin:0;font-size:11px;color:#aaa;">
      3 rue du cochet, 77700 Bailly-Romainvilliers — 2-4 boulevard Michaël Faraday, 77700 Serris<br>
      © Alt Formations — <a href="https://alt-rh.com" style="color:#aaa;">alt-rh.com</a>
    </p>
  </div>
</div>';

// --- Template email admin (notification) ---
$htmlAdmin = '
<div style="font-family:sans-serif;color:#1a202c;max-width:600px;margin:0 auto;border:1px solid #e2e8f0;border-radius:8px;padding:20px;">
  <div style="background:#1e2f47;padding:20px 24px;border-radius:6px 6px 0 0;margin:-20px -20px 20px;">
    <h1 style="color:#fca311;margin:0;font-size:20px;text-transform:uppercase;letter-spacing:2px;">Alt Formations</h1>
    <p style="color:#fff;margin:4px 0 0;font-size:13px;">Nouvelle inscription à une formation</p>
  </div>
  <table style="width:100%;border-collapse:collapse;margin-top:10px;">
    <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;width:120px;color:#718096;font-size:13px;">Stagiaire</td>
        <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-weight:600;">' . h($prenom) . ' ' . h($nom) . '</td></tr>
    <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#718096;font-size:13px;">Email</td>
        <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;"><a href="mailto:' . h($email) . '" style="color:#fca311;">' . h($email) . '</a></td></tr>
    <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#718096;font-size:13px;">Formation</td>
        <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-weight:600;">' . h($formation) . '</td></tr>
    ' . ($date ? '<tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#718096;font-size:13px;">Date</td>
        <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;">' . h($date) . '</td></tr>' : '') . '
    ' . ($lieu ? '<tr><td style="padding:10px 0;color:#718096;font-size:13px;">Lieu</td>
        <td style="padding:10px 0;">' . h($lieu) . '</td></tr>' : '') . '
  </table>
  <p style="margin-top:24px;font-size:11px;color:#aaa;border-top:1px solid #e2e8f0;padding-top:12px;">
    Inscription reçue via le site alt-rh.com
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

    // 1. Email de confirmation au stagiaire
    $mail->setFrom(SMTP_USER, SMTP_FROM_NAME);
    $mail->addAddress($email, "$prenom $nom");
    $mail->isHTML(true);
    $mail->Subject = "Confirmation d'inscription – $formation";
    $mail->Body    = $htmlStagiaire;
    $mail->AltBody = "Bonjour $prenom $nom,\n\nVotre inscription à la formation \"$formation\" est bien enregistrée." . ($date ? "\nDate : $date" : '') . "\n\nL'équipe Alt Formations";
    $mail->send();

    // 2. Notification à l'admin
    $mail->clearAddresses();
    $mail->addAddress(MAIL_RECIPIENT);
    $mail->Subject = "[INSCRIPTION] $formation – $prenom $nom";
    $mail->Body    = $htmlAdmin;
    $mail->AltBody = "Nouvelle inscription\n$prenom $nom <$email>\nFormation : $formation" . ($date ? "\nDate : $date" : '');
    $mail->send();

    echo json_encode(['success' => true]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => 'Erreur envoi email : ' . $mail->ErrorInfo]);
}
