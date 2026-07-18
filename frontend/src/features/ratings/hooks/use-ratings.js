import { useQuery } from "@tanstack/react-query";
import { ratingsService } from "@/services/ratings";
import { APP_CONFIG } from "@/config/app";

export function useRatings(params = {}) {
  return useQuery({
    queryKey: ["ratings", params],
    queryFn: () => ratingsService.listRatings(params),
    enabled: APP_CONFIG.apiEnabled,
    staleTime: 60_000,
  });
}
