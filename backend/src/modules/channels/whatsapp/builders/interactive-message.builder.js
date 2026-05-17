const { buildQuickReplyMessage } = require("./quick-reply.builder");
const { buildListMessage } = require("./list-message.builder");
const { LIST_MAX_ROWS } = require("./validation.util");

const QUICK_REPLY_THRESHOLD = 3;

/**
 * Selects rendering strategy and returns a normalized interactive payload.
 *
 * Rules:
 * - 0 options → plain text
 * - 1–3 options → quick reply buttons
 * - 4–10 options → list message
 *
 * @param {Object} params
 * @param {string} params.body
 * @param {Array<{ id: string, title: string, description?: string }>} [params.options]
 * @param {string} [params.listSectionTitle]
 * @returns {Object}
 */
function buildInteractiveMessage({
  body,
  options = [],
  listSectionTitle = "Available Options",
}) {
  if (typeof body !== "string" || !body.trim()) {
    throw new Error("buildInteractiveMessage requires a non-empty body");
  }

  if (!Array.isArray(options) || options.length === 0) {
    return {
      type: "text",
      body: body.trim(),
    };
  }

  if (options.length > LIST_MAX_ROWS) {
    throw new Error(
      `Interactive messages support at most ${LIST_MAX_ROWS} options`
    );
  }

  if (options.length <= QUICK_REPLY_THRESHOLD) {
    return buildQuickReplyMessage({ body, options });
  }

  return buildListMessage({
    body,
    options,
    sectionTitle: listSectionTitle,
  });
}

module.exports = {
  buildInteractiveMessage,
  QUICK_REPLY_THRESHOLD,
};
