import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "@/services/analytics";
import { APP_CONFIG } from "@/config/app";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () => analyticsService.getAnalyticsOverview(),
    enabled: APP_CONFIG.apiEnabled,
    staleTime: 60_000,
  });
}
