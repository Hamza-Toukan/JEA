const { logger } = require("../../core/logger/logger");
const { getWhatsAppProvider } = require("./providers/provider-factory");
const { validateTransportPayload } = require("./transport/validate-transport-payload");
const {
  buildApprovedTemplateTransportPayload,
} = require("./transport/template-payload.contract");
const {
  tryBuildStructuralTemplateTransport,
} = require("./whatsapp/templates/structural-template-delivery.service");
const {
  formatTwilioPayload,
} = require("./whatsapp/formatters/twilio-payload.formatter");

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

/**
 * Sends a pre-approved WhatsApp template by logical registry key.
 *
 * @param {Object} params
 * @param {'whatsapp'} [params.channel]
 * @param {string} params.to
 * @param {string} params.templateKey
 * @param {Record<string, string>} params.variables
 * @param {string} [params.locale]
 */
async function sendApprovedTemplateMessage({
  channel = "whatsapp",
  to,
  templateKey,
  variables,
  locale,
}) {
  const payload = buildApprovedTemplateTransportPayload(
    templateKey,
    variables,
    locale ? { locale } : {}
  );

  return sendMessage({ channel, to, payload });
}

/**
 * Sends interactive UI using a structural approved template when configured,
 * otherwise falls back to runtime interactive transport (dynamic Content create).
 *
 * @param {Object} params
 * @param {'whatsapp'} [params.channel]
 * @param {string} params.to
 * @param {Object} params.renderedMessage - From buildInteractiveMessage()
 * @param {string} [params.locale]
 */
async function sendStructuralOrRuntimeInteractive({
  channel = "whatsapp",
  to,
  renderedMessage,
  locale,
}) {
  const structural = tryBuildStructuralTemplateTransport(renderedMessage, {
    locale,
  });

  if (structural) {
    return sendMessage({ channel, to, payload: structural.payload });
  }

  return sendMessage({
    channel,
    to,
    payload: formatTwilioPayload(renderedMessage),
  });
}

module.exports = {
  sendMessage,
  sendApprovedTemplateMessage,
  sendStructuralOrRuntimeInteractive,
  buildApprovedTemplateTransportPayload,
  tryBuildStructuralTemplateTransport,
};
