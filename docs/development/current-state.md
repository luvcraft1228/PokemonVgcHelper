# État actuel du projet

**Dernière mise à jour :** 2025-01-27

## Phase active

**Phase 1 – Fondation Backend** ✅ TERMINÉE

**Phase 2 – Frontend socle** 🔄 PROCHAINE ÉTAPE

### ✅ Complété

1. **Setup Backend**
   - Structure Node.js/Express + TypeScript
   - Configuration ESLint et compilation
   - Docker Compose (backend, PostgreSQL, Ollama)
   - Système de migrations SQL

2. **Authentification**
   - Migration SQL `users` et `refresh_tokens`
   - Model `User` (classe métier)
   - Repository `UserRepository` (accès DB)
   - Service `AuthService` (logique métier complète)
   - Controller `auth.controller.ts` (HTTP)
   - Routes `/auth/*` (register, login, refresh, logout)
   - Middleware JWT `authenticateMiddleware`
   - Hash de mots de passe (Scrypt)
   - JWT natif (HS256, sans dépendances)
   - **Tests unitaires complets** (27 tests, 100% couverture service/controller)

3. **Architecture standardisée**
   - Structure par couche (Model-Controller-Services-Queries)
   - Documentation des patterns
   - Roadmap détaillée

4. **Infrastructure de tests**
   - Configuration Jest + ts-jest
   - Tests unitaires pour AuthService (register, login, refresh, logout)
   - Tests unitaires pour AuthController (validation, appels service)
   - Scripts npm : `test`, `test:watch`, `test:coverage`

### ⏳ Prochaines étapes immédiates

**Changement de plan :** Priorité donnée au frontend pour permettre les tests manuels de l'authentification.

1. **Frontend Angular 20** (Phase 2) - PROCHAINE ÉTAPE
   - Initialisation Angular 20
   - Structure modules (core, shared, features)
   - Configuration Angular Material 3 + thèmes (clair/sombre Pokémon)
   - Pages authentification (login/register)
   - Intégration avec backend (service HTTP, gestion tokens)
   - Dashboard utilisateur simple
   - Navigation et guards d'authentification

2. **Modules Teams/Pokemon** (Phase 1.3) - REPORTÉ
   - Migrations SQL pour tables équipes et Pokémon
   - Models `Team` et `Pokemon`
   - Repositories correspondants
   - Services et controllers
   - Tests unitaires pour les nouveaux modules
   - **Reprendre après validation du frontend**

## Structure actuelle

```
backend/src/
├── models/              # Models (User)
├── repositories/        # Repositories (UserRepository)
├── services/           # Services (AuthService)
├── controllers/        # Controllers (auth.controller)
├── routes/             # Routes (auth.routes)
├── middleware/         # Middlewares (auth, error-handler)
├── config/             # Configuration (env, database)
├── database/           # Infrastructure DB (pool, migrate)
└── shared/             # Utilitaires (logger, password, token, http-error)
```

## Points d'attention

- **Base de données** : PostgreSQL configuré, migrations fonctionnelles
- **Docker** : Stack complète (backend:3001, postgres:15432, ollama:11434)
- **Sécurité** : JWT, hash Scrypt, validation inputs
- **Architecture** : Pattern M-C-S-Q respecté, structure standardisée

## Configuration

- Backend : `http://localhost:3001`
- PostgreSQL : `localhost:15432` (user: `vgc_helper`, pass: `vgc_helper`)
- Ollama : `http://localhost:11434`

## Documentation disponible

- `docs/development/roadmap.md` - Roadmap complète
- `docs/development/architecture-patterns.md` - Explication des patterns
- `docs/development/file-structure.md` - Structure standardisée
- `docs/research/` - Recherches Phase 0

