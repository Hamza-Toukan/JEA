const { sendTwilioMessage } = require("../whatsapp/twilio/twilio.service");
const { generateMockMessageId } = require("../../../core/utils/generate-mock-message-id");
const { logger } = require("../../../core/logger/logger");

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
      logger.info(
        {
          provider: "twilio",
          transportPayloadType: payload.type,
          to,
          buttonCount: payload.buttons.length,
          buttons: payload.buttons.map((button) => ({
            id: button.id,
            title: button.title,
          })),
        },
        "Twilio quick reply transport payload prepared (interactive send not wired yet)"
      );

      return {
        providerMessageId: generateMockMessageId(),
        provider: "twilio",
        delivered: false,
      };
    }

    case "twilio_list": {
      const rowCount = payload.sections.reduce(
        (sum, section) => sum + (section.rows ? section.rows.length : 0),
        0
      );

      logger.info(
        {
          provider: "twilio",
          transportPayloadType: payload.type,
          to,
          sectionCount: payload.sections.length,
          rowCount,
          buttonText: payload.buttonText || null,
        },
        "Twilio list transport payload prepared (interactive send not wired yet)"
      );

      return {
        providerMessageId: generateMockMessageId(),
        provider: "twilio",
        delivered: false,
      };
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
};
