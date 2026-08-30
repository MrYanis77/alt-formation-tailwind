<?php
/**
 * @deprecated Préférer POST multipart /api/apply-career.php
 * Compatibilité JSON + base64 pour anciens clients.
 */
require_once __DIR__ . '/lib/bootstrap.php';
require_once __DIR__ . '/lib/cors.php';

apiCorsHeaders('POST, OPTIONS');
apiHandleOptions();

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    apiJsonResponse(['ok' => false, 'error' => 'Méthode non autorisée'], 405);
}

$contentType = strtolower((string) ($_SERVER['CONTENT_TYPE'] ?? ''));

if (str_contains($contentType, 'multipart/form-data')) {
    require_once __DIR__ . '/apply-career.php';
    exit;
}

require_once __DIR__ . '/lib/db.php';
require_once __DIR__ . '/lib/logger.php';
require_once __DIR__ . '/lib/mail.php';
require_once __DIR__ . '/lib/uploads.php';
require_once __DIR__ . '/lib/nexytal.php';

use PHPMailer\PHPMailer\Exception as MailException;

$body = json_decode(file_get_contents('php://input'), true) ?: [];

if (!empty($body['honeypot'])) {
    mailJsonSuccess();
}

$prenom = trim($body['prenom'] ?? '');
$nom = trim($body['nom'] ?? '');
$email = trim($body['email'] ?? '');
$telephone = trim($body['telephone'] ?? '');
$specificField = trim($body['specificField'] ?? '');
$message = trim($body['message'] ?? '');
$type = trim($body['type'] ?? 'collaborateur');
$attachment = $body['attachment'] ?? null;

if (!$prenom || !$nom || !$email || !$telephone || !$specificField) {
    mailJsonError('Tous les champs obligatoires sont requis', 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    mailJsonError('Adresse email invalide', 400);
}

$sid = siteId();
$cvRelative = null;
$cvAbsolute = null;
$cvOriginal = 'cv.pdf';

try {
    $storedAttachment = saveLegacyCareerAttachment(is_array($attachment) ? $attachment : null, $sid);
    if ($storedAttachment !== null) {
        $cvRelative = $storedAttachment['relative'];
        $cvAbsolute = $storedAttachment['absolute'];
        $cvOriginal = $storedAttachment['original'];
    }

    $pdo = db();
    $applicationId = null;

    if ($cvRelative && tableExists($pdo, 'candidatures_externes')) {
        $resolvedOfferId = resolveSpontaneousCareerOfferId(
            $pdo,
            $sid,
            in_array($type, ['formateur', 'collaborateur'], true) ? $type : 'collaborateur'
        );

        if ($resolvedOfferId !== null) {
            $applicationId = insertCareerExternalApplication($pdo, [
                'offre_id' => $resolvedOfferId,
                'site_id' => $sid,
                'prenom' => $prenom,
                'nom' => $nom,
                'email' => $email,
                'telephone' => $telephone,
                'lettre_motivation' => $message !== '' ? $message : null,
                'rgpd_consent_at' => date('Y-m-d H:i:s'),
                'cv_filename' => $cvRelative,
                'competences_reponses' => json_encode([
                    'application_type' => $type,
                    'contract_or_expertise' => $specificField,
                ], JSON_UNESCAPED_UNICODE),
            ]);
        }
    }

    $typeLabel = $type === 'formateur' ? 'Formateur Expert' : 'Collaborateur';
    $fieldLabel = $type === 'formateur' ? "Domaine d'expertise" : 'Contrat recherché';

    $html = '
<div style="font-family:sans-serif;color:#1a202c;max-width:600px;margin:0 auto;border:1px solid #e2e8f0;border-radius:8px;padding:20px;">
  <div style="background:#1e2f47;padding:20px 24px;border-radius:6px 6px 0 0;margin:-20px -20px 20px;">
    <h1 style="color:#fca311;margin:0;font-size:20px;text-transform:uppercase;letter-spacing:2px;">Alt RH Formations</h1>
    <p style="color:#fff;margin:4px 0 0;font-size:13px;">Nouvelle candidature — ' . htmlEscape($typeLabel) . '</p>
  </div>
  <table style="width:100%;border-collapse:collapse;margin-top:10px;">
    <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;width:160px;color:#718096;font-size:13px;">Candidat</td>
        <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;font-weight:600;">' . htmlEscape($prenom) . ' ' . htmlEscape($nom) . '</td></tr>
    <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#718096;font-size:13px;">Email</td>
        <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;"><a href="mailto:' . htmlEscape($email) . '" style="color:#fca311;">' . htmlEscape($email) . '</a></td></tr>
    <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#718096;font-size:13px;">Téléphone</td>
        <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;">' . htmlEscape($telephone) . '</td></tr>
    <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#718096;font-size:13px;">' . htmlEscape($fieldLabel) . '</td>
        <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;">' . htmlEscape($specificField) . '</td></tr>
  </table>
  ' . ($message ? '
  <div style="margin-top:24px;">
    <p style="font-weight:700;margin-bottom:8px;color:#1e2f47;">Lettre de motivation :</p>
    <div style="background:#f8fafc;padding:16px;border-radius:6px;white-space:pre-wrap;line-height:1.6;">' . htmlEscape($message) . '</div>
  </div>' : '') . '
  ' . ($attachment ? '<p style="margin-top:16px;font-size:13px;color:#718096;">CV joint à cet email.</p>' : '') . '
</div>';

    $mail = createMailer();
    $mail->addAddress(mailRecipient());
    $mail->addReplyTo($email, "$prenom $nom");

    if ($cvAbsolute && is_readable($cvAbsolute)) {
        $mail->addAttachment($cvAbsolute, $cvOriginal);
    } elseif ($attachment && isset($attachment['content'], $attachment['filename'])) {
        $mail->addStringAttachment(base64_decode($attachment['content']), $attachment['filename']);
    }

    $mail->isHTML(true);
    $mail->Subject = "[CANDIDATURE] $typeLabel – $prenom $nom";
    $mail->Body = $html;
    $mail->AltBody = "Candidature $typeLabel\n$prenom $nom <$email>\nTél: $telephone\n$fieldLabel: $specificField\n\n$message";
    $mail->send();

    apiJsonResponse(['ok' => true, 'success' => true, 'application_id' => $applicationId]);
} catch (InvalidArgumentException $e) {
    mailJsonError($e->getMessage(), 400);
} catch (MailException $e) {
    apiServerError($e, ['endpoint' => basename(__FILE__), 'mail_error' => isset($mail) ? $mail->ErrorInfo : null]);
} catch (Throwable $e) {
    apiServerError($e, ['endpoint' => basename(__FILE__)]);
}
