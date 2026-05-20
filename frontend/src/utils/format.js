/**
 * @param {number} value
 * @param {string} [locale]
 */
export function formatNumber(value, locale = "ar-JO") {
  return new Intl.NumberFormat(locale).format(value);
}

/**
 * @param {string | Date} date
 */
export function formatDate(date, locale = "ar-JO") {
  const d = date instanceof Date ? date : new Date(date);
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

/**
 * @param {number} ratio 0–1
 */
export function formatPercent(ratio, locale = "ar-JO") {
  return new Intl.NumberFormat(locale, {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(ratio);
}
