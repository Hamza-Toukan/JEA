const app = require("./app");
const { env } = require("./core/config/env");
const { connectDB } = require("./core/database/db");
const { logger } = require("./core/logger/logger");
const { isRedisConfigured } = require("./core/queue/redis.connection");
const {
  isAsyncInboundProcessingEnabled,
} = require("./core/queue/inbound-message.queue");
const {
  startOutboundRetryWorker,
} = require("./workers/outbound-retry.worker");

async function bootstrap() {
  await connectDB();

  if (env.ENABLE_OUTBOUND_RETRY_WORKER === "true") {
    logger.warn(
      "ENABLE_OUTBOUND_RETRY_WORKER is deprecated — use worker process with ENABLE_OUTBOUND_RETRY_QUEUE"
    );
    startOutboundRetryWorker();
  }

  if (
    env.ENABLE_ASYNC_INBOUND_PROCESSING === "true" &&
    !isRedisConfigured()
  ) {
    logger.warn(
      "ENABLE_ASYNC_INBOUND_PROCESSING is true but REDIS_URL is missing — Twilio webhooks will fall back to synchronous processing"
    );
  }

  app.listen(env.PORT, () => {
    logger.info(
      {
        port: env.PORT,
        environment: env.NODE_ENV,
        whatsappProvider: env.WHATSAPP_PROVIDER,
        redisConfigured: isRedisConfigured(),
        asyncInboundProcessing: isAsyncInboundProcessingEnabled(),
        outboundRetryQueue: env.ENABLE_OUTBOUND_RETRY_QUEUE,
      },
      "JEA Digital Assistant API started"
    );
  });
}

bootstrap();