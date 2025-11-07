import type { PoolConfig } from "pg";

export type DatabaseConfig = {
  readonly host: string;
  readonly port: number;
  readonly user: string;
  readonly password: string;
  readonly database: string;
  readonly ssl: boolean;
  readonly maxConnections: number;
  readonly idleTimeoutMillis: number;
};

/**
 * Construit la configuration PostgreSQL à partir des variables d'environnement.
 * @returns Configuration prête à l'emploi pour initialiser un pool PostgreSQL.
 */
export function getDatabaseConfig(): DatabaseConfig {
  const host: string = process.env.DATABASE_HOST ?? "localhost";
  const port: number = Number.parseInt(process.env.DATABASE_PORT ?? "15432", 10);
  const user: string = process.env.DATABASE_USER ?? "postgres";
  const password: string = process.env.DATABASE_PASSWORD ?? "postgres";
  const database: string = process.env.DATABASE_NAME ?? "postgres";
  const ssl: boolean = (process.env.DATABASE_SSL ?? "false").toLowerCase() === "true";
  const maxConnections: number = Number.parseInt(process.env.DATABASE_POOL_MAX ?? "10", 10);
  const idleTimeoutMillis: number = Number.parseInt(process.env.DATABASE_POOL_IDLE_TIMEOUT ?? "10000", 10);

  if (Number.isNaN(port) || port <= 0) {
    throw new Error("Invalid DATABASE_PORT value");
  }

  if (Number.isNaN(maxConnections) || maxConnections <= 0) {
    throw new Error("Invalid DATABASE_POOL_MAX value");
  }

  if (Number.isNaN(idleTimeoutMillis) || idleTimeoutMillis < 0) {
    throw new Error("Invalid DATABASE_POOL_IDLE_TIMEOUT value");
  }

  return {
    host,
    port,
    user,
    password,
    database,
    ssl,
    maxConnections,
    idleTimeoutMillis,
  };
}

/**
 * Convertit la configuration maison vers le format `pg`.
 * @param config Configuration interne validée.
 * @returns Configuration compatible `pg`.
 */
export function toPgConfig(config: DatabaseConfig): PoolConfig {
  return {
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
    ssl: config.ssl,
    max: config.maxConnections,
    idleTimeoutMillis: config.idleTimeoutMillis,
  } satisfies PoolConfig;
}

