# Alt RH Formations - Setup base de données et backend

Cette application utilise React + Vite (frontend) et Express + MySQL (backend).

## 1. Variables d'environnement

Crée (ou complète) le fichier `.env` à la racine du projet :

```env
# Backend
PORT=3000
NODE_ENV=development

# MySQL — nom de base aligné avec le script SQL choisi (voir §2)
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=ton_mot_de_passe
DB_NAME=alt_formations_db

# Sécurité
# OBLIGATOIRE en production : remplacer par une chaîne aléatoire d'au moins 32 caractères
IP_HASH_SALT=change-moi-pour-un-secret-aleatoire-long

# CORS : liste séparée par des virgules d'origines autorisées
# (en dev, par défaut http://localhost:5173 et http://127.0.0.1:5173)
# En prod, indiquez explicitement le domaine du frontend, ex.:
# CORS_ORIGINS=https://www.alt-rh.com,https://alt-rh.com
CORS_ORIGINS=

# Email (Resend) - obligatoire pour l'envoi des emails
RESEND_API_KEY=ta_cle_resend
# Adresse expéditrice : utiliser un domaine vérifié sur Resend en production
RESEND_FROM=onboarding@resend.dev
EMAIL_DESTINATAIRE=contact@alt-rh.com

# Compte administrateur back-office (table admin_users) — utilisé par npm run seed:admin
ADMIN_USERNAME=superadmin
ADMIN_EMAIL=admin@altformations.fr
ADMIN_PASSWORD=Admin1234!

# Tests sans MySQL : données factices, aucune connexion BDD (ne jamais mettre en production)
# DISABLE_DATABASE=1
```

**Important production :**

- `IP_HASH_SALT` DOIT être un secret long et unique
- `CORS_ORIGINS` DOIT lister explicitement vos domaines (sinon CORS bloque tout)
- `ADMIN_PASSWORD` DOIT être changé après la première connexion

### Back-office vs compte « site »

- **`admin_users` / cookie `admin_session_token`** : tableau de bord `/admin` (rôles `superadmin`, `admin`, `editor`).
- **`users` / cookie `session_token`** : espace utilisateur public (`/connexion`, `/mon-espace`) si ces routes sont activées.

Ce sont deux espèces de comptes distinctes.

### Tester sans MySQL (`DISABLE_DATABASE`)

Pour faire tourner le backend **sans MariaDB/MySQL** (aperçu UI, démo locale) :

1. Dans `.env`, définis **`DISABLE_DATABASE=1`** (valeurs reconnues : `1`, `true`, `yes`, `on`).
2. Lance `npm run server` ou `npm run dev:full`. Un avertissement s’affiche au démarrage ; **`GET /api/health`** inclut `"databaseDisabled": true`.
3. Page **`/admin`** : tout couple identifiant + mot de passe **non vides** déclenche une connexion admin simulée.
4. Les stats et listes viennent de données **factices** ([`src/data/backend/mockDb.js`](src/data/backend/mockDb.js)).

**Ne pas utiliser en production** : pas de persistance ni de sécurité réelle.

## 2. Création de la base MySQL

### Schéma recommandé (fusion site + back-office)

À partir d'une base vide ou pour une nouvelle installation :

```bash
mysql -u root -p < schema-merged.sql
```

Ce script crée `alt_formations_db` avec :

- Parties « sécurisées » : `admin_users`, `admin_sessions`, FAQ normalisée (`faq_categories`, `faq_items`), blog, newsletter, chatbot, `audit_logs`, `login_attempts`, vues et procédures stockées ;
- Parties « site » héritées de `schema.sql` : `users`, `sessions`, `contacts`, `faq_requests`, `chat_messages`, `faq`, `page_visits` ;
- Mises à niveau conditionnelles pour `chat_messages` (`sender_id` nullable, `admin_sender_id` pour les réponses depuis le back-office).

### Ancien schéma minimal (sans module newsletter / admin séparé)

Le fichier [`schema.sql`](schema.sql) reste disponible pour les environnements qui ne migrent pas encore. Dans ce cas le backend moderne (sessions `admin_users`) ne sera pas utilisable tant que les tables correspondantes n'existent pas.

## 3. Compte administrateur back-office

