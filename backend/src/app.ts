import express, { type Application } from "express";
import cors from "cors";
import { registerRoutes } from "./api/routes";
import { errorHandler } from "./middleware/error-handler";

/**
 * Construit et configure l'application Express principale.
 * @returns Instance Express prête à l'emploi.
 */
export function createApp(): Application {
  const app: Application = express();

  app.disable("x-powered-by");

  // Configuration CORS pour autoriser le frontend Angular
  app.use(
    cors({
      origin: process.env.FRONTEND_URL || "http://localhost:4200",
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
    })
  );

  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true }));

  registerRoutes(app);

  app.use(errorHandler);

  return app;
}

