import { ROUTES } from "@/constants/routes";
import { DashboardPage } from "@/features/dashboard";
import { InboxPage, TicketsPage } from "@/features/inbox";
import { KnowledgeBasePage } from "@/features/knowledge-base";
import { WorkflowsPage } from "@/features/workflows";

import { SettingsPage } from "@/features/settings";

/**
 * Central route registry — single source for paths, lazy loading, and auth flags.
 * @typedef {Object} AppRouteConfig
 * @property {string} path — path segment (no leading slash) or index marker
 * @property {React.ComponentType} element
 * @property {boolean} [protected] — requires auth when guard is enabled
 * @property {string} [title] — optional document / topbar title
 */

/** @type {AppRouteConfig[]} */
export const APP_ROUTES = [
  {
    path: ROUTES.DASHBOARD.slice(1),
    element: DashboardPage,
    protected: true,
    title: "لوحة القيادة",
  },
  {
    path: ROUTES.INBOX.slice(1),
    element: InboxPage,
    protected: true,
    title: "البريد الوارد",
  },
  {
    path: ROUTES.TICKETS.slice(1),
    element: TicketsPage,
    protected: true,
    title: "إدارة التذاكر",
  },
  {
    path: ROUTES.KNOWLEDGE_BASE.slice(1),
    element: KnowledgeBasePage,
    protected: true,
    title: "قاعدة المعرفة",
  },

  {
    path: ROUTES.SETTINGS.slice(1),
    element: SettingsPage,
    protected: true,
    title: "الإعدادات",
  },
];
