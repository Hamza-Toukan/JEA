/**
 * Provider transport payloads (channel-specific delivery layer).
 * Produced by formatters; consumed by provider adapters.
 *
 * @typedef {Object} TextTransportPayload
 * @property {'text'} type
 * @property {string} body
 */

/**
 * @typedef {Object} TwilioQuickReplyTransportPayload
 * @property {'twilio_quick_reply'} type
 * @property {string} body
 * @property {Array<{ id: string, title: string }>} buttons
 */

/**
 * @typedef {Object} TwilioListTransportPayload
 * @property {'twilio_list'} type
 * @property {string} body
 * @property {string} [buttonText]
 * @property {Array<{ title: string, rows: Array<{ id: string, title: string, description?: string }> }>} sections
 */

/**
 * @typedef {TextTransportPayload | TwilioQuickReplyTransportPayload | TwilioListTransportPayload} TransportPayload
 */

const TRANSPORT_PAYLOAD_TYPES = [
  "text",
  "twilio_quick_reply",
  "twilio_list",
];

module.exports = {
  TRANSPORT_PAYLOAD_TYPES,
};
