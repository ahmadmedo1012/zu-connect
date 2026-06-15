import app from "./app";
import { logger } from "./lib/logger";
import { initAdminSocket } from "./services/admin-socket";
import { telegramService } from "./services/telegram";

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const httpServer = app.listen(port, async (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  // Initialize socket.io for admin realtime
  initAdminSocket(httpServer);

  // Initialize Telegram service
  await telegramService.initialize();

  logger.info({ port }, "Server listening — admin socket & telegram initialized");
});

export default httpServer;
