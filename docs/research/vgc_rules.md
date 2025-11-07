## Pokemon VGC – Synthèse des règles (Phase 0)

> **Date de référence :** 7 novembre 2025 — à vérifier et mettre à jour avant chaque release.

### 1. Format général
- Combats en double (2v2) avec sélection simultanée.
- Chaque joueur prépare une équipe de 6 Pokémon et en choisit 4 pour le match.
- Tous les Pokémon sont ramenés au niveau 50 automatiquement.
- Objet unique par Pokémon, pas de duplication d’objet (« Item Clause »).
- Interdiction des Pokémon dupliqués (« Species Clause ») et de certains Pokémon légendaires/mythiques selon la régulation active.
- Minuterie standard officielle :
  - Aperçu d’équipe ~90 s.
  - Sélection des actions ~45 s par tour.
  - Temps de jeu total ~20 minutes (sujet à variation selon saison).
- Match en 1 manche gagnante (Bo1) pour les tournois locaux, Bo3 pour les rondes finales officielles.

### 2. Régulations récentes (Scarlet/Violet)
- **Regulation G (juin – août 2024)** : inclusion des Paradoxes et Treasures of Ruin, restriction des Pokémon mythiques.
- **Regulation H (septembre – novembre 2024, réintroduite en 2025 pour certains événements) :**
  - Autorise l’ensemble des Pokédex Paldea, Kitakami et Blueberry via Pokémon HOME.
  - Interdit toujours la plupart des légendaires « cover » (Koraidon, Miraidon, etc.) et mythiques.
  - Limite à un seul Pokémon restreint (ex : aucun, selon TPCi).
- **Tendance 2025 :** cycle de régulations trimestrielles alignées sur les extensions « DLC Indigo Disk ». Attendre publication officielle de The Pokémon Company International (TPCi) avant lancement production.
- **Sources officielles :**
  - Portail Play! Pokémon – Règlements VG (`https://www.pokemon.com/fr/play-pokemon/` > section Ressources > Règles VG).
  - Centre de presse TPCi pour annonces des Regulation Sets.
- **Sources communautaires utiles :** Victory Road VGC, Nimbasa City Post, Pikalytics (à croiser avec la source officielle).

### 3. Clauses et restrictions clés
- **Pokémon interdits courants :** Mewtwo, Mew, Rayquaza, Xerneas, Zacian, Zamazenta, Koraidon, Miraidon, etc. — à vérifier à chaque régulation.
- **Objets restreints :** certains événements peuvent bannir des objets spécifiques (ex. objets signature non disponibles).
- **Movesets interdits :** rares, mais vérifier pour les attaques événementielles (ex : « Dark Void » historquement banni).
- **Transferts Pokémon HOME :** seuls les Pokémon marqués de l’icône réglementaire sont autorisés.

### 4. Informations à collecter pour l’application
- Table de correspondance Regulation Set → Pokémon autorisés/interdits, objets restreints.
- Mises à jour de la méta : taux d’utilisation, teamsheets gagnantes.
- Détails des formats alternatifs (saison Ladder Battle Stadium) pour prévoir le support futur 1v1.
- Historique des régulations pour permettre aux utilisateurs d’explorer les anciennes saisons.

### 5. Prochaines actions
- Mettre en place une tâche de veille (cron + flux RSS Play! Pokémon) pour détecter les changements de régulation.
- Créer une table `regulations` dans la base de données pour versionner les règles et autorisations.
- Préparer un script d’ingestion depuis les PDF officiels (parsing manuel initial + stockage structuré).
- Stocker les teamsheets officielles disponibles (format Open Team Sheet) pour entraîner le moteur de recommandations.

> **Note :** Les règles évoluent rapidement. Documenter toute source utilisée avec date de consultation et conserver une copie locale (PDF) pour audit.

