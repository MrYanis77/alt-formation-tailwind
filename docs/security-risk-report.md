# Rapport d’identification des risques de sécurité — DevSecOps

## 1. Informations générales

| Champ | Valeur |
|---|---|
| Projet | Nexytal / Alt Formation |
| Version analysée | État du répertoire de travail au 20 août 2026 |
| Type d’analyse | Revue statique ciblée, configuration et dépendances |
| Périmètre | Frontend React/Vite, backend Express, API PHP, dépendances npm, configuration de déploiement |
| Environnements visés | Développement, préproduction et production |
| Données concernées | Comptes utilisateurs et administrateurs, contacts, candidatures, CV, newsletter, journaux techniques |
| Niveau global | **Critique** |
| Responsable du rapport | À renseigner |
| Responsable sécurité | À renseigner |

> Ce document est un rapport d’identification des risques, pas un test d’intrusion. Aucune valeur de secret n’est reproduite. L’environnement de production, la base distante et la configuration effective du serveur web n’ont pas été testés.

## 2. Synthèse exécutive

Le projet dispose déjà de plusieurs mécanismes utiles : requêtes SQL préparées, cookies `HttpOnly`, contrôle des rôles administratifs, Helmet et HPP sur Express, listes CORS, limites de taille, contrôle MIME des CV, journalisation et limitation de débit. L’audit npm effectué pendant cette analyse retourne **0 vulnérabilité connue sur 598 dépendances** et les tests automatisés existants réussissent.

Le niveau global reste toutefois **critique** en raison de deux risques immédiats : le fichier `.env` contenant des valeurs sensibles est actuellement suivi par Git, et l’endpoint public `public/api/test-data.php` exporte par défaut des données non publiées ainsi que des données personnelles d’abonnés newsletter. D’autres risques élevés concernent le mode administrateur de démonstration, les pages de diagnostic publiques, le rendu HTML non assaini des articles, les CV stockés sous la racine web et l’absence de protection CSRF explicite.

### Répartition des risques

| Niveau | Nombre |
|---|---:|
| Critique | 2 |
| Élevé | 6 |
| Modéré | 4 |
| Faible | 0 |
| Total | 12 |

## 3. Méthode de cotation

Le score est calculé avec la formule `Probabilité × Impact`.

| Valeur | Probabilité | Impact |
|---:|---|---|
| 1 | Très improbable | Mineur |
| 2 | Peu probable | Faible |
| 3 | Possible | Modéré |
| 4 | Probable | Majeur |
| 5 | Très probable | Critique |

| Score | Niveau |
|---:|---|
| 1–4 | Faible |
| 5–9 | Modéré |
| 10–16 | Élevé |
| 17–25 | Critique |

## 4. Registre des risques

| ID | Risque | Catégorie | P | I | Score | Niveau | Priorité |
|---|---|---|---:|---:|---:|---|---|
| R-01 | Secrets présents dans un `.env` suivi par Git | Secrets / SCM | 5 | 5 | 25 | Critique | Immédiate |
| R-02 | Export public de données internes et personnelles | Contrôle d’accès / RGPD | 5 | 5 | 25 | Critique | Immédiate |
| R-03 | Authentification superadmin contournée en mode base désactivée | Authentification | 3 | 5 | 15 | Élevé | Immédiate |
| R-04 | Endpoints de diagnostic accessibles publiquement | Divulgation d’information | 5 | 3 | 15 | Élevé | 7 jours |
| R-05 | Contenu de blog rendu comme HTML sans assainissement robuste | XSS persistante | 3 | 4 | 12 | Élevé | 7 jours |
| R-06 | CV stockés dans une arborescence publiquement adressable | Données personnelles | 3 | 4 | 12 | Élevé | 7 jours |
| R-07 | Absence de protection CSRF explicite sur les actions authentifiées | Sessions / CSRF | 3 | 4 | 12 | Élevé | 30 jours |
| R-08 | Limitation de débit PHP contournable via `X-Forwarded-For` | Anti-abus | 4 | 3 | 12 | Élevé | 30 jours |
| R-09 | Jetons de session stockés en clair en base | Gestion des sessions | 2 | 4 | 8 | Modéré | 30 jours |
| R-10 | Politique de mot de passe incohérente entre les backends | Authentification | 3 | 3 | 9 | Modéré | 30 jours |
| R-11 | Absence de pipeline DevSecOps et de contrôle PHP reproductible | Chaîne CI/CD | 3 | 3 | 9 | Modéré | 30 jours |
| R-12 | Trois implémentations backend augmentent la surface d’attaque | Architecture | 3 | 3 | 9 | Modéré | 60 jours |

