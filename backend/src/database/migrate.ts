import type { PoolClient } from "pg";
import { readdir } from "node:fs/promises";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

import "../config/env"; // Charge les variables d'environnement depuis .env
import { getPool } from "./pool";
import { log } from "../shared/logger";

type Migration = {
  readonly name: string;
  readonly sql: string;
};

const MIGRATIONS_DIR: string = join(process.cwd(), "migrations");

/**
 * Charge toutes les migrations SQL disponibles sur disque.
 * @returns Liste ordonnée des migrations.
 */
async function loadMigrations(): Promise<Migration[]> {
  let entries: string[] = [];

  try {
    entries = await readdir(MIGRATIONS_DIR);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      log("warn", "Aucune migration trouvée (dossier manquant)", { path: MIGRATIONS_DIR });
      return [];
    }

    throw error;
  }
  const sqlFiles: string[] = entries.filter((fileName) => fileName.endsWith(".sql"));
  sqlFiles.sort();

  const migrations: Migration[] = await Promise.all(
    sqlFiles.map(async (fileName) => {
      const filePath: string = join(MIGRATIONS_DIR, fileName);
      const sql: string = await readFile(filePath, "utf-8");
      return {
        name: fileName,
        sql,
      } satisfies Migration;
    }),
  );

  return migrations;
}

/**
 * Assure l'existence de la table de suivi des migrations.
 * @param client Client PostgreSQL actif.
 */
async function ensureMigrationsTable(client: PoolClient): Promise<void> {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      executed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

/**
 * Exécute les migrations manquantes dans l'ordre.
 */
async function runMigrations(): Promise<void> {
  const pool = getPool();
  const client = await pool.connect();

  try {
    await ensureMigrationsTable(client);
    const { rows } = await client.query<{ name: string }>("SELECT name FROM schema_migrations");
    const executedNames: Set<string> = new Set(rows.map((row: { name: string }) => row.name));

    const migrations: Migration[] = await loadMigrations();

    for (const migration of migrations) {
      if (executedNames.has(migration.name)) {
        log("info", "Migration already applied", { name: migration.name });
        continue;
      }

      log("info", "Applying migration", { name: migration.name });
      await client.query("BEGIN");
      try {
        await client.query(migration.sql);
        await client.query("INSERT INTO schema_migrations (name) VALUES ($1)", [migration.name]);
        await client.query("COMMIT");
      } catch (error) {
        await client.query("ROLLBACK");
        log("error", "Migration failed", { name: migration.name, error });
        throw error;
      }
    }

    log("info", "Migrations complete");
  } finally {
    client.release();
    await pool.end();
  }
}

/**
 * Point d'entrée CLI pour lancer les migrations.
 */
async function main(): Promise<void> {
  try {
    await runMigrations();
  } catch (error) {
    log("error", "Migration CLI error", { error });
    process.exitCode = 1;
  }
}

void main();

