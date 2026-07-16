import {
  LayoutDashboard,
  Inbox,
  Ticket,
  BookOpen,
  Settings,
  Workflow,
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
    id: "tickets",
    label: "التذاكر",
    path: ROUTES.TICKETS,
    icon: Ticket,
  },
  {
    id: "knowledge",
    label: "قاعدة المعرفة",
    path: ROUTES.KNOWLEDGE_BASE,
    icon: BookOpen,
  },
  {
    id: "workflows",
    label: "مسارات العمل",
    path: ROUTES.WORKFLOWS,
    icon: Workflow,
  },
  {
    id: "settings",
    label: "الإعدادات",
    path: ROUTES.SETTINGS,
    icon: Settings,
  },
];
