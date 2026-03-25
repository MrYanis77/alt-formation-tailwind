<?php
/**
 * formations.php — Page Catalogue des Formations
 *
 * Affiche toutes les formations disponibles, regroupées par catégorie :
 *   - Cybersécurité
 *   - Management
 *   - Ressources Humaines
 *   - Digital & Marketing
 *
 * Chaque catégorie contient une grille de 2 colonnes de cards.
 * Chaque card comporte : une image (fond bleu placeholder), un titre,
 * une liste de points forts et un bouton "En savoir plus".
 *
 * Dépendances :
 *   - includes/config.php   : constantes globales (BASE_URL, SITE_NAME…)
 *   - includes/header.php   : <head> + navbar + breadcrumb
 *   - includes/footer.php   : section contact + footer + </body></html>
 *   - assets/css/main.css   : styles globaux
 *   - assets/css/pages/formations.css : styles spécifiques à cette page
 *
 * @package AltFormationsRH
 */

require_once __DIR__ . '/../includes/config.php';

// ---------------------------------------------------------------------------
// META DE LA PAGE — Variables consommées par header.php
// ---------------------------------------------------------------------------

/** @var string $pageTitle Titre affiché dans l'onglet du navigateur */
$pageTitle = 'Nos Formations — ' . SITE_NAME;

/** @var string $pageCSS URL vers la feuille de styles spécifique à cette page */
$pageCSS = BASE_URL . '/assets/css/pages/formations.css';

/**
 * @var array $breadcrumb Fil d'Ariane : tableau associatif ['label', 'url']
 *                        Le dernier élément est la page courante (url vide).
 */
$breadcrumb = [
    ['label' => 'Accueil',    'url' => BASE_URL],
    ['label' => 'Formations', 'url' => ''],
];

// Inclusion de l'en-tête commun (génère tout jusqu'au breadcrumb inclus)
require_once INCLUDES_PATH . '/header.php';

// ---------------------------------------------------------------------------
// DONNÉES : CATALOGUE DES FORMATIONS PAR CATÉGORIE
// ---------------------------------------------------------------------------
/**
 * Structure de données des formations.
 *
 * Chaque catégorie est un tableau associatif :
 *   'id'       — Ancre HTML pour le lien direct (ex: #cybersecurite)
 *   'label'    — Libellé affiché dans le titre de section
 *   'items'    — Tableau de formations, chacune contenant :
 *                  'titre'    : Intitulé complet de la formation
 *                  'features' : Liste de 3 points forts (tableau)
 *
 * Les images sont représentées par des fonds bleus (#2b6cb0).
 * Pour utiliser de vraies images, ajouter une clé 'img' avec le chemin relatif
 * et remplacer le style background-color par background-image dans le HTML.
 *
 * @var array $catalogue
 */
$catalogue = [

    // ------------------------------------------------------------------
    // CATÉGORIE 1 : CYBERSÉCURITÉ
    // ------------------------------------------------------------------
    [
        'id'    => 'cybersecurite',
        'label' => 'Cybersécurité',
        'items' => [
            [
                'titre'    => 'Expert en Cybersécurité (Bac+5)',
                'features' => [
                    'Certification professionnelle reconnue',
                    'Formateurs experts du secteur',
                    'Plateforme e-learning accessible 24/7',
                ],
            ],
            [
                'titre'    => 'Administrateur Systèmes & Réseaux',
                'features' => [
                    'Certification professionnelle reconnue',
                    'Formateurs experts du secteur',
                    'Plateforme e-learning accessible 24/7',
                ],
            ],
            [
                'titre'    => 'Analyste SOC',
                'features' => [
                    'Certification professionnelle reconnue',
                    'Formateurs experts du secteur',
                    'Plateforme e-learning accessible 24/7',
                ],
            ],
            [
                'titre'    => 'Pentester & Ethical Hacking',
                'features' => [
                    'Certification professionnelle reconnue',
                    'Formateurs experts du secteur',
                    'Plateforme e-learning accessible 24/7',
                ],
            ],
        ],
    ],

    // ------------------------------------------------------------------
    // CATÉGORIE 2 : MANAGEMENT
    // ------------------------------------------------------------------
    [
        'id'    => 'management',
        'label' => 'Management',
        'items' => [
            [
                'titre'    => 'Manager d\'Équipe (Bac+3)',
                'features' => [
                    'Certification professionnelle reconnue',
                    'Formateurs experts du secteur',
                    'Plateforme e-learning accessible 24/7',
                ],
            ],
            [
                'titre'    => 'Manager de Projet (Bac+5)',
                'features' => [
                    'Certification professionnelle reconnue',
                    'Formateurs experts du secteur',
                    'Plateforme e-learning accessible 24/7',
                ],
            ],
            [
                'titre'    => 'Leadership & Gestion d\'équipe',
                'features' => [
                    'Certification professionnelle reconnue',
                    'Formateurs experts du secteur',
                    'Plateforme e-learning accessible 24/7',
                ],
            ],
            [
                'titre'    => 'Management agile',
                'features' => [
                    'Certification professionnelle reconnue',
                    'Formateurs experts du secteur',
                    'Plateforme e-learning accessible 24/7',
                ],
            ],
        ],
    ],

    // ------------------------------------------------------------------
    // CATÉGORIE 3 : RESSOURCES HUMAINES
    // ------------------------------------------------------------------
    [
        'id'    => 'ressources-humaines',
        'label' => 'Ressources Humaines',
        'items' => [
            [
                'titre'    => 'Responsable RH (Bac+5)',
                'features' => [
                    'Certification professionnelle reconnue',
                    'Formateurs experts du secteur',
                    'Plateforme e-learning accessible 24/7',
                ],
            ],
            [
                'titre'    => 'Chargé de Recrutement',
                'features' => [
                    'Certification professionnelle reconnue',
                    'Formateurs experts du secteur',
                    'Plateforme e-learning accessible 24/7',
                ],
            ],
            [
                'titre'    => 'Gestionnaire de Paie',
                'features' => [
                    'Certification professionnelle reconnue',
                    'Formateurs experts du secteur',
                    'Plateforme e-learning accessible 24/7',
                ],
            ],
            [
                'titre'    => 'GPEC & Développement des compétences',
                'features' => [
                    'Certification professionnelle reconnue',
                    'Formateurs experts du secteur',
                    'Plateforme e-learning accessible 24/7',
                ],
            ],
        ],
    ],

    // ------------------------------------------------------------------
    // CATÉGORIE 4 : DIGITAL & MARKETING
    // ------------------------------------------------------------------
    [
        'id'    => 'digital',
        'label' => 'Digital & Marketing',
        'items' => [
            [
                'titre'    => 'Chef de Projet Digital',
                'features' => [
                    'Certification professionnelle reconnue',
                    'Formateurs experts du secteur',
                    'Plateforme e-learning accessible 24/7',
                ],
            ],
            [
                'titre'    => 'Community Manager',
                'features' => [
                    'Certification professionnelle reconnue',
                    'Formateurs experts du secteur',
                    'Plateforme e-learning accessible 24/7',
                ],
            ],
            [
                'titre'    => 'Traffic Manager',
                'features' => [
                    'Certification professionnelle reconnue',
                    'Formateurs experts du secteur',
                    'Plateforme e-learning accessible 24/7',
                ],
            ],
            [
                'titre'    => 'Data Analyst',
                'features' => [
                    'Certification professionnelle reconnue',
                    'Formateurs experts du secteur',
                    'Plateforme e-learning accessible 24/7',
                ],
            ],
        ],
    ],

]; // fin $catalogue
?>

