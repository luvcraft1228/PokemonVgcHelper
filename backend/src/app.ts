import express, { type Application } from "express";
import { registerRoutes } from "./api/routes";

/**
 * Construit et configure l'application Express principale.
 * @returns Instance Express prête à l'emploi.
 */
export function createApp(): Application {
  const app: Application = express();

  app.disable("x-powered-by");
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

  registerRoutes(app);

  return app;
}

