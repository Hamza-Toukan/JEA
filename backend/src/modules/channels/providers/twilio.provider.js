const {
  sendTwilioMessage,
  sendTwilioContentInteractiveMessage,
  sendTwilioApprovedTemplateMessage,
} = require("../whatsapp/twilio/twilio.service");
const { logger } = require("../../../core/logger/logger");
const {
  translateTwilioQuickReply,
} = require("../whatsapp/translators/twilio-quick-reply.translator");
const {
  translateTwilioList,
} = require("../whatsapp/translators/twilio-list.translator");
const {
  mapTwilioInteractivePayload,
  mapTwilioApprovedTemplate,
} = require("../whatsapp/mappers/twilio-content-api.mapper");

/**
 * @param {import('../whatsapp/translators/twilio-interactive-payload.contract').TwilioInteractivePayload} translatedPayload
 * @param {string} to
 */
async function sendTwilioInteractiveMessage(translatedPayload, to) {
  const mapped = mapTwilioInteractivePayload(translatedPayload);

  const buttonCount =
    translatedPayload.type === "twilio_interactive_buttons"
      ? translatedPayload.buttons.length
      : undefined;

  const rowCount =
    translatedPayload.type === "twilio_interactive_list"
      ? translatedPayload.sections.reduce(
          (sum, section) => sum + section.rows.length,
          0
        )
      : undefined;

  const result = await sendTwilioContentInteractiveMessage(to, mapped.twilioRequest);

  logger.info(
    {
      provider: "twilio",
      contentType: mapped.contentType,
      translatedPayloadType: translatedPayload.type,
      twilioSid: result.sid,
      contentSid: result.contentSid,
      to,
      buttonCount,
      rowCount,
    },
    "Twilio interactive message sent via Content API"
  );

  return {
    providerMessageId: result.sid,
    provider: "twilio",
    delivered: true,
    contentSid: result.contentSid,
    contentType: mapped.contentType,
  };
}

/**
 * @param {import('../../transport/template-payload.contract').ApprovedTemplateTransportPayload} payload
 * @param {string} to
 */
async function sendTwilioApprovedTemplate(payload, to) {
  const mapped = mapTwilioApprovedTemplate(payload);
  const { resolvedTemplate } = mapped;

  const result = await sendTwilioApprovedTemplateMessage(to, mapped.twilioRequest);

  const variableKeys = Object.keys(resolvedTemplate.variables);

  const templateMeta = mapped.resolvedTemplate?.template;

  logger.info(
    {
      provider: "twilio",
      transportPayloadType: payload.type,
      contentType: mapped.contentType,
      templateKey: payload.templateKey,
      templateCategory: mapped.templateCategory,
      templateKind: templateMeta?.templateKind,
      structureType: templateMeta?.structureType,
      optionCount: templateMeta?.optionCount,
      resolvedTemplateKey: payload.templateKey,
      contentSid: result.contentSid,
      usingApprovedTemplate: true,
      fallbackReason: null,
      variableKeys,
      twilioSid: result.sid,
      to,
    },
    "Twilio approved template message sent"
  );

  return {
    providerMessageId: result.sid,
    provider: "twilio",
    delivered: true,
    contentSid: result.contentSid,
    contentType: mapped.contentType,
    templateDelivery: {
      templateKey: payload.templateKey,
      contentSid: result.contentSid,
      templateVariables: resolvedTemplate.variables,
      templateCategory: mapped.templateCategory,
      locale: resolvedTemplate.template.locale,
    },
  };
}

/**
 * @param {import('../transport/transport-payload.contract').TransportPayload} payload
 * @param {string} to
 */
async function dispatchTransportPayload(payload, to) {
  switch (payload.type) {
    case "text": {
      const result = await sendTwilioMessage(to, payload.body);

      if (result && result.sid) {
        logger.info(
          {
            provider: "twilio",
            transportPayloadType: payload.type,
            contentType: "text",
            twilioSid: result.sid,
            to,
          },
          "Twilio WhatsApp text message sent"
        );
      }

      return {
        providerMessageId: result.sid,
        provider: "twilio",
        delivered: true,
      };
    }

    case "approved_template":
      return sendTwilioApprovedTemplate(payload, to);

    case "twilio_quick_reply": {
      const translatedPayload = translateTwilioQuickReply(payload);
      return sendTwilioInteractiveMessage(translatedPayload, to);
    }

    case "twilio_list": {
      const translatedPayload = translateTwilioList(payload);
      return sendTwilioInteractiveMessage(translatedPayload, to);
    }

    default:
      throw new Error(`Unsupported Twilio transport payload type: ${payload.type}`);
  }
}

/** @type {import('./whatsapp-provider.interface').WhatsAppProvider} */
const twilioProvider = {
  id: "twilio",

  async sendWhatsAppMessage({ to, payload }) {
    return dispatchTransportPayload(payload, to);
  },
};

module.exports = {
  twilioProvider,
  dispatchTransportPayload,
  sendTwilioInteractiveMessage,
  sendTwilioApprovedTemplate,
};
