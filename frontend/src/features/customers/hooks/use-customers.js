import { useQuery } from "@tanstack/react-query";
import { customersService } from "@/services/customers";
import { APP_CONFIG } from "@/config/app";

export function useCustomers(params = {}) {
  return useQuery({
    queryKey: ["customers", params],
    queryFn: () => customersService.listCustomers(params),
    enabled: APP_CONFIG.apiEnabled,
    staleTime: 60_000,
  });
}
