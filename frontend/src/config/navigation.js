import {
  LayoutDashboard,
  Inbox,
  BookOpen,
  GitBranch,
  BarChart3,
  Settings,
} from "lucide-react";

export const NAV_ITEMS = [
  { id: "dashboard", label: "لوحة القيادة", path: "/dashboard", icon: LayoutDashboard },
  { id: "inbox", label: "البريد الوارد", path: "/inbox", icon: Inbox },
  { id: "knowledge", label: "قاعدة المعرفة", path: "/knowledge-base", icon: BookOpen },
  { id: "workflows", label: "مسارات عمل الذكاء الاصطناعي", path: "/workflows", icon: GitBranch },
  { id: "analytics", label: "التحليلات", path: "/analytics", icon: BarChart3 },
  { id: "settings", label: "الإعدادات", path: "/settings", icon: Settings },
];
