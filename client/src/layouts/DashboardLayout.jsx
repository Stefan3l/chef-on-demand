import { Outlet } from "react-router-dom";

// import components
import Sidebar from "../dashboard/Sidebar";
import Topbar from "../dashboard/Topbar";

export default function DashboardLayout() {
  return (
    <div className="flex h-screen">
      {/* Sidebar fix */}
      <Sidebar />

      {/* Content + topbar */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />

        {/* Scrollable content */}
        <main className="overflow-y-auto p-6 bg-[#f9f9f9] h-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
