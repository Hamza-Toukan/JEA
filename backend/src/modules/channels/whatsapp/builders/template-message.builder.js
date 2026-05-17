/**
 * Placeholder for approved WhatsApp template messages (HSM).
 * Business templates will be wired when JEA flows and BSP templates are finalized.
 *
 * @param {Object} _params
 * @returns {never}
 */
function buildTemplateMessage(_params) {
  throw new Error(
    "Template messages are not implemented yet; use text or interactive builders"
  );
}

module.exports = {
  buildTemplateMessage,
};
