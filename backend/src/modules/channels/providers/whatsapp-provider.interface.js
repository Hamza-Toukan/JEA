/**
 * @typedef {Object} SendWhatsAppMessageParams
 * @property {string} to - Customer phone (with or without whatsapp: prefix)
 * @property {import('../transport/transport-payload.contract').TransportPayload} payload
 */

/**
 * @typedef {Object} SendWhatsAppMessageResult
 * @property {string} providerMessageId - Provider-assigned outbound message id
 * @property {string} provider - Provider key (mock | twilio | meta)
 * @property {boolean} [delivered] - false when transport was accepted but not sent externally (e.g. interactive stub)
 */

/**
 * WhatsApp outbound provider contract.
 *
 * @typedef {Object} WhatsAppProvider
 * @property {string} id
 * @property {(params: SendWhatsAppMessageParams) => Promise<SendWhatsAppMessageResult>} sendWhatsAppMessage
 */

module.exports = {};
