const { TRANSPORT_PAYLOAD_TYPES } = require("./transport-payload.contract");

/**
 * @param {unknown} payload
 * @returns {import('./transport-payload.contract').TransportPayload}
 */
function validateTransportPayload(payload) {
  if (!payload || typeof payload !== "object") {
    throw new Error("Transport payload must be an object");
  }

  const { type } = payload;

  if (!TRANSPORT_PAYLOAD_TYPES.includes(type)) {
    throw new Error(`Unsupported transport payload type: ${type}`);
  }

  if (type === "approved_template") {
    if (!payload.templateKey || typeof payload.templateKey !== "string") {
      throw new Error("approved_template payload requires templateKey");
    }

    if (!payload.variables || typeof payload.variables !== "object") {
      throw new Error("approved_template payload requires variables object");
    }

    return payload;
  }

  const { body } = payload;

  if (typeof body !== "string" || !body.trim()) {
    throw new Error("Transport payload requires a non-empty body");
  }

  if (type === "twilio_quick_reply") {
    if (!Array.isArray(payload.buttons) || payload.buttons.length === 0) {
      throw new Error("twilio_quick_reply payload requires buttons");
    }
  }

  if (type === "twilio_list") {
    if (!Array.isArray(payload.sections) || payload.sections.length === 0) {
      throw new Error("twilio_list payload requires sections");
    }
  }

  return payload;
}

module.exports = {
  validateTransportPayload,
};
