import type { Request, Response } from "express";

import { AuthService } from "./auth.service";
import { BadRequestError } from "../../shared/http-error";

const authService = new AuthService();

/**
 * Gère l'inscription utilisateur.
 * @param req Requête HTTP contenant email/mot de passe.
 * @param res Réponse HTTP.
 */
export async function registerController(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body ?? {};
  validateCredentials(email, password);
  const tokens = await authService.register({ email, password });
  res.status(201).json(tokens);
}

/**
 * Gère la connexion utilisateur.
 * @param req Requête HTTP contenant email/mot de passe.
 * @param res Réponse HTTP.
 */
export async function loginController(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body ?? {};
  validateCredentials(email, password);
  const tokens = await authService.login({ email, password });
  res.status(200).json(tokens);
}

/**
 * Gère la génération d'une nouvelle paire de jetons depuis un refresh token.
 * @param req Requête HTTP contenant le refresh token.
 * @param res Réponse HTTP.
 */
export async function refreshController(req: Request, res: Response): Promise<void> {
  const { refreshToken } = req.body ?? {};
  if (typeof refreshToken !== "string" || refreshToken.length === 0) {
    throw new BadRequestError("Le refresh token est requis");
  }

  const tokens = await authService.refresh(refreshToken);
  res.status(200).json(tokens);
}

/**
 * Gère la déconnexion utilisateur.
 * @param req Requête HTTP (utilisée pour le contexte agent/ip).
 * @param res Réponse HTTP.
 */
export async function logoutController(req: Request, res: Response): Promise<void> {
  await authService.logout(req);
  res.status(204).send();
}

function validateCredentials(email: unknown, password: unknown): asserts email is string & { length: number } {
  if (typeof email !== "string" || email.length === 0) {
    throw new BadRequestError("Le champ email est requis");
  }

  if (typeof password !== "string" || password.length < 8) {
    throw new BadRequestError("Le mot de passe doit contenir au moins 8 caractères");
  }
}

