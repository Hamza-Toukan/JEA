import { ROUTES } from "@/constants/routes";
import { DashboardPage } from "@/features/dashboard";
import { InboxPage, TicketsPage } from "@/features/inbox";
import { KnowledgeBasePage } from "@/features/knowledge-base";
import { WorkflowsPage } from "@/features/workflows";
import { UsersPage } from "@/features/users";
import { RatingsPage } from "@/features/ratings";
import { CampaignsPage } from "@/features/campaigns";
import { CustomersPage } from "@/features/customers";
import { EmployeesPage } from "@/features/employees";

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
    path: ROUTES.WORKFLOWS.slice(1),
    element: WorkflowsPage,
    protected: true,
    title: "مسارات العمل",
  },
  {
    path: ROUTES.SETTINGS.slice(1),
    element: SettingsPage,
    protected: true,
    title: "الإعدادات",
  },
  {
    path: ROUTES.USERS.slice(1),
    element: UsersPage,
    protected: true,
    title: "المستخدمين",
  },
  {
    path: ROUTES.RATINGS.slice(1),
    element: RatingsPage,
    protected: true,
    title: "التقييمات",
  },
  {
    path: ROUTES.CAMPAIGNS.slice(1),
    element: CampaignsPage,
    protected: true,
    title: "الحملات",
  },
  {
    path: ROUTES.CUSTOMERS.slice(1),
    element: CustomersPage,
    protected: true,
    title: "العملاء",
  },
  {
    path: ROUTES.EMPLOYEES.slice(1),
    element: EmployeesPage,
    protected: true,
    title: "الموظفين",
  },
];