Après avoir appliqué **`schema-merged.sql`**, un superadmin peut déjà être présent avec le hash bcrypt du script SQL (mot de passe documenté lors de la génération du script d'origine). Pour créer ou réinitialiser un compte dans `admin_users` :

```bash
npm run seed:admin
```

Les identifiants utilisés sont ceux du `.env` (`ADMIN_USERNAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`).  
Si **`DISABLE_DATABASE=1`** est actif, le seed quitte sans toucher à MySQL.

## 4. Maintenance optionnelle

La procédure stockée `clean_expired_sessions()` supprime les sessions admin expirées et nettoie certains jetons newsletter non confirmés. À planifier via cron ou exécution manuelle :

```sql
CALL clean_expired_sessions();
```

## 5. Lancement

```bash
# Frontend + backend ensemble
npm run dev:full

# Ou séparément :
npm run dev      # Vite (port 5173)
npm run server   # Express (port 3000)
```

Vite proxy `/api/*` vers `http://localhost:3000`, donc en développement tu accèdes à
`http://localhost:5173`.

## 6. Routes principales

- `/connexion` et `/inscription` : auth utilisateur site (si activées dans `App.jsx`)
- `/mon-espace` : tableau de bord utilisateur (si activé)
- `/admin` : tableau de bord administrateur (**connexion dédiée** `POST /api/admin/auth/login`)
- `/contact` : formulaire de contact
- `/faq` : FAQ (contenu statique côté UI ; données dynamiques disponibles via API si besoin)

## 7. API endpoints (aperçu)

- **Site** : `POST /api/auth/register|login|logout` · `GET /api/auth/me` · `PATCH /api/auth/me`
- **Admin auth** : `POST /api/admin/auth/login|logout` · `GET /api/admin/auth/me`
- **Contact** : `POST /api/contact` · `GET /api/contact/mine`
- **FAQ** : `GET /api/faq/published` · flux demandes utilisateur inchangés si table `faq_requests` présente · CRUD admin sur catégories / items normalisés
- **Chat** : conversations contacts / FAQ inchangées · messages admin via `admin_sender_id`
- **Admin** : stats étendues, contacts, utilisateurs site, blog, newsletter, chatbot, gestion `admin_users`
- **Visit** : `POST /api/visit`

## 8. Optimisation performance (images, vidéos, bundle)

### Workflow avant déploiement OVH

```bash
# 1. Optimiser les images (WebP 400/800/1200w + recompression JPEG)
npm run optimize:images

# 2. Optimiser les vidéos (requiert ffmpeg installé)
npm run optimize:videos

# 3. Build production (+ index formations + sitemap)
npm run build

# 4. Prerender SEO (optionnel, requiert puppeteer)
npm run build:full

# 5. Audit tailles bundle + assets lourds
npm run audit:perf
```

### Scripts disponibles

| Commande | Rôle |
|---|---|
| `npm run optimize:images` | Génère variantes WebP et compresse `public/assets/images/` |
| `npm run optimize:videos` | Re-encode MP4 720p + posters WebP via ffmpeg |
| `npm run generate:formations-index` | Regénère `formations-index.json` (lookup fiches) |
| `npm run generate:sitemap` | Regénère `public/sitemap.xml` |
| `npm run prerender` | Snapshots HTML des routes SEO dans `dist/` |
| `npm run audit:perf` | Build + rapport chunks JS + fichiers > 500 Ko |

### Architecture bundle

- **Navbar** : liens statiques (`navlinks-static.js`) + méga-menu chargé au survol (`navdata-mega.js` en chunk séparé).
- **Fiche formation** : une seule fiche via `getFormationById.js` (import dynamique du JSON source).
- **Images** : composant `ResponsiveImage` avec `<picture>` WebP.
- **Vidéos hero** : `HeroVideo` — poster immédiat, pas de vidéo sur mobile, lazy load desktop.
- **Polices** : self-hosted via `@fontsource` (plus de Google Fonts).
- **Cache** : headers `Cache-Control` dans `public/.htaccess` (vérifier `mod_headers` sur OVH).

### Validation post-déploiement

- [PageSpeed Insights](https://pagespeed.web.dev/) sur `/accueil` et `/formations` (mobile)
- Objectifs : LCP < 2,5 s, aucune requête Unsplash externe

