<?php
declare(strict_types=1);

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/vendor/autoload.php';

const DEFAULT_CONTACT_ADDRESS = 'contact@nexytal.com';
const DEFAULT_MAIL_SENDER_NAME = 'Alt Formation';
const DEFAULT_ALT_FORMATION_URL = 'https://alt-formation.fr';

if (!defined('SMTP_HOST')) {
    define('SMTP_HOST', env('SMTP_HOST', 'smtp.ionos.fr') ?? 'smtp.ionos.fr');
    define('SMTP_PORT', (int)(env('SMTP_PORT', '465') ?? '465'));
    define('SMTP_SECURE', env('SMTP_ENCRYPTION', 'ssl') ?? 'ssl');
    define('SMTP_USER', env('SMTP_USER', env('MAIL_FROM', DEFAULT_CONTACT_ADDRESS)) ?? DEFAULT_CONTACT_ADDRESS);
    define('SMTP_PASS', env('SMTP_PASSWORD', env('SMTP_PASS', '')) ?? '');
    define('SMTP_FROM_NAME', env('MAIL_FROM_NAME', DEFAULT_MAIL_SENDER_NAME) ?? DEFAULT_MAIL_SENDER_NAME);
    define('MAIL_RECIPIENT', env('MAIL_TO', env('CONTACT_EMAIL', DEFAULT_CONTACT_ADDRESS)) ?? DEFAULT_CONTACT_ADDRESS);
}

use PHPMailer\PHPMailer\Exception as MailException;
use PHPMailer\PHPMailer\PHPMailer;

/** @var string|null */
$GLOBALS['_last_mail_error'] = null;

function lastMailError(): ?string
{
    return $GLOBALS['_last_mail_error'] ?? null;
}

function configuredMailValue(array $envKeys, ?string $constantName = null, ?string $fallback = null): ?string
{
    foreach ($envKeys as $envKey) {
        $value = env($envKey);
        if ($value !== null && $value !== '') {
            return $value;
        }
    }

    if ($constantName !== null && defined($constantName)) {
        return (string)constant($constantName);
    }

    return $fallback;
}

function smtpDiagnostics(): array
{
    bootstrapEnv();

    return [
        'host' => env('SMTP_HOST'),
        'port' => env('SMTP_PORT', '465'),
        'encryption' => env('SMTP_ENCRYPTION', 'ssl'),
        'user' => env('SMTP_USER', env('MAIL_FROM')),
        'password_set' => (env('SMTP_PASSWORD', env('SMTP_PASS', '')) ?? '') !== '',
        'from' => env('MAIL_FROM'),
        'from_name' => env('MAIL_FROM_NAME'),
        'mail_to' => env('MAIL_TO', env('CONTACT_EMAIL')),
        'site_url' => env('SITE_URL'),
    ];
}

function contactEmail(): string
{
    return configuredMailValue(['CONTACT_EMAIL'], 'MAIL_RECIPIENT', DEFAULT_CONTACT_ADDRESS) ?? DEFAULT_CONTACT_ADDRESS;
}

function mailFromAddress(): string
{
    return configuredMailValue(['MAIL_FROM'], 'SMTP_USER', contactEmail()) ?? contactEmail();
}

function mailFromName(): string
{
    return configuredMailValue(['MAIL_FROM_NAME'], 'SMTP_FROM_NAME', DEFAULT_MAIL_SENDER_NAME) ?? DEFAULT_MAIL_SENDER_NAME;
}

