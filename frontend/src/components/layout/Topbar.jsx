import { Bell, Moon, Search } from "lucide-react";
import { Input } from "../ui/Input";

export function Topbar({ title = "منصة العمليات الذكية" }) {
  return (
    <header className="jea-gradient-header sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-jea-border-soft bg-jea-surface/95 px-6 backdrop-blur-sm">
      <h1 className="hidden text-sm font-semibold text-jea-navy lg:block">{title}</h1>

      <div className="flex flex-1 items-center justify-center px-4 lg:max-w-md lg:flex-none">
        <Input
          placeholder="بحث في المحادثات، المقالات، التذاكر..."
          icon={Search}
          className="w-full max-w-sm"
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-jea-border-soft text-jea-text-muted transition-colors hover:bg-jea-bg hover:text-jea-navy"
          aria-label="الإشعارات"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute end-1.5 top-1.5 h-2 w-2 rounded-full bg-jea-danger ring-2 ring-white" />
        </button>
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-jea-border-soft text-jea-text-muted transition-colors hover:bg-jea-bg hover:text-jea-navy"
          aria-label="الوضع الليلي"
        >
          <Moon className="h-4 w-4" />
        </button>
        <div className="ms-1 flex items-center gap-2 rounded-lg border border-jea-border-soft bg-jea-bg py-1 pe-2 ps-1">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-jea-cyan-muted text-xs font-semibold text-jea-navy">
            م
          </div>
          <div className="hidden text-start sm:block">
            <p className="text-xs font-medium text-jea-navy">مدير النظام</p>
            <p className="text-[10px] text-jea-text-subtle">مسؤول</p>
          </div>
        </div>
      </div>
    </header>
  );
}
