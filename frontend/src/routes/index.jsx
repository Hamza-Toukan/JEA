import { Routes, Route, Navigate } from "react-router-dom";
import { AdminLayout } from "../layouts/AdminLayout";
import { ROUTES, DEFAULT_ROUTE } from "../constants";
import { DashboardPage } from "../features/dashboard";
import { InboxPage } from "../features/inbox";
import { KnowledgeBasePage } from "../features/knowledge-base";
import { WorkflowsPage } from "../features/workflows";
import { AnalyticsPage } from "../features/analytics";
import { SettingsPage } from "../features/settings";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Navigate to={DEFAULT_ROUTE} replace />} />
        <Route path={ROUTES.DASHBOARD.slice(1)} element={<DashboardPage />} />
        <Route path={ROUTES.INBOX.slice(1)} element={<InboxPage />} />
        <Route path={ROUTES.KNOWLEDGE_BASE.slice(1)} element={<KnowledgeBasePage />} />
        <Route path={ROUTES.WORKFLOWS.slice(1)} element={<WorkflowsPage />} />
        <Route path={ROUTES.ANALYTICS.slice(1)} element={<AnalyticsPage />} />
        <Route path={ROUTES.SETTINGS.slice(1)} element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
