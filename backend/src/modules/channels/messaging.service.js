const { logger } = require("../../core/logger/logger");
const { getWhatsAppProvider } = require("./providers/provider-factory");

/**
 * Channel-agnostic outbound messaging entry point.
 * WhatsApp is the only supported channel today; selection uses WHATSAPP_PROVIDER.
 *
 * @param {Object} params
 * @param {'whatsapp'} params.channel
 * @param {string} params.to
 * @param {string} params.body
 * @returns {Promise<{ providerMessageId: string, provider: string } | null>}
 */
async function sendMessage({ channel, to, body }) {
  if (channel !== "whatsapp") {
    throw new Error(`Unsupported messaging channel: ${channel}`);
  }

  const text = typeof body === "string" ? body.trim() : "";

  if (!text) {
    return null;
  }

  const provider = getWhatsAppProvider();

  try {
    return await provider.sendWhatsAppMessage({ to, body: text });
  } catch (error) {
    logger.error(
      {
        channel,
        provider: provider.id,
        to,
        errorMessage: error.message,
      },
      "Outbound message send failed"
    );
    throw error;
  }
}

module.exports = {
  sendMessage,
};
