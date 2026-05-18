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
/**
 * Creates Twilio Content API resource and sends via Messages API using contentSid.
 *
 * @param {string} to
 * @param {{ contentCreate: object, messageCreate: object }} mappedRequest
 * @returns {Promise<{ sid: string, contentSid: string }>}
 */
async function sendTwilioContentInteractiveMessage(to, mappedRequest) {
  if (!env.TWILIO_WHATSAPP_NUMBER || !String(env.TWILIO_WHATSAPP_NUMBER).trim()) {
    throw new Error("TWILIO_WHATSAPP_NUMBER is not configured");
  }

  const formattedTo = formatWhatsAppAddress(to);
  const formattedFrom = formatWhatsAppAddress(env.TWILIO_WHATSAPP_NUMBER);

  if (!formattedTo) {
    throw new Error("Invalid destination for Twilio WhatsApp send");
  }

  const client = getTwilioClient();

  const contentCreateBody = {
    ...mappedRequest.contentCreate,
    language: mappedRequest.contentCreate.language || env.TWILIO_CONTENT_LANGUAGE,
  };

  const content = await client.content.v1.contents.create(contentCreateBody);

  const messageParams = {
    from: formattedFrom,
    to: formattedTo,
    contentSid: content.sid,
  };

  if (env.TWILIO_MESSAGING_SERVICE_SID) {
    messageParams.messagingServiceSid = env.TWILIO_MESSAGING_SERVICE_SID;
  }

  const message = await client.messages.create(messageParams);

  return {
    sid: message.sid,
    contentSid: content.sid,
  };
}

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
  sendTwilioContentInteractiveMessage,
  formatWhatsAppAddress,
  getTwilioClient,
};
