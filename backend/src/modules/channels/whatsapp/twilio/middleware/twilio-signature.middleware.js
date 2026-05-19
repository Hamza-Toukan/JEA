const twilio = require("twilio");
const { env } = require("../../../../../core/config/env");
const { logger } = require("../../../../../core/logger/logger");

function stripWhatsAppPrefix(from) {
  if (typeof from !== "string") {
    return "";
  }
  return from.replace(/^whatsapp:/i, "").trim();
}

function shouldSkipSignatureValidation() {
  return env.TWILIO_SKIP_SIGNATURE_VALIDATION === "true";
}

function isSignatureValidationEnabled() {
  if (shouldSkipSignatureValidation()) {
    return false;
  }

  return Boolean(
    env.TWILIO_AUTH_TOKEN && String(env.TWILIO_AUTH_TOKEN).trim()
  );
}

/**
 * Resolves the public URL Twilio used when signing the webhook.
 * Production should set TWILIO_WEBHOOK_PUBLIC_URL explicitly (load balancers, TLS termination).
 *
 * @param {import('express').Request} req
 * @returns {string | null}
 */
function resolveTwilioWebhookUrl(req) {
  if (env.TWILIO_WEBHOOK_PUBLIC_URL) {
    return String(env.TWILIO_WEBHOOK_PUBLIC_URL).trim();
  }

  if (env.NODE_ENV === "production") {
    return null;
  }

  const protocol =
    req.get("x-forwarded-proto") || req.protocol || "http";
  const host = req.get("x-forwarded-host") || req.get("host");

  if (!host) {
    return null;
  }

  return `${protocol}://${host}${req.originalUrl}`;
}

/**
 * Validates Twilio webhook signatures using the official SDK.
 * Expects `express.urlencoded({ extended: false })` on the route (req.body).
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function validateTwilioSignatureMiddleware(req, res, next) {
  const messageSid =
    typeof req.body?.MessageSid === "string" ? req.body.MessageSid : null;
  const customerPhone = stripWhatsAppPrefix(req.body?.From || "");
  const signature =
    typeof req.headers["x-twilio-signature"] === "string"
      ? req.headers["x-twilio-signature"]
      : "";

  if (!isSignatureValidationEnabled()) {
    req.twilioSignatureValid = null;

    logger.debug(
      {
        requestId: req.requestId,
        twilioSignatureValid: null,
        providerMessageId: messageSid,
        customerPhone: customerPhone || null,
        validationSkipped: true,
      },
      "Twilio webhook signature validation skipped"
    );

    return next();
  }

  const webhookUrl = resolveTwilioWebhookUrl(req);

  if (!webhookUrl) {
    logger.error(
      {
        requestId: req.requestId,
        providerMessageId: messageSid,
        customerPhone: customerPhone || null,
      },
      "Twilio webhook signature validation misconfigured: TWILIO_WEBHOOK_PUBLIC_URL is required in production"
    );

    return res.status(500).type("text/xml").send("<Response></Response>");
  }

  const twilioSignatureValid = twilio.validateRequest(
    env.TWILIO_AUTH_TOKEN,
    signature,
    webhookUrl,
    req.body || {}
  );

  req.twilioSignatureValid = twilioSignatureValid;

  logger.info(
    {
      requestId: req.requestId,
      twilioSignatureValid,
      providerMessageId: messageSid,
      customerPhone: customerPhone || null,
      webhookUrl,
    },
    "Twilio webhook signature validation completed"
  );

  if (!twilioSignatureValid && env.NODE_ENV === "production") {
    logger.warn(
      {
        requestId: req.requestId,
        providerMessageId: messageSid,
        customerPhone: customerPhone || null,
      },
      "Twilio webhook rejected: invalid signature"
    );

    return res.status(403).type("text/xml").send("<Response></Response>");
  }

  if (!twilioSignatureValid) {
    logger.warn(
      {
        requestId: req.requestId,
        providerMessageId: messageSid,
        customerPhone: customerPhone || null,
      },
      "Twilio webhook received with invalid signature (non-production — request allowed)"
    );
  }

  return next();
}

module.exports = {
  validateTwilioSignatureMiddleware,
  isSignatureValidationEnabled,
  shouldSkipSignatureValidation,
  resolveTwilioWebhookUrl,
};
