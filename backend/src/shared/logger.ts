type LogLevel = "info" | "error" | "warn" | "debug";

/**
 * Journalise un message dans la console de manière uniforme.
 * @param level Niveau de log (`info`, `error`, `warn`, `debug`).
 * @param message Texte à afficher.
 * @param metadata Informations complémentaires optionnelles.
 */
export function log(level: LogLevel, message: string, metadata?: Record<string, unknown>): void {
  const timestamp: string = new Date().toISOString();
  const payload: Record<string, unknown> = {
    timestamp,
    message,
    ...(metadata ?? {}),
  };

  switch (level) {
    case "info":
      console.info(payload);
      break;
    case "error":
      console.error(payload);
      break;
    case "warn":
      console.warn(payload);
      break;
    default:
      console.debug(payload);
  }
}

