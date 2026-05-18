/**
 * Approved WhatsApp template transport payload (provider-agnostic logical key + variables).
 *
 * @typedef {Object} ApprovedTemplateTransportPayload
 * @property {'approved_template'} type
 * @property {string} templateKey - Logical key in template registry
 * @property {Record<string, string>} variables
 * @property {string} [locale] - Future multilingual resolution (default: ar)
 */

/**
 * @param {string} templateKey
 * @param {Record<string, string>} variables
 * @param {{ locale?: string }} [options]
 * @returns {ApprovedTemplateTransportPayload}
 */
function buildApprovedTemplateTransportPayload(
  templateKey,
  variables,
  options = {}
) {
  if (!templateKey || typeof templateKey !== "string") {
    throw new Error("buildApprovedTemplateTransportPayload requires templateKey");
  }

  return {
    type: "approved_template",
    templateKey: templateKey.trim(),
    variables: variables || {},
    ...(options.locale ? { locale: options.locale } : {}),
  };
}

module.exports = {
  buildApprovedTemplateTransportPayload,
};
