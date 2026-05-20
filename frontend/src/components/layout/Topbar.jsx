import { Bell, Menu, Moon, PanelRightClose, PanelRightOpen } from "lucide-react";
import { SearchInput } from "@/components/forms/SearchInput";
import { IconButton } from "@/components/layout/IconButton";
import { useUiStore, useNotificationsStore } from "@/store";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useAuth } from "@/hooks/use-auth";

export function Topbar({ title = "منصة العمليات الذكية" }) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const sidebarCollapsed = useUiStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const setMobileNavOpen = useUiStore((s) => s.setMobileNavOpen);
  const { user } = useAuth();
  const unreadCount = useNotificationsStore(
    (s) => s.items.filter((n) => !n.read).length
  );

  const displayName = user?.name ?? "مدير النظام";
  const displayRole =
    user?.role ?? (Array.isArray(user?.roles) ? user.roles[0] : null) ?? "مسؤول";
  const avatarInitial = displayName.charAt(0) || "م";

  const handleMenuClick = () => {
    if (isDesktop) {
      toggleSidebar();
    } else {
      setMobileNavOpen(true);
    }
  };

  return (
    <header
      className="ui-gradient-header sticky top-0 flex shrink-0 items-center justify-between gap-3 border-b border-border-subtle bg-surface/95 px-4 backdrop-blur-sm lg:gap-4 lg:px-6"
      style={{
        height: "var(--shell-topbar-height)",
        zIndex: "var(--z-topbar)",
      }}
    >
      <div className="flex min-w-0 items-center gap-2">
        <IconButton
          aria-label={
            isDesktop
              ? sidebarCollapsed
                ? "توسيع القائمة"
                : "طي القائمة"
              : "فتح القائمة"
          }
          onClick={handleMenuClick}
        >
          {isDesktop ? (
            sidebarCollapsed ? (
              <PanelRightOpen className="h-4 w-4" />
            ) : (
              <PanelRightClose className="h-4 w-4" />
            )
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </IconButton>
        <h1 className="truncate text-sm font-semibold text-primary md:text-base">
          {title}
        </h1>
      </div>

      <div className="hidden min-w-0 flex-1 justify-center px-2 md:flex lg:max-w-md">
        <SearchInput className="w-full max-w-sm" />
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <IconButton
          aria-label={`الإشعارات${unreadCount ? `، ${unreadCount} غير مقروء` : ""}`}
          className="relative"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute end-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-1 text-[10px] font-medium text-white ring-2 ring-surface">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </IconButton>

        <IconButton aria-label="الوضع الليلي (قريباً)" disabled>
          <Moon className="h-4 w-4 opacity-50" />
        </IconButton>

        <div className="ms-0.5 flex items-center gap-2 rounded-lg border border-border-subtle bg-background py-1 pe-2 ps-1 sm:ms-1">
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent-muted text-xs font-semibold text-primary"
            aria-hidden
          >
            {avatarInitial}
          </div>
          <div className="hidden min-w-0 text-start sm:block">
            <p className="truncate text-xs font-medium text-primary">{displayName}</p>
            <p className="text-[10px] text-subtle">{displayRole}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
