const { env } = require("../../../core/config/env");
const { mockProvider } = require("./mock.provider");
const { twilioProvider } = require("./twilio.provider");

const providersById = {
  mock: mockProvider,
  twilio: twilioProvider,
};

/**
 * Active WhatsApp provider id from environment.
 * @returns {'mock' | 'twilio' | 'meta'}
 */
function getActiveWhatsAppProviderId() {
  return env.WHATSAPP_PROVIDER;
}

/**
 * Resolves the configured WhatsApp provider implementation.
 * @returns {import('./whatsapp-provider.interface').WhatsAppProvider}
 */
function getWhatsAppProvider() {
  const providerId = getActiveWhatsAppProviderId();

  if (providerId === "meta") {
    throw new Error(
      "WHATSAPP_PROVIDER=meta is not implemented yet; use mock or twilio"
    );
  }

  const provider = providersById[providerId];

  if (!provider) {
    throw new Error(`Unsupported WHATSAPP_PROVIDER: ${providerId}`);
  }

  return provider;
}

module.exports = {
  getActiveWhatsAppProviderId,
  getWhatsAppProvider,
  providersById,
};
