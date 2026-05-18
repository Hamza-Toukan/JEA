/** Approved structural templates currently registered on Twilio. */
const SUPPORTED_QUICK_REPLY_COUNTS = new Set([2, 3]);
const SUPPORTED_LIST_COUNTS = new Set([4]);

/**
 * Resolves a generic structural approved-template key from interaction shape.
 * Returns null when no approved structural template exists for the count
 * (callers should use runtime interactive delivery).
 *
 * @param {Object} params
 * @param {'quick_reply' | 'list'} params.type
 * @param {number} params.optionCount
 * @returns {string | null} templateKey e.g. quick_reply_2, list_4
 */
function resolveInteractiveTemplate({ type, optionCount }) {
  const count = Number(optionCount);

  if (!Number.isInteger(count) || count < 1) {
    return null;
  }

  if (type === "quick_reply") {
    if (!SUPPORTED_QUICK_REPLY_COUNTS.has(count)) {
      return null;
    }
    return `quick_reply_${count}`;
  }

  if (type === "list") {
    if (!SUPPORTED_LIST_COUNTS.has(count)) {
      return null;
    }
    return `list_${count}`;
  }

  return null;
}

/**
 * @param {Object} renderedMessage - Output from buildInteractiveMessage()
 * @returns {{ type: 'quick_reply' | 'list', optionCount: number } | null}
 */
function inferStructureFromRenderedMessage(renderedMessage) {
  if (!renderedMessage || typeof renderedMessage !== "object") {
    return null;
  }

  if (renderedMessage.type === "quick_reply") {
    return {
      type: "quick_reply",
      optionCount: renderedMessage.buttons?.length || 0,
    };
  }

  if (renderedMessage.type === "list") {
    const optionCount = (renderedMessage.sections || []).reduce(
      (sum, section) => sum + (section.rows?.length || 0),
      0
    );

    return {
      type: "list",
      optionCount,
    };
  }

  return null;
}

/**
 * @param {Object} renderedMessage
 * @returns {string | null}
 */
function resolveInteractiveTemplateFromRendered(renderedMessage) {
  const structure = inferStructureFromRenderedMessage(renderedMessage);

  if (!structure) {
    return null;
  }

  return resolveInteractiveTemplate(structure);
}

module.exports = {
  resolveInteractiveTemplate,
  resolveInteractiveTemplateFromRendered,
  inferStructureFromRenderedMessage,
  SUPPORTED_QUICK_REPLY_COUNTS,
  SUPPORTED_LIST_COUNTS,
};
