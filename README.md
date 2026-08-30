# Alt Formation / Nexytal

Plateforme web d'un organisme de formation : catalogue de formations diplômantes,
certifiantes et e-learning, blog, recrutement, bilan de compétences et back-office.

## Architecture

Le projet suit un monolithe modulaire : les règles propres à chaque activité sont
rangées dans `src/features/<metier>`, tandis que les mécanismes réutilisables
(HTTP, état asynchrone, observabilité) restent dans `src/shared`.

La cartographie complète, les règles de dépendance et la stratégie de fiabilité
sont décrites dans [docs/architecture/README.md](docs/architecture/README.md).

## Démarrage local

Prérequis : Node.js 22+, npm, PHP 7.4+ et MySQL/MariaDB pour les données réelles.

```bash
npm install
npm run php
npm run dev
```

Vite sert l'interface sur `http://localhost:5173` et transmet `/api` au serveur PHP
sur `http://127.0.0.1:8000`. Les variables PHP se configurent avec les modèles dans
`public/api/config/`.

Le serveur Express historique/back-office peut être lancé séparément avec :

```bash
npm run server
```

## Contrôles qualité

```bash
npm run check:architecture
npm run lint
npm run test:js
npm run test:php
npm run test:coverage
npm run build
```

`npm run test` exécute les contrôles d'architecture, ESLint, les tests JavaScript
et le test PHP du logger.

Le rapport de couverture Vitest est généré dans `coverage/index.html`. Le bilan
versionné se trouve dans `docs/quality/coverage-report.md`.

`npm run build` lance directement le build Vite avec les donnees versionnees. Les
anciens scripts de generation retires du depot ne font plus partie de la chaine de
build.

L'analyse SonarQube se lance avec `npm run sonar`. Le jeton est fourni uniquement
par `SONAR_TOKEN` dans `.env`; il n'est jamais stocke dans la configuration Sonar.

## Logs de debug

Les appels API produisent des événements structurés en développement :
`request:start`, `request:success`, `request:failed`, `response:error` et
`response:invalid-json`. Les mots de passe, jetons, cookies et clés API sont
automatiquement masqués.

Pour activer temporairement ces traces dans un navigateur hors mode développement :

```js
localStorage.setItem('nexytal:debug', '1');
location.reload();
```

Pour les désactiver : `localStorage.removeItem('nexytal:debug')`.

## Arborescence utile

```text
src/
  features/       modules métier autonomes
  shared/         briques techniques génériques
  components/     composants d'interface transverses
  pages/          composition des routes
  data/backend/   serveur Express historique, isolé du frontend
public/api/        API PHP exécutée en local et copiée au build
tests/             tests JavaScript et PHP
docs/architecture décisions et règles d'évolution
```
