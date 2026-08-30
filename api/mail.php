<?php



use PHPMailer\PHPMailer\Exception as MailException;
use PHPMailer\PHPMailer\PHPMailer;

require_once __DIR__ . '/vendor/autoload.php';

class MailDeliveryException extends RuntimeException
{
}

const DEFAULT_SITE_CONTACT_EMAIL = 'contact@nexytal.com';

function escapeMail(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function formatField(string $label, ?string $value): string
{
    $safe = escapeMail(trim((string)$value));
    if ($safe === '') {
        return '';
    }

    return '<tr><td style="padding:8px 12px;font-weight:600;vertical-align:top;">'
        . escapeMail($label)
        . '</td><td style="padding:8px 12px;">'
        . nl2br($safe)
        . '</td></tr>';
}

function buildMailBody(array $fields): string
{
    $rows = '';
    foreach ($fields as $label => $value) {
        $rows .= formatField($label, is_scalar($value) ? (string)$value : '');
    }

    return '
        <div style="font-family:Arial,sans-serif;color:#0B1D3A;">
            <h2 style="margin:0 0 16px;">Nouveau message â€” Alt Formation</h2>
            <table style="border-collapse:collapse;width:100%;max-width:640px;">'
        . $rows
        . '</table>
        </div>';
}

function sendSiteMail(string $subject, array $fields, string $replyToEmail, string $replyToName): void
{
    $to = envValue('MAIL_RECIPIENT', DEFAULT_SITE_CONTACT_EMAIL);
    $from = envValue('SMTP_USER', DEFAULT_SITE_CONTACT_EMAIL);
    $fromName = envValue('SMTP_FROM_NAME', 'NEXYTAL Groupe');
    $host = envValue('SMTP_HOST', 'smtp.ionos.fr');
    $port = (int) envValue('SMTP_PORT', '465');
    $user = envValue('SMTP_USER', DEFAULT_SITE_CONTACT_EMAIL);
    $pass = envValue('SMTP_PASS', '') ?: envValue('SMTP_PASSWORD', '');
    $encryption = envValue('SMTP_SECURE', 'ssl');

    $mail = new PHPMailer(true);

    try {
        if ($host) {
            $mail->isSMTP();
            $mail->Host = $host;
            $mail->Port = $port;
            $mail->SMTPAuth = true;
            $mail->Username = $user;
            $mail->Password = $pass;
            $mail->SMTPSecure = $encryption === 'ssl' ? PHPMailer::ENCRYPTION_SMTPS : PHPMailer::ENCRYPTION_STARTTLS;
            $mail->CharSet = 'UTF-8';
        }

        $mail->setFrom($from, $fromName);
        $mail->addAddress($to);
        $mail->addReplyTo($replyToEmail, $replyToName);
        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = buildMailBody($fields);
        $mail->AltBody = strip_tags(str_replace(['<br>', '<br/>', '<br />'], "\n", $mail->Body));

        $mail->send();
    } catch (MailException $e) {
        throw new MailDeliveryException('Erreur envoi email : ' . $mail->ErrorInfo, 0, $e);
    }
}
