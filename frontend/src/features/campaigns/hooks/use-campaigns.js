import { useQuery } from "@tanstack/react-query";
import { campaignsService } from "@/services/campaigns";
import { APP_CONFIG } from "@/config/app";

export function useCampaigns(params = {}) {
  return useQuery({
    queryKey: ["campaigns", params],
    queryFn: () => campaignsService.listCampaigns(params),
    enabled: APP_CONFIG.apiEnabled,
    staleTime: 60_000,
  });
}
