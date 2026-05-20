import { Navigate, useLocation } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/use-auth";
import { LoadingState } from "@/components/feedback";

/**
 * Auth guard — enable via APP_CONFIG.authGuardEnabled or route-level `enabled`.
 */
export function ProtectedRoute({
  children,
  enabled = false,
  fallback = ROUTES.LOGIN,
}) {
  const location = useLocation();
  const { isAuthenticated, isHydrated } = useAuth();

  if (!enabled) {
    return children;
  }

  if (!isHydrated) {
    return <LoadingState label="جاري التحقق من الجلسة..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to={fallback} state={{ from: location }} replace />;
  }

  return children;
}
