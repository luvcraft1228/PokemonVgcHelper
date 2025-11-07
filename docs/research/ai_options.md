## Options IA gratuites pour recommandations d’équipe

> **Contraintes :** zéro coût d’exploitation, déploiement sur infrastructure contrôlée, respect des règles Clean Code (pas de dépendances lourdes si évitable).

### 1. Modèles open source auto-hébergés

#### 1.1 Ollama + modèles légers
- **Description :** Ollama fournit un serveur local facile à installer (Linux) avec API HTTP.
- **Modèles recommandés :**
  - `mistral:7b-instruct` (polyvalent, licence Apache 2.0).
  - `phi3:mini-4k-instruct` (Microsoft, performances solides pour prompts courts).
- **Avantages :**
  - 100 % gratuit (exécution locale).
  - Contrôle total des données (confidentialité).
  - API simple à intégrer depuis le backend Express.
- **Inconvénients :**
  - Nécessite machine avec GPU/CPU capable (prévoir dimensionnement serveur IA séparé si besoin).
  - Qualité inférieure aux modèles premium ; compenser par prompts riches et données de contexte.
- **Plan PoC :** installer Ollama sur environnement dev, exposer endpoint `http://localhost:11434/api/generate`, envoyer prompt VGC et mesurer latence/qualité.

#### 1.2 llama.cpp / ggml
- **Description :** Exécution directe de modèles quantifiés via C++.
- **Usage :** intégrer une instance dédiée au backend pour éviter complexité réseau.
- **Avantage :** encore plus léger que Ollama, mais nécessite plus de code glue.

### 2. Services communautaires gratuits (fallback)
- **Hugging Face Inference (gratuit communautaire)** : accès via `https://api-inference.huggingface.co/models/<model>` avec throttle strict (~30 requêtes/min, latence élevée).
- **Limitations :** disponibilité non garantie, risques de blocage. À garder comme solution de secours ou pour prototypage rapide.

### 3. Stratégie d’intégration
- Encapsuler toutes les interactions IA dans un service backend `AiAdapter`.
- Supporter plusieurs fournisseurs via configuration (`provider=ollama`, `provider=huggingface`, etc.).
- Implémenter un cache de suggestions pour réduire les appels répétés.
- Journaliser les prompts/réponses (anonymisées) pour audit qualité.
- Ajouter tests unitaires sur la construction de prompt (pas sur les réponses, non déterministes).

### 4. Données d’amorçage pour l’IA
- Fournir au modèle un contexte structuré :
  - Composition d’équipe actuelle + rôles manquants.
  - Règles de régulation pertinentes.
  - Statistiques d’utilisation (top 10 Pokémon, moves populaires).
  - Jeux possédés par l’utilisateur pour filtrer les suggestions.
- Utiliser un schéma JSON dans le prompt pour récupérer des réponses structurées (ex. suggestions + justification + moveset).

### 5. Prochaines étapes
- Valider la faisabilité matérielle (CPU/GPU) pour Ollama/llama.cpp sur l’infra cible.
- Préparer un script de test (Node.js) appelant l’API Ollama avec un prompt VGC type.
- Évaluer la qualité des suggestions sur 2-3 scénarios réels (ex. mode pluie, Trick Room, hyper-offense).
- Ajuster le prompt engineering et décider du modèle par défaut.

