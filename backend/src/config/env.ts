import { config as loadEnv } from "dotenv";

loadEnv();

export type Environment = {
  readonly nodeEnv: "development" | "production" | "test" | "ci";
  readonly port: number;
  readonly jwt: {
    readonly accessSecret: string;
    readonly refreshSecret: string;
    readonly accessTtlSeconds: number;
    readonly refreshTtlSeconds: number;
  };
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
  const accessSecret = process.env.JWT_ACCESS_SECRET;
  const refreshSecret = process.env.JWT_REFRESH_SECRET;

  if (!accessSecret || !refreshSecret) {
    throw new Error("JWT secrets must be provided");
  }

  const accessTtlSeconds: number = Number.parseInt(process.env.JWT_ACCESS_EXPIRES_IN ?? "900", 10);
  const refreshTtlSeconds: number = Number.parseInt(process.env.JWT_REFRESH_EXPIRES_IN ?? "1209600", 10);

  if (Number.isNaN(accessTtlSeconds) || accessTtlSeconds <= 0) {
    throw new Error("JWT_ACCESS_EXPIRES_IN must be a positive integer");
  }

  if (Number.isNaN(refreshTtlSeconds) || refreshTtlSeconds <= 0) {
    throw new Error("JWT_REFRESH_EXPIRES_IN must be a positive integer");
  }

  return {
    nodeEnv,
    port: parsedPort,
    jwt: {
      accessSecret,
      refreshSecret,
      accessTtlSeconds,
      refreshTtlSeconds,
    },
  };
}

