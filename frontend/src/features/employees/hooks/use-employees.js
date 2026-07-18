import { useQuery } from "@tanstack/react-query";
import { employeesService } from "@/services/employees";
import { APP_CONFIG } from "@/config/app";

export function useEmployees(params = {}) {
  return useQuery({
    queryKey: ["employees", params],
    queryFn: () => employeesService.listEmployees(params),
    enabled: APP_CONFIG.apiEnabled,
    staleTime: 60_000,
  });
}
