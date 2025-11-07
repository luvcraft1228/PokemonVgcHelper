## Plan de projet

### 1. Recherche et compréhension du format VGC
- Collecter les règles officielles actuelles (format 2v2, saison et régulation en cours) depuis les sources officielles Pokémon et sites spécialisés (Smogon, Victory Road, etc.).
- Documenter les restrictions de construction d’équipe : espèces bannies, objets limités, clauses particulières.
- Recenser les statistiques clés (tier lists, taux d’utilisation, movesets populaires) pour alimenter les suggestions de l’IA.
- Identifier les API publiques pertinentes (PokéAPI, Smogon usage stats, cérébro Pokémon, etc.) et évaluer leurs limites d’utilisation.

### 2. Vision fonctionnelle
- Gestion d’équipes personnalisées par utilisateur (création, édition, duplication, archivage).
- Assistant IA conversationnel pour recommandations de Pokémon par rôle, synergies et couverture.
- Conseils d’optimisation : movesets, EV spreads, choix d’objets, stratégies de lead.
- Module d’aide à l’obtention : meilleures méthodes d’acquisition selon le jeu et la version du joueur.
- Support multi-régulations : sélection du format (Régulation actuelle, historique, future) et prévision du support 1v1.
- Authentification utilisateur avec comptes locaux, Google et GitHub.

### 3. Architecture générale
- Backend Node.js + Express en structure modulaire (routes, contrôleurs, services, repositories).
- Base de données PostgreSQL avec ORM minimaliste natif (préférence pour requêtes SQL paramétrées, éviter les ORM lourds si possible).
- Frontend Angular 20 structuré par features, utilisation systématique d’Angular Material et SCSS modulaires.
- Service IA : encapsulation d’appels à un modèle externe (API OpenAI ou HuggingFace) via un service backend dédié.
- Synchronisation des données externes (API Pokémon) via tâches planifiées (cron) sur le backend.

### 4. Spécification Backend
- **Routes et modules**
  - `/auth` : inscription, connexion, OAuth Google/GitHub (via Passport.js ou implémentation OAuth minimale si faisable sans dépendances). Gestion de sessions JWT.
  - `/users` : profil, préférences (jeux possédés, formats suivis).
  - `/teams` : CRUD équipes, export/import, versioning léger.
  - `/pokemon` : catalogue, filtres par format, statistiques.
  - `/ia` : endpoints pour requêtes de suggestions, optimisations, conseils d’obtention.
- **Services**
  - Service de règles VGC : centralise les régulations, restrictions et formats.
  - Service IA : prépare le contexte (équipes actuelles, besoins) et enrichit les prompts avec données VGC.
  - Service de synchronisation des données publiques (moves, objets, Pokémon, taux d’utilisation).
- **Sécurité & normes**
  - Validation stricte des payloads (middleware maison ou bibliothèque légère).
  - Gestion des erreurs centralisée avec logs structurés.
  - Respect des bonnes pratiques OWASP (rate limiting de base, protections CSRF pour endpoints sensibles via token).

### 5. Modèle de données (esquisse)
- Utilisateurs : identifiants, infos OAuth, préférences de jeux.
- Équipes : nom, description, format, membres, métadonnées (date, statut).
- Membres d’équipe : référence Pokémon, moveset, EV/IV, objet, rôle.
- Règles VGC : formats, restrictions d’espèces/objets, dates de validité.
- Sources externes : cache des données API, horodatage de mise à jour.
- Suggestions IA : historique des requêtes, réponses stockées pour audit.

### 6. Spécification Frontend
- Application Angular structurée en modules : `core`, `shared`, `features` (auth, teams, assistant, profile, settings).
- Utilisation d’Angular Material (tables, dialogs, steppers, chips) pour cohérence UI.
- Gestion d’état via services Angular + RxJS, éviter NgRx initialement pour rester léger.
- Intégration d’un chat IA (composant conversation) avec streaming de réponses si possible.
- Formulaires réactifs pour la construction d’équipe avec validations custom (respect des règles VGC).
- Pages clés : dashboard, builder d’équipe, consultation de suggestions IA, comparateur de Pokémon, guide d’obtention.

### 7. Flux IA et données externes
- Prétraitement backend : collecte des données d’équipe, préférences utilisateur, méta actuelle.
- Construction de prompts standardisés incluant contraintes VGC, trous dans l’équipe, besoins de rôle.
- Post-traitement : parser la réponse pour extraire recommandations structurées (JSON), afficher dans UI.
- Configuration pour basculer entre fournisseurs IA (env var, adaptateur).
- Gestion du coût et des quotas : limiter la fréquence des appels, mettre en cache les suggestions pertinentes.

### 8. Authentification & autorisation
- Implémenter JWT stateless ; refresh tokens stockés en base avec rotation.
- OAuth 2.0 pour Google/GitHub avec flux Authorization Code.
- Middleware d’autorisation pour restreindre l’accès aux ressources d’équipe par propriétaire.
- Protection des actions critiques (suppression, reset) par confirmation côté frontend.

### 9. Intégration PostgreSQL
- Scripts SQL d’initialisation et migrations incrémentales (outillage maison simple ou `node-pg-migrate`).
- Utilisation de transactions pour opérations critiques (Création d’équipe + membres).
- Indexation des colonnes de filtrage (format, utilisateur, date de mise à jour).
- Stockage des données externes dans des tables dédiées (ex : `public_data.pokemon`).

### 10. Déploiement & CI/CD
- Conteneurisation minimale via Docker (backend, frontend, base).
- Pipeline CI : lint + tests unitaires + tests e2e (Cypress pour frontend, supertest pour backend).
- Environnements de staging/production avec variables de configuration sécurisées (secrets).
- Surveillance : logs structurés, métriques basiques (taux d’erreurs, temps de réponse).

### 11. Roadmap par phases
- **Phase 0 – Recherche** : consolidation des règles VGC et APIs, POC IA.
- **Phase 1 – Fondation** : setup backend (auth de base), base de données, modules teams/pokemon minimalistes.
- **Phase 2 – Frontend socle** : structure Angular, pages auth, dashboard, builder simple.
- **Phase 3 – Intégration IA** : endpoints `/ia`, interface de chat, recommandations basiques.
- **Phase 4 – Optimisations VGC** : validations avancées, suggestions enrichies, aide à l’obtention.
- **Phase 5 – OAuth & multi-régulations** : intégration Google/GitHub, support des variations de formats.
- **Phase 6 – Industrialisation** : tests couvrants, perf, déploiement.
- **Phase 7 – Extension 1v1** : adaptation des modèles de données et logique IA pour 1v1.

### 12. Préparation avant développement
- Valider le plan avec le client.
- Prioriser les fonctionnalités critiques pour un MVP.
- Définir la stratégie IA (modèle, budget, limites).
- Mettre en place un référentiel partagé des ressources VGC (docs internes, liens, définitions de rôles).

