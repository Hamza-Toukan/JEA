import { Outlet } from "react-router-dom";
import { Sidebar, Topbar } from "../components/layout";

export function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-jea-bg">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
