import { config as loadEnv } from "dotenv";

loadEnv();

export type Environment = {
  readonly nodeEnv: "development" | "production" | "test" | "ci";
  readonly port: number;
};

/**
 * Récupère la configuration d'environnement et applique des valeurs par défaut sûres.
 * @param inputPort Port HTTP à utiliser si défini dans les variables d'environnement.
 * @returns Configuration normalisée de l'application.
 */
export function getEnvironment(inputPort: string | undefined = process.env.PORT): Environment {
  const parsedPort: number = Number.parseInt(inputPort ?? "3000", 10);

  if (Number.isNaN(parsedPort) || parsedPort <= 0) {
    throw new Error("Invalid PORT environment variable");
  }

  const nodeEnv = (process.env.NODE_ENV ?? "development") as Environment["nodeEnv"];

  return {
    nodeEnv,
    port: parsedPort,
  };
}

