<?php

require_once __DIR__ . '/db.php';
require_once __DIR__ . '/../PHPMailer/Exception.php';
require_once __DIR__ . '/../PHPMailer/PHPMailer.php';
require_once __DIR__ . '/../PHPMailer/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;

function mailConfig(): array
{
    loadAllEnv();
    return [
        'host' => env('SMTP_HOST', ''),
        'port' => (int) env('SMTP_PORT', '465'),
        'user' => env('SMTP_USER', ''),
        'pass' => env('SMTP_PASSWORD', env('SMTP_PASS', '')),
        'from_email' => env('MAIL_FROM', env('SMTP_USER', 'contact@nexytal.com')),
        'from_name' => env('MAIL_FROM_NAME', env('SMTP_FROM_NAME', 'Alt RH Formations')),
        'recipient' => env('MAIL_RECIPIENT', 'contact@nexytal.com'),
    ];
}

function mailConfigDiagnostics(): array
{
    $cfg = mailConfig();
    $smtpConfigured = $cfg['user'] !== '' && $cfg['pass'] !== '';

    return [
        'transport' => $smtpConfigured ? 'smtp' : 'mail',
        'from_email' => $cfg['from_email'],
        'mail_recipient' => $cfg['recipient'],
        'smtp_configured' => $smtpConfigured,
    ];
}

function createMailer(): PHPMailer
{
    $cfg = mailConfig();
    $mail = new PHPMailer(true);
    $mail->CharSet = 'UTF-8';
    $mail->setFrom($cfg['from_email'], $cfg['from_name']);

    if ($cfg['user'] && $cfg['pass']) {
        $mail->isSMTP();
        $mail->Host = $cfg['host'] ?: 'localhost';
        $mail->SMTPAuth = true;
        $mail->Username = $cfg['user'];
        $mail->Password = $cfg['pass'];
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
        $mail->Port = $cfg['port'];
    } else {
        $mail->isMail();
    }

    return $mail;
}

function mailRecipient(): string
{
    return mailConfig()['recipient'];
}

function htmlEscape(string $str): string
{
    return htmlspecialchars($str, ENT_QUOTES, 'UTF-8');
}

function mailJsonSuccess(): void
{
    apiJsonResponse(['ok' => true, 'success' => true]);
}

function mailJsonError(string $message, int $status = 500): void
{
    apiJsonResponse(['ok' => false, 'success' => false, 'error' => $message], $status);
}

function sendCareerConfirmationEmail(
    string $toEmail,
    string $prenom,
    string $nom,
    string $offerTitle,
    string $typeLabel
): void {
    $name = trim("$prenom $nom");
    $posteLabel = $offerTitle !== '' ? $offerTitle : $typeLabel;

    $html = '
<div style="font-family:sans-serif;color:#1a202c;max-width:600px;margin:0 auto;border:1px solid #e2e8f0;border-radius:8px;padding:20px;">
  <div style="background:#1e2f47;padding:20px 24px;border-radius:6px 6px 0 0;margin:-20px -20px 20px;">
    <h1 style="color:#fca311;margin:0;font-size:20px;text-transform:uppercase;letter-spacing:2px;">Alt RH Formations</h1>
    <p style="color:#fff;margin:4px 0 0;font-size:13px;">Confirmation de candidature</p>
  </div>
  <p style="line-height:1.6;">Bonjour ' . htmlEscape($prenom) . ',</p>
  <p style="line-height:1.6;">Nous avons bien reçu votre candidature pour le poste de <strong>' . htmlEscape($posteLabel) . '</strong>.</p>
  <p style="line-height:1.6;">Notre équipe RH va étudier votre profil et vous recontactera dans les meilleurs délais.</p>
  <p style="line-height:1.6;margin-top:24px;">Cordialement,<br><strong>L&apos;équipe Alt RH Formations</strong></p>
  <p style="margin-top:24px;font-size:12px;color:#718096;border-top:1px solid #e2e8f0;padding-top:16px;">
    Cet email confirme la réception de votre dossier. Merci de ne pas répondre directement à ce message automatique.
  </p>
</div>';

    $mail = createMailer();
    $mail->addAddress($toEmail, $name);
    $mail->isHTML(true);
    $mail->Subject = 'Confirmation de votre candidature — Alt RH Formations';
    $mail->Body = $html;
    $mail->AltBody = "Bonjour $prenom,\n\nNous avons bien reçu votre candidature pour le poste de $posteLabel.\n\nNotre équipe RH va étudier votre profil et vous recontactera dans les meilleurs délais.\n\nCordialement,\nL'équipe Alt RH Formations";
    $mail->send();
}
