const app = require("./app");
const { env } = require("./core/config/env");
const { connectDB } = require("./core/database/db");

async function bootstrap() {
  await connectDB();

  app.listen(env.PORT, () => {
    console.log(`🚀 JEA Digital Assistant API running on port ${env.PORT}`);
    console.log(`🌍 Environment: ${env.NODE_ENV}`);
    console.log(`💬 WhatsApp Provider: ${env.WHATSAPP_PROVIDER}`);
  });
}

bootstrap();