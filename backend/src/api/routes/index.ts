import type { Application, Request, Response } from "express";
import { createHealthRouter } from "./health.routes";
import { createAuthRouter } from "../../routes/auth.routes";

/**
 * Enregistre tous les routeurs HTTP sur l'application Express.
 * @param app Instance Express cible.
 */
export function registerRoutes(app: Application): void {
  app.get("/", (_req: Request, res: Response) => {
    res.status(200).json({ name: "pokemon-vgc-helper", status: "running" });
  });

  app.use("/health", createHealthRouter());
  app.use("/auth", createAuthRouter());
}

