<?php
error_reporting(E_ALL);
ini_set('display_errors', '0');

require_once __DIR__ . '/security.php';

function cleanString(?string $value, int $max = 500): string
{
    $value = trim((string)$value);
    if ($value === '') {
        return '';
    }

    return mb_substr($value, 0, $max);
}

function requireEmail(?string $value): string
{
    $email = filter_var(trim((string)$value), FILTER_VALIDATE_EMAIL);
    if (!$email) {
        throw new InvalidArgumentException('Adresse email invalide.');
    }

    return $email;
}

try {
    require_once __DIR__ . '/helpers.php';
    require_once __DIR__ . '/db.php';
    require_once __DIR__ . '/mail.php';

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['error' => 'Method Not Allowed'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    enforceRateLimit('contact', 8, 900);

    $body = readJsonBody();
    rejectHoneypot($body);

    $allowedTypes = ['contact', 'entreprise', 'formateur'];
    $type = cleanString($body['type'] ?? 'contact', 40);
    if (!in_array($type, $allowedTypes, true)) {
        throw new InvalidArgumentException('Type de formulaire inconnu.');
    }

    $site = cleanString($_SERVER['HTTP_X_SITE_ID'] ?? (defined('SITE_ID') ? (string) SITE_ID : '1'), 10);

    switch ($type) {
        case 'contact':
            $name = cleanString($body['name'] ?? '', 120);
            $email = requireEmail($body['email'] ?? '');
            $subject = safeMailSubject(cleanString($body['subject'] ?? '', 200));
            $message = cleanString($body['message'] ?? '', 5000);

            if ($name === '' || $subject === '' || $message === '') {
                throw new InvalidArgumentException('Tous les champs obligatoires doivent ÃƒÂªtre renseignÃƒÂ©s.');
            }

            sendSiteMail(
                '[Contact Alt Formation] ' . $subject,
                [
                    'Type' => 'Contact',
                    'Site ID' => $site,
                    'Nom' => $name,
                    'Email' => $email,
                    'Sujet' => $subject,
                    'Message' => $message,
                ],
                $email,
                $name
            );
            break;

        case 'entreprise':
            $company = cleanString($body['company'] ?? '', 160);
            $contact = cleanString($body['contact'] ?? '', 120);
            $email = requireEmail($body['email'] ?? '');
            $phone = cleanString($body['phone'] ?? '', 40);
            $expertise = cleanString($body['expertise'] ?? '', 120);
            $duration = cleanString($body['duration'] ?? '', 80);
            $modality = cleanString($body['modality'] ?? '', 80);
            $message = cleanString($body['message'] ?? '', 5000);

            if ($company === '' || $contact === '' || $expertise === '') {
                throw new InvalidArgumentException('Veuillez complÃƒÂ©ter les informations obligatoires.');
            }

            sendSiteMail(
                '[Demande entreprise] ' . safeMailSubject($company, 160),
                [
                    'Type' => 'Demande entreprise',
                    'Site ID' => $site,
                    'Entreprise' => $company,
                    'Contact' => $contact,
                    'Email' => $email,
                    'TÃƒÂ©lÃƒÂ©phone' => $phone,
                    'Expertise' => $expertise,
                    'DurÃƒÂ©e' => $duration,
                    'ModalitÃƒÂ©' => $modality,
                    'Besoin' => $message,
                ],
                $email,
                $contact
            );
            break;

        case 'formateur':
            $firstName = cleanString($body['firstName'] ?? '', 80);
            $lastName = cleanString($body['lastName'] ?? '', 80);
            $email = requireEmail($body['email'] ?? '');
            $phone = cleanString($body['phone'] ?? '', 40);
            $linkedin = cleanString($body['linkedin'] ?? '', 300);
            $expertise = cleanString($body['expertise'] ?? '', 160);
            $experience = cleanString($body['experience'] ?? '', 40);
            $certifications = cleanString($body['certifications'] ?? '', 300);
            $message = cleanString($body['message'] ?? '', 5000);

            if ($firstName === '' || $lastName === '' || $expertise === '' || $experience === '') {
                throw new InvalidArgumentException('Veuillez complÃƒÂ©ter les champs obligatoires.');
            }

            sendSiteMail(
                '[Candidature formateur] ' . $firstName . ' ' . $lastName,
                [
                    'Type' => 'Candidature formateur',
                    'Site ID' => $site,
                    'PrÃƒÂ©nom' => $firstName,
                    'Nom' => $lastName,
                    'Email' => $email,
                    'TÃƒÂ©lÃƒÂ©phone' => $phone,
                    'LinkedIn' => $linkedin,
                    'Expertise' => $expertise,
                    'ExpÃƒÂ©rience' => $experience,
                    'Certifications' => $certifications,
                    'PrÃƒÂ©sentation' => $message,
                ],
                $email,
                $firstName . ' ' . $lastName
            );
            break;

        default:
            throw new InvalidArgumentException('Type de formulaire inconnu.');
    }

    echo json_encode([
        'success' => true,
        'message' => 'Votre message a bien ÃƒÂ©tÃƒÂ© envoyÃƒÂ©. Nous vous rÃƒÂ©pondrons rapidement.',
    ], JSON_UNESCAPED_UNICODE);
} catch (InvalidArgumentException $e) {
    http_response_code(422);
    echo json_encode([
        'error' => 'Validation Error',
        'message' => $e->getMessage(),
    ], JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode([
        'error' => 'Internal Server Error',
        'message' => apiErrorMessage($e),
    ], JSON_UNESCAPED_UNICODE);
}