<!-- =========================================================
     HERO BANNER — "Nos formations"
     ========================================================= -->
<section class="hero" aria-label="Bandeau Nos formations">
    <div class="hero-content">
        <h1>Nos formations</h1>
        <p>340 parcours certifiants adaptés à vos ambitions professionnelles</p>
    </div>
</section>


<!-- =========================================================
     CATALOGUE DES FORMATIONS — Boucle par catégorie
     ========================================================= -->
<main class="section-catalogue" id="main-content">

    <?php
    /**
     * On itère sur chaque catégorie du catalogue.
     * Pour chaque catégorie, on affiche :
     *   1) Un titre avec bordure orange gauche (category-title)
     *   2) Une grille de 2 colonnes de cards
     */
    foreach ($catalogue as $category):
    ?>

    <!-- ---- Bloc catégorie : <?= htmlspecialchars($category['label']) ?> ---- -->
    <section class="category-block" id="<?= htmlspecialchars($category['id']) ?>">

        <!-- Titre de la catégorie avec barre orange gauche -->
        <h2 class="category-title"><?= htmlspecialchars($category['label']) ?></h2>

        <!-- Grille 2 colonnes de formations -->
        <div class="formations-grid">

            <?php
            /**
             * Pour chaque formation de la catégorie,
             * on affiche une card composée de :
             *   - .card-img  : image / fond bleu placeholder
             *   - .card-body : titre, bullets, bouton CTA
             *
             * @var array $item Formation courante
             */
            foreach ($category['items'] as $item):
            ?>
            <article class="formation-card">

                <!-- Image / Placeholder bleu -->
                <div class="card-img" role="img" aria-label="Image de la formation <?= htmlspecialchars($item['titre']) ?>"></div>

                <!-- Zone d'information (fond bleu nuit) -->
                <div class="card-body">

                    <!-- Titre de la formation -->
                    <h3><?= htmlspecialchars($item['titre']) ?></h3>

                    <!-- Points forts de la formation -->
                    <ul class="card-features">
                        <?php foreach ($item['features'] as $feature): ?>
                        <li><?= htmlspecialchars($feature) ?></li>
                        <?php endforeach; ?>
                    </ul>

                    <!-- Lien vers la page détail (à compléter avec l'URL réelle) -->
                    <a href="#" class="btn-action" aria-label="En savoir plus sur <?= htmlspecialchars($item['titre']) ?>">
                        En savoir plus
                    </a>

                </div><!-- /.card-body -->
            </article><!-- /.formation-card -->

            <?php endforeach; // fin boucle formations ?>
        </div><!-- /.formations-grid -->

    </section><!-- /.category-block -->

    <?php endforeach; // fin boucle catégories ?>

</main><!-- /.section-catalogue -->


<!-- =========================================================
     SECTION CTA — "Besoin d'un conseil personnalisé ?"
     ========================================================= -->
<section class="section-cta" aria-labelledby="cta-title">
    <h2 class="section-title" id="cta-title">Besoin d'un conseil personnalisé&nbsp;?</h2>
    <p>Nos conseillers sont à votre écoute pour vous orienter vers la formation idéale</p>
    <a href="tel:<?= SITE_PHONE ?>" class="btn-primary">Être rappelé gratuitement</a>
</section>


<?php
// Inclusion du pied de page commun (section contact + footer + </body></html>)
require_once INCLUDES_PATH . '/footer.php';
?>
