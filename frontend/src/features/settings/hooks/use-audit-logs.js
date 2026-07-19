import { useQuery } from "@tanstack/react-query";
import { auditLogsService } from "@/services/audit-logs";
import { APP_CONFIG } from "@/config/app";

export function useAuditLogs(params = {}) {
  return useQuery({
    queryKey: ["auditLogs", params],
    queryFn: () => auditLogsService.list(params),
    enabled: APP_CONFIG.apiEnabled,
    staleTime: 60_000,
  });
}
