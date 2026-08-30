# Rapport de couverture et qualité

Date de mesure : 20 août 2026  
Outils : Vitest 4.1.11, couverture V8 et SonarQube  
Commandes : `npm run test:coverage` puis `npm run sonar`

## Résultat Vitest

| Indicateur | Couvert | Total | Couverture | Seuil minimal | Statut |
|---|---:|---:|---:|---:|---|
| Instructions | 473 | 497 | **95,17 %** | 80 % | Réussi |
| Branches | 541 | 636 | **85,06 %** | 80 % | Réussi |
| Fonctions | 122 | 124 | **98,38 %** | 80 % | Réussi |
| Lignes | 396 | 407 | **97,29 %** | 80 % | Réussi |

La suite contient **61 tests répartis dans 7 fichiers**, tous réussis. Le test PHP
du logger réussit également avec `npm test`.

## Résultat SonarQube

| Indicateur | Résultat |
|---|---:|
| Quality Gate | **Réussi** |
| Couverture globale du périmètre déclaré | **90,7 %** |
| Couverture des lignes | **97,4 %** |
| Couverture des branches | **85,1 %** |
| Vulnérabilités | **0** |
| Bugs | **0** |
| Code smells | **104** |
| Duplication | **2,4 %** |
| Notes sécurité, fiabilité et maintenabilité | **A / A / A** |

## Périmètre mesuré

La couverture unitaire porte sur le code JavaScript déterministe et critique :

- client HTTP, erreurs normalisées et observabilité ;
- règles métier des formations, modalités, catalogue et tarification ;
- adaptateurs d'API et mappers du blog, des carrières et des certifications ;
- utilitaires de catalogue, sessions et images responsives.

Les vues et hooks React ainsi que les endpoints PHP restent analysés statiquement
par SonarQube, mais sont exclus de cette mesure unitaire. Une couverture pertinente
de ces zones nécessite des tests d'intégration avec DOM, base de données et serveur
HTTP. Le code tiers PHPMailer est également exclu de l'analyse du code applicatif.

## Cas limites vérifiés

- panne réseau, timeout, annulation et réponses HTTP invalides ;
- masquage des mots de passe, cookies, jetons et clés API dans les traces ;
- données métier absentes, JSON invalide et valeurs de repli ;
- fusion des offres BDD avec les données statiques ;
- catégories, modalités, certifications et formats d'image inconnus.

## Fichiers produits

- `coverage/index.html` : rapport HTML interactif ;
- `coverage/coverage-summary.json` : synthèse exploitable en CI ;
- `coverage/lcov.info` : rapport transmis à SonarQube.
