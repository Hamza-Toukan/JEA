import { Outlet } from "react-router-dom";
import { SidebarDesktop, SidebarMobile, Topbar } from "@/components/layout";
import { ErrorBoundary } from "@/components/feedback";

/**
 * Application shell — sidebar, topbar, main content region.
 */
export function AppShell({ topbarTitle }) {
  return (
    <div className="flex min-h-dvh bg-background">
      <SidebarDesktop />
      <SidebarMobile />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={topbarTitle} />
        <main className="ui-shell-main flex-1 overflow-auto">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
