import { cn } from "./cn";

/**
 * Lightweight variant resolver (no external cva dependency).
 * @param {string} base
 * @param {Record<string, Record<string, string>>} config
 * @returns {(options?: Record<string, string>) => string}
 */
export function variants(base, config) {
  return (options = {}) => {
    const parts = [base];
    for (const [key, map] of Object.entries(config)) {
      const value = options[key];
      if (value && map[value]) {
        parts.push(map[value]);
      }
    }
    return cn(...parts);
  };
}
