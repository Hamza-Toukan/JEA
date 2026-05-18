const {
  QUICK_REPLY_MAX_BUTTONS,
  validateOptionsList,
} = require("../builders/validation.util");

/**
 * Translates a Twilio transport quick-reply payload into a normalized
 * Twilio interactive buttons structure (ready for Content API / SDK wiring).
 *
 * @param {import('../../transport/transport-payload.contract').TwilioQuickReplyTransportPayload} transportPayload
 * @returns {import('./twilio-interactive-payload.contract').TwilioInteractiveButtonsPayload}
 */
function translateTwilioQuickReply(transportPayload) {
  if (transportPayload.type !== "twilio_quick_reply") {
    throw new Error(
      `translateTwilioQuickReply expected twilio_quick_reply, got ${transportPayload.type}`
    );
  }

  const body =
    typeof transportPayload.body === "string"
      ? transportPayload.body.trim()
      : "";

  if (!body) {
    throw new Error("twilio_quick_reply transport payload requires a body");
  }

  const buttons = validateOptionsList(transportPayload.buttons, {
    maxCount: QUICK_REPLY_MAX_BUTTONS,
    label: "Twilio quick reply",
  });

  return {
    type: "twilio_interactive_buttons",
    body,
    buttons,
  };
}

module.exports = {
  translateTwilioQuickReply,
};
