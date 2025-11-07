import type { Server } from "node:http";
import { createServer } from "node:http";

import { createApp } from "./app";
import { getEnvironment } from "./config/env";
import { log } from "./shared/logger";

/**
 * Démarre le serveur HTTP Express en utilisant la configuration d'environnement.
 * @returns Instance de serveur HTTP en cours d'exécution.
 */
export function bootstrap(): Server {
  const app = createApp();
  const { port, nodeEnv } = getEnvironment();
  const server: Server = createServer(app);

  server.listen(port, () => {
    log("info", "HTTP server started", { port, nodeEnv });
  });

  server.on("error", (error: unknown) => {
    log("error", "HTTP server failed", { error });
    process.exitCode = 1;
  });

  return server;
}

if (require.main === module) {
  bootstrap();
}

