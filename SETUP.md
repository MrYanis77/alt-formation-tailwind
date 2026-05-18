# Alt Formations - Setup base de données et backend

Cette application utilise React + Vite (frontend) et Express + MySQL (backend).

## 1. Variables d'environnement

Crée (ou complète) le fichier `.env` à la racine du projet :

```env
# Backend
PORT=3000
NODE_ENV=development

# MySQL
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
<<<<<<< HEAD
# CORS_ORIGINS=https://www.alt-rh.com,https://alt-rh.com
=======
# CORS_ORIGINS=https://www.altformations.fr,https://altformations.fr
>>>>>>> 0a48c2f2e8ddbb4846f055db09011af7079eaa03
CORS_ORIGINS=

# Email (Resend) - obligatoire pour l'envoi des emails
RESEND_API_KEY=ta_cle_resend
# Adresse expéditrice : utiliser un domaine vérifié sur Resend en production
RESEND_FROM=onboarding@resend.dev
<<<<<<< HEAD
EMAIL_DESTINATAIRE=contact@alt-rh.com

# Compte admin par défaut (utilisé par seed:admin)
ADMIN_EMAIL=admin@alt-rh.com
=======
EMAIL_DESTINATAIRE=contact@altformations.fr

# Compte admin par défaut (utilisé par seed:admin)
ADMIN_EMAIL=admin@altformations.fr
>>>>>>> 0a48c2f2e8ddbb4846f055db09011af7079eaa03
ADMIN_PASSWORD=Admin1234!
ADMIN_PRENOM=Admin
ADMIN_NOM=Alt Formations
```

**Important production :**
- `IP_HASH_SALT` DOIT être un secret long et unique
- `CORS_ORIGINS` DOIT lister explicitement vos domaines (sinon CORS bloque tout)
- `ADMIN_PASSWORD` DOIT être changé après la première connexion

## 2. Création de la base MySQL

Exécute le script SQL :

```bash
mysql -u root -p < schema.sql
```

Cela crée la base `alt_formations_db` et les 7 tables : `users`, `sessions`, `contacts`,
`faq_requests`, `chat_messages`, `faq`, `page_visits`.

## 3. Création du compte administrateur

```bash
npm run seed:admin
```

Cela crée (ou met à jour) le compte admin avec les identifiants définis dans `.env`.

## 4. Lancement

```bash
# Frontend + backend ensemble
npm run dev:full

# Ou séparément :
npm run dev      # Vite (port 5173)
npm run server   # Express (port 3000)
```

Vite proxy `/api/*` vers `http://localhost:3000`, donc en développement tu accèdes à
`http://localhost:5173`.

## 5. Routes principales

- `/connexion` et `/inscription` : auth utilisateur
- `/mon-espace` : tableau de bord utilisateur (profil, messages, questions FAQ)
- `/admin` : tableau de bord administrateur (stats, contacts, FAQ, utilisateurs)
- `/contact` : formulaire de contact (envoie un email + crée une entrée DB + ouvre une conversation)
- `/faq` : FAQ publique + bouton pour poser une question

## 6. API endpoints

- `POST /api/auth/register|login|logout` · `GET /api/auth/me` · `PATCH /api/auth/me`
- `POST /api/contact` · `GET /api/contact/mine`
- `GET /api/faq/published`
- `POST /api/faq/requests` · `GET /api/faq/requests/mine`
- `GET /api/faq/requests` (admin) · `POST /api/faq/requests/:id/reply` · `POST /api/faq/requests/:id/publish`
- `GET /api/faq/admin/list` · `PUT /api/faq/admin/:id` · `DELETE /api/faq/admin/:id`
- `GET /api/chat/conversations/mine` · `GET /api/chat/conversations` (admin)
- `GET /api/chat/messages?contactId=...&after=...` · `POST /api/chat/messages`
- `GET /api/admin/stats` · `GET /api/admin/contacts` · `PATCH /api/admin/contacts/:id/status`
- `GET /api/admin/users` · `PATCH /api/admin/users/:id/role`
- `POST /api/visit` (beacon de tracking)
