process.env.NODE_ENV = "test";
process.env.MONGO_URI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/jea_test";
process.env.JWT_SECRET =
  process.env.JWT_SECRET || "test_jwt_secret_at_least_32_chars";
process.env.TWILIO_AUTH_TOKEN = "test_auth_token";
process.env.TWILIO_SKIP_SIGNATURE_VALIDATION = "false";
process.env.TWILIO_WEBHOOK_PUBLIC_URL =
  "https://api.example.com/api/whatsapp/twilio/webhook";

const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const twilio = require("twilio");
const {
  isSignatureValidationEnabled,
  shouldSkipSignatureValidation,
  resolveTwilioWebhookUrl,
} = require("../src/modules/channels/whatsapp/twilio/middleware/twilio-signature.middleware");

describe("twilio-signature.middleware helpers", () => {
  it("enables validation when auth token is configured", () => {
    assert.equal(shouldSkipSignatureValidation(), false);
    assert.equal(isSignatureValidationEnabled(), true);
  });

  it("validates signature using Twilio SDK with parsed body", () => {
    const authToken = "test_auth_token";
    const url = "https://example.com/api/whatsapp/twilio/webhook";
    const params = { MessageSid: "SM123", From: "whatsapp:+962790000000" };
    const signature = twilio.getExpectedTwilioSignature(authToken, url, params);

    assert.equal(
      twilio.validateRequest(authToken, signature, url, params),
      true
    );
    assert.equal(
      twilio.validateRequest(authToken, "invalid", url, params),
      false
    );
  });

  it("resolveTwilioWebhookUrl prefers configured public URL", () => {
    const req = {
      protocol: "http",
      originalUrl: "/api/whatsapp/twilio/webhook",
      get: (header) => {
        if (header === "host") {
          return "localhost:5000";
        }
        return undefined;
      },
    };

    assert.equal(
      resolveTwilioWebhookUrl(req),
      "https://api.example.com/api/whatsapp/twilio/webhook"
    );
  });
});
