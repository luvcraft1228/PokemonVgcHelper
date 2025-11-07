import { Router } from "express";

/**
 * Crée le routeur de contrôle de santé de l'API.
 * @returns Routeur Express exposant les statuts de service.
 */
export function createHealthRouter(): Router {
  const router: Router = Router();

  router.get("/live", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  router.get("/ready", (_req, res) => {
    res.status(200).json({ status: "ready" });
  });

  return router;
}

