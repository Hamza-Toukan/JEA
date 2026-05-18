const { env } = require("../../../../core/config/env");
const {
  getStructuralVariableNames,
} = require("./structural-template-variables.util");

/**
 * Central registry of approved WhatsApp templates.
 *
 * **Structural templates** — reusable containers (quick_reply_N, list_N).
 *   Business meaning (yes/no, insurance, renew) is supplied only via variables.
 *
 * **Business templates** — optional named templates for specific notifications
 *   (e.g. ticket_created). Add sparingly to avoid template explosion.
 *
 * ContentSid values are loaded from environment — never hardcode in handlers.
 *
 * @typedef {Object} WhatsAppTemplateDefinition
 * @property {'twilio' | 'meta' | 'unifonic'} provider
 * @property {string | null} contentSid
 * @property {string} language
 * @property {string} category
 * @property {string[]} variables
 * @property {'structural' | 'business'} [templateKind]
 * @property {'quick_reply' | 'list' | 'utility' | null} [structureType]
 * @property {number | null} [optionCount]
 * @property {number} [version]
 * @property {Record<string, Partial<WhatsAppTemplateDefinition>>} [locales]
 */

const QUICK_REPLY_ENV_BY_COUNT = {
  2: env.TWILIO_TEMPLATE_QUICK_REPLY_2_SID,
  3: env.TWILIO_TEMPLATE_QUICK_REPLY_3_SID,
};

const LIST_ENV_BY_COUNT = {
  4: env.TWILIO_TEMPLATE_LIST_4_SID,
  5: env.TWILIO_TEMPLATE_LIST_5_SID,
  6: env.TWILIO_TEMPLATE_LIST_6_SID,
  7: env.TWILIO_TEMPLATE_LIST_7_SID,
  8: env.TWILIO_TEMPLATE_LIST_8_SID,
  9: env.TWILIO_TEMPLATE_LIST_9_SID,
  10: env.TWILIO_TEMPLATE_LIST_10_SID,
};

function createStructuralQuickReplyDefinition(optionCount) {
  const contentSid = QUICK_REPLY_ENV_BY_COUNT[optionCount] || null;

  return {
    provider: "twilio",
    contentSid,
    language: "ar",
    category: "utility",
    templateKind: "structural",
    structureType: "quick_reply",
    optionCount,
    variables: getStructuralVariableNames("quick_reply", optionCount),
    version: 1,
    locales: {
      ar: {
        language: "ar",
        contentSid,
      },
    },
  };
}

function createStructuralListDefinition(optionCount) {
  const contentSid = LIST_ENV_BY_COUNT[optionCount] || null;

  return {
    provider: "twilio",
    contentSid,
    language: "ar",
    category: "utility",
    templateKind: "structural",
    structureType: "list",
    optionCount,
    variables: getStructuralVariableNames("list", optionCount),
    version: 1,
    locales: {
      ar: {
        language: "ar",
        contentSid,
      },
    },
  };
}

/** @type {Record<string, WhatsAppTemplateDefinition>} */
const STRUCTURAL_TEMPLATES = {
  quick_reply_2: createStructuralQuickReplyDefinition(2),
  quick_reply_3: createStructuralQuickReplyDefinition(3),
  list_4: createStructuralListDefinition(4),
  list_5: createStructuralListDefinition(5),
  list_6: createStructuralListDefinition(6),
  list_7: createStructuralListDefinition(7),
  list_8: createStructuralListDefinition(8),
  list_9: createStructuralListDefinition(9),
  list_10: createStructuralListDefinition(10),
  auth_otp: {
    provider: "twilio",
    contentSid: env.TWILIO_TEMPLATE_AUTH_OTP_SID || null,
    language: "ar",
    category: "authentication",
    templateKind: "structural",
    structureType: "utility",
    optionCount: null,
    variables: ["body", "code"],
    version: 1,
    locales: {
      ar: {
        language: "ar",
        contentSid: env.TWILIO_TEMPLATE_AUTH_OTP_SID || null,
      },
    },
  },
  generic_notification: {
    provider: "twilio",
    contentSid: env.TWILIO_TEMPLATE_GENERIC_NOTIFICATION_SID || null,
    language: "ar",
    category: "utility",
    templateKind: "structural",
    structureType: "utility",
    optionCount: null,
    variables: ["body", "headline", "detail"],
    version: 1,
    locales: {
      ar: {
        language: "ar",
        contentSid: env.TWILIO_TEMPLATE_GENERIC_NOTIFICATION_SID || null,
      },
    },
  },
};