function escapeHtml(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function sendSiteMail(
    string $subject,
    string $htmlBody,
    string $textBody,
    ?string $replyToEmail = null,
    ?string $replyToName = null
): bool {
    return sendDirectMail(contactEmail(), $subject, $htmlBody, $textBody, $replyToEmail, $replyToName);
}

function sendDirectMail(
    string $toEmail,
    string $subject,
    string $htmlBody,
    string $textBody,
    ?string $replyToEmail = null,
    ?string $replyToName = null
): bool {
    if ($toEmail === '') {
        return false;
    }

    $mail = new PHPMailer(true);
    $GLOBALS['_last_mail_error'] = null;

    try {
        bootstrapEnv();

        $smtpHost = configuredMailValue(['SMTP_HOST'], 'SMTP_HOST');
        $smtpUser = configuredMailValue(['SMTP_USER', 'MAIL_FROM'], 'SMTP_USER');
        $smtpPass = configuredMailValue(['SMTP_PASSWORD', 'SMTP_PASS'], 'SMTP_PASS', '');
        $smtpPort = (int)configuredMailValue(['SMTP_PORT'], 'SMTP_PORT', '465');
        $secure = strtolower(configuredMailValue(['SMTP_ENCRYPTION'], 'SMTP_SECURE', 'ssl') ?? 'ssl');

        if ($smtpHost && $smtpUser && $smtpPass !== '') {
            $mail->isSMTP();
            $mail->Host = $smtpHost;
            $mail->SMTPAuth = true;
            $mail->Username = $smtpUser;
            $mail->Password = $smtpPass;
            $mail->Port = $smtpPort;
            $mail->AuthType = 'LOGIN';

            if ($secure === 'ssl') {
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
            } elseif ($secure === 'tls') {
                $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            }

            $mail->SMTPOptions = [
                'ssl' => [
                    'verify_peer' => true,
                    'verify_peer_name' => true,
                    'allow_self_signed' => false,
                ],
            ];
        } else {
            $mail->isMail();
        }

        $fromAddress = $smtpUser ?: mailFromAddress();
        $mail->CharSet = 'UTF-8';
        $mail->setFrom($fromAddress, mailFromName());
        $mail->addAddress($toEmail);

        if ($replyToEmail) {
            $mail->addReplyTo($replyToEmail, $replyToName ?? '');
        }

        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body = $htmlBody;
        $mail->AltBody = $textBody;

        $mail->send();
        return true;
    } catch (MailException $e) {
        $GLOBALS['_last_mail_error'] = $mail->ErrorInfo ?: $e->getMessage();
        error_log('PHPMailer: ' . $GLOBALS['_last_mail_error']);
        return false;
    }
}

function notifyContactRequest(array $data): bool
{
    $name = trim(($data['prenom'] ?? '') . ' ' . ($data['nom'] ?? ''));
    $email = (string)($data['email'] ?? '');
    $subject = '[Alt Formation] Nouvelle demande de contact';

    $rows = [
        'Profil' => $data['profil'] ?? '',
        'Besoins' => is_array($data['besoins'] ?? null)
            ? implode(', ', $data['besoins'])
            : (string)($data['besoins'] ?? ''),
        'PrÃ©nom' => $data['prenom'] ?? '',
        'Nom' => $data['nom'] ?? '',
        'Email' => $email,
        'TÃ©lÃ©phone' => $data['telephone'] ?? '',
        'Entreprise' => $data['entreprise'] ?? '',
        'Fonction' => $data['fonction'] ?? '',
        'CrÃ©neau' => $data['slot_label'] ?? ($data['creneau'] ?? ''),
        'Message' => $data['message'] ?? '',
    ];

    $html = '<h2>Nouvelle demande de contact</h2><table cellpadding="6" cellspacing="0" border="0">';
    $text = "Nouvelle demande de contact\n\n";

    foreach ($rows as $label => $value) {
        if ($value === '' || $value === null) {
            continue;
        }
        $html .= '<tr><td><strong>' . escapeHtml($label) . '</strong></td><td>' . nl2br(escapeHtml((string)$value)) . '</td></tr>';
        $text .= $label . ': ' . $value . "\n";
    }

    $html .= '</table>';

    return sendSiteMail($subject, $html, $text, $email, $name);
}

function notifyDiagnosticRequest(array $data): bool
{
    $name = trim(($data['prenom'] ?? '') . ' ' . ($data['nom'] ?? ''));
    $email = (string)($data['email'] ?? '');
    $subject = '[Alt Formation] Nouveau diagnostic offert';

    $rows = [
        'PrÃ©nom' => $data['prenom'] ?? '',
        'Nom' => $data['nom'] ?? '',
        'Email' => $email,
        'TÃ©lÃ©phone' => $data['telephone'] ?? '',
        'Profil' => $data['profil'] ?? '',
        'CrÃ©neau' => $data['slot_label'] ?? '',
    ];

    $html = '<h2>Nouvelle rÃ©servation diagnostic</h2><table cellpadding="6" cellspacing="0" border="0">';
    $text = "Nouvelle rÃ©servation diagnostic\n\n";

    foreach ($rows as $label => $value) {
        if ($value === '' || $value === null) {
            continue;
        }
        $html .= '<tr><td><strong>' . escapeHtml($label) . '</strong></td><td>' . nl2br(escapeHtml((string)$value)) . '</td></tr>';
        $text .= $label . ': ' . $value . "\n";
    }

    $html .= '</table>';

    return sendSiteMail($subject, $html, $text, $email, $name);
}

function notifyNewsletterSignup(array $data): bool
{
    $email = (string)($data['email'] ?? '');
    $name = trim(($data['first_name'] ?? '') . ' ' . ($data['last_name'] ?? ''));
    $subject = '[Alt Formation] Nouvelle inscription newsletter';

    $html = '<h2>Nouvelle inscription newsletter</h2>'
        . '<p><strong>Email :</strong> ' . escapeHtml($email) . '</p>';

    if ($name !== '') {
        $html .= '<p><strong>Nom :</strong> ' . escapeHtml($name) . '</p>';
    }

    $text = "Nouvelle inscription newsletter\nEmail: {$email}\n";
    if ($name !== '') {
        $text .= "Nom: {$name}\n";
    }

    return sendSiteMail($subject, $html, $text, $email, $name !== '' ? $name : null);
}

function notifyCoachApplication(array $data): bool
{
    $name = trim(($data['first_name'] ?? '') . ' ' . ($data['last_name'] ?? ''));
    $email = (string)($data['email'] ?? '');
    $subject = '[Alt Formation] Nouvelle candidature formateur/coach';

    $rows = [
        'PrÃ©nom' => $data['first_name'] ?? '',
        'Nom' => $data['last_name'] ?? '',
        'Email' => $email,
        'TÃ©lÃ©phone' => $data['phone'] ?? '',
        'Titre' => $data['title'] ?? '',
        'Accroche' => $data['tagline'] ?? '',
        'Ville' => $data['city'] ?? '',
        'ExpÃ©rience (ans)' => $data['experience_years'] ?? '',
        'TJM (â‚¬)' => $data['tjm_eur'] ?? '',
        'Statut juridique' => $data['legal_status'] ?? '',
        'Ã‰ligible Qualiopi' => $data['qualiopi_eligible'] ?? '',
        'Expertises' => $data['expertises'] ?? ($data['specialties'] ?? ''),
        'CompÃ©tences' => $data['skills'] ?? '',
        'Certifications' => $data['certifications'] ?? '',
        'Langues' => $data['languages'] ?? '',
        'ModalitÃ©s' => $data['modalities'] ?? '',
        'LinkedIn' => $data['linkedin'] ?? '',
        'Bio' => $data['bio'] ?? '',
        'Slug proposÃ©' => $data['slug'] ?? '',
        'Statut' => 'pending_review',
    ];

    $html = '<h2>Nouvelle candidature formateur / coach</h2><table cellpadding="6" cellspacing="0" border="0">';
    $text = "Nouvelle candidature formateur / coach\n\n";

    foreach ($rows as $label => $value) {
        if ($value === '' || $value === null) {
            continue;
        }
        $html .= '<tr><td><strong>' . escapeHtml($label) . '</strong></td><td>' . nl2br(escapeHtml((string)$value)) . '</td></tr>';
        $text .= $label . ': ' . $value . "\n";
    }

    $html .= '</table>';

    return sendSiteMail($subject, $html, $text, $email, $name);
}

function notifyTrainerApplication(array $data): bool
{
    return notifyCoachApplication($data);
}

function notifySessionBooking(array $data): void
{
    $clientName = trim((string)($data['client_name'] ?? ''));
    $clientEmail = trim((string)($data['client_email'] ?? ''));
    $coachName = trim((string)($data['trainer_name'] ?? $data['coach_name'] ?? ''));
    $coachEmail = trim((string)($data['trainer_email'] ?? $data['coach_email'] ?? ''));
    $slotLabel = trim((string)($data['slot_label'] ?? ''));
    $type = trim((string)($data['type'] ?? 'session'));
    $typeLabel = $type === 'diagnostic' ? 'Diagnostic offert' : 'Rendez-vous formation';
    $notes = trim((string)($data['notes'] ?? ''));

    $rows = [
        'Type' => $typeLabel,
        'CrÃ©neau' => $slotLabel,
        'Client' => $clientName,
        'Email client' => $clientEmail,
        'Formateur' => $coachName,
        'Notes' => $notes,
    ];

    $html = '<h2>' . escapeHtml($typeLabel) . ' confirmÃ©</h2><table cellpadding="6" cellspacing="0" border="0">';
    $text = $typeLabel . " confirmÃ©\n\n";
    foreach ($rows as $label => $value) {
        if ($value === '') {
            continue;
        }
        $html .= '<tr><td><strong>' . escapeHtml($label) . '</strong></td><td>' . nl2br(escapeHtml($value)) . '</td></tr>';
        $text .= $label . ': ' . $value . "\n";
    }
    $html .= '</table>';

    if ($clientEmail !== '') {
        $clientSubject = '[Alt Formation] Confirmation â€” ' . $slotLabel;
        $clientHtml = '<p>Bonjour ' . escapeHtml($clientName !== '' ? $clientName : '') . ',</p>'
            . '<p>Votre ' . escapeHtml(strtolower($typeLabel)) . ' est confirmÃ© :</p>'
            . $html
            . '<p>Ã€ bientÃ´t,<br>L\'Ã©quipe Alt Formation</p>';
        $clientText = "Bonjour {$clientName},\n\nVotre rendez-vous est confirmÃ© :\n\n{$text}\nÃ€ bientÃ´t,\nL'Ã©quipe Alt Formation";
        sendDirectMail($clientEmail, $clientSubject, $clientHtml, $clientText);
    }

    if ($coachEmail !== '') {
        $coachSubject = '[Alt Formation] Nouveau rendez-vous â€” ' . $slotLabel;
        $coachHtml = '<p>Bonjour ' . escapeHtml($coachName !== '' ? $coachName : '') . ',</p>'
            . '<p>Un client a rÃ©servÃ© un crÃ©neau avec vous :</p>'
            . $html
            . '<p>Consultez votre espace formateur pour le dÃ©tail.</p>';
        $coachText = "Bonjour {$coachName},\n\nUn client a rÃ©servÃ© un crÃ©neau :\n\n{$text}";
        sendDirectMail($coachEmail, $coachSubject, $coachHtml, $coachText);
    }

    sendSiteMail(
        '[Alt Formation] Nouvelle rÃ©servation â€” ' . $slotLabel,
        $html,
        $text,
        $clientEmail !== '' ? $clientEmail : null,
        $clientName !== '' ? $clientName : null
    );
}

function notifyPasswordReset(string $email, string $resetUrl, string $roleLabel): bool
{
    $siteUrl = rtrim(env('SITE_URL', DEFAULT_ALT_FORMATION_URL) ?? DEFAULT_ALT_FORMATION_URL, '/');
    $logoUrl = $siteUrl . '/assets/logo.png';
    $subject = '[Alt Formation] RÃ©initialisation de votre mot de passe';
    $html = '<div style="text-align: center; margin-bottom: 20px;">'
        . '<img src="' . escapeHtml($logoUrl) . '" alt="Alt Formation" height="40" style="display: block; margin: 0 auto;">'
        . '</div>'
        . '<p>Bonjour,</p>'
        . '<p>Vous avez demandÃ© la rÃ©initialisation de votre mot de passe pour votre espace '
        . escapeHtml($roleLabel) . '.</p>'
        . '<p><a href="' . escapeHtml($resetUrl) . '" style="display: inline-block; padding: 10px 20px; background: #0f172a; color: white; text-decoration: none; border-radius: 5px;">RÃ©initialiser mon mot de passe</a></p>'
        . '<p>Ce lien expire dans 1 heure. Si vous n\'Ãªtes pas Ã  l\'origine de cette demande, ignorez cet email.</p>';
    $text = "RÃ©initialisation mot de passe Alt Formation\n\n"
        . "Ouvrez ce lien (valide 1 h) :\n{$resetUrl}\n";

    return sendDirectMail($email, $subject, $html, $text);
}

function notifyTrainerRegistrationPending(array $data): void
{
    $email = trim((string)($data['email'] ?? ''));
    if ($email === '') {
        return;
    }

    $name = trim(($data['first_name'] ?? '') . ' ' . ($data['last_name'] ?? ''));
    $subject = '[Alt Formation] Inscription reÃ§ue â€” validation en cours';

    $html = '<p>Bonjour' . ($name !== '' ? ' ' . escapeHtml($name) : '') . ',</p>'
        . '<p>Nous avons bien reÃ§u votre inscription en tant que <strong>formateur</strong> sur Alt Formation.</p>'
        . '<p><strong>Votre profil est en cours de validation</strong> par notre Ã©quipe. '
        . 'Le dÃ©lai moyen de traitement est de 5 jours ouvrÃ©s.</p>'
        . '<p>DÃ¨s que votre profil sera validÃ©, vous pourrez vous connecter Ã  votre espace formateur '
        . 'avec l\'email <strong>' . escapeHtml($email) . '</strong> et le mot de passe que vous avez choisi.</p>'
        . '<p>Ã€ bientÃ´t,<br>L\'Ã©quipe Alt Formation</p>';

    $text = "Bonjour{$name},\n\n"
        . "Nous avons bien reÃ§u votre inscription formateur sur Alt Formation.\n\n"
        . "Votre profil est en cours de validation (dÃ©lai moyen : 5 jours ouvrÃ©s).\n"
        . "Vous pourrez vous connecter dÃ¨s son activation avec l'email {$email}.\n\n"
        . "Ã€ bientÃ´t,\nL'Ã©quipe Alt Formation";

    sendDirectMail($email, $subject, $html, $text);
    notifyCoachApplication(array_merge($data, [
        'specialties' => $data['specialties'] ?? $data['expertises'] ?? '',
        'bio' => $data['bio'] ?? '',
    ]));
}

function notifyTrainerAccountActivated(array $data): void
{
    $email = trim((string)($data['email'] ?? ''));
    if ($email === '') {
        return;
    }

    $name = trim(($data['first_name'] ?? '') . ' ' . ($data['last_name'] ?? ''));
    $loginUrl = rtrim(env('SITE_URL', DEFAULT_ALT_FORMATION_URL) ?? DEFAULT_ALT_FORMATION_URL, '/')
        . '/espace/connexion?role=trainer';
    $subject = '[Alt Formation] Votre espace formateur est activÃ©';

    $html = '<p>Bonjour' . ($name !== '' ? ' ' . escapeHtml($name) : '') . ',</p>'
        . '<p>Votre espace formateur Alt Formation est maintenant <strong>actif</strong>.</p>'
        . '<p><a href="' . escapeHtml($loginUrl) . '">Se connecter Ã  mon espace</a></p>'
        . '<p>Ã€ bientÃ´t,<br>L\'Ã©quipe Alt Formation</p>';

    $text = "Bonjour{$name},\n\nVotre espace formateur est actif.\nConnectez-vous : {$loginUrl}\n";

    sendDirectMail($email, $subject, $html, $text);
}

function notifyTrainerApplicationReceived(array $data): void
{
    $email = trim((string)($data['email'] ?? ''));
    if ($email === '') {
        notifyCoachApplication($data);
        return;
    }

    $name = trim(($data['first_name'] ?? '') . ' ' . ($data['last_name'] ?? ''));
    $subject = '[Alt Formation] Candidature reÃ§ue â€” validation en cours';

    $html = '<p>Bonjour' . ($name !== '' ? ' ' . escapeHtml($name) : '') . ',</p>'
        . '<p>Nous avons bien reÃ§u votre candidature pour rejoindre le rÃ©seau Alt Formation.</p>'
        . '<p>Notre Ã©quipe examinera votre profil sous 5 jours ouvrÃ©s. '
        . 'Une fois validÃ©, vous pourrez crÃ©er votre espace formateur avec cet email.</p>'
        . '<p>Ã€ bientÃ´t,<br>L\'Ã©quipe Alt Formation</p>';

    $text = "Bonjour{$name},\n\nCandidature reÃ§ue. Validation sous 5 jours ouvrÃ©s.\n";

    sendDirectMail($email, $subject, $html, $text);
    notifyCoachApplication($data);
}

function notifyPortalAccountDeleted(array $data): void
{
    $email = trim((string)($data['email'] ?? ''));
    if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return;
    }

    $name = trim((string)($data['name'] ?? ''));
    $role = (string)($data['role'] ?? 'client');
    $roleLabel = $role === 'trainer' ? 'formateur' : 'client';
    $subject = '[Alt Formation] Confirmation de suppression de votre compte ' . $roleLabel;

    $html = '<p>Bonjour' . ($name !== '' ? ' ' . escapeHtml($name) : '') . ',</p>'
        . '<p>Nous confirmons la <strong>suppression dÃ©finitive</strong> de votre compte '
        . escapeHtml($roleLabel) . ' sur Alt Formation.</p>'
        . '<p>Vos donnÃ©es personnelles associÃ©es Ã  cet espace ont Ã©tÃ© anonymisÃ©es ou dÃ©sactivÃ©es '
        . 'conformÃ©ment Ã  notre politique de confidentialitÃ©.</p>'
        . '<p>Si vous n\'Ãªtes pas Ã  l\'origine de cette demande, contactez-nous immÃ©diatement Ã  '
        . escapeHtml(contactEmail()) . '.</p>'
        . '<p>Cordialement,<br>L\'Ã©quipe Alt Formation</p>';

    $text = "Bonjour{$name},\n\n"
        . "Confirmation de suppression de votre compte {$roleLabel} sur Alt Formation.\n"
        . "Vos donnÃ©es ont Ã©tÃ© anonymisÃ©es ou dÃ©sactivÃ©es.\n\n"
        . "Cordialement,\nL'Ã©quipe Alt Formation";

    sendDirectMail($email, $subject, $html, $text);
}

function notifyAdminPortalAccountDeleted(array $data): bool
{
    $email = trim((string)($data['email'] ?? ''));
    $name = trim((string)($data['name'] ?? ''));
    $role = (string)($data['role'] ?? 'client');
    $roleLabel = $role === 'trainer' ? 'formateur' : 'client';
    $subject = '[Alt Formation] Compte ' . $roleLabel . ' supprimÃ©';

    $rows = [
        'Profil' => $roleLabel,
        'Nom' => $name,
        'Email' => $email,
        'Date' => date('d/m/Y H:i'),
        'Site' => env('SITE_URL', DEFAULT_ALT_FORMATION_URL),
    ];

    $html = '<h2>Suppression de compte portail</h2><table cellpadding="6" cellspacing="0" border="0">';
    $text = "Suppression de compte portail\n\n";

    foreach ($rows as $label => $value) {
        if ($value === '' || $value === null) {
            continue;
        }
        $html .= '<tr><td><strong>' . escapeHtml($label) . '</strong></td><td>' . escapeHtml((string)$value) . '</td></tr>';
        $text .= $label . ': ' . $value . "\n";
    }

    $html .= '</table>';

    return sendSiteMail($subject, $html, $text, $email, $name);
}
