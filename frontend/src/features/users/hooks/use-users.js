import { useQuery } from "@tanstack/react-query";
import { usersService } from "@/services/users";
import { APP_CONFIG } from "@/config/app";

export function useUsers(params = {}) {
  return useQuery({
    queryKey: ["users", params],
    queryFn: () => usersService.listUsers(params),
    enabled: APP_CONFIG.apiEnabled,
    staleTime: 60_000,
  });
}
