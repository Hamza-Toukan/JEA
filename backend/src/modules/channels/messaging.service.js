const { logger } = require("../../core/logger/logger");
const { getWhatsAppProvider } = require("./providers/provider-factory");
const { validateTransportPayload } = require("./transport/validate-transport-payload");

/**
 * Channel-agnostic outbound messaging entry point.
 * Accepts normalized transport payloads produced by formatters.
 *
 * @param {Object} params
 * @param {'whatsapp'} params.channel
 * @param {string} params.to
 * @param {import('./transport/transport-payload.contract').TransportPayload} params.payload
 * @returns {Promise<{ providerMessageId: string, provider: string, delivered: boolean } | null>}
 */
async function sendMessage({ channel, to, payload }) {
  if (channel !== "whatsapp") {
    throw new Error(`Unsupported messaging channel: ${channel}`);
  }

  const validatedPayload = validateTransportPayload(payload);
  const provider = getWhatsAppProvider();

  logger.info(
    {
      channel,
      provider: provider.id,
      transportPayloadType: validatedPayload.type,
      to,
    },
    "Dispatching outbound transport payload"
  );

  try {
    return await provider.sendWhatsAppMessage({
      to,
      payload: validatedPayload,
    });
  } catch (error) {
    logger.error(
      {
        channel,
        provider: provider.id,
        transportPayloadType: validatedPayload.type,
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
