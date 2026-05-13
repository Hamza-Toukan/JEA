const twilio = require("twilio");
const { env } = require("../../../../core/config/env");

/**
 * Ensures a Twilio WhatsApp address uses the whatsapp: channel prefix.
 * @param {string} address Phone or whatsapp: URI
 * @returns {string}
 */
function formatWhatsAppAddress(address) {
  if (typeof address !== "string") {
    return "";
  }
  const trimmed = address.trim();
  if (!trimmed) {
    return "";
  }
  if (/^whatsapp:/i.test(trimmed)) {
    return trimmed;
  }
  return `whatsapp:${trimmed}`;
}

function getTwilioClient() {
  if (!env.TWILIO_ACCOUNT_SID || !env.TWILIO_AUTH_TOKEN) {
    throw new Error("Twilio credentials are not configured");
  }
  return twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN);
}

/**
 * Sends a WhatsApp message via Twilio.
 * @param {string} to Customer address (with or without whatsapp: prefix)
 * @param {string} text Message body
 * @returns {Promise<{ sid: string }>}
 */
async function sendTwilioMessage(to, text) {
  if (!env.TWILIO_WHATSAPP_NUMBER || !String(env.TWILIO_WHATSAPP_NUMBER).trim()) {
    throw new Error("TWILIO_WHATSAPP_NUMBER is not configured");
  }

  const formattedTo = formatWhatsAppAddress(to);
  const formattedFrom = formatWhatsAppAddress(env.TWILIO_WHATSAPP_NUMBER);

  if (!formattedTo) {
    throw new Error("Invalid destination for Twilio WhatsApp send");
  }

  const client = getTwilioClient();

  return client.messages.create({
    from: formattedFrom,
    to: formattedTo,
    body: text,
  });
}

module.exports = {
  sendTwilioMessage,
  formatWhatsAppAddress,
};
