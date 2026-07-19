import { Bell, Menu, Moon, ChevronLeft, ChevronRight, LogOut } from "lucide-react";
import { SearchInput } from "@/components/forms/SearchInput";
import { IconButton } from "@/components/layout/IconButton";
import { useUiStore, useNotificationsStore } from "@/store";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useNotifications } from "@/features/notifications/hooks/use-notifications";
import { useState, useRef, useEffect } from "react";

export function Topbar({ title = "منصة العمليات الذكية" }) {
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const sidebarCollapsed = useUiStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const setMobileNavOpen = useUiStore((s) => s.setMobileNavOpen);
  const navigate = useNavigate();
  const { user, clearSession } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationsRef = useRef(null);

  const { data: notificationsData, isLoading: isLoadingNotifications } = useNotifications();
  const apiNotifications = notificationsData?.data || [];
  
  const unreadCount = apiNotifications.filter((n) => n.status === 'UNREAD').length;

  useEffect(() => {
    function handleClickOutside(event) {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    clearSession();
    navigate("/login", { replace: true });
  };

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
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
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
        <div className="relative" ref={notificationsRef}>
          <IconButton
            aria-label={`الإشعارات${unreadCount ? `، ${unreadCount} غير مقروء` : ""}`}
            className="relative"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute end-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-1 text-[10px] font-medium text-white ring-2 ring-surface">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </IconButton>

          {showNotifications && (
            <div className="absolute end-0 top-full mt-2 w-80 rounded-xl border border-border-subtle bg-surface shadow-lg overflow-hidden">
              <div className="border-b border-border-subtle p-3 flex justify-between items-center bg-background">
                <h3 className="font-semibold text-primary text-sm">الإشعارات</h3>
                {unreadCount > 0 && <span className="text-[10px] text-muted cursor-pointer hover:text-primary">تحديد الكل كمقروء</span>}
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-border-subtle">
                {isLoadingNotifications ? (
                  <div className="p-4 text-center text-xs text-muted">جاري التحميل...</div>
                ) : apiNotifications.length === 0 ? (
                  <div className="p-8 text-center text-xs text-muted">لا توجد إشعارات جديدة</div>
                ) : (
                  apiNotifications.map((notif) => (
                    <div key={notif.id} className={`p-3 text-start hover:bg-background-subtle transition-colors cursor-pointer ${notif.status === 'UNREAD' ? 'bg-accent-muted/20' : ''}`}>
                      <p className="text-xs font-medium text-primary mb-1">{notif.title}</p>
                      <p className="text-[11px] text-muted leading-tight">{notif.content}</p>
                      <p className="text-[9px] text-subtle mt-2 ltr text-start">{new Date(notif.created_at).toLocaleString('ar-JO')}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <IconButton aria-label="الوضع الليلي (قريباً)" disabled>
          <Moon className="h-4 w-4 opacity-50" />
        </IconButton>

        <button
          type="button"
          onClick={handleLogout}
          className="ms-0.5 flex items-center gap-2 rounded-lg border border-border-subtle bg-background hover:bg-error/5 hover:border-error/20 py-1 pe-2 ps-1 sm:ms-1 cursor-pointer transition-all group"
          title="تسجيل الخروج"
        >
          <div
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-accent-muted group-hover:bg-error/10 group-hover:text-error text-xs font-semibold text-primary"
            aria-hidden
          >
            <LogOut className="h-3.5 w-3.5 hidden group-hover:block" />
            <span className="group-hover:hidden">{avatarInitial}</span>
          </div>
          <div className="hidden min-w-0 text-start sm:block">
            <p className="truncate text-xs font-medium text-primary group-hover:text-error">{displayName}</p>
            <p className="text-[10px] text-subtle group-hover:text-error/80">{displayRole}</p>
          </div>
        </button>
        
        {/* JEA Logo on the Top Left Corner */}
        <div className="hidden sm:block ms-2 border-s border-border-subtle ps-4">
          <img src="/logo.png" alt="JEA Logo" className="h-8 w-auto object-contain" />
        </div>
      </div>
    </header>
  );
}
