import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { APP_CONFIG } from "@/config/app";
import { queryKeys } from "@/lib/query-keys";
import { authService } from "@/services/auth";
import { useAuthStore } from "@/store";

/**
 * Validates persisted session against backend when API is enabled.
 * No UI — architecture only until login page ships.
 */
export function useAuthBootstrap() {
  const token = useAuthStore((s) => s.token);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const setSession = useAuthStore((s) => s.setSession);
  const clearSession = useAuthStore((s) => s.clearSession);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  const meQuery = useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: () => authService.getCurrentUser(),
    enabled: APP_CONFIG.apiEnabled && isHydrated && Boolean(token) && token !== "mock-jwt-token-sk_8924",
    retry: false,
    staleTime: 5 * 60_000,
  });

  useEffect(() => {
    if (!APP_CONFIG.apiEnabled || !isHydrated) return;
    if (!token && isAuthenticated) {
      clearSession();
    }
  }, [token, isAuthenticated, isHydrated, clearSession]);

  useEffect(() => {
    if (!meQuery.data || !token) return;
    setSession(token, meQuery.data);
  }, [meQuery.data, token, setSession]);

  useEffect(() => {
    if (meQuery.isError) {
      clearSession();
    }
  }, [meQuery.isError, clearSession]);

  return {
    isBootstrapping:
      !isHydrated || (Boolean(token) && APP_CONFIG.apiEnabled && meQuery.isLoading),
    meQuery,
  };
}
