/**
 * Normalized conversational response returned by state handlers.
 * Provider-agnostic — no Twilio/Meta payload shapes here.
 */
class InteractiveResponse {
  /**
   * @param {Object} params
   * @param {'text' | 'interactive'} [params.messageType]
   * @param {string} params.body
   * @param {Array<{ id: string, title: string, description?: string }>} [params.options]
   * @param {Record<string, unknown>} [params.metadata]
   * @param {string | null} [params.nextState]
   * @param {Record<string, unknown>} [params.conversationUpdates]
   * @param {boolean} [params.setModeHuman]
   */
  constructor({
    messageType = "text",
    body,
    options = [],
    metadata = {},
    nextState = null,
    conversationUpdates = {},
    setModeHuman = false,
  }) {
    if (!body || typeof body !== "string" || !body.trim()) {
      throw new Error("InteractiveResponse requires a non-empty body");
    }

    this.messageType = messageType;
    this.body = body.trim();
    this.options = options;
    this.metadata = metadata;
    this.nextState = nextState;
    this.conversationUpdates = conversationUpdates;
    this.setModeHuman = setModeHuman;
  }

  /**
   * @returns {boolean}
   */
  isInteractive() {
    return this.messageType === "interactive" && this.options.length > 0;
  }
}

module.exports = {
  InteractiveResponse,
};
