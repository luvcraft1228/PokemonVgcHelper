## Sources de données publiques Pokémon

> **Objectif Phase 0 :** cartographier les APIs/données gratuites exploitables sans coûts récurrents.

### 1. PokéAPI (https://pokeapi.co/)
- **Type :** RESTful, open source, gratuit.
- **Contenu :** espèces, statistiques de base, types, moves, items, egg groups, évolutions.
- **Format :** JSON, pagination, endpoints indépendants.
- **Limites :** aucun SLA officiel, taux de requêtes conseillé <100/min ; prévoir un cache.
- **Intégration :**
  - Synchronisation backend quotidienne pour alimenter tables `pokemon`, `moves`, `items`.
  - Utiliser l’URL officielle ou auto-héberger (dépôt GitHub) pour garantir disponibilité.

### 2. Veekun Data Dump (https://github.com/veekun/pokedex)
- **Type :** Dump SQL/CSV libre (licence CC-BY-SA 3.0).
- **Contenu :** données exhaustives jusqu’à Gen 7 (à compléter manuellement pour SV).
- **Usage :** base initiale pour peupler la BDD, puis appliquer des migrations pour Gen 9.

### 3. Pokémon Showdown / Smogon Usage Stats
- **Type :** Fichiers texte accessibles sur `https://www.smogon.com/stats/`.
- **Contenu :** taux d’utilisation mensuels par format (inclut VGC 202x, Battle Stadium).
- **Limites :** pas d’API officielle ; nécessite parsing manuel.
- **Licence :** usage communautaire (attribuer Smogon).
- **Intégration :** tâche CRON téléchargeant les stats VGC et calculant tendances.

### 4. Victory Road VGC (https://victoryroadvgc.com/)
- **Type :** Articles + teamsheets CSV pour événements majeurs.
- **Accès :** téléchargement manuel ou via scraping léger (respecter robots.txt, demander permission si besoin).
- **Intérêt :** données d’équipes gagnantes, métagame analyses.
- **Action :** constituer un connecteur semi-automatique pour importer teamsheets publiques.

### 5. Limitless Pokémon (https://play.limitlesstcg.com/)
- **Type :** Plateforme tournois, propose exports JSON pour événements VGC.
- **Usage :** récupérer données structurées sur les participants et leurs équipes.
- **Statut :** vérifier conditions d’utilisation avant automatisation.

### 6. Serebii / Bulbapedia
- **Type :** Encyclopédies web (HTML).
- **Usage :** compléments (méthodes d’obtention, disponibilité par version).
- **Limites :** pas d’API officielle, scraping soumis à CGU.
- **Approche :**
  - Prioriser Serebii pour les tables d’obtention par jeu.
  - Mettre en cache les résultats localement pour limiter le trafic.

### 7. Pikalytics (https://www.pikalytics.com/)
- **Type :** Tableau de bord VGC, propose API GraphQL non officielle.
- **Limites :** conditions d’utilisation restreintes ; nécessite accord pour usage étendu.
- **Plan :** contacter Pikalytics si besoin de volume important, sinon se contenter des exports publics.

### 8. Données officielles Play! Pokémon
- **Type :** PDF/HTML pour règlements et listes d’équipes (Open Team Sheets).
- **Approche :** scraper/extraire manuellement puis stocker en base.

### Stratégie de collecte
- Prioriser PokéAPI pour la structure de base et auto-hébergement si nécessaire.
- Mettre en place un module backend `data-sync` pour orchestrer téléchargements + parsing.
- Normaliser toutes les données (types, moves, availability) dans PostgreSQL avant consommation par l’IA.
- Documenter l’origine, la date et la licence de chaque dataset importé.

