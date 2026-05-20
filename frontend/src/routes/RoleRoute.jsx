import { Navigate } from "react-router-dom";
import { ROUTES } from "@/constants/routes";
import { useAuth } from "@/hooks/use-auth";
import { ErrorState } from "@/components/feedback";

/**
 * Role guard — use on routes that require specific RBAC roles.
 */
export function RoleRoute({
  children,
  roles,
  fallback = ROUTES.DASHBOARD,
  enabled = true,
}) {
  const { isAuthenticated, hasRole, isHydrated } = useAuth();

  if (!enabled) {
    return children;
  }

  if (!isHydrated) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (!hasRole(roles)) {
    return (
      <div className="p-6">
        <ErrorState
          title="صلاحيات غير كافية"
          description="ليس لديك صلاحية للوصول إلى هذه الصفحة."
        />
      </div>
    );
  }

  return children;
}
