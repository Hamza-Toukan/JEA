const {
  QUICK_REPLY_MAX_BUTTONS,
  validateOptionsList,
} = require("./validation.util");

/**
 * Builds a provider-agnostic quick-reply structure (1–3 buttons).
 *
 * @param {Object} params
 * @param {string} params.body
 * @param {Array<{ id: string, title: string }>} params.options
 * @returns {{ type: 'quick_reply', body: string, buttons: Array<{ id: string, title: string }> }}
 */
function buildQuickReplyMessage({ body, options = [] }) {
  if (typeof body !== "string" || !body.trim()) {
    throw new Error("Quick reply message requires a non-empty body");
  }

  const buttons = validateOptionsList(options, {
    maxCount: QUICK_REPLY_MAX_BUTTONS,
    label: "Quick reply",
  });

  if (buttons.length === 0) {
    throw new Error("Quick reply message requires at least one button");
  }

  return {
    type: "quick_reply",
    body: body.trim(),
    buttons,
  };
}

module.exports = {
  buildQuickReplyMessage,
  QUICK_REPLY_MAX_BUTTONS,
};
