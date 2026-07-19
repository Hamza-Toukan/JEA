import { useQuery } from "@tanstack/react-query";
import { notificationsService } from "@/services/notifications";
import { APP_CONFIG } from "@/config/app";

export function useNotifications(params = {}) {
  return useQuery({
    queryKey: ["notifications", params],
    queryFn: () => notificationsService.list(params),
    enabled: APP_CONFIG.apiEnabled,
    staleTime: 60_000,
  });
}