## 5. Détail des risques

### R-01 — Secrets présents dans un `.env` suivi par Git

- **Actif concerné :** identifiants de base de données, compte administrateur, sel de hachage IP et configuration d’environnement.
- **Preuve :** `git ls-files .env` confirme que `.env` est suivi. Les clés sensibles `DB_PASSWORD`, `ADMIN_PASSWORD` et `IP_HASH_SALT` possèdent des valeurs non vides. Les valeurs n’ont volontairement pas été consignées dans ce rapport.
- **Scénario :** une copie du dépôt, une archive, un fork ou un accès à l’historique Git permet de récupérer les secrets puis d’accéder à la base ou au compte administrateur.
- **Impact :** compromission de comptes, fuite ou modification de données, mouvement latéral.
- **Traitement recommandé :** retirer immédiatement `.env` de l’index Git, révoquer et renouveler tous les secrets présents, vérifier l’historique et le nettoyer avec un outil adapté, puis stocker les secrets dans le gestionnaire de secrets de l’hébergeur/CI.
- **Critère de clôture :** `.env` absent de `git ls-files`, secrets renouvelés, recherche de secrets réussie sur tout l’historique.
- **Responsable suggéré :** responsable technique + administrateur de l’hébergement.

### R-02 — Export public de données internes et personnelles

- **Actif concerné :** abonnés newsletter, commentaires, brouillons d’articles, formations et informations de base.
- **Preuve :** `public/api/test-data.php:12-14` n’impose qu’une méthode GET, sans authentification. `public/api/test-data.php:19` inclut toutes les données par défaut. `public/api/lib/nexytal.php:611-620` sélectionne les noms, emails, statuts et dates de consentement des abonnés. `public/api/lib/nexytal.php:653-704` place ces données dans l’export.
- **Scénario :** un visiteur appelle `/api/test-data.php` et collecte les données exportées sans compte.
- **Impact :** violation de confidentialité, exposition de données personnelles, risque RGPD et atteinte à l’image.
- **Traitement recommandé :** supprimer cet endpoint de production. Si un diagnostic est indispensable, l’autoriser uniquement en développement, derrière une authentification administrateur et une liste d’adresses IP, avec une réponse strictement agrégée.
- **Critère de clôture :** réponse 404 ou 403 en production et test automatisé empêchant tout export d’abonnés non authentifié.
- **Responsable suggéré :** équipe backend.

### R-03 — Authentification superadmin contournée en mode base désactivée

- **Actif concerné :** back-office et fonctions administratives Express.
- **Preuve :** `src/data/backend/routes/adminAuth.js:102-118` accepte n’importe quels identifiants non vides lorsque `DISABLE_DATABASE` est actif et attribue le rôle `superadmin`. `src/data/backend/middleware/attachAdmin.js:25-27` transforme ensuite tout cookie de session présent en identité superadmin de démonstration.
- **Scénario :** une variable `DISABLE_DATABASE=1` laissée par erreur dans un environnement exposé permet une prise de contrôle du back-office.
- **Impact :** accès administrateur complet et modification des contenus ou comptes.
- **Traitement recommandé :** interdire le démarrage si `DISABLE_DATABASE=1` hors environnement `test` explicite, retirer la création d’une session superadmin du code de production et isoler les mocks dans les tests.
- **Critère de clôture :** test d’intégration prouvant que le serveur refuse de démarrer avec cette combinaison en préproduction/production.
- **Responsable suggéré :** équipe backend/DevOps.

### R-04 — Endpoints de diagnostic accessibles publiquement

- **Actif concerné :** topologie, noms de base/utilisateur, version MariaDB, tables, volumes et messages d’erreur.
- **Preuve :** `public/test-connexion.php:10-14` charge la configuration de connexion puis `public/test-connexion.php:56-90` affiche les informations et erreurs. `api/health.php:106-117` retourne base, version, tables, compteurs et diagnostics. `public/api/health.php:136-167` expose également de nombreux détails et référence l’endpoint de test.
- **Scénario :** un attaquant collecte les détails techniques pour préparer un ciblage ou obtient des messages contenant des informations d’infrastructure.
- **Impact :** facilitation d’attaques, fuite de métadonnées et informations personnelles agrégées.
- **Traitement recommandé :** supprimer `public/test-connexion.php`, `public/test-bdd.html` et les diagnostics détaillés en production. Limiter `/health` à un statut minimal (`ok`) et protéger les informations approfondies.
- **Critère de clôture :** les chemins de test répondent 404 en production et le healthcheck ne contient aucun nom d’hôte, utilisateur, base, table, volume ni erreur brute.
- **Responsable suggéré :** DevOps + backend PHP.

