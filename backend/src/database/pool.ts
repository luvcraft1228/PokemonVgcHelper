import type { Pool, PoolClient } from "pg";
import { Pool as PgPool } from "pg";

import { getDatabaseConfig, toPgConfig } from "../config/database";
import { log } from "../shared/logger";

let singletonPool: Pool | null = null;

/**
 * Fournit un pool PostgreSQL partagé pour l'application.
 * @returns Pool PostgreSQL initialisé.
 */
export function getPool(): Pool {
  if (singletonPool === null) {
    const config = toPgConfig(getDatabaseConfig());
    singletonPool = new PgPool(config);

    singletonPool.on("error", (error: unknown) => {
      log("error", "Unexpected database error", { error });
    });
  }

  return singletonPool;
}

/**
 * Obtient un client issu du pool avec journalisation simple.
 * @returns Client PostgreSQL à libérer manuellement.
 */
export async function getClient(): Promise<PoolClient> {
  const client: PoolClient = await getPool().connect();
  log("debug", "Database client acquired");
  return client;
}

