# Structure de fichiers standardisée

## Principe

Pour le pattern **Model - Controller - Services - Queries**, on organise par **couche** plutôt que par feature.

## Structure standardisée

```
src/
├── models/              # Tous les models (classes métier)
│   ├── user.model.ts
│   ├── team.model.ts
│   └── pokemon.model.ts
│
├── repositories/        # Tous les repositories (accès données)
│   ├── user.repository.ts
│   ├── team.repository.ts
│   └── pokemon.repository.ts
│
├── services/           # Tous les services (logique métier)
│   ├── auth.service.ts
│   ├── team.service.ts
│   └── pokemon.service.ts
│
├── controllers/        # Tous les controllers (HTTP)
│   ├── auth.controller.ts
│   ├── team.controller.ts
│   └── pokemon.controller.ts
│
├── routes/             # Toutes les routes Express
│   ├── auth.routes.ts
│   ├── team.routes.ts
│   └── pokemon.routes.ts
│
├── middleware/         # Middlewares Express
│   ├── auth.middleware.ts
│   └── error-handler.ts
│
├── config/             # Configuration
│   ├── env.ts
│   └── database.ts
│
├── database/           # Infrastructure DB
│   ├── pool.ts
│   └── migrate.ts
│
├── shared/             # Utilitaires partagés
│   ├── http-error.ts
│   ├── logger.ts
│   ├── password.ts
│   └── token.ts
│
├── api/                # Point d'entrée API
│   └── routes/
│       └── index.ts    # Enregistre toutes les routes
│
├── app.ts              # Configuration Express
└── server.ts           # Point d'entrée serveur
```

## Pourquoi cette organisation ?

### Avantages

1. **Séparation claire des responsabilités** : Chaque dossier = une couche du pattern
2. **Facilité de navigation** : On sait où chercher (tous les models au même endroit)
3. **Réutilisabilité** : Un model peut être utilisé par plusieurs services
4. **Scalabilité** : Facile d'ajouter de nouvelles features sans créer de nouveaux dossiers
5. **Standard** : C'est l'organisation classique pour M-C-S-Q

### Exemple de flux

```
Request → routes/auth.routes.ts
         → controllers/auth.controller.ts
         → services/auth.service.ts
         → repositories/user.repository.ts
         → models/user.model.ts
```

## Migration depuis l'ancienne structure

**Ancienne (par feature) :**
```
modules/auth/
  ├── models/
  ├── repositories/
  ├── services/
  └── controllers/
```

**Nouvelle (par couche) :**
```
models/user.model.ts
repositories/user.repository.ts
services/auth.service.ts
controllers/auth.controller.ts
routes/auth.routes.ts
```

## Convention de nommage

- **Models** : `{Entity}.model.ts` (ex. `user.model.ts`, `team.model.ts`)
- **Repositories** : `{Entity}.repository.ts` (ex. `user.repository.ts`)
- **Services** : `{Feature}.service.ts` (ex. `auth.service.ts`, `team.service.ts`)
- **Controllers** : `{Feature}.controller.ts` (ex. `auth.controller.ts`)
- **Routes** : `{Feature}.routes.ts` (ex. `auth.routes.ts`)

