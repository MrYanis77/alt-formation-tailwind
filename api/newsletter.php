<?php
error_reporting(E_ALL);
ini_set('display_errors', 0);

require_once __DIR__ . '/site.php';
require_once __DIR__ . '/helpers.php';
require_once __DIR__ . '/security.php';

try {
    require_once __DIR__ . '/db.php';
    require_once __DIR__ . '/mailer.php';

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(['error' => 'Method Not Allowed'], JSON_UNESCAPED_UNICODE);
        exit;
    }

    enforceRateLimit('newsletter', 6, 900);

    $input = readJsonBody();
    rejectHoneypot($input);
    $email = filter_var(trim((string)($input['email'] ?? '')), FILTER_VALIDATE_EMAIL);

    if (!$email) {
        http_response_code(400);
        echo json_encode([
            'error' => 'Invalid email',
            'message' => 'Adresse email invalide.',
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if (empty($input['consent'])) {
        http_response_code(400);
        echo json_encode([
            'error' => 'Consent required',
            'message' => 'Veuillez accepter de recevoir la newsletter.',
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $firstName = trim((string)($input['first_name'] ?? ''));
    $lastName = trim((string)($input['last_name'] ?? ''));
    $ip = clientIp();

    $stmtList = $pdo->prepare('
        SELECT id, name
        FROM newsletter_lists
        WHERE site_id = :site_id AND slug = :slug AND is_active = 1
        LIMIT 1
    ');
    $stmtList->execute(['site_id' => SITE_ID, 'slug' => NEWSLETTER_LIST_SLUG]);
    $list = $stmtList->fetch(PDO::FETCH_ASSOC);

    if (!$list) {
        http_response_code(500);
        echo json_encode([
            'error' => 'List not found',
            'message' => 'Liste newsletter indisponible.',
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    $listId = (int)$list['id'];
    $alreadySubscribed = false;

    $pdo->beginTransaction();

    $stmtSub = $pdo->prepare('
        SELECT id, status, first_name, last_name
        FROM newsletter_subscribers
        WHERE site_id = :site_id AND email = :email
        LIMIT 1
    ');
    $stmtSub->execute(['site_id' => SITE_ID, 'email' => $email]);
    $subscriber = $stmtSub->fetch(PDO::FETCH_ASSOC);

    if ($subscriber) {
        $subscriberId = (int)$subscriber['id'];
        $alreadySubscribed = $subscriber['status'] === 'active';

        $stmtUpdate = $pdo->prepare('
            UPDATE newsletter_subscribers
            SET status = "active",
                first_name = COALESCE(NULLIF(:first_name, ""), first_name),
                last_name = COALESCE(NULLIF(:last_name, ""), last_name),
                rgpd_consent_at = NOW(),
                rgpd_consent_ip = :ip,
                unsubscribed_at = NULL,
                updated_at = NOW()
            WHERE id = :id
        ');
        $stmtUpdate->execute([
            'first_name' => $firstName,
            'last_name' => $lastName,
            'ip' => $ip,
            'id' => $subscriberId,
        ]);
    } else {
        $stmtInsert = $pdo->prepare('
            INSERT INTO newsletter_subscribers (
                site_id, email, first_name, last_name, status,
                rgpd_consent_at, rgpd_consent_ip, source
            ) VALUES (
                :site_id, :email, :first_name, :last_name, "active",
                NOW(), :ip, "form"
            )
        ');
        $stmtInsert->execute([
            'site_id' => SITE_ID,
            'email' => $email,
            'first_name' => $firstName !== '' ? $firstName : null,
            'last_name' => $lastName !== '' ? $lastName : null,
            'ip' => $ip,
        ]);
        $subscriberId = (int)$pdo->lastInsertId();
    }

    $stmtLink = $pdo->prepare('
        SELECT subscriber_id
        FROM newsletter_subscriptions
        WHERE subscriber_id = :subscriber_id AND list_id = :list_id
        LIMIT 1
    ');
    $stmtLink->execute([
        'subscriber_id' => $subscriberId,
        'list_id' => $listId,
    ]);
    $link = $stmtLink->fetch(PDO::FETCH_ASSOC);

    if ($link) {
        $pdo->prepare('
            UPDATE newsletter_subscriptions
            SET unsubscribed_at = NULL
            WHERE subscriber_id = :subscriber_id AND list_id = :list_id
        ')->execute([
            'subscriber_id' => $subscriberId,
            'list_id' => $listId,
        ]);
    } else {
        $pdo->prepare('
            INSERT INTO newsletter_subscriptions (subscriber_id, list_id)
            VALUES (:subscriber_id, :list_id)
        ')->execute([
            'subscriber_id' => $subscriberId,
            'list_id' => $listId,
        ]);
    }

    logGdprConsent($pdo, $email, 'newsletter', $subscriberId);

    $pdo->commit();

    notifyNewsletterSignup([
        'email' => $email,
        'first_name' => $firstName,
        'last_name' => $lastName,
    ]);

    echo json_encode([
        'success' => true,
        'already_subscribed' => $alreadySubscribed,
        'message' => $alreadySubscribed
            ? 'Vous Ãªtes dÃ©jÃ  inscrit Ã  notre newsletter.'
            : 'Merci ! Vous Ãªtes inscrit Ã  la newsletter Alt Formation.',
    ], JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    if (isset($pdo) && $pdo->inTransaction()) {
        $pdo->rollBack();
    }

    http_response_code(500);
    echo json_encode([
        'error' => 'Internal Server Error',
        'message' => apiErrorMessage($e),
    ], JSON_UNESCAPED_UNICODE);
}
