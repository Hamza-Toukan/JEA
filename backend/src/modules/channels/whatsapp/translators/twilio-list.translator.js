const {
  LIST_MAX_ROWS,
  validateOption,
  validateUniqueOptionIds,
} = require("../builders/validation.util");

const LIST_BUTTON_TEXT_MAX_LENGTH = 20;
const SECTION_TITLE_MAX_LENGTH = 24;

function normalizeSection(section, sectionIndex) {
  if (!section || typeof section !== "object") {
    throw new Error(`sections[${sectionIndex}] must be an object`);
  }

  const title =
    typeof section.title === "string" ? section.title.trim() : "";

  if (!title) {
    throw new Error(`sections[${sectionIndex}].title is required`);
  }

  if (title.length > SECTION_TITLE_MAX_LENGTH) {
    throw new Error(
      `sections[${sectionIndex}].title exceeds max length of ${SECTION_TITLE_MAX_LENGTH}`
    );
  }

  if (!Array.isArray(section.rows) || section.rows.length === 0) {
    throw new Error(`sections[${sectionIndex}].rows must be a non-empty array`);
  }

  const rows = section.rows.map((row, rowIndex) =>
    validateOption(row, rowIndex)
  );

  return { title, rows };
}

/**
 * Translates a Twilio transport list payload into a normalized
 * Twilio interactive list structure (ready for Content API / SDK wiring).
 *
 * @param {import('../../transport/transport-payload.contract').TwilioListTransportPayload} transportPayload
 * @returns {import('./twilio-interactive-payload.contract').TwilioInteractiveListPayload}
 */
function translateTwilioList(transportPayload) {
  if (transportPayload.type !== "twilio_list") {
    throw new Error(
      `translateTwilioList expected twilio_list, got ${transportPayload.type}`
    );
  }

  const body =
    typeof transportPayload.body === "string"
      ? transportPayload.body.trim()
      : "";

  if (!body) {
    throw new Error("twilio_list transport payload requires a body");
  }

  const buttonText = (
    typeof transportPayload.buttonText === "string" &&
    transportPayload.buttonText.trim()
      ? transportPayload.buttonText
      : "اختر"
  ).trim();

  if (buttonText.length > LIST_BUTTON_TEXT_MAX_LENGTH) {
    throw new Error(
      `buttonText exceeds max length of ${LIST_BUTTON_TEXT_MAX_LENGTH}`
    );
  }

  if (!Array.isArray(transportPayload.sections) || transportPayload.sections.length === 0) {
    throw new Error("twilio_list transport payload requires sections");
  }

  const sections = transportPayload.sections.map((section, index) =>
    normalizeSection(section, index)
  );

  const allRows = sections.flatMap((section) => section.rows);

  if (allRows.length > LIST_MAX_ROWS) {
    throw new Error(
      `Twilio list supports at most ${LIST_MAX_ROWS} rows across all sections`
    );
  }

  if (allRows.length < 4) {
    throw new Error("Twilio list requires at least 4 rows");
  }

  validateUniqueOptionIds(allRows);

  return {
    type: "twilio_interactive_list",
    body,
    buttonText,
    sections,
  };
}

module.exports = {
  translateTwilioList,
};
