# Patterns d'architecture Backend

## Pattern Model - Controller - Services - Queries

### Vue d'ensemble

Ce pattern organise le code en couches distinctes avec des responsabilités claires :

```
Request HTTP
    ↓
Controller (validation basique, format réponse)
    ↓
Service (logique métier, orchestration)
    ↓
Repository/Queries (accès données)
    ↓
Database
```

---

## 1. Model (Modèle)

**Rôle :** Classe TypeScript représentant une entité métier en mémoire.

**Caractéristiques :**
- Classe avec propriétés typées
- Pas de logique de persistance (pas de SQL)
- Peut contenir des méthodes utilitaires (ex. `isValid()`, `toJSON()`)
- Représente l'état d'une entité à un instant T

**Exemple :**
```typescript
export class User {
  public readonly id: number;
  public readonly email: string;
  public readonly passwordHash: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  public constructor(data: UserData) {
    this.id = data.id;
    this.email = data.email;
    this.passwordHash = data.passwordHash;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }

  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      email: this.email,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}
```

---

## 2. Controller

**Rôle :** Point d'entrée HTTP, validation basique des inputs, formatage des réponses.

**Responsabilités :**
- Extraire les données de la requête (`req.body`, `req.params`)
- Valider le format (types, champs requis)
- Appeler le service approprié
- Gérer les codes HTTP et formater la réponse

**Ce qu'il NE fait PAS :**
- Logique métier complexe
- Accès direct à la base de données
- Transformations de données complexes

**Exemple :**
```typescript
export async function registerController(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body ?? {};
  
  // Validation basique
  if (typeof email !== "string" || email.length === 0) {
    throw new BadRequestError("Email requis");
  }
  
  // Délégation au service
  const tokens = await authService.register({ email, password });
  
  // Formatage réponse
  res.status(201).json(tokens);
}
```

---

## 3. Service

**Rôle :** Logique métier, orchestration entre plusieurs repositories, règles d'affaires.

**Responsabilités :**
- Appliquer les règles métier (ex. "un email ne peut être utilisé qu'une fois")
- Orchestrer plusieurs opérations (ex. créer utilisateur + envoyer email)
- Transformer les données entre formats (Model ↔ DTO)
- Gérer les transactions si nécessaire

**Exemple :**
```typescript
export class AuthService {
  public async register(input: RegisterInput): Promise<TokenPair> {
    // Règle métier : vérifier unicité email
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing !== null) {
      throw new BadRequestError("Email déjà utilisé");
    }
    
    // Transformation : mot de passe → hash
    const passwordHash = hashPassword(input.password);
    
    // Création via repository
    const user = await this.userRepository.create(input.email, passwordHash);
    
    // Génération tokens (logique métier)
    return this.generateTokenPair(user.id, user.email);
  }
}
```

---

## 4. Repository / Queries

**Rôle :** Accès aux données, abstraction de la base de données.

**Responsabilités :**
- Exécuter les requêtes SQL (ou via ORM)
- Convertir les résultats SQL → Models
- Gérer les connexions/pools de base de données
- Isoler le code SQL du reste de l'application

**Concept de Repository :**
Un repository est un **abstraction de l'accès aux données**. Il cache les détails d'implémentation (SQL, tables, colonnes) derrière une interface simple orientée domaine.

**Avantages :**
- **Testabilité** : on peut mocker le repository sans toucher à la DB
- **Maintenabilité** : si on change de DB, seul le repository change
- **Réutilisabilité** : plusieurs services peuvent utiliser le même repository
- **Séparation des responsabilités** : le service ne connaît pas le SQL

**Exemple :**
```typescript
export class UserRepository {
  /**
   * Trouve un utilisateur par email.
   * Retourne un Model User, pas une row SQL brute.
   */
  public async findByEmail(email: string): Promise<User | null> {
    const client = await getClient();
    try {
      const { rows } = await client.query<UserRow>(
        "SELECT * FROM users WHERE email = $1 LIMIT 1",
        [email]
      );
      
      // Conversion row SQL → Model
      return rows[0] ? new User(rows[0]) : null;
    } finally {
      client.release();
    }
  }
}
```

**Différence Repository vs Query :**
- **Repository** : Interface orientée domaine (`findByEmail`, `create`, `update`)
- **Query** : Plus proche du SQL, peut être plus générique

Dans notre cas, on utilise des **Repositories** car ils sont plus expressifs et alignés avec le domaine métier.

---

## Flux complet exemple : Inscription utilisateur

```
1. HTTP POST /auth/register
   ↓
2. Controller (auth.controller.ts)
   - Extrait { email, password } de req.body
   - Valide format (string, non vide)
   - Appelle authService.register()
   ↓
3. Service (auth.service.ts)
   - Vérifie si email existe (appelle userRepository.findByEmail())
   - Hash le mot de passe
   - Crée l'utilisateur (appelle userRepository.create())
   - Génère les tokens JWT
   - Retourne TokenPair
   ↓
4. Repository (user.repository.ts)
   - Exécute SQL: SELECT * FROM users WHERE email = $1
   - Convertit row SQL → Model User
   - Retourne User ou null
   ↓
5. Controller
   - Reçoit TokenPair du service
   - Formate réponse HTTP 201 avec JSON
```

---

## Avantages de ce pattern

1. **Séparation des responsabilités** : Chaque couche a un rôle clair
2. **Testabilité** : On peut tester chaque couche indépendamment
3. **Maintenabilité** : Changements isolés (ex. changer SQL n'affecte pas le service)
4. **Réutilisabilité** : Un repository peut être utilisé par plusieurs services
5. **Évolutivité** : Facile d'ajouter de nouvelles fonctionnalités

---

## Adaptation pour ce projet

**Structure actuelle :**
```
src/modules/auth/
  ├── auth.controller.ts    (Controller)
  ├── auth.service.ts       (Service)
  ├── auth.routes.ts        (Routes Express)
  └── repositories/
      └── user.repository.ts (Repository)
```

**À ajouter :**
```
src/modules/auth/
  └── models/
      └── user.model.ts     (Model - classe User)
```

Le repository retournera des instances de `User` (Model) au lieu de `UserRow` (type SQL brut).

