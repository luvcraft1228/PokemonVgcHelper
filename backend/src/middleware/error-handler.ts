import type { NextFunction, Request, Response } from "express";

import { HttpError } from "../shared/http-error";
import { log } from "../shared/logger";

/**
 * Middleware global de gestion d'erreurs HTTP.
 * @param error Erreur interceptée.
 * @param _req Requête originale (non utilisée).
 * @param res Réponse HTTP.
 * @param _next Fonction next (non utilisée).
 */
export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (error instanceof HttpError) {
    log("warn", "Handled http error", { status: error.status, code: error.code, message: error.message });
    res.status(error.status).json({ error: error.code, message: error.message });
    return;
  }

  log("error", "Unhandled error", { error });
  res.status(500).json({ error: "internal_error", message: "Une erreur interne est survenue." });
}

