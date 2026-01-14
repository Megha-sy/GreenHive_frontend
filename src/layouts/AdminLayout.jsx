import { Outlet } from "react-router-dom";
import AdminSidebar from "../components/admin/AdminSidebar";

export default function AdminLayout() {
  return (
    <div className="flex">
      {/* SIDEBAR */}
      <AdminSidebar />

      {/* MAIN CONTENT */}
      <main className="ml-64 w-full min-h-screen bg-gray-50 p-6">
        <Outlet />
      </main>
    </div>
  );
}
