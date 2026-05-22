-- =============================================================================
-- Alt RH Formations — Schéma fusionné (back-office sécurisé + site public legacy)
-- Encodage : utf8mb4 | Collation : utf8mb4_unicode_ci
-- Ordre : 1) tables back-office du script sécurisé  2) tables site (schema.sql)
--          3) ALTER chat_messages pour les réponses admin (admin_users)
-- Exécution : mysql -u root -p < schema-merged.sql
-- Base par défaut : alt_formations_db (modifiable ci-dessous et dans .env DB_NAME)
-- =============================================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";
SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS alt_formations_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE alt_formations_db;

-- =============================================================================
-- PARTIE A — Back-office (admin, FAQ normalisée, blog, newsletter, chatbot…)
-- =============================================================================

CREATE TABLE IF NOT EXISTS `admin_users` (
  `id`              INT UNSIGNED     NOT NULL AUTO_INCREMENT,
  `username`        VARCHAR(60)      NOT NULL,
  `email`           VARCHAR(180)     NOT NULL,
  `password_hash`   VARCHAR(255)     NOT NULL,
  `role`            ENUM('superadmin','admin','editor') NOT NULL DEFAULT 'editor',
  `is_active`       TINYINT(1)       NOT NULL DEFAULT 1,
  `last_login`      DATETIME         DEFAULT NULL,
  `created_at`      DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME         NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_username` (`username`),
  UNIQUE KEY `uq_email`    (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `admin_users` (`username`, `email`, `password_hash`, `role`)
VALUES (
  'superadmin',
  'admin@altformations.fr',
  '$2y$12$eImiTXuWVxfM37uY4JANjOe5XpSQnMTpLF4rMkWgN5VkFHqH7BKQC',
  'superadmin'
);

CREATE TABLE IF NOT EXISTS `admin_sessions` (
  `id`           INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `admin_id`     INT UNSIGNED  NOT NULL,
  `token`        VARCHAR(128)  NOT NULL,
  `ip_address`   VARCHAR(45)   DEFAULT NULL,
  `user_agent`   VARCHAR(512)  DEFAULT NULL,
  `expires_at`   DATETIME      NOT NULL,
  `created_at`   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_token` (`token`),
  KEY `fk_session_admin` (`admin_id`),
  CONSTRAINT `fk_session_admin`
    FOREIGN KEY (`admin_id`) REFERENCES `admin_users` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `audit_logs` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `admin_id`    INT UNSIGNED    DEFAULT NULL,
  `action`      VARCHAR(100)    NOT NULL,
  `table_name`  VARCHAR(60)     DEFAULT NULL,
  `record_id`   INT UNSIGNED    DEFAULT NULL,
  `old_value`   JSON            DEFAULT NULL,
  `new_value`   JSON            DEFAULT NULL,
  `ip_address`  VARCHAR(45)     DEFAULT NULL,
  `created_at`  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_audit_admin` (`admin_id`),
  KEY `idx_audit_table` (`table_name`, `record_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `faq_categories` (
  `id`         INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `slug`       VARCHAR(80)   NOT NULL,
  `label`      VARCHAR(120)  NOT NULL,
  `sort_order` SMALLINT      NOT NULL DEFAULT 0,
  `is_active`  TINYINT(1)    NOT NULL DEFAULT 1,
  `created_at` DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_faq_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `faq_items` (
  `id`          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `category_id` INT UNSIGNED  NOT NULL,
  `question`    TEXT          NOT NULL,
  `answer`      LONGTEXT      NOT NULL,
  `sort_order`  SMALLINT      NOT NULL DEFAULT 0,
  `is_active`   TINYINT(1)    NOT NULL DEFAULT 1,
  `created_by`  INT UNSIGNED  DEFAULT NULL,
  `updated_by`  INT UNSIGNED  DEFAULT NULL,
  `created_at`  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_faq_category` (`category_id`),
  KEY `fk_faq_created`  (`created_by`),
  CONSTRAINT `fk_faq_category`
    FOREIGN KEY (`category_id`) REFERENCES `faq_categories` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_faq_created`
    FOREIGN KEY (`created_by`) REFERENCES `admin_users` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `faq_categories` (`slug`, `label`, `sort_order`) VALUES
('formations',    'Nos Formations',                        1),
('financement',   'Financement & Prise en charge',         2),
('recrutement',   'Nous rejoindre (Formateur & Collaborateur)', 3),
('entreprise',    'L\'Entreprise : Alt RH Formations',        4),
('bilan',         'Bilan de Compétences & Coaching',       5),
('alternance',    'Alternance',                            6),
('blog',          'Blog',                                  7),
('contact',       'Contact',                               8),
('campus',        'Campus & Lieux',                        9),
('certification', 'Certification & Diplômes',              10),
('ia',            'Ressources & Formations IA',            11);

INSERT IGNORE INTO `faq_items` (`category_id`, `question`, `answer`, `sort_order`) VALUES
(1, 'Quels sont les formats d\'apprentissage proposés ?',
 'Nous proposons plusieurs modalités : en présentiel dans nos locaux, en distanciel (classes virtuelles), et en e-learning à votre propre rythme.', 1),
(1, 'Vos formations sont-elles diplômantes ?',
 'La grande majorité de nos formations préparent à des Titres Professionnels (TP) reconnus par l\'État et enregistrés au RNCP.', 2),
(2, 'Vos formations sont-elles éligibles au CPF ?',
 'Oui, la majorité de nos formations certifiantes sont éligibles au CPF. Vous pouvez utiliser vos droits sur moncompteformation.gouv.fr.', 1),
(4, 'Êtes-vous un organisme certifié ?',
 'Oui, Alt RH Formations est certifié Qualiopi au titre des actions de formation.', 1);

CREATE TABLE IF NOT EXISTS `blog_categories` (
  `id`         INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `slug`       VARCHAR(80)   NOT NULL,
  `label`      VARCHAR(120)  NOT NULL,
  `sort_order` SMALLINT      NOT NULL DEFAULT 0,
  `is_active`  TINYINT(1)    NOT NULL DEFAULT 1,
  `created_at` DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_blog_cat_slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `blog_categories` (`slug`, `label`, `sort_order`) VALUES
('tous',           'Tous',           0),
('cybersecurite',  'Cybersécurité',  1),
('financement',    'Financement',    2),
('formations',     'Formations',     3),
('management',     'Management',     4),
('conseils',       'Conseils',       5),
('digital',        'Digital',        6);

CREATE TABLE IF NOT EXISTS `blog_posts` (
  `id`           INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `category_id`  INT UNSIGNED  NOT NULL,
  `slug`         VARCHAR(220)  NOT NULL,
  `title`        VARCHAR(255)  NOT NULL,
  `excerpt`      TEXT          DEFAULT NULL,
  `content`      LONGTEXT      DEFAULT NULL,
  `image_url`    VARCHAR(512)  DEFAULT NULL,
  `author`       VARCHAR(120)  NOT NULL DEFAULT 'Équipe Alt RH Formations',
  `status`       ENUM('draft','published','archived') NOT NULL DEFAULT 'draft',
  `published_at` DATETIME      DEFAULT NULL,
  `views`        INT UNSIGNED  NOT NULL DEFAULT 0,
  `created_by`   INT UNSIGNED  DEFAULT NULL,
  `updated_by`   INT UNSIGNED  DEFAULT NULL,
  `created_at`   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_post_slug` (`slug`),
  KEY `fk_post_category` (`category_id`),
  KEY `idx_post_status`  (`status`, `published_at`),
  CONSTRAINT `fk_post_category`
    FOREIGN KEY (`category_id`) REFERENCES `blog_categories` (`id`)
    ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `blog_posts`
  (`category_id`, `slug`, `title`, `excerpt`, `author`, `status`, `published_at`)
VALUES
(2, 'metiers-cybersecurite-2026',
 'Les métiers de la cybersécurité en 2026 : perspectives et opportunités',
 'Découvrez les tendances du marché de la cybersécurité et les compétences les plus recherchées.',
 'Sophie Martin', 'published', '2026-03-15 08:00:00'),
(3, 'financement-reconversion-2026',
 'Comment financer sa reconversion professionnelle en 2026 ?',
 'Le point complet sur les dispositifs CPF, OPCO et aides régionales disponibles.',
 'Jean Dupont', 'published', '2026-03-10 08:00:00');

CREATE TABLE IF NOT EXISTS `newsletter_subscribers` (
  `id`                       INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `email`                    VARCHAR(180)  NOT NULL,
  `first_name`               VARCHAR(80)   DEFAULT NULL,
  `last_name`                VARCHAR(80)   DEFAULT NULL,
  `is_confirmed`             TINYINT(1)    NOT NULL DEFAULT 0,
  `confirm_token`            VARCHAR(128)  DEFAULT NULL,
  `confirm_token_expires_at` DATETIME DEFAULT NULL,
  `unsubscribe_token`        VARCHAR(128) NOT NULL DEFAULT '',
  `source`                   ENUM('site','import','admin') NOT NULL DEFAULT 'site',
  `subscribed_at`            DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `confirmed_at`             DATETIME      DEFAULT NULL,
  `unsubscribed_at`          DATETIME      DEFAULT NULL,
  `ip_address`               VARCHAR(45)   DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_subscriber_email`      (`email`),
  UNIQUE KEY `uq_unsubscribe_token`     (`unsubscribe_token`),
  KEY `idx_subscriber_confirmed`        (`is_confirmed`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `newsletter_lists` (
  `id`          INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `name`        VARCHAR(120)  NOT NULL,
  `description` TEXT          DEFAULT NULL,
  `is_active`   TINYINT(1)    NOT NULL DEFAULT 1,
  `created_by`  INT UNSIGNED  DEFAULT NULL,
  `created_at`  DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  CONSTRAINT `fk_nlist_admin`
    FOREIGN KEY (`created_by`) REFERENCES `admin_users` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT IGNORE INTO `newsletter_lists` (`name`, `description`) VALUES
('Tous les abonnés',      'Liste principale — tous les inscrits confirmés'),
('Apprenants actifs',     'Personnes en cours de formation'),
('Prospects formation',   'Visiteurs ayant téléchargé une brochure ou demandé un RDV'),
('Entreprises & RH',      'Contacts DRH / responsables formation');

CREATE TABLE IF NOT EXISTS `newsletter_subscriber_lists` (
  `subscriber_id` INT UNSIGNED NOT NULL,
  `list_id`       INT UNSIGNED NOT NULL,
  `added_at`      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`subscriber_id`, `list_id`),
  CONSTRAINT `fk_nsl_subscriber`
    FOREIGN KEY (`subscriber_id`) REFERENCES `newsletter_subscribers` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_nsl_list`
    FOREIGN KEY (`list_id`) REFERENCES `newsletter_lists` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `newsletter_campaigns` (
  `id`            INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `list_id`       INT UNSIGNED  DEFAULT NULL,
  `subject`       VARCHAR(255)  NOT NULL,
  `preview_text`  VARCHAR(255)  DEFAULT NULL,
  `body_html`     LONGTEXT      DEFAULT NULL,
  `body_text`     LONGTEXT      DEFAULT NULL,
  `from_name`     VARCHAR(120)  NOT NULL DEFAULT 'Alt RH Formations',
  `from_email`    VARCHAR(180)  NOT NULL DEFAULT 'contact@altformations.fr',
  `status`        ENUM('draft','scheduled','sending','sent','cancelled') NOT NULL DEFAULT 'draft',
  `scheduled_at`  DATETIME      DEFAULT NULL,
  `sent_at`       DATETIME      DEFAULT NULL,
  `total_sent`    INT UNSIGNED  NOT NULL DEFAULT 0,
  `total_opened`  INT UNSIGNED  NOT NULL DEFAULT 0,
  `total_clicked` INT UNSIGNED  NOT NULL DEFAULT 0,
  `created_by`    INT UNSIGNED  DEFAULT NULL,
  `updated_by`    INT UNSIGNED  DEFAULT NULL,
  `created_at`    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_camp_list`  (`list_id`),
  KEY `idx_camp_status` (`status`),
  CONSTRAINT `fk_camp_list`
    FOREIGN KEY (`list_id`) REFERENCES `newsletter_lists` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `fk_camp_creator`
    FOREIGN KEY (`created_by`) REFERENCES `admin_users` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `newsletter_sends` (
  `id`            BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `campaign_id`   INT UNSIGNED    NOT NULL,
  `subscriber_id` INT UNSIGNED    NOT NULL,
  `tracking_token` VARCHAR(128)   NOT NULL,
  `sent_at`       DATETIME        DEFAULT NULL,
  `opened_at`     DATETIME        DEFAULT NULL,
  `open_count`    SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `clicked_at`    DATETIME        DEFAULT NULL,
  `click_count`   SMALLINT UNSIGNED NOT NULL DEFAULT 0,
  `bounced`       TINYINT(1)      NOT NULL DEFAULT 0,
  `bounce_type`   ENUM('hard','soft') DEFAULT NULL,
  `unsubscribed`  TINYINT(1)      NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_send_token`       (`tracking_token`),
  UNIQUE KEY `uq_send_camp_sub`    (`campaign_id`, `subscriber_id`),
  KEY `fk_send_subscriber`         (`subscriber_id`),
  CONSTRAINT `fk_send_campaign`
    FOREIGN KEY (`campaign_id`) REFERENCES `newsletter_campaigns` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_send_subscriber`
    FOREIGN KEY (`subscriber_id`) REFERENCES `newsletter_subscribers` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `newsletter_link_clicks` (
  `id`          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `send_id`     BIGINT UNSIGNED NOT NULL,
  `url`         VARCHAR(2048)   NOT NULL,
  `clicked_at`  DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ip_address`  VARCHAR(45)     DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_click_send` (`send_id`),
  CONSTRAINT `fk_click_send`
    FOREIGN KEY (`send_id`) REFERENCES `newsletter_sends` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE OR REPLACE VIEW `v_campaign_stats` AS
  SELECT
    c.id                                        AS campaign_id,
    c.subject,
    c.status,
    c.sent_at,
    COUNT(s.id)                                 AS total_sent,
    SUM(s.open_count  > 0)                      AS unique_opens,
    SUM(s.click_count > 0)                      AS unique_clicks,
    SUM(s.bounced)                              AS total_bounces,
    SUM(s.unsubscribed)                         AS total_unsubs,
    ROUND(SUM(s.open_count  > 0) * 100.0 / NULLIF(COUNT(s.id), 0), 2) AS open_rate_pct,
    ROUND(SUM(s.click_count > 0) * 100.0 / NULLIF(COUNT(s.id), 0), 2) AS click_rate_pct
  FROM `newsletter_campaigns` c
  LEFT JOIN `newsletter_sends` s ON s.campaign_id = c.id
  GROUP BY c.id;

CREATE TABLE IF NOT EXISTS `chatbot_conversations` (
  `id`           BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `session_id`   VARCHAR(128)    NOT NULL,
  `user_name`    VARCHAR(120)    DEFAULT NULL,
  `user_email`   VARCHAR(180)    DEFAULT NULL,
  `status`       ENUM('open','closed','transferred') NOT NULL DEFAULT 'open',
  `handled_by`   INT UNSIGNED    DEFAULT NULL,
  `created_at`   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`   DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_chat_session` (`session_id`),
  KEY `fk_chat_admin`    (`handled_by`),
  CONSTRAINT `fk_chat_admin`
    FOREIGN KEY (`handled_by`) REFERENCES `admin_users` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `chatbot_messages` (
  `id`              BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `conversation_id` BIGINT UNSIGNED NOT NULL,
  `sender`          ENUM('user','bot','admin') NOT NULL,
  `message`         TEXT            NOT NULL,
  `faq_item_id`     INT UNSIGNED    DEFAULT NULL,
  `created_at`      DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_msg_conversation` (`conversation_id`),
  KEY `fk_msg_faq`          (`faq_item_id`),
  CONSTRAINT `fk_msg_conversation`
    FOREIGN KEY (`conversation_id`) REFERENCES `chatbot_conversations` (`id`)
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_msg_faq`
    FOREIGN KEY (`faq_item_id`) REFERENCES `faq_items` (`id`)
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `login_attempts` (
  `id`           INT UNSIGNED  NOT NULL AUTO_INCREMENT,
  `ip_address`   VARCHAR(45)   NOT NULL,
  `username`     VARCHAR(60)   DEFAULT NULL,
  `success`      TINYINT(1)    NOT NULL DEFAULT 0,
  `attempted_at` DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_login_ip`   (`ip_address`, `attempted_at`),
  KEY `idx_login_user` (`username`,   `attempted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE OR REPLACE VIEW `v_published_posts` AS
  SELECT
    p.id,
    p.slug,
    p.title,
    p.excerpt,
    p.image_url,
    p.author,
    p.published_at,
    p.views,
    c.slug  AS category_slug,
    c.label AS category_label
  FROM `blog_posts`      p
  JOIN `blog_categories` c ON c.id = p.category_id
  WHERE p.status = 'published'
  ORDER BY p.published_at DESC;

DELIMITER $$

DROP PROCEDURE IF EXISTS `clean_expired_sessions`$$
CREATE PROCEDURE `clean_expired_sessions`()
BEGIN
  DELETE FROM `admin_sessions` WHERE expires_at < NOW();
  UPDATE `newsletter_subscribers`
     SET `confirm_token` = NULL, `confirm_token_expires_at` = NULL
   WHERE `is_confirmed` = 0
     AND `confirm_token_expires_at` < NOW();
END$$

DROP PROCEDURE IF EXISTS `confirm_newsletter_subscriber`$$
CREATE PROCEDURE `confirm_newsletter_subscriber`(
  IN  p_token   VARCHAR(128),
  OUT p_result  VARCHAR(20)
)
BEGIN
  DECLARE v_id INT UNSIGNED;
  DECLARE v_expires DATETIME;

  SELECT id, confirm_token_expires_at INTO v_id, v_expires
    FROM `newsletter_subscribers`
   WHERE confirm_token = p_token AND is_confirmed = 0
   LIMIT 1;

  IF v_id IS NULL THEN
    SET p_result = 'not_found';
  ELSEIF v_expires < NOW() THEN
    SET p_result = 'expired';
  ELSE
    UPDATE `newsletter_subscribers`
       SET is_confirmed  = 1,
           confirmed_at  = NOW(),
           confirm_token = NULL,
           confirm_token_expires_at = NULL
     WHERE id = v_id;
    SET p_result = 'ok';
  END IF;
END$$

DROP PROCEDURE IF EXISTS `is_ip_blocked`$$
CREATE PROCEDURE `is_ip_blocked`(
  IN  p_ip        VARCHAR(45),
  OUT p_blocked   TINYINT
)
BEGIN
  DECLARE attempt_count INT;
  SELECT COUNT(*) INTO attempt_count
  FROM `login_attempts`
  WHERE ip_address = p_ip
    AND success    = 0
    AND attempted_at >= DATE_SUB(NOW(), INTERVAL 15 MINUTE);

  SET p_blocked = IF(attempt_count >= 5, 1, 0);
END$$

DELIMITER ;

-- =============================================================================
-- PARTIE B — Site public (inchangé par rapport à schema.sql)
-- =============================================================================

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  prenom VARCHAR(50) NOT NULL,
  nom VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  telephone VARCHAR(20) DEFAULT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') NOT NULL DEFAULT 'user',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_users_email (email),
  INDEX idx_users_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  token VARCHAR(64) NOT NULL UNIQUE,
  expires_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_sessions_token (token),
  INDEX idx_sessions_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT DEFAULT NULL,
  nom VARCHAR(50) NOT NULL,
  prenom VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL,
  telephone VARCHAR(20) DEFAULT NULL,
  sujet VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  status ENUM('pending', 'read', 'replied') NOT NULL DEFAULT 'pending',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_contacts_status (status),
  INDEX idx_contacts_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS faq_requests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  question TEXT NOT NULL,
  admin_response TEXT DEFAULT NULL,
  status ENUM('pending', 'replied', 'published') NOT NULL DEFAULT 'pending',
  published_question TEXT DEFAULT NULL,
  published_response TEXT DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  replied_at DATETIME DEFAULT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_faqreq_status (status),
  INDEX idx_faqreq_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS chat_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  contact_id INT DEFAULT NULL,
  faq_request_id INT DEFAULT NULL,
  sender_id INT DEFAULT NULL,
  admin_sender_id INT UNSIGNED DEFAULT NULL,
  sender_role ENUM('user', 'admin') NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
  FOREIGN KEY (faq_request_id) REFERENCES faq_requests(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_chat_admin_sender FOREIGN KEY (admin_sender_id) REFERENCES admin_users(id) ON DELETE SET NULL,
  INDEX idx_chat_contact (contact_id),
  INDEX idx_chat_faqreq (faq_request_id),
  INDEX idx_chat_sender (sender_id),
  INDEX idx_chat_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS faq (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question TEXT NOT NULL,
  reponse TEXT NOT NULL,
  categorie VARCHAR(100) NOT NULL DEFAULT 'Général',
  ordre INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_faq_categorie (categorie),
  INDEX idx_faq_ordre (ordre)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS page_visits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  page VARCHAR(255) NOT NULL,
  ip_hash VARCHAR(64) NOT NULL,
  user_agent VARCHAR(500) DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_visits_page (page),
  INDEX idx_visits_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================================================
-- PARTIE C — Mise à niveau chat_messages si base créée avec l’ancien schema.sql
-- =============================================================================

SET @sql_cm_null_sender := (
  SELECT IF(
    EXISTS (
      SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'chat_messages'
        AND COLUMN_NAME = 'sender_id'
        AND IS_NULLABLE = 'NO'
    ),
    'ALTER TABLE chat_messages MODIFY sender_id INT NULL',
    'SELECT 1'
  )
);
PREPARE stmt_cm FROM @sql_cm_null_sender;
EXECUTE stmt_cm;
DEALLOCATE PREPARE stmt_cm;

SET @sql_cm_admin_col := (
  SELECT IF(
    EXISTS (
      SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'chat_messages'
        AND COLUMN_NAME = 'admin_sender_id'
    ),
    'SELECT 1',
    'ALTER TABLE chat_messages ADD COLUMN admin_sender_id INT UNSIGNED DEFAULT NULL AFTER sender_id'
  )
);
PREPARE stmt_cm2 FROM @sql_cm_admin_col;
EXECUTE stmt_cm2;
DEALLOCATE PREPARE stmt_cm2;

SET @fk_chat_admin_exists := (
  SELECT COUNT(*) FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
  WHERE CONSTRAINT_SCHEMA = DATABASE()
    AND TABLE_NAME = 'chat_messages'
    AND CONSTRAINT_NAME = 'fk_chat_admin_sender'
);
SET @sql_chat_fk := IF(
  @fk_chat_admin_exists = 0,
  'ALTER TABLE chat_messages ADD CONSTRAINT fk_chat_admin_sender FOREIGN KEY (admin_sender_id) REFERENCES admin_users(id) ON DELETE SET NULL',
  'SELECT 1'
);
PREPARE stmt_fk_chat FROM @sql_chat_fk;
EXECUTE stmt_fk_chat;
DEALLOCATE PREPARE stmt_fk_chat;