### R-05 — Contenu de blog rendu comme HTML sans assainissement robuste

- **Actif concerné :** sessions des visiteurs et administrateurs, intégrité des pages.
- **Preuve :** `src/pages/BlogArticlePage.jsx:63-69` utilise `dangerouslySetInnerHTML`. `src/data/backend/routes/adminBlogRoutes.js:63-74` enregistre `content` sans assainissement HTML. La fonction de détection de `src/data/backend/utils.js:41-49` est une liste noire partielle et n’est pas appliquée au contenu.
- **Scénario :** un contenu compromis en base ou saisi par un compte éditeur contient un gestionnaire d’événement, une URL dangereuse ou un balisage contournant la liste noire et exécute du JavaScript chez les visiteurs.
- **Impact :** XSS persistante, vol d’actions/session, défiguration ou redirection.
- **Traitement recommandé :** assainir le HTML côté serveur avec une liste blanche, assainir à nouveau avant rendu, limiter les balises/attributs autorisés et ajouter une Content Security Policy restrictive.
- **Critère de clôture :** tests XSS couvrant attributs d’événement, SVG, URL `javascript:`, balises malformées et contenus imbriqués.
- **Responsable suggéré :** équipes frontend et backend.

### R-06 — CV stockés dans une arborescence publiquement adressable

- **Actif concerné :** CV et lettres de motivation contenant des données personnelles.
- **Preuve :** `public/api/lib/uploads.php:11-13` place les fichiers sous `public/api/uploads/candidatures`. `public/api/lib/uploads.php:82-89` utilise un nom aléatoire puis conserve un chemin relatif public. `public/api/uploads/.htaccess` désactive uniquement l’indexation, sans refuser la lecture directe.
- **Mesures existantes :** taille maximale de 5 Mo, contrôle MIME, `is_uploaded_file` et nom aléatoire.
- **Scénario :** une URL divulguée dans un log, une sauvegarde, une réponse ou une fuite de base permet le téléchargement direct du CV.
- **Impact :** fuite de données personnelles et risque RGPD.
- **Traitement recommandé :** stocker les fichiers hors de la racine web ou refuser tout accès HTTP direct, puis servir les fichiers via une route administrateur authentifiée et journalisée. Définir une durée de conservation et une suppression automatique.
- **Critère de clôture :** une requête directe vers un fichier retourne 403/404 et seul un administrateur autorisé peut le télécharger.
- **Responsable suggéré :** backend PHP + DPO.

### R-07 — Absence de protection CSRF explicite

- **Actif concerné :** actions utilisateur et administrateur authentifiées par cookie.
- **Preuve :** `src/data/backend/routes/auth.js:12-18` et `src/data/backend/routes/adminAuth.js:11-17` utilisent des cookies `HttpOnly` avec `SameSite=Lax`, mais aucune vérification de jeton CSRF ou stricte de l’en-tête `Origin` n’a été trouvée sur les routes POST/PATCH/DELETE.
- **Mesure existante :** `SameSite=Lax` réduit plusieurs attaques intersites, sans couvrir toutes les situations de même site, sous-domaines compromis ou évolutions de configuration.
- **Traitement recommandé :** ajouter un jeton CSRF synchronisé ou « double submit », vérifier `Origin`/`Referer` sur les mutations et conserver une liste CORS stricte.
- **Critère de clôture :** les mutations sans jeton ou avec origine non autorisée retournent 403 dans les tests d’intégration.
- **Responsable suggéré :** équipe backend Express.

### R-08 — Limitation de débit PHP contournable via `X-Forwarded-For`

- **Actif concerné :** formulaires, newsletter, email et disponibilité de l’API.
- **Preuve :** `api/security.php:11-18` fait confiance au premier `X-Forwarded-For` sans valider que la requête provient d’un proxy de confiance. Cette valeur sert à la clé de limitation dans `api/security.php:22-30`.
- **Scénario :** un client change l’en-tête à chaque requête et contourne les quotas par adresse IP.
- **Impact :** spam, consommation SMTP, saturation de stockage ou déni de service.
- **Traitement recommandé :** n’accepter les en-têtes proxy que depuis les adresses du reverse proxy, sinon utiliser `REMOTE_ADDR`. Préférer un stockage atomique partagé pour le rate limiting.
- **Critère de clôture :** test démontrant que la modification de `X-Forwarded-For` par un client direct ne change pas son quota.
- **Responsable suggéré :** backend PHP + DevOps.

### R-09 — Jetons de session stockés en clair en base

