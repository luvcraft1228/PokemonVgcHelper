# Environnement Docker

## Prérequis
- Docker Desktop (Windows) ou Docker Engine + Docker Compose v2.
- Activer le support WSL2 sur Windows pour de meilleures performances.
- Facultatif : GPU compatible pour accélérer Ollama (sinon CPU-only).

## Services
- `backend` : API Node.js/Express (TypeScript) lancée via `npm run start:dev` (accessible sur `http://localhost:3001`).
- `postgres` : base PostgreSQL 16 avec volume persistant `postgres-data`.
- `ollama` : moteur IA local accessible sur `http://localhost:11434`.

## Commandes de base
- Lancer l’ensemble :
  ```bash
  docker compose up --build
  ```
- Arrêter (en conservant les volumes) :
  ```bash
  docker compose down
  ```
- Rejouer les migrations :
  ```bash
  docker compose run --rm backend npm run migrate
  ```
- Accéder au shell du backend :
  ```bash
  docker compose exec backend sh
  ```

## Volumes
- `backend-node-modules` : dépendances Node isolées du host.
- `postgres-data` : données PostgreSQL persistées.
- `ollama-data` : modèles téléchargés via Ollama.

## Notes importantes
- Le service backend attend PostgreSQL sous l’hôte `postgres` (réseau compose).
- Les migrations SQL doivent être ajoutées dans `backend/migrations/*`.
- L’API Ollama est optionnelle mais préconfigurée ; désactivez le service si non utilisé.
- Pensez à charger un modèle (ex. `docker compose exec ollama ollama run mistral`) avant d’interroger l’endpoint IA.

