import { useQuery } from "@tanstack/react-query";
import { APP_CONFIG } from "@/config/app";
import { queryKeys } from "@/lib/query-keys";
import { analyticsService } from "@/services/analytics";

/**
 * Operations analytics overview — ready for backend wiring.
 * @param {{ range?: string }} [params]
 */
export function useAnalyticsOverview(params = {}) {
  return useQuery({
    queryKey: queryKeys.analytics.operations(params.range),
    queryFn: () => analyticsService.getOperationsOverview(params),
    enabled: APP_CONFIG.apiEnabled,
  });
}
