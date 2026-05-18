/**
 * Normalized Twilio interactive payloads produced by translators.
 * These shapes are SDK-agnostic and map 1:1 to future Content API / Messages API fields.
 *
 * @typedef {Object} TwilioInteractiveButtonsPayload
 * @property {'twilio_interactive_buttons'} type
 * @property {string} body
 * @property {Array<{ id: string, title: string }>} buttons
 */

/**
 * @typedef {Object} TwilioInteractiveListPayload
 * @property {'twilio_interactive_list'} type
 * @property {string} body
 * @property {string} buttonText
 * @property {Array<{ title: string, rows: Array<{ id: string, title: string, description?: string }> }>} sections
 */

/**
 * @typedef {TwilioInteractiveButtonsPayload | TwilioInteractiveListPayload} TwilioInteractivePayload
 */

const TWILIO_INTERACTIVE_PAYLOAD_TYPES = [
  "twilio_interactive_buttons",
  "twilio_interactive_list",
];

module.exports = {
  TWILIO_INTERACTIVE_PAYLOAD_TYPES,
};
