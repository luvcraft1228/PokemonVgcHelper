import express, { type Application } from "express";
import { registerRoutes } from "./api/routes";
import { errorHandler } from "./middleware/error-handler";

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

  app.use(errorHandler);

  return app;
}

