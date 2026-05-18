const { logger } = require("../../../../core/logger/logger");
const {
  buildApprovedTemplateTransportPayload,
} = require("../../transport/template-payload.contract");
const { getTemplate } = require("./template-registry.service");
const {
  resolveInteractiveTemplate,
  inferStructureFromRenderedMessage,
} = require("./interactive-template-resolver.service");
const {
  buildStructuralVariablesFromRendered,
} = require("./structural-template-variables.util");

/**
 * Builds an approved_template transport payload from a rendered interactive structure.
 *
 * @param {Object} renderedMessage - Output from buildInteractiveMessage()
 * @param {{ locale?: string }} [options]
 * @returns {{
 *   payload: import('../../transport/template-payload.contract').ApprovedTemplateTransportPayload,
 *   templateKey: string,
 *   structureType: string,
 *   optionCount: number,
 *   variables: Record<string, string>
 * }}
 */
function buildStructuralTemplateTransport(renderedMessage, options = {}) {
  const structure = inferStructureFromRenderedMessage(renderedMessage);

  if (!structure) {
    const error = new Error(
      "Rendered message is not a structural quick_reply or list payload"
    );
    error.code = "NOT_STRUCTURAL_INTERACTIVE";
    throw error;
  }

  const templateKey = resolveInteractiveTemplate(structure);

  if (!templateKey) {
    const error = new Error(
      `No approved structural template for ${structure.type} with ${structure.optionCount} options`
    );
    error.code = "STRUCTURAL_TEMPLATE_UNSUPPORTED";
    throw error;
  }

  const variables = buildStructuralVariablesFromRendered(
    renderedMessage,
    structure.type,
    structure.optionCount
  );

  const payload = buildApprovedTemplateTransportPayload(
    templateKey,
    variables,
    options.locale ? { locale: options.locale } : {}
  );

  return {
    payload,
    templateKey,
    structureType: structure.type,
    optionCount: structure.optionCount,
    variables,
  };
}

/**
 * Returns structural approved-template transport when registry ContentSid is configured.
 * Falls back to null so callers can use runtime interactive Content API create instead.
 *
 * @param {Object} renderedMessage
 * @param {{ locale?: string }} [options]
 */
function tryBuildStructuralTemplateTransport(renderedMessage, options = {}) {
  const structure = inferStructureFromRenderedMessage(renderedMessage);

  if (!structure) {
    logger.debug(
      {
        usingApprovedTemplate: false,
        fallbackReason: "NOT_STRUCTURAL_INTERACTIVE",
      },
      "Structural template skipped; runtime interactive fallback"
    );
    return null;
  }

  const templateKey = resolveInteractiveTemplate(structure);

  if (!templateKey) {
    logger.info(
      {
        structureType: structure.type,
        optionCount: structure.optionCount,
        resolvedTemplateKey: null,
        contentSid: null,
        usingApprovedTemplate: false,
        fallbackReason: "UNSUPPORTED_STRUCTURE_COUNT",
      },
      "No approved structural template for option count; runtime interactive fallback"
    );
    return null;
  }

  let built;

  try {
    built = buildStructuralTemplateTransport(renderedMessage, options);
  } catch (error) {
    if (error.code === "STRUCTURAL_TEMPLATE_UNSUPPORTED") {
      logger.info(
        {
          structureType: structure.type,
          optionCount: structure.optionCount,
          resolvedTemplateKey: null,
          usingApprovedTemplate: false,
          fallbackReason: "UNSUPPORTED_STRUCTURE_COUNT",
        },
        "Structural template build failed; runtime interactive fallback"
      );
      return null;
    }
    throw error;
  }

  try {
    getTemplate(built.templateKey, { locale: options.locale });
  } catch (error) {
    if (
      error.code === "TEMPLATE_NOT_CONFIGURED" ||
      error.code === "TEMPLATE_NOT_FOUND"
    ) {
      logger.info(
        {
          structureType: built.structureType,
          optionCount: built.optionCount,
          resolvedTemplateKey: built.templateKey,
          contentSid: null,
          usingApprovedTemplate: false,
          fallbackReason: "TEMPLATE_SID_NOT_CONFIGURED",
        },
        "Structural template SID missing; runtime interactive fallback"
      );
      return null;
    }
    throw error;
  }

  const template = getTemplate(built.templateKey, { locale: options.locale });

  logger.info(
    {
      structureType: built.structureType,
      optionCount: built.optionCount,
      resolvedTemplateKey: built.templateKey,
      contentSid: template.contentSid,
      usingApprovedTemplate: true,
      fallbackReason: null,
      variableKeys: Object.keys(built.variables),
      templateKind: template.templateKind,
    },
    "Structural approved template transport resolved"
  );

  return built;
}

module.exports = {
  buildStructuralTemplateTransport,
  tryBuildStructuralTemplateTransport,
};
