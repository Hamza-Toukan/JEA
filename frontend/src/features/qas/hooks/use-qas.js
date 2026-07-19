import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { qasService } from "@/services/qas";
import { APP_CONFIG } from "@/config/app";

export function useQAs(params = {}) {
  return useQuery({
    queryKey: ["qas", params],
    queryFn: () => qasService.list(params),
    enabled: APP_CONFIG.apiEnabled,
    staleTime: 60_000,
  });
}

export function useCreateQA() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => qasService.create(data),
    onSuccess: () => queryClient.invalidateQueries(["qas"]),
  });
}

export function useUpdateQA() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => qasService.update(id, data),
    onSuccess: () => queryClient.invalidateQueries(["qas"]),
  });
}

export function useDeleteQA() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => qasService.remove(id),
    onSuccess: () => queryClient.invalidateQueries(["qas"]),
  });
}
