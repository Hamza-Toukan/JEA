const { translateTwilioQuickReply } = require("./twilio-quick-reply.translator");
const { translateTwilioList } = require("./twilio-list.translator");

/**
 * Entry point for Twilio interactive translation.
 * Future: provider factory may route meta/unifonic translators here by channel.
 *
 * @param {import('../../transport/transport-payload.contract').TwilioQuickReplyTransportPayload | import('../../transport/transport-payload.contract').TwilioListTransportPayload} transportPayload
 * @returns {import('./twilio-interactive-payload.contract').TwilioInteractivePayload}
 */
function translateTwilioInteractiveTransport(transportPayload) {
  switch (transportPayload.type) {
    case "twilio_quick_reply":
      return translateTwilioQuickReply(transportPayload);
    case "twilio_list":
      return translateTwilioList(transportPayload);
    default:
      throw new Error(
        `No Twilio interactive translator for transport type: ${transportPayload.type}`
      );
  }
}

module.exports = {
  translateTwilioInteractiveTransport,
  translateTwilioQuickReply,
  translateTwilioList,
};
