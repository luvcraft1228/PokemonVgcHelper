## Règles de travail

### Principles d’architecture
- **IMPÉRATIF** Respecter une architecture Clean Code.
- **IMPÉRATIF**  Appliquer systématiquement les principes DRY, SOLID et KISS.
- **IMPÉRATIF**  Le code doit être en anglais, les commentaires en français.
- **IMPÉRATIF**  Documenter les fonctions avec la syntaxe officielle JSDoc/TypeDoc pour décrire paramètres et retours. (sauf pour les trucs evidents comme req et res)
- **IMPÉRATIF**  Prioriser en permanence la sécurité et la performance.

### Architecture Backend
- **IMPÉRATIF** Suivre le pattern **Model - Controller - Services - Queries** :
  - **Model** : Classe représentant une entité métier (ex. `User`, `Team`, `Pokemon`).
  - **Controller** : Gère les requêtes HTTP, validation basique, appelle les services.
  - **Services** : Logique métier, orchestration entre repositories/queries.
  - **Queries/Repositories** : Accès aux données (SQL paramétré ou via ORM selon décision).
- **Note** : Décision à prendre sur l'utilisation de Sequelize (ORM) vs requêtes SQL natives. Pattern Model-Controller-Services-Queries reste valable dans les deux cas.

### Contraintes générales
- Fournisseurs IA gratuits uniquement (aucun coût d’exploitation autorisé).
- Traiter le projet comme destiné à la production, tout en restant sans coût.
- Couverture de tests la plus complète possible (unitaires, intégration, e2e).
-  **IMPÉRATIF** Secrets et configurations sensibles stockés dans un fichier `.env` local.
- Utiliser les APIs tierces nécessaires en respectant leurs limites et licences.

### Structure des projets
- **IMPÉRATIF** Maintenir deux projets séparés : `backend/` (Node.js + Express) et `frontend/`.
- **IMPÉRATIF** Angular 20
- **IMPÉRATIF** Angular Material 3 - Le moins de changements aux components possible en cas de changements de cet api.
- **IMPÉRATIF** Utiliser SCSS pour les styles côté frontend.
- **IMPÉRATIF** Fournir un design avec thèmes clair/sombre personnalisables, ambiance Pokémon.

### Gestion du code source
- Branches Git :
  - `main` : production.
  - `release-candidate` : branche stable pour le sprint courant.
  - `feature-<id>` : une branche par nouvelle fonctionnalité (ex. `feature-1234`).
- **IMPÉRATIF** Chaque série de modifications doit être validée par un commit.

### Hébergement cible
- Backend Node.js sous Linux (Ubuntu) avec PM2.
- Frontend Angular servi par Nginx sous Linux (Ubuntu).
- Base de données PostgreSQL hébergée sur une machine Linux dédiée.

