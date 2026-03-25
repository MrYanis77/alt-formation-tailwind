<?php
/**
 * footer.php — Pied de page commun à toutes les pages
 *
 * Ce fichier génère :
 *   1) La section "Contactez-nous" (formulaire de contact sur fond sombre)
 *   2) Le footer en 4 colonnes (Formations / Services / À propos / Mentions légales)
 *   3) La barre de copyright
 *   4) Les balises de fermeture </body></html>
 *
 * VARIABLES ATTENDUES (optionnelles) :
 * ---------------------------------------------------------------------------
 *   @var bool $showContact  Afficher ou non la section contact (défaut : true)
 *                           Utile pour masquer le formulaire sur la page Contact.
 * ---------------------------------------------------------------------------
 *
 * Le traitement PHP du formulaire POST est géré ici directement.
 * Pour une version avancée, externaliser dans handlers/contact-handler.php.
 *
 * @package AltFormationsRH
 */

// Valeur par défaut : la section contact est affichée
$showContact = $showContact ?? true;

// ---------------------------------------------------------------------------
// Traitement du formulaire de contact (méthode POST)
// ---------------------------------------------------------------------------
$contactSuccess = false;  // Indicateur de succès d'envoi
$contactError   = '';     // Message d'erreur éventuel

if ($showContact && $_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['contact_submit'])) {

    // Nettoyage et validation des champs reçus
    $nom     = trim(htmlspecialchars($_POST['nom']       ?? '', ENT_QUOTES, 'UTF-8'));
    $prenom  = trim(htmlspecialchars($_POST['prenom']    ?? '', ENT_QUOTES, 'UTF-8'));
    $email   = filter_var(trim($_POST['email'] ?? ''), FILTER_SANITIZE_EMAIL);
    $tel     = trim(htmlspecialchars($_POST['telephone'] ?? '', ENT_QUOTES, 'UTF-8'));
    $message = trim(htmlspecialchars($_POST['message']   ?? '', ENT_QUOTES, 'UTF-8'));

    // Validation basique
    if (empty($nom) || empty($prenom) || empty($email) || empty($message)) {
        $contactError = 'Veuillez remplir tous les champs obligatoires.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $contactError = 'Adresse e-mail invalide.';
    } else {
        /**
         * TODO : Implémenter l'envoi réel par mail avec PHPMailer ou mail()
         * Exemple : mail(SITE_EMAIL, "Nouveau contact de $nom $prenom", $message, "From: $email");
         */
        $contactSuccess = true;
    }
}
?>

<?php if ($showContact): ?>
<!-- =========================================================
     SECTION CONTACT — Formulaire sur fond sombre (#2c2c2c)
     ========================================================= -->
<section class="section-contact" id="contact" aria-labelledby="contact-title">
    <h2 class="section-title" id="contact-title">Contactez-nous</h2>

    <?php if ($contactSuccess): ?>
        <!-- Message de confirmation après envoi réussi -->
        <p class="form-success" role="alert">
            ✓ Votre message a bien été envoyé ! Nous vous répondrons dans les 24h.
        </p>
    <?php elseif (!empty($contactError)): ?>
        <!-- Message d'erreur de validation -->
        <p class="form-error" role="alert">
            <?= htmlspecialchars($contactError) ?>
        </p>
    <?php endif; ?>

    <form class="contact-form"
          method="POST"
          action="<?= htmlspecialchars($_SERVER['REQUEST_URI']) ?>"
          novalidate>

        <!-- Champ caché pour identifier la soumission du formulaire contact -->
        <input type="hidden" name="contact_submit" value="1">

        <!-- Ligne Nom / Prénom -->
        <div class="form-row">
            <input type="text"
                   name="nom"
                   placeholder="Nom"
                   required
                   aria-label="Nom"
                   value="<?= htmlspecialchars($nom ?? '') ?>">
            <input type="text"
                   name="prenom"
                   placeholder="Prénom"
                   required
                   aria-label="Prénom"
                   value="<?= htmlspecialchars($prenom ?? '') ?>">
        </div>

        <!-- Email -->
        <input type="email"
               name="email"
               placeholder="Email"
               required
               aria-label="Adresse e-mail"
               value="<?= htmlspecialchars($email ?? '') ?>">

        <!-- Téléphone (optionnel) -->
        <input type="tel"
               name="telephone"
               placeholder="Téléphone"
               aria-label="Numéro de téléphone"
               value="<?= htmlspecialchars($tel ?? '') ?>">

        <!-- Message -->
        <textarea name="message"
                  placeholder="Votre message"
                  required
                  aria-label="Votre message"><?= htmlspecialchars($message ?? '') ?></textarea>

        <!-- Bouton d'envoi -->
        <button type="submit" class="btn-send">Envoyer</button>

    </form><!-- /.contact-form -->
</section><!-- /.section-contact -->
<?php endif; ?>


<!-- =========================================================
     FOOTER — 4 colonnes de liens + copyright
     ========================================================= -->
<footer role="contentinfo">
    <div class="footer-grid">

        <!-- Colonne 1 : Formations -->
        <div class="footer-col">
            <h4>Formations</h4>
            <ul>
                <li><a href="<?= BASE_URL ?>/pages/formations.php#cybersecurite">Cybersécurité</a></li>
                <li><a href="<?= BASE_URL ?>/pages/formations.php#management">Management</a></li>
                <li><a href="<?= BASE_URL ?>/pages/formations.php#ressources-humaines">Ressources Humaines</a></li>
                <li><a href="<?= BASE_URL ?>/pages/formations.php#digital">Digital</a></li>
            </ul>
        </div>

        <!-- Colonne 2 : Services -->
        <div class="footer-col">
            <h4>Services</h4>
            <ul>
                <li><a href="<?= BASE_URL ?>/pages/alternance.php">Alternance</a></li>
                <li><a href="<?= BASE_URL ?>/pages/e-learning.php">E-learning</a></li>
                <li><a href="<?= BASE_URL ?>/pages/financements.php">Financements</a></li>
                <li><a href="<?= BASE_URL ?>/pages/entreprise.php">Solutions Entreprise</a></li>
            </ul>
        </div>

        <!-- Colonne 3 : À propos -->
        <div class="footer-col">
            <h4>À propos</h4>
            <ul>
                <li><a href="<?= BASE_URL ?>/pages/a-propos.php#histoire">Notre histoire</a></li>
                <li><a href="<?= BASE_URL ?>/pages/a-propos.php#equipe">Notre équipe</a></li>
                <li><a href="<?= BASE_URL ?>/pages/blog.php">Blog</a></li>
                <li><a href="<?= BASE_URL ?>/pages/contact.php">Contact</a></li>
            </ul>
        </div>

        <!-- Colonne 4 : Mentions légales -->
        <div class="footer-col">
            <h4>Mentions légales</h4>
            <ul>
                <li><a href="<?= BASE_URL ?>/pages/confidentialite.php">Politique de confidentialité</a></li>
                <li><a href="<?= BASE_URL ?>/pages/cgv.php">Conditions générales</a></li>
                <li><a href="<?= BASE_URL ?>/pages/mentions-legales.php">Mentions légales</a></li>
            </ul>
        </div>

    </div><!-- /.footer-grid -->

    <!-- Barre de copyright -->
    <div class="footer-bottom">
        &copy; <?= SITE_YEAR ?> <?= SITE_NAME ?>. Tous droits réservés.
    </div>

</footer><!-- /footer -->

</body>
</html>
