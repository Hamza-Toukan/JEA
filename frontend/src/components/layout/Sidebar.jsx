import { NavLink } from "react-router-dom";
import { HelpCircle, Headphones } from "lucide-react";
import { cn } from "../../lib/cn";
import { MAIN_NAV_ITEMS } from "../../constants/navigation";
import { Button } from "../ui/Button";
import { useUiStore } from "../../store";

function JeaLogoMark() {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/20">
      <svg viewBox="0 0 40 40" className="h-7 w-7" aria-hidden>
        <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/90" />
        <path d="M12 26 L20 12 L28 26 Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" className="text-jea-cyan-light" />
        <circle cx="20" cy="22" r="3" fill="currentColor" className="text-white/80" />
      </svg>
    </div>
  );
}

export function Sidebar() {
  const collapsed = useUiStore((s) => s.sidebarCollapsed);

  return (
    <aside
      className={cn(
        "jea-gradient-sidebar flex shrink-0 flex-col border-s border-white/5 transition-[width] duration-200",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      <div className="border-b border-white/10 px-4 py-4">
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <JeaLogoMark />
          {!collapsed && (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold leading-snug text-white">
                نقابة المهندسين الأردنيين
              </p>
              <p className="mt-0.5 truncate text-[11px] text-white/60">
                منصة العمليات الذكية
              </p>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-2 py-4" aria-label="التنقل الرئيسي">
        {MAIN_NAV_ITEMS.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            title={collapsed ? item.label : undefined}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                collapsed && "justify-center px-2",
                isActive
                  ? "bg-white/12 text-white shadow-sm ring-1 ring-white/10"
                  : "text-white/70 hover:bg-white/8 hover:text-white"
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  className={cn(
                    "h-[18px] w-[18px] shrink-0",
                    isActive ? "text-jea-cyan-light" : "text-white/50"
                  )}
                  aria-hidden
                />
                {!collapsed && <span className="truncate">{item.label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {!collapsed && (
        <div className="space-y-3 border-t border-white/10 px-4 py-4">
          <a
            href="#help"
            className="flex items-center gap-2 rounded-lg px-2 py-2 text-xs text-white/60 transition-colors hover:bg-white/8 hover:text-white/90"
          >
            <HelpCircle className="h-4 w-4" aria-hidden />
            المساعدة
          </a>
          <Button
            variant="accent"
            size="md"
            className="w-full justify-center bg-jea-cyan/90 hover:bg-jea-cyan border-jea-cyan/50"
            icon={Headphones}
          >
            تواصل مع الدعم
          </Button>
        </div>
      )}
    </aside>
  );
}
