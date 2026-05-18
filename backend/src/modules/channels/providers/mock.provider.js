const { generateMockMessageId } = require("../../../core/utils/generate-mock-message-id");
const { logger } = require("../../../core/logger/logger");
const {
  translateTwilioQuickReply,
} = require("../whatsapp/translators/twilio-quick-reply.translator");
const {
  translateTwilioList,
} = require("../whatsapp/translators/twilio-list.translator");
const {
  mapTwilioInteractivePayload,
  mapTwilioApprovedTemplate,
} = require("../whatsapp/mappers/twilio-content-api.mapper");

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

    case "twilio_quick_reply": {
      const translated = translateTwilioQuickReply(payload);
      const mapped = mapTwilioInteractivePayload(translated);
      logger.info(
        {
          provider: "mock",
          transportPayloadType: payload.type,
          contentType: mapped.contentType,
          translatedPayloadType: translated.type,
          buttonCount: translated.buttons.length,
          to,
          providerMessageId,
          twilioRequest: mapped.twilioRequest,
        },
        "Mock WhatsApp quick reply mapped (not sent to external API)"
      );
      break;
    }

    case "approved_template": {
      try {
        const mapped = mapTwilioApprovedTemplate(payload);
        logger.info(
          {
            provider: "mock",
            transportPayloadType: payload.type,
            contentType: mapped.contentType,
            templateKey: payload.templateKey,
            templateCategory: mapped.templateCategory,
            contentSid: mapped.twilioRequest.messageCreate.contentSid,
            variableKeys: Object.keys(payload.variables || {}),
            to,
            providerMessageId,
            twilioRequest: mapped.twilioRequest,
          },
          "Mock approved template mapped (not sent to external API)"
        );
      } catch (error) {
        logger.warn(
          {
            provider: "mock",
            transportPayloadType: payload.type,
            templateKey: payload.templateKey,
            errorMessage: error.message,
            code: error.code,
          },
          "Mock approved template mapping skipped"
        );
      }
      break;
    }

    case "twilio_list": {
      const translated = translateTwilioList(payload);
      const mapped = mapTwilioInteractivePayload(translated);
      const rowCount = translated.sections.reduce(
        (sum, section) => sum + section.rows.length,
        0
      );
      logger.info(
        {
          provider: "mock",
          transportPayloadType: payload.type,
          contentType: mapped.contentType,
          translatedPayloadType: translated.type,
          rowCount,
          to,
          providerMessageId,
          twilioRequest: mapped.twilioRequest,
        },
        "Mock WhatsApp list mapped (not sent to external API)"
      );
      break;
    }

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
