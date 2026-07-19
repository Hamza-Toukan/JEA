import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { escService } from "@/services/employee-service-categories";
import { APP_CONFIG } from "@/config/app";

export function useEmployeeServiceCategories(params = {}) {
  return useQuery({
    queryKey: ["esc", params],
    queryFn: () => escService.list(params),
    enabled: APP_CONFIG.apiEnabled,
    staleTime: 60_000,
  });
}

export function useCreateESC() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => escService.create(data),
    onSuccess: () => queryClient.invalidateQueries(["esc"]),
  });
}

export function useDeleteESC() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => escService.remove(id),
    onSuccess: () => queryClient.invalidateQueries(["esc"]),
  });
}
