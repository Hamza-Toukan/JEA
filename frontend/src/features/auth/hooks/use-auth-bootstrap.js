import { useEffect } from "react";
import { APP_CONFIG } from "@/config/app";
import { useAuthStore } from "@/store";

/**
 * Validates persisted session against backend when API is enabled.
 * No UI — architecture only until login page ships.
 */
export function useAuthBootstrap() {
  const token = useAuthStore((s) => s.token);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const clearSession = useAuthStore((s) => s.clearSession);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  useEffect(() => {
    if (!APP_CONFIG.apiEnabled || !isHydrated) return;
    if (!token && isAuthenticated) {
      clearSession();
    }
  }, [token, isAuthenticated, isHydrated, clearSession]);

  return {
    isBootstrapping: !isHydrated,
  };
}
