/**
 * Normalizes Twilio WhatsApp webhook fields, including interactive button/list replies.
 */

/**
 * @typedef {Object} TwilioInteractiveReply
 * @property {'button_reply' | 'list_reply' | 'unknown'} interactiveReplyType
 * @property {string | null} selectedId
 * @property {string | null} selectedTitle
 * @property {string | null} buttonType
 */

/**
 * @param {Record<string, unknown>} body - Twilio webhook form body
 * @returns {{
 *   text: string,
 *   body: string,
 *   interactiveReply: TwilioInteractiveReply | null,
 *   metadata: Record<string, unknown>
 * }}
 */
function parseTwilioInboundMessage(body) {
  const rawBody = typeof body.Body === "string" ? body.Body : "";
  const buttonText =
    typeof body.ButtonText === "string" ? body.ButtonText.trim() : "";
  const buttonPayload =
    typeof body.ButtonPayload === "string" ? body.ButtonPayload.trim() : "";
  const buttonType =
    typeof body.ButtonType === "string" ? body.ButtonType.trim() : null;

  let interactiveReply = null;
  let effectiveText = rawBody.trim();

  if (buttonPayload || buttonText) {
    const interactiveReplyType = buttonPayload ? "button_reply" : "unknown";

    interactiveReply = {
      interactiveReplyType,
      selectedId: buttonPayload || null,
      selectedTitle: buttonText || rawBody || null,
      buttonType,
    };

    effectiveText = buttonPayload || buttonText || rawBody;
  }

  if (!interactiveReply && body.InteractiveData) {
    try {
      const interactiveData =
        typeof body.InteractiveData === "string"
          ? JSON.parse(body.InteractiveData)
          : body.InteractiveData;

      interactiveReply = {
        interactiveReplyType: "list_reply",
        selectedId:
          interactiveData?.list_reply?.id ||
          interactiveData?.button_reply?.id ||
          null,
        selectedTitle:
          interactiveData?.list_reply?.title ||
          interactiveData?.button_reply?.title ||
          null,
        buttonType,
      };

      if (interactiveReply.selectedId) {
        effectiveText = interactiveReply.selectedId;
      } else if (interactiveReply.selectedTitle) {
        effectiveText = interactiveReply.selectedTitle;
      }
    } catch {
      // Keep plain body fallback when InteractiveData is not valid JSON
    }
  }

  return {
    text: effectiveText,
    body: rawBody,
    interactiveReply,
    metadata: {
      rawPayload: body,
      ...(interactiveReply ? { interactiveReply } : {}),
    },
  };
}

module.exports = {
  parseTwilioInboundMessage,
};
