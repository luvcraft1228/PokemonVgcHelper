# Roadmap de développement

## Vue d'ensemble

Ce document détaille les phases de développement selon le plan défini dans `project.md`.

---

## Phase 0 – Recherche ✅ TERMINÉE

- [x] Documentation des règles VGC actuelles (format 2v2, régulations)
- [x] Recensement des APIs publiques (PokéAPI, Smogon, Victory Road, etc.)
- [x] Évaluation des solutions IA gratuites (Ollama retenu)

**Livrables :**
- `docs/research/vgc_rules.md`
- `docs/research/pokemon_data_sources.md`
- `docs/research/ai_options.md`

---

## Phase 1 – Fondation Backend ✅ TERMINÉE

### 1.1 Setup Backend ✅
- [x] Structure Node.js/Express avec TypeScript
- [x] Configuration ESLint et compilation
- [x] Docker Compose (backend, PostgreSQL, Ollama)
- [x] Configuration PostgreSQL et système de migrations

### 1.2 Authentification ✅
- [x] Structure routes/services/auth (scaffold)
- [x] Migration SQL `users` et `refresh_tokens`
- [x] Repository utilisateurs
- [x] Service auth complet (register/login/refresh/logout)
- [x] Middleware JWT
- [x] Tests unitaires auth (27 tests, 100% couverture)

### 1.3 Modules Teams/Pokemon ⏳ REPORTÉ
- [ ] Migrations SQL pour tables équipes et Pokémon
- [ ] Models Teams/Pokemon
- [ ] Repositories Teams/Pokemon
- [ ] Services Teams/Pokemon
- [ ] Routes/Contrôleurs Teams/Pokemon

**Note :** Reporté après la création du frontend pour permettre les tests manuels de l'authentification.

---

## Phase 2 – Frontend socle 🔄 PROCHAINE ÉTAPE

- [ ] Initialisation Angular 20
- [ ] Structure modules (core, shared, features)
- [ ] Configuration Angular Material 3 + thèmes (clair/sombre Pokémon)
- [ ] Pages authentification (login/register)
- [ ] Intégration avec backend (service HTTP, gestion tokens)
- [ ] Dashboard utilisateur simple
- [ ] Navigation et guards d'authentification

---

## Phase 3 – Intégration IA ⏳ À VENIR

- [ ] Service backend Ollama (adapter)
- [ ] Endpoints `/ia` (suggestions, optimisations)
- [ ] Interface chat IA côté frontend
- [ ] Construction de prompts VGC structurés
- [ ] Cache des suggestions

---

## Phase 4 – Optimisations VGC ⏳ À VENIR

- [ ] Validations avancées (règles VGC, clauses)
- [ ] Suggestions enrichies (synergies, couverture)
- [ ] Module aide à l'obtention (méthodes par jeu)
- [ ] Support multi-régulations

---

## Phase 5 – OAuth & Multi-régulations ⏳ À VENIR

- [ ] Intégration OAuth Google
- [ ] Intégration OAuth GitHub
- [ ] Support variations de formats (historique, futures)

---

## Phase 6 – Industrialisation ⏳ À VENIR

- [ ] Tests unitaires complets
- [ ] Tests d'intégration
- [ ] Tests e2e (Cypress)
- [ ] Optimisations performance
- [ ] Déploiement production

---

## Phase 7 – Extension 1v1 ⏳ À VENIR

- [ ] Adaptation modèles de données pour 1v1
- [ ] Logique IA adaptée au format 1v1

---

## État actuel

**Dernière mise à jour :** 2025-01-27

**Phase active :** Phase 2 (Frontend socle)

**Changement de plan :** Priorité donnée au frontend pour permettre les tests manuels de l'authentification avant de continuer avec les modules backend.

**Prochaines étapes immédiates :**
1. Créer le frontend Angular 20 avec authentification (Phase 2)
2. Tester manuellement l'authentification via l'interface
3. Reprendre les modules Teams/Pokemon (Phase 1.3) après validation du frontend

