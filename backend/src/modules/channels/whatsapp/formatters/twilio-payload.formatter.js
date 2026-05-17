/**
 * Future integration point: maps normalized interactive payloads to Twilio Content API /
 * WhatsApp message resource fields.
 *
 * Not used in the infrastructure phase — outbound still sends plain text via messaging.service.
 *
 * @param {Object} renderedPayload - Output from buildInteractiveMessage()
 * @returns {Object} Twilio-specific create-message parameters (stub)
 */
function formatTwilioPayload(renderedPayload) {
  if (!renderedPayload || typeof renderedPayload !== "object") {
    throw new Error("formatTwilioPayload requires a rendered payload object");
  }

  switch (renderedPayload.type) {
    case "text":
      return {
        channel: "whatsapp",
        messageType: "text",
        body: renderedPayload.body,
      };

    case "quick_reply":
      return {
        channel: "whatsapp",
        messageType: "interactive",
        interactiveType: "quick_reply",
        body: renderedPayload.body,
        buttons: renderedPayload.buttons,
        _note: "Map to Twilio Content / Messaging API when formatter is enabled",
      };

    case "list":
      return {
        channel: "whatsapp",
        messageType: "interactive",
        interactiveType: "list",
        body: renderedPayload.body,
        buttonText: renderedPayload.buttonText,
        sections: renderedPayload.sections,
        _note: "Map to Twilio Content / Messaging API when formatter is enabled",
      };

    default:
      throw new Error(
        `Unsupported rendered payload type for Twilio: ${renderedPayload.type}`
      );
  }
}

module.exports = {
  formatTwilioPayload,
};
