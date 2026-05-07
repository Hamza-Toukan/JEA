const app = require("./app");
const { env } = require("./core/config/env");
const { connectDB } = require("./core/database/db");
const { logger } = require("./core/logger/logger");

async function bootstrap() {
  await connectDB();

  app.listen(env.PORT, () => {
    logger.info(
      {
        port: env.PORT,
        environment: env.NODE_ENV,
        whatsappProvider: env.WHATSAPP_PROVIDER
      },
      "JEA Digital Assistant API started"
    );
  });
}

bootstrap();