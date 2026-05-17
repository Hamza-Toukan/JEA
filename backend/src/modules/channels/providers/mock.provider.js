const { generateMockMessageId } = require("../../../core/utils/generate-mock-message-id");
const { logger } = require("../../../core/logger/logger");

/** @type {import('./whatsapp-provider.interface').WhatsAppProvider} */
const mockProvider = {
  id: "mock",

  async sendWhatsAppMessage({ to, body }) {
    const providerMessageId = generateMockMessageId();

    logger.info(
      {
        provider: "mock",
        to,
        bodyLength: body ? body.length : 0,
        providerMessageId,
      },
      "Mock WhatsApp outbound message (not sent to external API)"
    );

    return {
      providerMessageId,
      provider: "mock",
    };
  },
};

module.exports = {
  mockProvider,
};
