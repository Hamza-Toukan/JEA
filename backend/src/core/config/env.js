const dotenv = require("dotenv");
const { z } = require("zod");

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().default(5000),
  MONGO_URI: z.string().min(1, "MONGO_URI is required"),
  FRONTEND_URL: z.string().default("http://localhost:5173"),
  WHATSAPP_PROVIDER: z.enum(["mock", "meta", "twilio"]).default("mock"),

  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
    .default("info"),

  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  JWT_EXPIRES_IN: z.string().default("1d"),

  ADMIN_SEED_NAME: z.string().optional(),
  ADMIN_SEED_EMAIL: z.string().email().optional(),
  ADMIN_SEED_PASSWORD: z.string().min(8).optional(),

  ENABLE_MOCK_WHATSAPP: z.enum(["true", "false"]).default("false"),

  MOCK_WHATSAPP_SECRET: z.string().optional(),

  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_WHATSAPP_NUMBER: z.string().optional(),
  TWILIO_MESSAGING_SERVICE_SID: z.string().optional(),
  TWILIO_CONTENT_LANGUAGE: z.string().default("ar"),

  /** Full public webhook URL Twilio signs against (required in production when validation is on). */
  TWILIO_WEBHOOK_PUBLIC_URL: z.string().url().optional(),
  /** Set to "true" in local development to skip Twilio signature validation. */
  TWILIO_SKIP_SIGNATURE_VALIDATION: z.enum(["true", "false"]).default("false"),

  ENABLE_OUTBOUND_RETRY_WORKER: z.enum(["true", "false"]).default("true"),
  OUTBOUND_DELIVERY_MAX_ATTEMPTS: z.coerce.number().int().min(1).default(5),
  OUTBOUND_RETRY_INTERVAL_MS: z.coerce.number().int().min(5000).default(60000),
  OUTBOUND_RETRY_BATCH_SIZE: z.coerce.number().int().min(1).max(100).default(20),
  OUTBOUND_RETRY_BACKOFF_BASE_MS: z.coerce
    .number()
    .int()
    .min(1000)
    .default(30000),

  TWILIO_TEMPLATE_VERIFICATION_SUCCESS_SID: z.string().optional(),
  TWILIO_TEMPLATE_TICKET_CREATED_SID: z.string().optional(),

  TWILIO_TEMPLATE_QUICK_REPLY_2_SID: z.string().optional(),
  TWILIO_TEMPLATE_QUICK_REPLY_3_SID: z.string().optional(),
  TWILIO_TEMPLATE_LIST_4_SID: z.string().optional(),
  TWILIO_TEMPLATE_LIST_5_SID: z.string().optional(),
  TWILIO_TEMPLATE_LIST_6_SID: z.string().optional(),
  TWILIO_TEMPLATE_LIST_7_SID: z.string().optional(),
  TWILIO_TEMPLATE_LIST_8_SID: z.string().optional(),
  TWILIO_TEMPLATE_LIST_9_SID: z.string().optional(),
  TWILIO_TEMPLATE_LIST_10_SID: z.string().optional(),
  TWILIO_TEMPLATE_AUTH_OTP_SID: z.string().optional(),
  TWILIO_TEMPLATE_GENERIC_NOTIFICATION_SID: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌ Invalid environment variables:");
  console.error(z.flattenError(parsed.error).fieldErrors);
  process.exit(1);
}

module.exports = {
  env: parsed.data,
};
