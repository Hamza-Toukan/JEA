/**
 * Maps rendered interactive payloads to generic structural template variables.
 * Variable names are fixed per structure — business flows only supply values.
 *
 * Quick reply: option{N}_title, option{N}_id
 * List: row{N}_title, row{N}_id
 */

/**
 * @param {'quick_reply' | 'list'} structureType
 * @param {number} optionCount
 * @returns {string[]}
 */
function getStructuralVariableNames(structureType, optionCount) {
  const count = Number(optionCount);

  if (structureType === "quick_reply") {
    const names = ["body"];
    for (let i = 1; i <= count; i += 1) {
      names.push(`option${i}_title`, `option${i}_id`);
    }
    return names;
  }

  if (structureType === "list") {
    const names = ["body", "buttonText"];
    for (let i = 1; i <= count; i += 1) {
      names.push(`row${i}_title`, `row${i}_id`);
    }
    return names;
  }

  throw new Error(`Unsupported structureType for variables: ${structureType}`);
}

/**
 * @param {Object} renderedMessage
 * @param {'quick_reply' | 'list'} structureType
 * @param {number} optionCount
 * @returns {Record<string, string>}
 */
function buildStructuralVariablesFromRendered(
  renderedMessage,
  structureType,
  optionCount
) {
  const variables = {
    body: String(renderedMessage.body || "").trim(),
  };

  if (structureType === "quick_reply") {
    const buttons = renderedMessage.buttons || [];

    for (let i = 0; i < optionCount; i += 1) {
      const button = buttons[i];
      const index = i + 1;
      variables[`option${index}_title`] = button?.title
        ? String(button.title).trim()
        : "";
      variables[`option${index}_id`] = button?.id
        ? String(button.id).trim()
        : "";
    }

    return variables;
  }

  if (structureType === "list") {
    variables.buttonText = String(renderedMessage.buttonText || "اختر").trim();

    const rows = (renderedMessage.sections || []).flatMap(
      (section) => section.rows || []
    );

    for (let i = 0; i < optionCount; i += 1) {
      const row = rows[i];
      const index = i + 1;
      variables[`row${index}_title`] = row?.title
        ? String(row.title).trim()
        : "";
      variables[`row${index}_id`] = row?.id ? String(row.id).trim() : "";
    }

    return variables;
  }

  throw new Error(`Unsupported structureType: ${structureType}`);
}

module.exports = {
  getStructuralVariableNames,
  buildStructuralVariablesFromRendered,
};
