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

$nom = trim($body['nom'] ?? '');
$prenom = trim($body['prenom'] ?? '');
$email = trim($body['email'] ?? '');
$telephone = trim($body['telephone'] ?? '');
$sujet = trim($body['sujet'] ?? '');
$message = trim($body['message'] ?? '');
$honeypot = trim($body['honeypot'] ?? '');

if ($honeypot !== '') {
    mailJsonSuccess();
}

if (!$nom || !$prenom || !$email || !$message) {
    mailJsonError('Tous les champs obligatoires sont requis', 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    mailJsonError('Adresse email invalide', 400);
}

$sujetFinal = $sujet ?: "Demande de contact – $prenom $nom";

$html = '
<div style="font-family:sans-serif;color:#1a202c;max-width:600px;margin:0 auto;border:1px solid #e2e8f0;border-radius:8px;padding:20px;">
  <div style="background:#1e2f47;padding:20px 24px;border-radius:6px 6px 0 0;margin:-20px -20px 20px;">
    <h1 style="color:#fca311;margin:0;font-size:20px;text-transform:uppercase;letter-spacing:2px;">Alt RH Formations</h1>
    <p style="color:#fff;margin:4px 0 0;font-size:13px;">Nouveau message de contact</p>
  </div>
  <table style="width:100%;border-collapse:collapse;margin-top:10px;">
    <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;width:140px;color:#718096;font-size:13px;">Nom</td>
        <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-weight:600;">' . htmlEscape($prenom) . ' ' . htmlEscape($nom) . '</td></tr>
    <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#718096;font-size:13px;">Email</td>
        <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;"><a href="mailto:' . htmlEscape($email) . '" style="color:#fca311;">' . htmlEscape($email) . '</a></td></tr>
    <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#718096;font-size:13px;">Téléphone</td>
        <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;">' . ($telephone ? htmlEscape($telephone) : '<em style="color:#aaa;">Non renseigné</em>') . '</td></tr>
    <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#718096;font-size:13px;">Sujet</td>
        <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;">' . htmlEscape($sujetFinal) . '</td></tr>
  </table>
  <div style="margin-top:24px;">
    <p style="font-weight:700;margin-bottom:8px;color:#1e2f47;">Message :</p>
    <div style="background:#f8fafc;padding:16px;border-radius:6px;white-space:pre-wrap;line-height:1.6;">' . htmlEscape($message) . '</div>
  </div>
</div>';

try {
    $mail = createMailer();
    $mail->addAddress(mailRecipient());
    $mail->addReplyTo($email, "$prenom $nom");
    $mail->isHTML(true);
    $mail->Subject = "Nouveau message : $sujetFinal";
    $mail->Body = $html;
    $mail->AltBody = "$prenom $nom <$email>\n\n$message";
    $mail->send();
    mailJsonSuccess();
} catch (MailException $e) {
    apiServerError($e, ['endpoint' => basename(__FILE__), 'mail_error' => isset($mail) ? $mail->ErrorInfo : null]);
} catch (Throwable $e) {
    apiServerError($e, ['endpoint' => basename(__FILE__)]);
}
