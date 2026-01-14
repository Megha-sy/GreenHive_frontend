import { NavLink } from "react-router-dom";

export default function SellerSidebar() {
  const linkClass = ({ isActive }) =>
    `block px-4 py-2 rounded ${
      isActive
        ? "bg-green-600 text-white"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <aside className="fixed top-0 left-0 w-64 h-screen bg-white shadow-md p-4">
      <h2 className="text-xl font-bold text-green-600 mb-6">
        Seller Panel
      </h2>

      <nav className="space-y-2">
        <NavLink to="/seller/dashboard" className={linkClass}>
          Dashboard
        </NavLink>

        <NavLink to="/seller/plants" className={linkClass}>
          My Plants
        </NavLink>

        <NavLink to="/seller/orders" className={linkClass}>
          Orders
        </NavLink>

        <NavLink to="/seller/analytics" className={linkClass}>
          Product Analytics
        </NavLink>

        <NavLink to="/seller/salesanalytics" className={linkClass}>
          Sales & Payouts
        </NavLink>

        <NavLink to="/seller/promotions" className={linkClass}>
          Promotions
        </NavLink>

        <NavLink to="/seller/profile" className={linkClass}>
          Profile
        </NavLink>
          <NavLink to="/seller/about" className={linkClass}>
          About
        </NavLink>
          <NavLink to="/login" className={linkClass}>
          Login
        </NavLink>
        <NavLink to="/seller/chats"  className={linkClass}>Chat 💬</NavLink>

      </nav>
    </aside>
  );
}
