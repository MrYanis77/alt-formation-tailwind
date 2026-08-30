<?php
/**
 * Candidature carrière — POST multipart/form-data /api/apply-career.php
 *
 * Champs : prenom, nom, email, telephone, type (collaborateur|formateur),
 *          specificField, message, offer_id (optionnel), offer_slug (optionnel),
 *          offer_title (optionnel), rgpd_consent (1),
 *          honeypot (vide), cv (fichier), cover_letter (fichier optionnel)
 */
require_once __DIR__ . '/lib/bootstrap.php';
require_once __DIR__ . '/lib/db.php';
require_once __DIR__ . '/lib/logger.php';
require_once __DIR__ . '/lib/cors.php';
require_once __DIR__ . '/lib/mail.php';
require_once __DIR__ . '/lib/uploads.php';
require_once __DIR__ . '/lib/nexytal.php';

use PHPMailer\PHPMailer\Exception as MailException;

apiCorsHeaders('POST, OPTIONS');
apiHandleOptions();
apiRequireMethod('POST');

function applyCareerField(string $key): string
{
    return trim((string) ($_POST[$key] ?? ''));
}

try {
    $pdo = db();
    $sid = siteId();

    $honeypot = applyCareerField('honeypot');
    if ($honeypot !== '') {
        mailJsonSuccess();
    }

    $prenom = applyCareerField('prenom');
    $nom = applyCareerField('nom');
    $email = applyCareerField('email');
    $telephone = applyCareerField('telephone');
    $specificField = applyCareerField('specificField');
    $message = applyCareerField('message');
    $type = applyCareerField('type') ?: 'collaborateur';
    $rgpdConsent = applyCareerField('rgpd_consent');
    $offerIdRaw = applyCareerField('offer_id');
    $offerId = $offerIdRaw !== '' ? (int) $offerIdRaw : null;
    $offerSlug = applyCareerField('offer_slug');
    $offerTitle = applyCareerField('offer_title');

    if ($offerId !== null && $offerId > 0) {
        $offerRow = getCareerJobOfferById($pdo, $sid, $offerId, true);
        if ($offerRow) {
            $offerTitle = (string) ($offerRow['title'] ?? $offerTitle);
        } else {
            $offerId = null;
        }
    }

    if (($offerId === null || $offerId <= 0) && $offerSlug !== '') {
        $offerRow = getCareerJobOfferBySlug($pdo, $sid, $offerSlug, true);
        if ($offerRow) {
            $offerId = (int) $offerRow['id'];
            $offerTitle = (string) ($offerRow['title'] ?? $offerTitle);
        }
    }

    if (!$prenom || !$nom || !$email || !$telephone || !$specificField) {
        mailJsonError('Tous les champs obligatoires sont requis.', 400);
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        mailJsonError('Adresse email invalide.', 400);
    }

    if (!in_array($type, ['collaborateur', 'formateur'], true)) {
        mailJsonError('Type de candidature invalide.', 400);
    }

    if ($rgpdConsent !== '1' && strtolower($rgpdConsent) !== 'on' && strtolower($rgpdConsent) !== 'true') {
        mailJsonError('Le consentement RGPD est obligatoire.', 400);
    }

    $cvFile = $_FILES['cv'] ?? null;
    if (!$cvFile || !is_array($cvFile)) {
        mailJsonError('Le CV est obligatoire.', 400);
    }

    $cvSaved = saveCareerUpload($cvFile, $sid, 'cv', true);
    $lmSaved = null;
    $lmFile = $_FILES['cover_letter'] ?? null;
    if ($lmFile && is_array($lmFile) && ($lmFile['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) {
        $lmSaved = saveCareerUpload($lmFile, $sid, 'lm', false);
    }

    $consentAt = date('Y-m-d H:i:s');
    $applicationId = null;

    $resolvedOfferId = resolveCareerApplicationOfferId($pdo, $sid, $offerId, $offerSlug, $type);

    if ($resolvedOfferId !== null) {
        $meta = [
            'application_type' => $type,
            'contract_or_expertise' => $specificField,
        ];
        if ($lmSaved) {
            $meta['cover_letter_filename'] = $lmSaved['relative'];
        }

        $applicationId = insertCareerExternalApplication($pdo, [
            'offre_id' => $resolvedOfferId,
            'site_id' => $sid,
            'prenom' => $prenom,
            'nom' => $nom,
            'email' => $email,
            'telephone' => $telephone,
            'lettre_motivation' => $message !== '' ? $message : null,
            'rgpd_consent_at' => $consentAt,
            'cv_filename' => $cvSaved['relative'],
            'competences_reponses' => json_encode($meta, JSON_UNESCAPED_UNICODE),
        ]);
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
        <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;">' . htmlEscape($specificField) . '</td></tr>'
        . ($offerTitle !== '' ? '
    <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#718096;font-size:13px;">Offre visée</td>
        <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;">' . htmlEscape($offerTitle) . '</td></tr>' : '')
        . ($applicationId ? '
    <tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;color:#718096;font-size:13px;">Réf. BDD</td>
        <td style="padding:10px 0;border-bottom:1px solid #e2e8f0;">#' . $applicationId . '</td></tr>' : '') . '
  </table>
  ' . ($message !== '' ? '
  <div style="margin-top:24px;">
    <p style="font-weight:700;margin-bottom:8px;color:#1e2f47;">Lettre de motivation :</p>
    <div style="background:#f8fafc;padding:16px;border-radius:6px;white-space:pre-wrap;line-height:1.6;">' . htmlEscape($message) . '</div>
  </div>' : '') . '
  <p style="margin-top:16px;font-size:13px;color:#718096;">CV joint' . ($lmSaved ? ' + lettre de motivation en pièce jointe' : '') . '.</p>
</div>';

    $mail = createMailer();
    $mail->addAddress(mailRecipient());
    $mail->addReplyTo($email, "$prenom $nom");
    $mail->addAttachment($cvSaved['absolute'], $cvSaved['original']);
    if ($lmSaved) {
        $mail->addAttachment($lmSaved['absolute'], $lmSaved['original']);
    }
    $mail->isHTML(true);
    $mail->Subject = "[CANDIDATURE] $typeLabel – $prenom $nom" . ($offerTitle ? " ($offerTitle)" : '');
    $mail->Body = $html;
    $mail->AltBody = "Candidature $typeLabel\n$prenom $nom <$email>\nTél: $telephone\n$fieldLabel: $specificField\n\n$message";
    $mail->send();

    sendCareerConfirmationEmail($email, $prenom, $nom, $offerTitle, $typeLabel);

    apiJsonResponse([
        'ok' => true,
        'success' => true,
        'application_id' => $applicationId,
    ]);
} catch (InvalidArgumentException $e) {
    mailJsonError($e->getMessage(), 400);
} catch (MailException $e) {
    apiServerError($e, ['endpoint' => basename(__FILE__), 'mail_error' => isset($mail) ? $mail->ErrorInfo : null]);
} catch (Throwable $e) {
    apiServerError($e, ['endpoint' => basename(__FILE__)]);
}
