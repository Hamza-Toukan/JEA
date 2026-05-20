import { useEffect } from "react";
import { handleApiError } from "@/services/api/error-handler";

/**
 * Surfaces query/mutation errors via global toast.
 * @param {unknown} error
 * @param {{ enabled?: boolean, silent?: boolean }} [options]
 */
export function useQueryErrorToast(error, options = {}) {
  const { enabled = true, silent = false } = options;

  useEffect(() => {
    if (!enabled || !error || silent) return;
    handleApiError(error);
  }, [error, enabled, silent]);
}
