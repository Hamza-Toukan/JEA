import { QueryClient } from "@tanstack/react-query";
import { normalizeApiError } from "@/services/api/errors";

const STALE_TIME_MS = 60_000;
const GC_TIME_MS = 5 * 60_000;

/**
 * @param {unknown} error
 */
function shouldRetry(failureCount, error) {
  const normalized = normalizeApiError(error);
  if (normalized.isUnauthorized || normalized.isForbidden) return false;
  if (normalized.isValidation || normalized.isNotFound) return false;
  return failureCount < 2;
}

export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: STALE_TIME_MS,
        gcTime: GC_TIME_MS,
        retry: shouldRetry,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

export const queryClient = createQueryClient();
