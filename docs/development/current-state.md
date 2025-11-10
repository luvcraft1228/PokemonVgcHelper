# État actuel du projet

**Dernière mise à jour :** 2025-01-27

## Phase active

**Phase 1 – Fondation Backend** ✅ TERMINÉE

**Phase 2 – Frontend socle** ✅ TERMINÉE

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

5. **Frontend Angular 20** (Phase 2) ✅
   - Initialisation Angular 20 avec structure moderne
   - Structure modules (core, shared, features)
   - Configuration Angular Material 3 + thèmes Pokémon (clair/sombre)
   - Pages authentification (login/register) avec formulaires réactifs
   - Services HTTP et auth avec signals Angular
   - Guards et interceptors pour la navigation
   - Dashboard utilisateur simple
   - Configuration CORS backend
   - Utilisation de la syntaxe moderne (@if, @for, signals)

### ⏳ Prochaines étapes immédiates

1. **Tests manuels de l'authentification** - EN COURS
   - Tester le flux complet login/register via l'interface
   - Valider la gestion des tokens et la navigation

2. **Modules Teams/Pokemon** (Phase 1.3) - PROCHAINE ÉTAPE
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

