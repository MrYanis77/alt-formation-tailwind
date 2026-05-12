-- Schema MySQL pour Alt Formations
-- Auth, contact, FAQ, chat, admin
-- À exécuter sur une base de données vide. Le script est idempotent (DROP IF EXISTS / CREATE TABLE IF NOT EXISTS).

-- ---------------------------------------------------------------------------
-- Création de la base de données (à adapter selon votre hébergeur)
-- ---------------------------------------------------------------------------
CREATE DATABASE IF NOT EXISTS alt_formations_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE alt_formations_db;

-- ---------------------------------------------------------------------------
-- Table USERS
-- ---------------------------------------------------------------------------
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

-- ---------------------------------------------------------------------------
-- Table SESSIONS
-- ---------------------------------------------------------------------------
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

-- ---------------------------------------------------------------------------
-- Table CONTACTS (messages envoyés depuis la page contact)
-- ---------------------------------------------------------------------------
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

-- ---------------------------------------------------------------------------
-- Table FAQ_REQUESTS (questions soumises par les utilisateurs)
-- ---------------------------------------------------------------------------
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

-- ---------------------------------------------------------------------------
-- Table CHAT_MESSAGES (échanges admin <-> utilisateur)
-- Une conversation est identifiée soit par contact_id, soit par faq_request_id
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS chat_messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  contact_id INT DEFAULT NULL,
  faq_request_id INT DEFAULT NULL,
  sender_id INT NOT NULL,
  sender_role ENUM('user', 'admin') NOT NULL,
  message TEXT NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE CASCADE,
  FOREIGN KEY (faq_request_id) REFERENCES faq_requests(id) ON DELETE CASCADE,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_chat_contact (contact_id),
  INDEX idx_chat_faqreq (faq_request_id),
  INDEX idx_chat_sender (sender_id),
  INDEX idx_chat_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Table FAQ (FAQ publiée et affichée sur le site)
-- ---------------------------------------------------------------------------
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

-- ---------------------------------------------------------------------------
-- Table PAGE_VISITS (statistiques de visites)
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS page_visits (
  id INT AUTO_INCREMENT PRIMARY KEY,
  page VARCHAR(255) NOT NULL,
  ip_hash VARCHAR(64) NOT NULL,
  user_agent VARCHAR(500) DEFAULT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_visits_page (page),
  INDEX idx_visits_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ---------------------------------------------------------------------------
-- Compte ADMIN par défaut : utilisez le script seed à la racine
--   node src/data/backend/seed-admin.js
-- pour créer l'admin avec un mot de passe correctement hashé via bcrypt.
-- ---------------------------------------------------------------------------
