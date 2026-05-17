/**
 * @typedef {Object} SendWhatsAppMessageParams
 * @property {string} to - Customer phone (with or without whatsapp: prefix)
 * @property {string} body - Message text
 */

/**
 * @typedef {Object} SendWhatsAppMessageResult
 * @property {string} providerMessageId - Provider-assigned outbound message id
 * @property {string} provider - Provider key (mock | twilio | meta)
 */

/**
 * WhatsApp outbound provider contract.
 * Implementations must not throw for expected config gaps when channel is mock;
 * Twilio implementation may throw and callers should catch.
 *
 * @typedef {Object} WhatsAppProvider
 * @property {string} id
 * @property {(params: SendWhatsAppMessageParams) => Promise<SendWhatsAppMessageResult>} sendWhatsAppMessage
 */

module.exports = {};
