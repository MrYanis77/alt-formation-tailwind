<?php
/**
 * alternance.php — Page Alternance (refactorisée)
 *
 * Version refactorisée de alt_rh.php utilisant l'architecture partagée du site :
 *   - includes/config.php  : constantes globales
 *   - includes/header.php  : <head> + navbar + breadcrumb
 *   - includes/footer.php  : section contact + footer + </body></html>
 *
 * Sections de la page :
 *   1) Hero banner "Alternance"
 *   2) "Pourquoi l'alternance ?" — 3 bénéfices clés
 *   3) Catalogue des titres RNCP — généré dynamiquement
 *   4) "Comment intégrer nos formations ?" — 4 étapes numérotées
 *
 * @package AltFormationsRH
 */

require_once __DIR__ . '/../includes/config.php';

// ---------------------------------------------------------------------------
// META DE LA PAGE
// ---------------------------------------------------------------------------
$pageTitle  = 'Alternance — ' . SITE_NAME;
$pageCSS    = BASE_URL . '/assets/css/pages/alternance.css';
$breadcrumb = [
    ['label' => 'Accueil',   'url' => BASE_URL],
    ['label' => 'Alternance','url' => ''],
];

require_once INCLUDES_PATH . '/header.php';

// ---------------------------------------------------------------------------
// DONNÉES : FORMATIONS EN ALTERNANCE (Titres RNCP)
// ---------------------------------------------------------------------------
/**
 * Liste des formations disponibles en alternance.
 * Chaque entrée contient :
 *   'titre'  — Intitulé complet de la formation
 *   'code'   — Code RNCP officiel
 *   'duree'  — Durée totale de la formation
 *   'rythme' — Alternance centre/entreprise
 *
 * @var array $formations
 */
$formations = [
    [
        'titre'  => 'Manager de Projet Digital (Bac+5)',
        'code'   => 'Code RNCP : RNCP37893',
        'duree'  => '18 à 24 mois',
        'rythme' => '1 semaine en formation / 3 semaines en entreprise',
    ],
    [
        'titre'  => 'Expert en Cybersécurité (Bac+5)',
        'code'   => 'Code RNCP : RNCP35584',
        'duree'  => '24 mois',
        'rythme' => '2 jours en formation / 3 jours en entreprise',
    ],
    [
        'titre'  => 'Responsable Ressources Humaines (Bac+5)',
        'code'   => 'Code RNCP : RNCP35488',
        'duree'  => '12 à 24 mois',
        'rythme' => '1 semaine en formation / 3 semaines en entreprise',
    ],
    [
        'titre'  => 'Chef de Projet Marketing Digital (Bac+3)',
        'code'   => 'Code RNCP : RNCP36202',
        'duree'  => '12 mois',
        'rythme' => '2 jours en formation / 3 jours en entreprise',
    ],
];

// ---------------------------------------------------------------------------
// DONNÉES : ÉTAPES D'INTÉGRATION
// ---------------------------------------------------------------------------
/**
 * Les 4 étapes pour intégrer une formation en alternance.
 * @var array $steps
 */
$steps = [
    ['num' => '1', 'titre' => 'Candidature', 'desc' => 'Déposez votre dossier en ligne'],
    ['num' => '2', 'titre' => 'Entretien',   'desc' => 'Échangez avec nos conseillers'],
    ['num' => '3', 'titre' => 'Recherche',   'desc' => 'Nous vous aidons à trouver votre entreprise'],
    ['num' => '4', 'titre' => 'Démarrage',   'desc' => 'Commencez votre parcours'],
];
?>

<!-- =========================================================
     HERO BANNER
     ========================================================= -->
<section class="hero" aria-label="Bandeau Alternance">
    <div class="hero-content">
        <h1>Alternance</h1>
        <p>Conjuguez théorie et pratique avec nos formations en alternance reconnues par l'État.</p>
    </div>
</section>


<!-- =========================================================
     SECTION : POURQUOI L'ALTERNANCE ?
     ========================================================= -->
<section class="section-why" aria-labelledby="why-title">
    <h2 class="section-title" id="why-title">Pourquoi l'alternance ?</h2>
    <div class="benefits-grid">
        <div class="benefit-card">
            <h3>Rémunération</h3>
            <p>Percevez un salaire pendant votre formation, de 43% à 100% du SMIC selon votre âge et votre niveau.</p>
        </div>
        <div class="benefit-card">
            <h3>Expérience</h3>
            <p>Acquérez une expérience professionnelle concrète et valorisable sur votre CV.</p>
        </div>
        <div class="benefit-card">
            <h3>Employabilité</h3>
            <p>85% de nos alternants sont embauchés en CDI dans les 6 mois suivant leur diplôme.</p>
        </div>
    </div>
</section>


<!-- =========================================================
     SECTION : CATALOGUE DES TITRES RNCP
     ========================================================= -->
<section class="section-catalogue-rncp" aria-labelledby="rncp-title">
    <h2 class="section-title" id="rncp-title">Catalogue des titres RNCP</h2>
    <div class="formation-list-rncp">

        <?php
        /**
         * Génération dynamique des cards RNCP.
         * @var array $f Formation courante
         */
        foreach ($formations as $f):
        ?>
        <article class="formation-card-rncp">
            <div class="formation-info">
                <h3><?= htmlspecialchars($f['titre']) ?></h3>
                <div class="formation-code"><?= htmlspecialchars($f['code']) ?></div>
                <div class="formation-meta">
                    <span><strong>Durée :</strong> <?= htmlspecialchars($f['duree']) ?></span>
                    <span><strong>Rythme :</strong> <?= htmlspecialchars($f['rythme']) ?></span>
                </div>
            </div>
            <a href="#contact" class="btn-postuler">Postuler</a>
        </article>

        <?php endforeach; ?>

    </div>
</section>


<!-- =========================================================
     SECTION : COMMENT INTÉGRER NOS FORMATIONS ?
     ========================================================= -->
<section class="section-steps" aria-labelledby="steps-title">
    <h2 class="section-title" id="steps-title">Comment intégrer nos formations ?</h2>
    <div class="steps-grid">

        <?php foreach ($steps as $step): ?>
        <div class="step-item">
            <div class="step-number" aria-hidden="true"><?= htmlspecialchars($step['num']) ?></div>
            <h4><?= htmlspecialchars($step['titre']) ?></h4>
            <p><?= htmlspecialchars($step['desc']) ?></p>
        </div>
        <?php endforeach; ?>

    </div>
</section>


<?php require_once INCLUDES_PATH . '/footer.php'; ?>
