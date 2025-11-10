import { Router } from "express";

import { loginController, logoutController, refreshController, registerController } from "../controllers/auth.controller";

/**
 * Crée le routeur d'authentification.
 * @returns Routeur Express prêt pour l'API `/auth`.
 */
export function createAuthRouter(): Router {
  const router: Router = Router();

  router.post("/register", async (req, res, next) => {
    try {
      await registerController(req, res);
    } catch (error) {
      next(error);
    }
  });

  router.post("/login", async (req, res, next) => {
    try {
      await loginController(req, res);
    } catch (error) {
      next(error);
    }
  });

  router.post("/refresh", async (req, res, next) => {
    try {
      await refreshController(req, res);
    } catch (error) {
      next(error);
    }
  });

  router.post("/logout", async (req, res, next) => {
    try {
      await logoutController(req, res);
    } catch (error) {
      next(error);
    }
  });

  return router;
}

