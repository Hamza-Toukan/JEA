import { Routes, Route, Navigate } from "react-router-dom";
import { APP_CONFIG } from "@/config/app";
import { DEFAULT_ROUTE } from "@/constants";
import { AppShell } from "@/layouts/AppShell";
import { ProtectedRoute } from "./ProtectedRoute";
import { APP_ROUTES } from "./routes.config";
import { LoginPage } from "@/features/auth";

const AUTH_GUARD_ENABLED = APP_CONFIG.authGuardEnabled;

export function AppRoutes() {
  return (
    <Routes>
      {/* Standalone full-screen login page */}
      <Route path="login" element={<LoginPage />} />

      {/* Main app navigation inside JEA AppShell */}
      <Route element={<AppShell />}>
        <Route index element={<Navigate to={DEFAULT_ROUTE} replace />} />

        {APP_ROUTES.map(({ path, element: Page, protected: isProtected }) => (
          <Route
            key={path}
            path={path}
            element={
              <ProtectedRoute enabled={isProtected && AUTH_GUARD_ENABLED}>
                <Page />
              </ProtectedRoute>
            }
          />
        ))}
      </Route>

      {/* Wildcard fallback redirects to dashboard */}
      <Route path="*" element={<Navigate to={DEFAULT_ROUTE} replace />} />
    </Routes>
  );
}
