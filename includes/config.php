<?php
/**
 * config.php — Configuration globale du site ALT FORMATIONS-RH
 *
 * Ce fichier centralise toutes les constantes et paramètres globaux
 * utilisés à travers l'ensemble du site. Il doit être inclus EN PREMIER
 * dans chaque page via : require_once __DIR__ . '/config.php';
 *
 * @package    AltFormationsRH
 * @author     ALT FORMATIONS-RH
 * @version    1.0.0
 */

// ---------------------------------------------------------------------------
// 🌐 URL DE BASE
// Adapter selon l'environnement (local / production).
// Utilisé pour construire tous les liens absolus vers assets et pages.
// ---------------------------------------------------------------------------
define('BASE_URL', 'http://localhost/alt_rh');

// ---------------------------------------------------------------------------
// 📁 CHEMINS ABSOLUS (système de fichiers)
// ---------------------------------------------------------------------------
define('ROOT_PATH',     dirname(__DIR__));          // f:/wamp64/www/alt_rh
define('INCLUDES_PATH', ROOT_PATH . '/includes');
define('ASSETS_PATH',   ROOT_PATH . '/assets');
define('PAGES_PATH',    ROOT_PATH . '/pages');

// ---------------------------------------------------------------------------
// 🏢 INFORMATIONS DU SITE
// ---------------------------------------------------------------------------
define('SITE_NAME',     'ALT FORMATIONS-RH');
define('SITE_SLOGAN',   '340 parcours certifiants adaptés à vos ambitions professionnelles');
define('SITE_EMAIL',    'contact@alt-formations-rh.fr');
define('SITE_PHONE',    '01 23 45 67 89');
define('SITE_YEAR',     date('Y'));

// ---------------------------------------------------------------------------
// 🎨 COULEURS (référence documentaire — la vraie source est le CSS)
// ---------------------------------------------------------------------------
/*
 * Palette principale :
 *   #1a1a2e  — Bleu nuit (navbar, entêtes de cards)
 *   #e8722a  — Orange    (boutons, accents, titres de catégories)
 *   #2c2c2c  — Gris dark (section contact)
 *   #1a1a1a  — Noir soft (footer)
 *   #f9f9f9  — Gris clair (fonds de sections alternées)
 */

// ---------------------------------------------------------------------------
// ⚠️  GESTION DES ERREURS (désactiver en production)
// ---------------------------------------------------------------------------
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
