const app = require("./app");
const { env } = require("./core/config/env");
const { connectDB } = require("./core/database/db");
const { logger } = require("./core/logger/logger");
const {
  startOutboundRetryWorker,
} = require("./workers/outbound-retry.worker");

async function bootstrap() {
  await connectDB();

  startOutboundRetryWorker();

  app.listen(env.PORT, () => {
    logger.info(
      {
        port: env.PORT,
        environment: env.NODE_ENV,
        whatsappProvider: env.WHATSAPP_PROVIDER,
        outboundRetryWorker: env.ENABLE_OUTBOUND_RETRY_WORKER,
      },
      "JEA Digital Assistant API started"
    );
  });
}

bootstrap();