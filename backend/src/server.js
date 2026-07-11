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
  // Temporary logo copy logic
  try {
    const fs = require("fs");
    const path = require("path");
    const src = "C:\\Users\\eqra2\\.gemini\\antigravity-ide\\brain\\215827c8-5b03-4fdd-9a6f-85f469b968d6\\media__1783582208179.png";
    const destDir1 = "C:\\Dev\\JEA\\frontend\\src\\assets";
    const destDir2 = "C:\\Dev\\JEA\\frontend\\public";
    
    fs.mkdirSync(destDir1, { recursive: true });
    fs.mkdirSync(destDir2, { recursive: true });
    
    fs.copyFileSync(src, path.join(destDir1, "logo.png"));
    fs.copyFileSync(src, path.join(destDir2, "logo.png"));
    console.log("✅ JEA Logo successfully copied to frontend src/assets/logo.png and public/logo.png");
  } catch (err) {
    console.error("❌ Failed to copy JEA logo:", err.message);
  }

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
// Trigger reload 10