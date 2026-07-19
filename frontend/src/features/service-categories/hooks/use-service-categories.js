import { useQuery } from "@tanstack/react-query";
import { serviceCategoriesService } from "@/services/service-categories";
import { APP_CONFIG } from "@/config/app";

export function useServiceCategories(params = {}) {
  return useQuery({
    queryKey: ["serviceCategories", params],
    queryFn: () => serviceCategoriesService.list(params),
    enabled: APP_CONFIG.apiEnabled,
    staleTime: 60_000,
  });
}
