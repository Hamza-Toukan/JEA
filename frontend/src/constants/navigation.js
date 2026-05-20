import {
  LayoutDashboard,
  Inbox,
  BookOpen,
  GitBranch,
  BarChart3,
  Settings,
} from "lucide-react";
import { ROUTES } from "./routes";

/**
 * Primary sidebar navigation — extend here for new modules.
 */
export const MAIN_NAV_ITEMS = [
  {
    id: "dashboard",
    label: "لوحة القيادة",
    path: ROUTES.DASHBOARD,
    icon: LayoutDashboard,
  },
  {
    id: "inbox",
    label: "البريد الوارد",
    path: ROUTES.INBOX,
    icon: Inbox,
  },
  {
    id: "knowledge",
    label: "قاعدة المعرفة",
    path: ROUTES.KNOWLEDGE_BASE,
    icon: BookOpen,
  },
  {
    id: "workflows",
    label: "مسارات عمل الذكاء الاصطناعي",
    path: ROUTES.WORKFLOWS,
    icon: GitBranch,
  },
  {
    id: "analytics",
    label: "التحليلات",
    path: ROUTES.ANALYTICS,
    icon: BarChart3,
  },
  {
    id: "settings",
    label: "الإعدادات",
    path: ROUTES.SETTINGS,
    icon: Settings,
  },
];
