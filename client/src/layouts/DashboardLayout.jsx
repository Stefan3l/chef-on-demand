import { Outlet, useParams } from "react-router-dom";

// import components
import Sidebar from "../dashboard/Sidebar";
import Topbar from "../dashboard/Topbar";
import { UnreadMessagesProvider } from "../components/contexts/UnreadMessagesContext";

export default function DashboardLayout() {
  const { id } = useParams();

  return (
    <UnreadMessagesProvider chefId={id}>
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
    </UnreadMessagesProvider>
  );
}
