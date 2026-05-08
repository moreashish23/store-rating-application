import { useState} from "react";
import type{ ReactNode } from "react"
import { useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const pageTitles: Record<string, string> = {
  "/admin": "Dashboard Overview",
  "/admin/users": "Manage Users",
  "/admin/stores": "Manage Stores",
  "/user": "Browse Stores",
  "/store-owner": "Store Dashboard",
  "/change-password": "Change Password",
};

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = pageTitles[location.pathname] || "Dashboard";

  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content - offset for desktop fixed sidebar */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        <Navbar onMenuClick={() => setSidebarOpen(true)} title={title} />
        <main className="flex-1 p-4 sm:p-5 lg:p-6">
          <div className="max-w-screen-2xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;