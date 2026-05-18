const { sendTwilioMessage } = require("../whatsapp/twilio/twilio.service");
const { generateMockMessageId } = require("../../../core/utils/generate-mock-message-id");
const { logger } = require("../../../core/logger/logger");
const {
  translateTwilioQuickReply,
} = require("../whatsapp/translators/twilio-quick-reply.translator");
const {
  translateTwilioList,
} = require("../whatsapp/translators/twilio-list.translator");

/**
 * Future Content API integration point:
 * map translatedPayload → Twilio messages.create() / content API request body.
 *
 * @param {import('../whatsapp/translators/twilio-interactive-payload.contract').TwilioInteractivePayload} translatedPayload
 * @param {string} to
 * @returns {Promise<import('./whatsapp-provider.interface').SendWhatsAppMessageResult>}
 */
async function sendTwilioInteractiveMessage(translatedPayload, to) {
  if (translatedPayload.type === "twilio_interactive_buttons") {
    logger.info(
      {
        provider: "twilio",
        transportPayloadType: "twilio_quick_reply",
        translatedPayloadType: translatedPayload.type,
        to,
        buttonCount: translatedPayload.buttons.length,
        translatedPayload,
      },
      "Twilio interactive buttons payload translated (SDK send not wired yet)"
    );
  } else if (translatedPayload.type === "twilio_interactive_list") {
    const rowCount = translatedPayload.sections.reduce(
      (sum, section) => sum + section.rows.length,
      0
    );

    logger.info(
      {
        provider: "twilio",
        transportPayloadType: "twilio_list",
        translatedPayloadType: translatedPayload.type,
        to,
        sectionCount: translatedPayload.sections.length,
        rowCount,
        buttonText: translatedPayload.buttonText,
        translatedPayload,
      },
      "Twilio interactive list payload translated (SDK send not wired yet)"
    );
  }

  return {
    providerMessageId: generateMockMessageId(),
    provider: "twilio",
    delivered: false,
  };
}

/**
 * @param {import('../transport/transport-payload.contract').TransportPayload} payload
 * @param {string} to
 */
async function dispatchTransportPayload(payload, to) {
  switch (payload.type) {
    case "text": {
      const result = await sendTwilioMessage(to, payload.body);

      if (result && result.sid) {
        logger.info(
          {
            provider: "twilio",
            transportPayloadType: payload.type,
            messageSid: result.sid,
            to,
          },
          "Twilio WhatsApp text message sent"
        );
      }

      return {
        providerMessageId: result.sid,
        provider: "twilio",
        delivered: true,
      };
    }

    case "twilio_quick_reply": {
      const translatedPayload = translateTwilioQuickReply(payload);
      return sendTwilioInteractiveMessage(translatedPayload, to);
    }

    case "twilio_list": {
      const translatedPayload = translateTwilioList(payload);
      return sendTwilioInteractiveMessage(translatedPayload, to);
    }

    default:
      throw new Error(`Unsupported Twilio transport payload type: ${payload.type}`);
  }
}

/** @type {import('./whatsapp-provider.interface').WhatsAppProvider} */
const twilioProvider = {
  id: "twilio",

  async sendWhatsAppMessage({ to, payload }) {
    return dispatchTransportPayload(payload, to);
  },
};

module.exports = {
  twilioProvider,
  dispatchTransportPayload,
  sendTwilioInteractiveMessage,
};
