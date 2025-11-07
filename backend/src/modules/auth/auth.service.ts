import type { Request } from "express";

import { NotImplementedError } from "../../shared/http-error";

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

/**
 * Service applicatif dédié aux opérations d'authentification.
 */
export class AuthService {
  /**
   * Inscrit un nouvel utilisateur.
   * @param input Données d'inscription.
   * @returns Paires de jetons générés.
   */
  public async register(input: RegisterInput): Promise<TokenPair> {
    throw new NotImplementedError(`Registration not implemented for ${input.email}`);
  }

  /**
   * Authentifie un utilisateur existant.
   * @param input Informations de connexion.
   * @returns Paires de jetons générés.
   */
  public async login(input: LoginInput): Promise<TokenPair> {
    throw new NotImplementedError(`Login not implemented for ${input.email}`);
  }

  /**
   * Rafraîchit les jetons d'un utilisateur.
   * @param refreshToken Jeton de rafraîchissement présenté.
   * @returns Nouvelle paire de jetons.
   */
  public async refresh(refreshToken: string): Promise<TokenPair> {
    throw new NotImplementedError(`Refresh not implemented for token ${refreshToken}`);
  }

  /**
   * Invalide un refresh token (logout).
   * @param _request Requête d'origine (pour contextualiser l'agent utilisateur).
   */
  public async logout(_request: Request): Promise<void> {
    throw new NotImplementedError("Logout not implemented");
  }
}

