import { Bell, Moon, PanelRightClose, PanelRightOpen } from "lucide-react";
import { SearchInput } from "../forms/SearchInput";
import { useUiStore, useNotificationsStore } from "../../store";

export function Topbar({ title = "منصة العمليات الذكية" }) {
  const { sidebarCollapsed, toggleSidebar } = useUiStore();
  const unreadCount = useNotificationsStore(
    (s) => s.items.filter((n) => !n.read).length
  );

  return (
    <header className="jea-gradient-header sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-jea-border-soft bg-jea-surface/95 px-4 backdrop-blur-sm lg:px-6">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={toggleSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-jea-border-soft text-jea-text-muted transition-colors hover:bg-jea-bg hover:text-jea-navy jea-focus-ring"
          aria-label={sidebarCollapsed ? "توسيع القائمة" : "طي القائمة"}
        >
          {sidebarCollapsed ? (
            <PanelRightOpen className="h-4 w-4" />
          ) : (
            <PanelRightClose className="h-4 w-4" />
          )}
        </button>
        <h1 className="hidden text-sm font-semibold text-jea-navy md:block">{title}</h1>
      </div>

      <div className="hidden flex-1 justify-center px-4 md:flex lg:max-w-md">
        <SearchInput className="w-full max-w-sm" />
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-jea-border-soft text-jea-text-muted transition-colors hover:bg-jea-bg hover:text-jea-navy jea-focus-ring"
          aria-label={`الإشعارات${unreadCount ? `، ${unreadCount} غير مقروء` : ""}`}
        >
          <Bell className="h-4 w-4" aria-hidden />
          {unreadCount > 0 && (
            <span className="absolute end-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-jea-danger px-1 text-[10px] font-medium text-white ring-2 ring-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-jea-border-soft text-jea-text-muted transition-colors hover:bg-jea-bg hover:text-jea-navy jea-focus-ring"
          aria-label="الوضع الليلي"
        >
          <Moon className="h-4 w-4" aria-hidden />
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
