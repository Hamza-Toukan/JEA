const { LIST_MAX_ROWS, validateOptionsList } = require("./validation.util");

/**
 * Builds a provider-agnostic list message structure (4–10 rows in a single section).
 *
 * @param {Object} params
 * @param {string} params.body
 * @param {Array<{ id: string, title: string, description?: string }>} params.options
 * @param {string} [params.sectionTitle]
 * @returns {{ type: 'list', body: string, buttonText: string, sections: Array }}
 */
function buildListMessage({
  body,
  options = [],
  sectionTitle = "Available Options",
}) {
  if (typeof body !== "string" || !body.trim()) {
    throw new Error("List message requires a non-empty body");
  }

  if (typeof sectionTitle !== "string" || !sectionTitle.trim()) {
    throw new Error("List message requires a non-empty section title");
  }

  const rows = validateOptionsList(options, {
    maxCount: LIST_MAX_ROWS,
    label: "List",
  });

  if (rows.length < 4) {
    throw new Error("List message requires at least 4 options");
  }

  return {
    type: "list",
    body: body.trim(),
    buttonText: "اختر",
    sections: [
      {
        title: sectionTitle.trim(),
        rows,
      },
    ],
  };
}

module.exports = {
  buildListMessage,
  LIST_MAX_ROWS,
};