- **Actif concerné :** sessions utilisateurs et administrateurs.
- **Preuve :** `src/data/backend/routes/auth.js:40-44` et `src/data/backend/routes/adminAuth.js:68-76` insèrent directement les jetons générés dans les tables de session. Les middlewares les recherchent ensuite directement (`src/data/backend/middleware/auth.js:17-22`, `src/data/backend/middleware/attachAdmin.js:30-35`).
- **Scénario :** une lecture non autorisée de la base permet de réutiliser immédiatement les jetons encore valides.
- **Traitement recommandé :** ne stocker qu’un hachage SHA-256 des jetons, comparer le hachage reçu et révoquer toutes les sessions existantes lors de la migration.
- **Critère de clôture :** aucun jeton brut en base et tests de création, validation, expiration et révocation réussis.
- **Responsable suggéré :** équipe backend Express.

### R-10 — Politique de mot de passe incohérente

- **Actif concerné :** comptes utilisateurs et administrateurs.
- **Preuve :** `src/data/backend/routes/auth.js:78-80` exige seulement 8 caractères. `src/data/backend/routes/admin.js:263-276` accepte également 8 caractères lors d’un changement administrateur, alors que `api/security.php:91-111` définit une politique plus forte de 10 caractères avec complexité.
- **Traitement recommandé :** centraliser une politique commune, privilégier au moins 12 caractères, contrôler les mots de passe compromis et ajouter une authentification multifacteur pour les administrateurs.
- **Critère de clôture :** politique unique testée sur création, modification, réinitialisation et initialisation des comptes.
- **Responsable suggéré :** équipe identité/backend.

### R-11 — Absence de pipeline DevSecOps et de contrôle PHP reproductible

- **Actif concerné :** chaîne de livraison et dépendances.
- **Preuve :** aucun workflow CI n’est présent. Les scripts npm proposent lint, tests et audit d’architecture, mais pas de SAST, secret scanning ou SCA obligatoire. `api/composer.json` déclare PHPMailer, mais `api/composer.lock` est absent et Composer n’est pas disponible dans l’environnement d’analyse. Deux copies différentes de PHPMailer sont présentes (`6.9.3` et `7.1.1`).
- **Mesure existante :** `npm audit` retourne 0 vulnérabilité connue et 47 tests JavaScript plus un test PHP sont disponibles.
- **Traitement recommandé :** créer une CI bloquante exécutant installation reproductible, lint, tests, couverture, `npm audit`, `composer audit`, SAST, recherche de secrets et analyse des artefacts/de l’infrastructure.
- **Critère de clôture :** pipeline requis sur chaque pull request, artefacts conservés et seuils bloquants documentés.
- **Responsable suggéré :** DevOps/DevSecOps.

### R-12 — Multiplication des backends et surface d’attaque ambiguë

- **Actif concerné :** API, règles de sécurité et processus de déploiement.
- **Preuve :** le dépôt contient trois implémentations : `api/`, `public/api/` et `src/data/backend/`. Elles n’appliquent pas les mêmes contrôles, versions de bibliothèques, diagnostics, règles CORS ou politiques de mot de passe. `vercel.json` réécrit actuellement toutes les routes vers `index.html`, tandis que la documentation et les scripts prévoient PHP et Express.
- **Scénario :** une route ancienne ou de test est déployée involontairement et contourne les protections du backend principal.
- **Traitement recommandé :** désigner un backend de référence par environnement, supprimer ou isoler les implémentations obsolètes et documenter une matrice de déploiement explicite.
- **Critère de clôture :** une seule surface publique documentée et un test automatisé de l’inventaire des routes déployées.
- **Responsable suggéré :** architecte logiciel + DevOps.

## 6. Contrôles positifs observés

| Contrôle | État | Preuve |
|---|---|---|
| Requêtes SQL préparées | Présent | Utilisation de paramètres dans les backends Express et PHP |
| Cookies de session `HttpOnly` | Présent | `routes/auth.js` et `routes/adminAuth.js` |
| Cookies `Secure` en production | Présent côté Express | Option conditionnée par `NODE_ENV=production` |
| Contrôle des rôles | Présent | `requireAdmin`, `requireAdminElevated`, `requireSuperAdmin` |
| En-têtes Express | Présent | Helmet, HPP et suppression de `x-powered-by` |
| Limite des corps Express | Présent | 64 Ko pour JSON et formulaires |
| Rate limiting Express | Présent | Authentification, formulaires, visites et chat |
| Validation des CV | Partielle mais utile | Taille, MIME, upload PHP natif et nom aléatoire |
| Journalisation d’audit | Présente | Actions administratives journalisées |
| Audit des dépendances npm | Conforme lors de l’analyse | 0 vulnérabilité connue sur 598 dépendances |
| Tests automatisés | Présents | 47 tests JavaScript et 1 test PHP réussis |

