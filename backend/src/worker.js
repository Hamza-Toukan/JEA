const { logger } = require("./core/logger/logger");
const { env } = require("./core/config/env");
const {
  startWorkers,
  registerGracefulShutdownHandlers,
} = require("./workers/worker-bootstrap");

async function bootstrapWorker() {
  registerGracefulShutdownHandlers();

  try {
    await startWorkers();

    logger.info(
      {
        environment: env.NODE_ENV,
        whatsappProvider: env.WHATSAPP_PROVIDER,
      },
      "JEA Digital Assistant worker process started"
    );
  } catch (error) {
    logger.error(
      { errorMessage: error.message },
      "Worker process failed to start"
    );
    process.exit(1);
  }
}

bootstrapWorker();
