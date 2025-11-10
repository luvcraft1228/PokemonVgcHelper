import type { NextFunction, Request, Response } from "express";

import { getEnvironment } from "../config/env";
import { UnauthorizedError } from "../shared/http-error";
import { verifyToken } from "../shared/token";

type JwtPayload = {
  readonly userId: number;
  readonly email: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Middleware pour vérifier et extraire le JWT d'accès depuis l'en-tête Authorization.
 * @param req Requête HTTP.
 * @param res Réponse HTTP.
 * @param next Fonction next Express.
 */
export function authenticateMiddleware(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("Token d'accès manquant");
  }

  const token = authHeader.substring(7);
  const config = getEnvironment();

  try {
    const payload = verifyToken<JwtPayload>(token, config.jwt.accessSecret);
    req.user = payload;
    next();
  } catch (error) {
    throw new UnauthorizedError("Token invalide ou expiré");
  }
}

