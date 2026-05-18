/**
 * Maps normalized Twilio interactive payloads to exact Twilio Content API + Messages API shapes.
 * This is the ONLY module that may encode Twilio SDK request schemas.
 */

const { resolveTemplate } = require("../templates/template-registry.service");

const CONTENT_TYPE_QUICK_REPLY = "twilio/quick-reply";
const CONTENT_TYPE_LIST_PICKER = "twilio/list-picker";

/**
 * @param {import('../translators/twilio-interactive-payload.contract').TwilioInteractiveButtonsPayload} translatedPayload
 * @returns {{ contentType: string, twilioRequest: { contentCreate: object, messageCreate: object } }}
 */
function mapTwilioInteractiveButtons(translatedPayload) {
  if (translatedPayload.type !== "twilio_interactive_buttons") {
    throw new Error(
      `mapTwilioInteractiveButtons expected twilio_interactive_buttons, got ${translatedPayload.type}`
    );
  }

  const friendlyName = `jea-qr-${Date.now()}`;

  return {
    contentType: "interactive_buttons",
    twilioRequest: {
      contentCreate: {
        friendly_name: friendlyName,
        language: "ar",
        types: {
          [CONTENT_TYPE_QUICK_REPLY]: {
            body: translatedPayload.body,
            actions: translatedPayload.buttons.map((button) => ({
              id: button.id,
              title: button.title,
            })),
          },
        },
      },
      messageCreate: {
        contentSid: null,
      },
    },
  };
}

/**
 * Flattens translated list sections into Twilio list-picker items.
 * Twilio requires `item`, `id`, and `description` per row.
 *
 * @param {import('../translators/twilio-interactive-payload.contract').TwilioInteractiveListPayload} translatedPayload
 */
function mapListSectionsToTwilioItems(translatedPayload) {
  return translatedPayload.sections.flatMap((section) =>
    section.rows.map((row) => ({
      id: row.id,
      item: row.title,
      description: row.description || row.title,
    }))
  );
}

/**
 * @param {import('../translators/twilio-interactive-payload.contract').TwilioInteractiveListPayload} translatedPayload
 * @returns {{ contentType: string, twilioRequest: { contentCreate: object, messageCreate: object } }}
 */
function mapTwilioInteractiveList(translatedPayload) {
  if (translatedPayload.type !== "twilio_interactive_list") {
    throw new Error(
      `mapTwilioInteractiveList expected twilio_interactive_list, got ${translatedPayload.type}`
    );
  }

  const friendlyName = `jea-list-${Date.now()}`;

  return {
    contentType: "interactive_list",
    twilioRequest: {
      contentCreate: {
        friendly_name: friendlyName,
        language: "ar",
        types: {
          [CONTENT_TYPE_LIST_PICKER]: {
            body: translatedPayload.body,
            button: translatedPayload.buttonText,
            items: mapListSectionsToTwilioItems(translatedPayload),
          },
        },
      },
      messageCreate: {
        contentSid: null,
      },
    },
  };
}

/**
 * @param {import('../../transport/template-payload.contract').ApprovedTemplateTransportPayload} transportPayload
 */
function mapTwilioApprovedTemplate(transportPayload) {
  if (transportPayload.type !== "approved_template") {
    throw new Error(
      `mapTwilioApprovedTemplate expected approved_template, got ${transportPayload.type}`
    );
  }

  const resolved = resolveTemplate(
    transportPayload.templateKey,
    transportPayload.variables,
    { locale: transportPayload.locale }
  );

  return {
    contentType: "approved_template",
    templateKey: transportPayload.templateKey,
    templateCategory: resolved.template.category,
    twilioRequest: {
      messageCreate: {
        contentSid: resolved.template.contentSid,
        contentVariables: resolved.contentVariables,
      },
    },
    resolvedTemplate: resolved,
  };
}

/**
 * @param {import('../translators/twilio-interactive-payload.contract').TwilioInteractivePayload} translatedPayload
 */
function mapTwilioInteractivePayload(translatedPayload) {
  switch (translatedPayload.type) {
    case "twilio_interactive_buttons":
      return mapTwilioInteractiveButtons(translatedPayload);
    case "twilio_interactive_list":
      return mapTwilioInteractiveList(translatedPayload);
    default:
      throw new Error(
        `No Twilio Content API mapper for payload type: ${translatedPayload.type}`
      );
  }
}

module.exports = {
  mapTwilioInteractiveButtons,
  mapTwilioInteractiveList,
  mapTwilioInteractivePayload,
  mapTwilioApprovedTemplate,
  CONTENT_TYPE_QUICK_REPLY,
  CONTENT_TYPE_LIST_PICKER,
};
