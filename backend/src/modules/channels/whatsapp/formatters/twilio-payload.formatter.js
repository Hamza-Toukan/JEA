/**
 * Maps provider-agnostic rendered structures (interactive builders)
 * to Twilio-oriented transport payloads for the provider layer.
 *
 * Does NOT call the Twilio SDK or Content API — transport shaping only.
 *
 * @param {Object} renderedPayload - Output from buildInteractiveMessage()
 * @returns {import('../../transport/transport-payload.contract').TransportPayload}
 */
function formatTwilioPayload(renderedPayload) {
  if (!renderedPayload || typeof renderedPayload !== "object") {
    throw new Error("formatTwilioPayload requires a rendered payload object");
  }

  switch (renderedPayload.type) {
    case "text":
      return {
        type: "text",
        body: renderedPayload.body,
      };

    case "quick_reply":
      return {
        type: "twilio_quick_reply",
        body: renderedPayload.body,
        buttons: renderedPayload.buttons,
      };

    case "list":
      return {
        type: "twilio_list",
        body: renderedPayload.body,
        buttonText: renderedPayload.buttonText,
        sections: renderedPayload.sections,
      };

    default:
      throw new Error(
        `Unsupported rendered payload type for Twilio formatter: ${renderedPayload.type}`
      );
  }
}

module.exports = {
  formatTwilioPayload,
};
