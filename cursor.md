## Règles de travail

### Principles d’architecture
- Respecter une architecture Clean Code.
- Appliquer systématiquement les principes DRY, SOLID et KISS.
- Le code doit être en anglais, les commentaires en français.
- Documenter les fonctions avec la syntaxe officielle JSDoc/TypeDoc pour décrire paramètres et retours.
- Prioriser en permanence la sécurité et la performance.

### Contraintes générales
- Fournisseurs IA gratuits uniquement (aucun coût d’exploitation autorisé).
- Traiter le projet comme destiné à la production, tout en restant sans coût.
- Couverture de tests la plus complète possible (unitaires, intégration, e2e).
- Secrets et configurations sensibles stockés dans un fichier `.env` local.
- Utiliser les APIs tierces nécessaires en respectant leurs limites et licences.

### Structure des projets
- Maintenir deux projets séparés : `backend/` (Node.js + Express) et `frontend/` (Angular 20 + Angular Material).
- Utiliser SCSS pour les styles côté frontend.
- Fournir un design avec thèmes clair/sombre personnalisables, ambiance Pokémon.

### Gestion du code source
- Branches Git :
  - `main` : production.
  - `release-candidate` : branche stable pour le sprint courant.
  - `feature-<id>` : une branche par nouvelle fonctionnalité (ex. `feature-1234`).
- Chaque série de modifications doit être validée par un commit.

### Hébergement cible
- Backend Node.js sous Linux (Ubuntu) avec PM2.
- Frontend Angular servi par Nginx sous Linux (Ubuntu).
- Base de données PostgreSQL hébergée sur une machine Linux dédiée.

