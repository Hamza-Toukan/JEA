import { useQuery } from "@tanstack/react-query";
import { ticketsService } from "@/services/tickets";
import { APP_CONFIG } from "@/config/app";

export function useTickets(params = {}) {
  return useQuery({
    queryKey: ["tickets", params],
    queryFn: () => ticketsService.listTickets(params),
    enabled: APP_CONFIG.apiEnabled,
    staleTime: 60_000,
  });
}
