import { NavLink } from "react-router-dom";

export default function AdminSidebar() {
  const linkClass = ({ isActive }) =>
    `block px-3 py-2 rounded text-sm font-medium transition ${
      isActive
        ? "bg-green-600 text-white"
        : "text-gray-700 hover:bg-green-100"
    }`;

  return (
    <aside className="w-44 bg-white shadow-lg h-screen fixed left-0 top-0">
      
      {/* LOGO */}
      <div className="p-4 border-b">
        <h1 className="text-lg font-bold text-green-600">
          GreenHive
        </h1>
        <p className="text-xs text-gray-400">
          Admin Panel
        </p>
      </div>

      {/* NAV */}
      <nav className="p-3 space-y-1">
        <NavLink to="/admin/dashboard" className={linkClass}>
          Dashboard
        </NavLink>

        <NavLink to="/admin/users" className={linkClass}>
          Users
        </NavLink>

        <NavLink to="/admin/orders" className={linkClass}>
          Orders
        </NavLink>

        {/* <NavLink to="/admin/reports" className={linkClass}>
          Reports
        </NavLink> */}

        <NavLink to="/admin/sellers" className={linkClass}>
          Sellers
        </NavLink>

        <NavLink to="/admin/products" className={linkClass}>
          Products
        </NavLink>

        <NavLink to="/admin/categories" className={linkClass}>
          Categories
        </NavLink>

        <NavLink to="/admin/tips" className={linkClass}>
          Tips
        </NavLink>

        <NavLink
          to="/admin/disease-reports"
          className={linkClass}
        >
          Disease Reports
        </NavLink>
      </nav>
    </aside>
  );
}
