import { getClient } from "../database/pool";
import { User } from "../models/user.model";

type UserRow = {
  readonly id: number;
  readonly email: string;
  readonly password_hash: string;
  readonly created_at: Date | string;
  readonly updated_at: Date | string;
};

export type RefreshTokenRow = {
  readonly id: number;
  readonly user_id: number;
  readonly token_hash: string;
  readonly expires_at: Date;
  readonly created_at: Date;
  readonly revoked_at: Date | null;
};

/**
 * Repository pour les opérations sur les utilisateurs et tokens de rafraîchissement.
 * Retourne des Models (User) plutôt que des rows SQL brutes.
 */
export class UserRepository {
  /**
   * Trouve un utilisateur par son email.
   * @param email Email recherché.
   * @returns Utilisateur trouvé (Model) ou null.
   */
  public async findByEmail(email: string): Promise<User | null> {
    const client = await getClient();
    try {
      const { rows } = await client.query<UserRow>("SELECT * FROM users WHERE email = $1 LIMIT 1", [email]);
      return rows[0] ? new User(rows[0]) : null;
    } finally {
      client.release();
    }
  }

  /**
   * Trouve un utilisateur par son identifiant.
   * @param userId Identifiant recherché.
   * @returns Utilisateur trouvé (Model) ou null.
   */
  public async findById(userId: number): Promise<User | null> {
    const client = await getClient();
    try {
      const { rows } = await client.query<UserRow>("SELECT * FROM users WHERE id = $1 LIMIT 1", [userId]);
      return rows[0] ? new User(rows[0]) : null;
    } finally {
      client.release();
    }
  }

  /**
   * Crée un nouvel utilisateur.
   * @param email Email de l'utilisateur.
   * @param passwordHash Hash du mot de passe.
   * @returns Utilisateur créé (Model).
   */
  public async create(email: string, passwordHash: string): Promise<User> {
    const client = await getClient();
    try {
      const { rows } = await client.query<UserRow>(
        "INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *",
        [email, passwordHash],
      );
      if (!rows[0]) {
        throw new Error("Failed to create user");
      }
      return new User(rows[0]);
    } finally {
      client.release();
    }
  }

  /**
   * Stocke un refresh token pour un utilisateur.
   * @param userId Identifiant de l'utilisateur.
   * @param tokenHash Hash du token.
   * @param expiresAt Date d'expiration.
   * @returns Token créé.
   */
  public async createRefreshToken(userId: number, tokenHash: string, expiresAt: Date): Promise<RefreshTokenRow> {
    const client = await getClient();
    try {
      const { rows } = await client.query<RefreshTokenRow>(
        "INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1, $2, $3) RETURNING *",
        [userId, tokenHash, expiresAt],
      );
      if (!rows[0]) {
        throw new Error("Failed to create refresh token");
      }
      return rows[0];
    } finally {
      client.release();
    }
  }

  /**
   * Trouve un refresh token par son hash.
   * @param tokenHash Hash du token.
   * @returns Token trouvé ou null.
   */
  public async findRefreshToken(tokenHash: string): Promise<RefreshTokenRow | null> {
    const client = await getClient();
    try {
      const { rows } = await client.query<RefreshTokenRow>(
        "SELECT * FROM refresh_tokens WHERE token_hash = $1 AND revoked_at IS NULL AND expires_at > NOW() LIMIT 1",
        [tokenHash],
      );
      return rows[0] ?? null;
    } finally {
      client.release();
    }
  }

  /**
   * Révoque un refresh token.
   * @param tokenHash Hash du token à révoquer.
   */
  public async revokeRefreshToken(tokenHash: string): Promise<void> {
    const client = await getClient();
    try {
      await client.query("UPDATE refresh_tokens SET revoked_at = NOW() WHERE token_hash = $1", [tokenHash]);
    } finally {
      client.release();
    }
  }

  /**
   * Révoque tous les refresh tokens d'un utilisateur.
   * @param userId Identifiant de l'utilisateur.
   */
  public async revokeAllUserTokens(userId: number): Promise<void> {
    const client = await getClient();
    try {
      await client.query("UPDATE refresh_tokens SET revoked_at = NOW() WHERE user_id = $1 AND revoked_at IS NULL", [
        userId,
      ]);
    } finally {
      client.release();
    }
  }
}

