const { sendTwilioMessage } = require("../whatsapp/twilio/twilio.service");
const { logger } = require("../../../core/logger/logger");

/** @type {import('./whatsapp-provider.interface').WhatsAppProvider} */
const twilioProvider = {
  id: "twilio",

  async sendWhatsAppMessage({ to, body }) {
    const result = await sendTwilioMessage(to, body);

    if (result && result.sid) {
      logger.info(
        {
          provider: "twilio",
          messageSid: result.sid,
          to,
        },
        "Twilio WhatsApp outbound message sent"
      );
    }

    return {
      providerMessageId: result.sid,
      provider: "twilio",
    };
  },
};

module.exports = {
  twilioProvider,
};
