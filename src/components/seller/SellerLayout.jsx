import SellerSidebar from "./SellerSidebar";
import { Outlet } from "react-router-dom";

export default function SellerLayout() {
  // ✅ Get seller info from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="flex">
      {/* Sidebar */}
      <SellerSidebar />

      {/* Main Content */}
      <main className="ml-64 flex-1 min-h-screen bg-gray-50">
        {/* ✅ TOP BAR */}
        <div className="bg-white shadow px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-gray-800">
              {user?.shopName || "My Shop"}
            </h1>
            <p className="text-sm text-gray-500">
              Seller Dashboard
            </p>
          </div>

          <div className="text-sm text-gray-600">
             Hi, <span className="font-medium">{user?.name}</span>
          </div>
        </div>

        {/* PAGE CONTENT */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
