<?php
require_once __DIR__ . '/lib/bootstrap.php';
require_once __DIR__ . '/lib/cors.php';
require_once __DIR__ . '/lib/mail.php';
require_once __DIR__ . '/lib/logger.php';

use PHPMailer\PHPMailer\Exception as MailException;

apiCorsHeaders('POST, OPTIONS');
apiHandleOptions();
apiRequireMethod('POST');

$body = json_decode(file_get_contents('php://input'), true) ?: [];

$prenom = trim($body['prenom'] ?? '');
$nom = trim($body['nom'] ?? '');
$email = trim($body['email'] ?? '');
$formation = trim($body['formation'] ?? '');
$date = trim($body['date'] ?? '');
$lieu = trim($body['lieu'] ?? '');

if (!$prenom || !$nom || !$email || !$formation) {
    mailJsonError('Champs obligatoires manquants', 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    mailJsonError('Adresse email invalide', 400);
}

$htmlStagiaire = '
<div style="font-family:sans-serif;color:#1a202c;max-width:600px;margin:0 auto;border:1px solid #e2e8f0;border-radius:8px;overflow:hidden;">
  <div style="background:#1e2f47;padding:32px 24px;text-align:center;">
    <h1 style="color:#fca311;margin:0;font-size:24px;text-transform:uppercase;letter-spacing:2px;">Alt RH Formations</h1>
    <p style="color:#cbd5e0;margin:8px 0 0;font-size:14px;">Confirmation d\'inscription</p>
  </div>
  <div style="padding:32px 24px;">
    <p style="font-size:16px;margin-bottom:24px;">Bonjour <strong>' . htmlEscape($prenom) . ' ' . htmlEscape($nom) . '</strong>,</p>
    <p style="line-height:1.7;color:#4a5568;">Nous avons bien enregistré votre inscription à la formation suivante.</p>
    <div style="background:#f8fafc;border-left:4px solid #fca311;border-radius:4px;padding:20px 24px;margin:24px 0;">
      <h2 style="color:#1e2f47;margin:0 0 16px;font-size:18px;">' . htmlEscape($formation) . '</h2>
    </div>
    <p style="line-height:1.7;color:#4a5568;">Notre équipe prendra contact avec vous prochainement.</p>
  </div>
</div>';

$htmlAdmin = '
<div style="font-family:sans-serif;color:#1a202c;max-width:600px;margin:0 auto;border:1px solid #e2e8f0;border-radius:8px;padding:20px;">
  <div style="background:#1e2f47;padding:20px 24px;border-radius:6px 6px 0 0;margin:-20px -20px 20px;">
    <h1 style="color:#fca311;margin:0;font-size:20px;text-transform:uppercase;letter-spacing:2px;">Alt RH Formations</h1>
    <p style="color:#fff;margin:4px 0 0;font-size:13px;">Nouvelle inscription à une formation</p>
  </div>
  <table style="width:100%;border-collapse:collapse;margin-top:10px;">
    <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;width:120px;color:#718096;font-size:13px;">Stagiaire</td>
        <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-weight:600;">' . htmlEscape($prenom) . ' ' . htmlEscape($nom) . '</td></tr>
    <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#718096;font-size:13px;">Email</td>
        <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;"><a href="mailto:' . htmlEscape($email) . '" style="color:#fca311;">' . htmlEscape($email) . '</a></td></tr>
    <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#718096;font-size:13px;">Formation</td>
        <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-weight:600;">' . htmlEscape($formation) . '</td></tr>
    ' . ($date ? '<tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#718096;font-size:13px;">Date</td>
        <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;">' . htmlEscape($date) . '</td></tr>' : '') . '
    ' . ($lieu ? '<tr><td style="padding:10px 0;color:#718096;font-size:13px;">Lieu</td>
        <td style="padding:10px 0;">' . htmlEscape($lieu) . '</td></tr>' : '') . '
  </table>
</div>';

try {
    $mail = createMailer();

    $mail->addAddress($email, "$prenom $nom");
    $mail->isHTML(true);
    $mail->Subject = "Confirmation d'inscription – $formation";
    $mail->Body = $htmlStagiaire;
    $mail->AltBody = "Bonjour $prenom $nom,\n\nVotre inscription à \"$formation\" est bien enregistrée.";
    $mail->send();

    $mail->clearAddresses();
    $mail->addAddress(mailRecipient());
    $mail->Subject = "[INSCRIPTION] $formation – $prenom $nom";
    $mail->Body = $htmlAdmin;
    $mail->AltBody = "Nouvelle inscription\n$prenom $nom <$email>\nFormation : $formation";
    $mail->send();

    mailJsonSuccess();
} catch (MailException $e) {
    apiServerError($e, ['endpoint' => basename(__FILE__), 'mail_error' => isset($mail) ? $mail->ErrorInfo : null]);
} catch (Throwable $e) {
    apiServerError($e, ['endpoint' => basename(__FILE__)]);
}
