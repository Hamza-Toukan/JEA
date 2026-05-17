const { generateMockMessageId } = require("../../../core/utils/generate-mock-message-id");
const { logger } = require("../../../core/logger/logger");

/**
 * @param {import('../transport/transport-payload.contract').TransportPayload} payload
 * @param {string} to
 */
async function dispatchTransportPayload(payload, to) {
  const providerMessageId = generateMockMessageId();

  switch (payload.type) {
    case "text":
      logger.info(
        {
          provider: "mock",
          transportPayloadType: payload.type,
          to,
          bodyLength: payload.body.length,
          providerMessageId,
        },
        "Mock WhatsApp text transport payload (not sent to external API)"
      );
      break;

    case "twilio_quick_reply":
      logger.info(
        {
          provider: "mock",
          transportPayloadType: payload.type,
          to,
          buttonCount: payload.buttons.length,
          providerMessageId,
        },
        "Mock WhatsApp quick reply transport payload (not sent to external API)"
      );
      break;

    case "twilio_list":
      logger.info(
        {
          provider: "mock",
          transportPayloadType: payload.type,
          to,
          sectionCount: payload.sections.length,
          providerMessageId,
        },
        "Mock WhatsApp list transport payload (not sent to external API)"
      );
      break;

    default:
      throw new Error(`Unsupported mock transport payload type: ${payload.type}`);
  }

  return {
    providerMessageId,
    provider: "mock",
    delivered: payload.type === "text",
  };
}

/** @type {import('./whatsapp-provider.interface').WhatsAppProvider} */
const mockProvider = {
  id: "mock",

  async sendWhatsAppMessage({ to, payload }) {
    return dispatchTransportPayload(payload, to);
  },
};

module.exports = {
  mockProvider,
  dispatchTransportPayload,
};
