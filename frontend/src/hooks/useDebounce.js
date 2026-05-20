import { useEffect, useState } from "react";

/**
 * @param {T} value
 * @param {number} delayMs
 * @returns {T}
 * @template T
 */
export function useDebounce(value, delayMs = 300) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);

  return debounced;
}