## 7. Plan de remédiation priorisé

### Immédiatement — 0 à 24 heures

1. Révoquer et renouveler toutes les valeurs sensibles présentes dans `.env`.
2. Retirer `.env` du suivi Git et rechercher les secrets dans tout l’historique.
3. Désactiver ou supprimer `/api/test-data.php`, `/test-connexion.php` et `/test-bdd.html` en production.
4. Bloquer le démarrage du serveur exposé lorsque `DISABLE_DATABASE=1`.
5. Vérifier les journaux d’accès afin d’identifier d’éventuels appels aux endpoints de test.

### Sous 7 jours

1. Réduire les réponses des healthchecks à un état minimal.
2. Déplacer les CV hors de la racine web ou interdire leur accès direct.
3. Ajouter un assainissement HTML robuste pour les articles et une CSP.
4. Vérifier si les secrets exposés ont déjà été utilisés de façon anormale.

### Sous 30 jours

1. Ajouter la protection CSRF et les tests associés.
2. Corriger la confiance accordée à `X-Forwarded-For`.
3. Hacher les jetons de session en base et révoquer les anciens.
4. Unifier la politique de mot de passe et planifier la MFA administrateur.
5. Mettre en place une CI DevSecOps bloquante avec rapports conservés.

### Sous 60 jours

1. Rationaliser les trois backends et supprimer les routes obsolètes.
2. Documenter les flux de données, leur durée de conservation et leur suppression.
3. Réaliser un test d’intrusion ciblé sur authentification, contrôle d’accès, uploads et XSS.

## 8. Pipeline DevSecOps recommandé

Chaque pull request devrait exécuter les étapes suivantes :

1. Installation reproductible avec `npm ci` et `composer install` à partir de fichiers de verrouillage.
2. Recherche de secrets dans le commit et l’historique pertinent.
3. Lint et contrôle des frontières d’architecture.
4. Tests unitaires, tests PHP et tests d’intégration des API.
5. SAST JavaScript/PHP et analyse des dépendances avec `npm audit` et `composer audit`.
6. Tests de sécurité ciblés : contrôle d’accès, CSRF, XSS, upload, rate limiting et exposition des diagnostics.
7. Génération d’un SBOM et conservation des rapports comme artefacts.
8. Blocage automatique pour tout secret détecté ou vulnérabilité critique/élevée non explicitement acceptée.

## 9. Suivi et acceptation

| ID | Décision | Responsable | Échéance | Ticket | Statut | Preuve de correction |
|---|---|---|---|---|---|---|
| R-01 | À corriger | À renseigner | 24 h | À créer | Ouvert | À fournir |
| R-02 | À corriger | À renseigner | 24 h | À créer | Ouvert | À fournir |
| R-03 | À corriger | À renseigner | 24 h | À créer | Ouvert | À fournir |
| R-04 | À corriger | À renseigner | 7 j | À créer | Ouvert | À fournir |
| R-05 | À corriger | À renseigner | 7 j | À créer | Ouvert | À fournir |
| R-06 | À corriger | À renseigner | 7 j | À créer | Ouvert | À fournir |
| R-07 | À corriger | À renseigner | 30 j | À créer | Ouvert | À fournir |
| R-08 | À corriger | À renseigner | 30 j | À créer | Ouvert | À fournir |
| R-09 | À corriger | À renseigner | 30 j | À créer | Ouvert | À fournir |
| R-10 | À corriger | À renseigner | 30 j | À créer | Ouvert | À fournir |
| R-11 | À corriger | À renseigner | 30 j | À créer | Ouvert | À fournir |
| R-12 | À réduire | À renseigner | 60 j | À créer | Ouvert | À fournir |

Toute acceptation d’un risque élevé ou critique doit être documentée, limitée dans le temps et approuvée par le responsable sécurité et le responsable métier. Les risques R-01 et R-02 ne devraient pas être acceptés en l’état.

## 10. Vérifications réalisées

- Cartographie des fichiers, routes et configurations de sécurité.
- Vérification du suivi Git de `.env` sans afficher ses valeurs.
- Recherche ciblée des contrôles d’authentification, autorisation, CORS, rate limiting, sessions, uploads et rendu HTML.
- `npm audit` : 0 vulnérabilité connue sur 598 dépendances.
- `npm test` : architecture conforme, 5 fichiers et 47 tests JavaScript réussis, test PHP du logger réussi.
- Limite : `composer audit` non exécuté, car Composer n’est pas installé et aucun `composer.lock` n’est présent.

