import { NavLink } from "react-router-dom";

import { cn } from "@/lib/cn";
import { MAIN_NAV_ITEMS } from "@/constants/navigation";
import { Button } from "@/components/ui/Button";
import { useUiStore } from "@/store";

const logoImg = "/logo.png";

function JeaLogoMark() {
  return (
    <div
      className="relative h-12 w-12 shrink-0 rounded-lg bg-white overflow-hidden p-1 ring-1 ring-white/20"
      aria-hidden
    >
      <img 
        src={logoImg} 
        alt="JEA Logo" 
        className="absolute top-0 left-0 h-[175%] w-full object-cover object-top" 
      />
    </div>
  );
}

function NavItems({ collapsed, onNavigate }) {
  return (
    <>
      {MAIN_NAV_ITEMS.map((item) => (
        <NavLink
          key={item.id}
          to={item.path}
          title={collapsed ? item.label : undefined}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-[var(--duration-fast)] ui-focus-ring",
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
                  isActive ? "text-[var(--color-accent-subtle)]" : "text-white/50"
                )}
                aria-hidden
              />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </>
          )}
        </NavLink>
      ))}
    </>
  );
}

function SidebarPanel({ collapsed, className, onNavigate }) {
  return (
    <aside
      className={cn(
        "ui-gradient-sidebar flex h-full flex-col border-s border-white/5",
        collapsed ? "w-[var(--shell-sidebar-collapsed)]" : "w-[var(--shell-sidebar-width)]",
        className
      )}
    >
      <div className="border-b border-white/10 px-4 py-4">
        <div
          className={cn(
            "flex items-center gap-3",
            collapsed && "justify-center"
          )}
        >
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

      <nav
        className="flex-1 space-y-0.5 overflow-y-auto px-2 py-4"
        aria-label="التنقل الرئيسي"
      >
        <NavItems collapsed={collapsed} onNavigate={onNavigate} />
      </nav>


    </aside>
  );
}

/** Desktop sidebar (lg+) */
export function SidebarDesktop() {
  const collapsed = useUiStore((s) => s.sidebarCollapsed);

  return (
    <div className="hidden shrink-0 lg:flex">
      <SidebarPanel collapsed={collapsed} />
    </div>
  );
}

/** Mobile drawer sidebar */
export function SidebarMobile() {
  const mobileNavOpen = useUiStore((s) => s.mobileNavOpen);
  const closeMobileNav = useUiStore((s) => s.closeMobileNav);

  if (!mobileNavOpen) return null;

  return (
    <div className="fixed inset-0 lg:hidden" style={{ zIndex: "var(--z-drawer)" }}>
      <button
        type="button"
        className="absolute inset-0 bg-[var(--color-overlay)]"
        aria-label="إغلاق القائمة"
        onClick={closeMobileNav}
      />
      <div className="absolute inset-y-0 inset-inline-end-0 flex">
        <SidebarPanel
          collapsed={false}
          onNavigate={closeMobileNav}
          className="shadow-jea-lg"
        />
      </div>
    </div>
  );
}

/** @deprecated Use SidebarDesktop + SidebarMobile via AppShell */
export function Sidebar() {
  return (
    <>
      <SidebarDesktop />
      <SidebarMobile />
    </>
  );
}
