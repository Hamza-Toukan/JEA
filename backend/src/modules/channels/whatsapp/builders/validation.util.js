const QUICK_REPLY_MAX_BUTTONS = 3;
const LIST_MAX_ROWS = 10;
const OPTION_TITLE_MAX_LENGTH = 24;
const QUICK_REPLY_TITLE_MAX_LENGTH = 25;
const OPTION_ID_MAX_LENGTH = 200;
const OPTION_ID_PATTERN = /^[a-z0-9_-]+$/i;

function assertNonEmptyString(value, fieldName) {
  if (typeof value !== "string" || !value.trim()) {
    throw new Error(`${fieldName} must be a non-empty string`);
  }
}

function validateOption(option, index, titleMaxLength = OPTION_TITLE_MAX_LENGTH) {
  assertNonEmptyString(option.id, `options[${index}].id`);
  assertNonEmptyString(option.title, `options[${index}].title`);

  const id = option.id.trim();
  const title = option.title.trim();

  if (id.length > OPTION_ID_MAX_LENGTH) {
    throw new Error(
      `options[${index}].id exceeds max length of ${OPTION_ID_MAX_LENGTH}`
    );
  }

  if (!OPTION_ID_PATTERN.test(id)) {
    throw new Error(
      `options[${index}].id must be alphanumeric with optional _ or -`
    );
  }

  if (title.length > titleMaxLength) {
    throw new Error(
      `options[${index}].title exceeds max length of ${titleMaxLength}`
    );
  }

  if (
    option.description != null &&
    String(option.description).length > 72
  ) {
    throw new Error(
      `options[${index}].description exceeds max length of 72 characters`
    );
  }

  return {
    id,
    title,
    ...(option.description != null
      ? { description: String(option.description).trim() }
      : {}),
  };
}

function validateUniqueOptionIds(options) {
  const seen = new Set();

  for (const option of options) {
    if (seen.has(option.id)) {
      throw new Error(`Duplicate option id: ${option.id}`);
    }
    seen.add(option.id);
  }
}

function validateOptionsList(options, { maxCount, label, titleMaxLength }) {
  if (!Array.isArray(options)) {
    throw new Error(`${label} options must be an array`);
  }

  if (options.length > maxCount) {
    throw new Error(`${label} supports at most ${maxCount} options`);
  }

  const normalized = options.map((option, index) =>
    validateOption(option, index, titleMaxLength ?? OPTION_TITLE_MAX_LENGTH)
  );
  validateUniqueOptionIds(normalized);
  return normalized;
}

module.exports = {
  QUICK_REPLY_MAX_BUTTONS,
  LIST_MAX_ROWS,
  OPTION_TITLE_MAX_LENGTH,
  QUICK_REPLY_TITLE_MAX_LENGTH,
  validateOptionsList,
  validateOption,
  validateUniqueOptionIds,
};
