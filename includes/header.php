<?php
/**
 * header.php — En-tête HTML commun à toutes les pages
 *
 * Ce fichier génère :
 *   1) La balise <head> avec meta, title, fonts et CSS
 *   2) La barre de navigation sticky
 *   3) Le fil d'Ariane (breadcrumb)
 *
 * VARIABLES ATTENDUES (à définir AVANT d'inclure ce fichier) :
 * ---------------------------------------------------------------------------
 *   @var string $pageTitle   Titre de l'onglet, ex: "Formations - ALT FORMATIONS-RH"
 *   @var string $pageCSS     Chemin URL vers la feuille CSS spécifique à la page,
 *                            ex: BASE_URL . '/assets/css/pages/formations.css'
 *                            Laisser '' si aucune CSS spécifique.
 *   @var array  $breadcrumb  Tableau de paires ['label' => '...', 'url' => '...']
 *                            Le dernier élément est considéré comme la page active.
 *                            ex: [['label'=>'Accueil','url'=> BASE_URL],
 *                                 ['label'=>'Formations','url'=>'']]
 * ---------------------------------------------------------------------------
 *
 * USAGE TYPE depuis une page dans pages/ :
 * ---------------------------------------------------------------------------
 *   <?php
 *   require_once __DIR__ . '/../includes/config.php';
 *   $pageTitle  = 'Formations - ' . SITE_NAME;
 *   $pageCSS    = BASE_URL . '/assets/css/pages/formations.css';
 *   $breadcrumb = [
 *       ['label' => 'Accueil',    'url' => BASE_URL],
 *       ['label' => 'Formations', 'url' => ''],
 *   ];
 *   require_once INCLUDES_PATH . '/header.php';
 *   ?>
 *
 * @package AltFormationsRH
 */

// Sécurité : s'assurer que config.php a bien été chargé avant l'inclusion
if (!defined('BASE_URL')) {
    die('Erreur : config.php doit être inclus avant header.php');
}

// Valeurs par défaut si les variables ne sont pas définies
$pageTitle  = $pageTitle  ?? SITE_NAME;
$pageCSS    = $pageCSS    ?? '';
$breadcrumb = $breadcrumb ?? [['label' => 'Accueil', 'url' => BASE_URL]];

// Détermination de la page active pour surligner le lien nav correspondant
// On compare la dernière partie de l'URL courante avec chaque lien nav
$currentPage = basename($_SERVER['PHP_SELF'], '.php'); // ex: "formations"
?>
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="<?= SITE_SLOGAN ?>">

    <title><?= htmlspecialchars($pageTitle) ?></title>

    <!-- Google Fonts : Montserrat (titres) + Open Sans (corps de texte) -->
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&family=Open+Sans:wght@400;600&display=swap"
          rel="stylesheet">

    <!-- Feuille de styles globale (nav, footer, hero, contact, responsive) -->
    <link rel="stylesheet" href="<?= BASE_URL ?>/assets/css/main.css">

    <?php if (!empty($pageCSS)): ?>
    <!-- Feuille de styles spécifique à cette page -->
    <link rel="stylesheet" href="<?= htmlspecialchars($pageCSS) ?>">
    <?php endif; ?>
</head>
<body>

<!-- =========================================================
     NAVIGATION — Barre de navigation sticky commune
     ========================================================= -->
<nav role="navigation" aria-label="Navigation principale">

    <!-- Logo / identité de marque -->
    <a href="<?= BASE_URL ?>" class="nav-logo" aria-label="Retour à l'accueil">
        <?= SITE_NAME ?>
    </a>

    <!-- Liens de navigation principaux -->
    <ul class="nav-links" role="menubar">
        <?php
        /**
         * Tableau de navigation : chaque entrée définit
         *   'label' — Texte affiché
         *   'href'  — URL de destination
         *   'slug'  — Identifiant court pour détecter la page active
         */
        $navItems = [
            ['label' => 'Formations',  'href' => BASE_URL . '/pages/formations.php',  'slug' => 'formations'],
            ['label' => 'Alternance',  'href' => BASE_URL . '/pages/alternance.php',  'slug' => 'alternance'],
            ['label' => 'E-learning',  'href' => BASE_URL . '/pages/e-learning.php',  'slug' => 'e-learning'],
            ['label' => 'Financements','href' => BASE_URL . '/pages/financements.php','slug' => 'financements'],
            ['label' => 'Entreprise',  'href' => BASE_URL . '/pages/entreprise.php',  'slug' => 'entreprise'],
            ['label' => 'À propos',    'href' => BASE_URL . '/pages/a-propos.php',    'slug' => 'a-propos'],
            ['label' => 'Blog',        'href' => BASE_URL . '/pages/blog.php',         'slug' => 'blog'],
            ['label' => 'Contact',     'href' => BASE_URL . '/pages/contact.php',      'slug' => 'contact'],
        ];

        foreach ($navItems as $item):
            // On marque le lien actif si le slug correspond à la page courante
            $isActive = ($currentPage === $item['slug']) ? ' aria-current="page" class="active"' : '';
        ?>
        <li role="none">
            <a href="<?= htmlspecialchars($item['href']) ?>"
               role="menuitem"<?= $isActive ?>>
                <?= htmlspecialchars($item['label']) ?>
            </a>
        </li>
        <?php endforeach; ?>

        <!-- Bouton CTA "S'inscrire" mis en valeur -->
        <li role="none">
            <a href="<?= BASE_URL ?>/pages/inscription.php"
               class="btn-subscribe"
               role="menuitem">
                S'inscrire
            </a>
        </li>
    </ul><!-- /.nav-links -->

</nav><!-- /nav -->

<!-- =========================================================
     FIL D'ARIANE (Breadcrumb) — Aide à la navigation et SEO
     ========================================================= -->
<nav class="breadcrumb" aria-label="Fil d'ariane">
    <?php
    $lastIndex = count($breadcrumb) - 1;
    foreach ($breadcrumb as $index => $crumb):
        $isLast = ($index === $lastIndex);
    ?>
        <?php if ($isLast): ?>
            <!-- Page courante : non cliquable, mise en orange -->
            <span aria-current="page"><?= htmlspecialchars($crumb['label']) ?></span>
        <?php else: ?>
            <a href="<?= htmlspecialchars($crumb['url']) ?>">
                <?= htmlspecialchars($crumb['label']) ?>
            </a>
            <span class="breadcrumb-sep" aria-hidden="true"> &rsaquo; </span>
        <?php endif; ?>
    <?php endforeach; ?>
</nav><!-- /.breadcrumb -->