/** @type {Record<string, WhatsAppTemplateDefinition>} */
const BUSINESS_TEMPLATES = {
  verification_success: {
    provider: "twilio",
    contentSid: env.TWILIO_TEMPLATE_VERIFICATION_SUCCESS_SID || null,
    language: "ar",
    category: "utility",
    templateKind: "business",
    structureType: null,
    optionCount: null,
    variables: ["memberName"],
    version: 1,
    locales: {
      ar: {
        language: "ar",
        contentSid: env.TWILIO_TEMPLATE_VERIFICATION_SUCCESS_SID || null,
      },
    },
  },
  ticket_created: {
    provider: "twilio",
    contentSid: env.TWILIO_TEMPLATE_TICKET_CREATED_SID || null,
    language: "ar",
    category: "utility",
    templateKind: "business",
    structureType: null,
    optionCount: null,
    variables: ["ticketNumber"],
    version: 1,
    locales: {
      ar: {
        language: "ar",
        contentSid: env.TWILIO_TEMPLATE_TICKET_CREATED_SID || null,
      },
    },
  },
};

const TEMPLATE_REGISTRY = {
  ...STRUCTURAL_TEMPLATES,
  ...BUSINESS_TEMPLATES,
};

/**
 * @param {string} templateKey
 * @param {{ locale?: string }} [options]
 * @returns {WhatsAppTemplateDefinition & { key: string, locale: string }}
 */
function getTemplate(templateKey, options = {}) {
  const locale = options.locale || "ar";
  const base = TEMPLATE_REGISTRY[templateKey];

  if (!base) {
    const error = new Error(`Unknown WhatsApp template key: ${templateKey}`);
    error.code = "TEMPLATE_NOT_FOUND";
    throw error;
  }

  const localeOverrides =
    base.locales && base.locales[locale] ? base.locales[locale] : {};

  const resolved = {
    ...base,
    ...localeOverrides,
    key: templateKey,
    locale,
  };

  if (!resolved.contentSid) {
    const error = new Error(
      `Template "${templateKey}" has no contentSid configured for locale "${locale}"`
    );
    error.code = "TEMPLATE_NOT_CONFIGURED";
    throw error;
  }

  return resolved;
}

/**
 * @param {WhatsAppTemplateDefinition} template
 * @param {Record<string, string>} variables
 */
function validateTemplateVariables(template, variables = {}) {
  if (!variables || typeof variables !== "object") {
    const error = new Error("Template variables must be an object");
    error.code = "TEMPLATE_VARIABLES_INVALID";
    throw error;
  }

  const missing = (template.variables || []).filter(
    (key) =>
      variables[key] === undefined ||
      variables[key] === null ||
      String(variables[key]).trim() === ""
  );

  if (missing.length > 0) {
    const error = new Error(
      `Missing required template variables: ${missing.join(", ")}`
    );
    error.code = "TEMPLATE_VARIABLES_MISSING";
    error.details = { missing };
    throw error;
  }

  return true;
}

/**
 * Maps logical variable names to Twilio Content API numbered placeholders ({{1}}, {{2}}, …).
 *
 * @param {WhatsAppTemplateDefinition} template
 * @param {Record<string, string>} variables
 * @returns {Record<string, string>}
 */
function buildTwilioContentVariables(template, variables) {
  const contentVariables = {};

  (template.variables || []).forEach((key, index) => {
    contentVariables[String(index + 1)] = String(variables[key]);
  });

  return contentVariables;
}

/**
 * @param {string} templateKey
 * @param {Record<string, string>} variables
 * @param {{ locale?: string }} [options]
 * @returns {{
 *   template: WhatsAppTemplateDefinition & { key: string, locale: string },
 *   variables: Record<string, string>,
 *   contentVariables: Record<string, string>
 * }}
 */
function resolveTemplate(templateKey, variables = {}, options = {}) {
  const template = getTemplate(templateKey, options);
  validateTemplateVariables(template, variables);

  const normalizedVariables = {};

  for (const key of template.variables) {
    normalizedVariables[key] = String(variables[key]);
  }

  let contentVariables = {};

  if (template.provider === "twilio") {
    contentVariables = buildTwilioContentVariables(template, normalizedVariables);
  }

  return {
    template,
    variables: normalizedVariables,
    contentVariables,
  };
}

function isStructuralTemplateKey(templateKey) {
  const template = TEMPLATE_REGISTRY[templateKey];
  return Boolean(template && template.templateKind === "structural");
}

module.exports = {
  TEMPLATE_REGISTRY,
  STRUCTURAL_TEMPLATES,
  BUSINESS_TEMPLATES,
  getTemplate,
  validateTemplateVariables,
  resolveTemplate,
  buildTwilioContentVariables,
  isStructuralTemplateKey,
};
