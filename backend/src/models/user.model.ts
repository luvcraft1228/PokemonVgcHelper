/**
 * Modèle représentant un utilisateur dans l'application.
 */
export class User {
  public readonly id: number;
  public readonly email: string;
  public readonly passwordHash: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  /**
   * Construit une instance User à partir de données brutes.
   * @param data Données utilisateur (typiquement issues de la base de données).
   */
  public constructor(data: {
    readonly id: number;
    readonly email: string;
    readonly password_hash: string;
    readonly created_at: Date | string;
    readonly updated_at: Date | string;
  }) {
    this.id = data.id;
    this.email = data.email;
    this.passwordHash = data.password_hash;
    this.createdAt = typeof data.created_at === "string" ? new Date(data.created_at) : data.created_at;
    this.updatedAt = typeof data.updated_at === "string" ? new Date(data.updated_at) : data.updated_at;
  }

  /**
   * Convertit l'utilisateur en JSON (sans le hash de mot de passe).
   * @returns Représentation JSON sécurisée de l'utilisateur.
   */
  public toJSON(): Record<string, unknown> {
    return {
      id: this.id,
      email: this.email,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}

