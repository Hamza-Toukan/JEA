import {
  LayoutDashboard,
  Inbox,
  Ticket,
  BookOpen,
  Settings,
  Workflow,
  Users,
  UserCheck,
  Briefcase,
  Activity,
  MessageSquare,
  Megaphone,
  Star,
  FolderTree,
  Network,
  HelpCircle
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
  {
    id: "users",
    label: "المستخدمين",
    path: ROUTES.USERS,
    icon: Users,
  },
  {
    id: "customers",
    label: "العملاء",
    path: ROUTES.CUSTOMERS,
    icon: UserCheck,
  },
  {
    id: "employees",
    label: "الموظفين",
    path: ROUTES.EMPLOYEES,
    icon: Briefcase,
  },
  {
    id: "campaigns",
    label: "الحملات",
    path: ROUTES.CAMPAIGNS,
    icon: Megaphone,
  },
  {
    id: "ratings",
    label: "التقييمات",
    path: ROUTES.RATINGS,
    icon: Star,
  },
];
