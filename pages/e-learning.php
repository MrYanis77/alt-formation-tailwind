<?php
/**
 * e-learning.php — Page Plateforme E-learning
 *
 * Présente la plateforme d'apprentissage en ligne d'ALT FORMATIONS-RH :
 *   - Hero banner "E-learning"
 *   - Grille 2×2 des fonctionnalités clés (feature cards)
 *   - Section Statistiques (+200 / 92% / 4.8/5)
 *   - CTA "Prêt à démarrer votre apprentissage ?"
 *   - Formulaire de contact (commun, via footer.php)
 *   - Footer (commun, via footer.php)
 *
 * Dépendances :
 *   - includes/config.php        : constantes globales
 *   - includes/header.php        : <head> + navbar + breadcrumb
 *   - includes/footer.php        : section contact + footer + </body></html>
 *   - assets/css/main.css        : styles globaux
 *   - assets/css/pages/e-learning.css : styles spécifiques
 *
 * @package AltFormationsRH
 */

require_once __DIR__ . '/../includes/config.php';

// ---------------------------------------------------------------------------
// META DE LA PAGE — Variables consommées par header.php
// ---------------------------------------------------------------------------

/** @var string $pageTitle Titre affiché dans l'onglet du navigateur */
$pageTitle = 'E-learning — ' . SITE_NAME;

/** @var string $pageCSS URL vers la feuille de styles spécifique à cette page */
$pageCSS = BASE_URL . '/assets/css/pages/e-learning.css';

/**
 * @var array $breadcrumb Fil d'Ariane
 */
$breadcrumb = [
    ['label' => 'Accueil',   'url' => BASE_URL],
    ['label' => 'E-learning','url' => ''],
];

require_once INCLUDES_PATH . '/header.php';

// ---------------------------------------------------------------------------
// DONNÉES : FONCTIONNALITÉS DE LA PLATEFORME (Grille 2×2)
// ---------------------------------------------------------------------------
/**
 * Chaque feature card contient :
 *   'titre'       — Titre de la fonctionnalité
 *   'description' — Texte d'introduction
 *   'items'       — Liste de points détaillés (bullets)
 *
 * @var array $features
 */
$features = [
    [
        'titre'       => 'Accessible 24/7',
        'description' => 'Apprenez où vous voulez, quand vous voulez, depuis n\'importe quel appareil',
        'items'       => [
            'Interface intuitive et responsive',
            'Application mobile iOS et Android',
            'Mode hors ligne disponible',
        ],
    ],
    [
        'titre'       => 'Contenus interactifs',
        'description' => 'Des ressources pédagogiques variées pour un apprentissage optimal',
        'items'       => [
            'Vidéos HD avec formateurs experts',
            'Quiz et exercices pratiques',
            'Études de cas réels',
        ],
    ],
    [
        'titre'       => 'Suivi personnalisé',
        'description' => 'Un accompagnement individualisé tout au long de votre parcours',
        'items'       => [
            'Tableau de bord de progression',
            'Tutorat en ligne avec formateurs',
            'Feedback personnalisé sur vos travaux',
        ],
    ],
    [
        'titre'       => 'Certifications',
        'description' => 'Validez vos acquis avec des certifications reconnues',
        'items'       => [
            'Badges de compétences',
            'Certificats de réussite',
            'Attestations téléchargeables',
        ],
    ],
];

// ---------------------------------------------------------------------------
// DONNÉES : STATISTIQUES CLÉS
// ---------------------------------------------------------------------------
/**
 * Chiffres clés affichés dans la section statistiques.
 * Chaque stat contient :
 *   'value' — Valeur affichée en grand (orange)
 *   'label' — Libellé descriptif sous le chiffre
 *
 * @var array $stats
 */
$stats = [
    ['value' => '+200',  'label' => 'Heures de contenu vidéo'],
    ['value' => '92%',   'label' => 'Taux de complétion'],
    ['value' => '4.8/5', 'label' => 'Satisfaction apprenants'],
];
?>

<!-- =========================================================
     HERO BANNER — "E-learning"
     ========================================================= -->
<section class="hero" aria-label="Bandeau E-learning">
    <div class="hero-content">
        <h1>E-learning</h1>
        <p>Formez-vous à votre rythme avec notre plateforme d'apprentissage en ligne</p>
    </div>
</section>


<!-- =========================================================
     SECTION : NOTRE PLATEFORME E-LEARNING
     Titre centré + grille 2×2 de feature cards
     ========================================================= -->
<main class="section-platform" id="main-content">

    <h2 class="section-title">Notre plateforme e-learning</h2>

    <!-- Grille 2×2 des fonctionnalités -->
    <div class="features-grid">

        <?php
        /**
         * On itère sur chaque fonctionnalité pour générer une card.
         * @var array $feature Fonctionnalité courante
         */
        foreach ($features as $feature):
        ?>
        <article class="feature-card">

            <!-- Titre de la fonctionnalité -->
            <h3><?= htmlspecialchars($feature['titre']) ?></h3>

            <!-- Description introductive -->
            <p><?= htmlspecialchars($feature['description']) ?></p>

            <!-- Liste des points détaillés -->
            <ul>
                <?php foreach ($feature['items'] as $item): ?>
                <li><?= htmlspecialchars($item) ?></li>
                <?php endforeach; ?>
            </ul>

        </article><!-- /.feature-card -->

        <?php endforeach; // fin boucle features ?>

    </div><!-- /.features-grid -->

</main><!-- /.section-platform -->


<!-- =========================================================
     SECTION : STATISTIQUES CLÉS
     Trois chiffres forts en large format orange
     ========================================================= -->
<section class="section-stats" aria-label="Chiffres clés de la plateforme">
    <div class="stats-row">

        <?php
        /**
         * Affichage dynamique des statistiques.
         * @var array $stat Statistique courante ['value', 'label']
         */
        foreach ($stats as $stat):
        ?>
        <div class="stat-item">
            <!-- Valeur numérique en orange (impact visuel fort) -->
            <span class="stat-value"><?= htmlspecialchars($stat['value']) ?></span>
            <!-- Libellé descriptif -->
            <span class="stat-label"><?= htmlspecialchars($stat['label']) ?></span>
        </div>

        <?php endforeach; // fin boucle stats ?>

    </div><!-- /.stats-row -->
</section><!-- /.section-stats -->


<!-- =========================================================
     SECTION CTA — "Prêt à démarrer votre apprentissage ?"
     ========================================================= -->
<section class="section-cta-elearning" aria-labelledby="cta-elearning-title">
    <h2 class="section-title" id="cta-elearning-title">Prêt à démarrer votre apprentissage&nbsp;?</h2>
    <p>Découvrez nos modules e-learning et commencez dès aujourd'hui</p>
    <a href="#" class="btn-primary">Accéder à la plateforme</a>
</section>


<?php
// Inclusion du pied de page commun (section contact + footer + </body></html>)
require_once INCLUDES_PATH . '/footer.php';
?>
