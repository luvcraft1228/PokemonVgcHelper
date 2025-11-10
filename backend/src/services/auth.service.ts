import { createHmac } from "node:crypto";
import type { Request } from "express";

import { getEnvironment } from "../config/env";
import { UnauthorizedError, BadRequestError } from "../shared/http-error";
import { hashPassword, verifyPassword } from "../shared/password";
import { signToken, verifyToken } from "../shared/token";
import { UserRepository } from "../repositories/user.repository";

export type RegisterInput = {
  readonly email: string;
  readonly password: string;
};

export type LoginInput = {
  readonly email: string;
  readonly password: string;
};

export type TokenPair = {
  readonly accessToken: string;
  readonly refreshToken: string;
};

type JwtPayload = {
  readonly userId: number;
  readonly email: string;
};

/**
 * Service applicatif dédié aux opérations d'authentification.
 */
export class AuthService {
  private readonly userRepository: UserRepository;
  private readonly config: ReturnType<typeof getEnvironment>;

  public constructor() {
    this.userRepository = new UserRepository();
    this.config = getEnvironment();
  }

  /**
   * Inscrit un nouvel utilisateur.
   * @param input Données d'inscription.
   * @returns Paires de jetons générés.
   */
  public async register(input: RegisterInput): Promise<TokenPair> {
    const existing = await this.userRepository.findByEmail(input.email);
    if (existing !== null) {
      throw new BadRequestError("Un compte avec cet email existe déjà");
    }

    const passwordHash = hashPassword(input.password);
    const user = await this.userRepository.create(input.email, passwordHash);

    return this.generateTokenPair(user.id, user.email);
  }

  /**
   * Authentifie un utilisateur existant.
   * @param input Informations de connexion.
   * @returns Paires de jetons générés.
   */
  public async login(input: LoginInput): Promise<TokenPair> {
    const user = await this.userRepository.findByEmail(input.email);
    if (user === null) {
      throw new UnauthorizedError("Email ou mot de passe incorrect");
    }

    const isValid = verifyPassword(input.password, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedError("Email ou mot de passe incorrect");
    }

    return this.generateTokenPair(user.id, user.email);
  }

  /**
   * Rafraîchit les jetons d'un utilisateur.
   * @param refreshToken Jeton de rafraîchissement présenté.
   * @returns Nouvelle paire de jetons.
   */
  public async refresh(refreshToken: string): Promise<TokenPair> {
    let payload: JwtPayload;
    try {
      payload = verifyToken<JwtPayload>(refreshToken, this.config.jwt.refreshSecret);
    } catch (error) {
      throw new UnauthorizedError("Token invalide ou expiré");
    }

    const tokenHash = this.hashToken(refreshToken);
    const storedToken = await this.userRepository.findRefreshToken(tokenHash);
    if (storedToken === null) {
      throw new UnauthorizedError("Token invalide ou révoqué");
    }

    await this.userRepository.revokeRefreshToken(tokenHash);

    return this.generateTokenPair(payload.userId, payload.email);
  }

  /**
   * Invalide un refresh token (logout).
   * @param req Requête d'origine (pour extraire le token).
   */
  public async logout(req: Request): Promise<void> {
    const { refreshToken } = req.body ?? {};
    if (typeof refreshToken !== "string" || refreshToken.length === 0) {
      return;
    }

    const tokenHash = this.hashToken(refreshToken);
    await this.userRepository.revokeRefreshToken(tokenHash);
  }

  private async generateTokenPair(userId: number, email: string): Promise<TokenPair> {
    const payload: JwtPayload = { userId, email };

    const accessToken = signToken(payload, this.config.jwt.accessSecret, this.config.jwt.accessTtlSeconds);
    const refreshToken = signToken(payload, this.config.jwt.refreshSecret, this.config.jwt.refreshTtlSeconds);

    const tokenHash = this.hashToken(refreshToken);
    const expiresAt = new Date(Date.now() + this.config.jwt.refreshTtlSeconds * 1000);
    await this.userRepository.createRefreshToken(userId, tokenHash, expiresAt);

    return { accessToken, refreshToken };
  }

  private hashToken(token: string): string {
    return createHmac("sha256", this.config.jwt.refreshSecret).update(token).digest("hex");
  }
}

