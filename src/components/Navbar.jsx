import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaShoppingCart, FaHeart, FaUserCircle } from "react-icons/fa";

export default function Navbar() {
  const [openMenu, setOpenMenu] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // ✅ LOAD USER FROM LOCAL STORAGE
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // ✅ LOGOUT FUNCTION (NOW USED IN LOGIN PLACE)
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  // ✅ MAIN LINKS
  const mainLinks = [
    { name: "Home", path: "/" },
    { name: "Browse", path: "/browse" },
    { name: "AI Scan", path: "/ai-detect" },
    { name: "Tips", path: "/community-tips" },
    { name: "AI Plant Care", path: "/ai-plant-care" }
  ];

  // ✅ DASHBOARD DROPDOWN LINKS
  const dashboardLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "My Plants", path: "/my-plants" },
    { name: "Orders", path: "/orders" },
  ];

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center sticky top-0 z-50">

      {/* ✅ LOGO */}
      <Link to="/" className="text-2xl font-bold text-green-700">
        🌿 GreenHive
      </Link>

      {/* ✅ NAV LINKS */}
      <div className="hidden md:flex items-center gap-8 font-medium text-gray-700 relative">

        {/* ✅ MAIN LINKS */}
        {mainLinks.map((link, i) => (
          <Link
            key={i}
            to={link.path}
            className="hover:text-green-600 transition"
          >
            {link.name}
          </Link>
        ))}

        {/* ✅ DASHBOARD DROPDOWN (ONLY WHEN LOGGED IN) */}
        {user && (
          <div className="relative">
            <button
              onClick={() =>
                setOpenMenu(openMenu === "dashboard" ? null : "dashboard")
              }
              className="hover:text-green-600 transition"
            >
              Dashboard ▾
            </button>

            {openMenu === "dashboard" && (
              <div className="absolute top-8 left-0 w-44 bg-white shadow-lg rounded-lg overflow-hidden">
                {dashboardLinks.map((link, i) => (
                  <Link
                    key={i}
                    to={link.path}
                    onClick={() => setOpenMenu(null)}
                    className="block px-4 py-2 hover:bg-green-50 hover:text-green-700"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ✅ RIGHT SIDE ICONS + LOGIN/LOGOUT */}
      <div className="flex items-center gap-6 text-gray-700">

        {/* ✅ WISHLIST ICON */}
        {user && (
          <Link to="/wishlist" className="hover:text-green-600 text-xl">
            <FaHeart />
          </Link>
        )}

        {/* ✅ CART ICON */}
        {user && (
          <Link to="/cart" className="hover:text-green-600 text-xl">
            <FaShoppingCart />
          </Link>
        )}

        {/* ✅ ACCOUNT ICON + NAME UNDER IT */}
        {user && (
          <div className="relative flex flex-col items-center text-sm">
            <button
              onClick={() =>
                setOpenMenu(openMenu === "profile" ? null : "profile")
              }
              className="flex flex-col items-center hover:text-green-600"
            >
              <FaUserCircle className="text-3xl" />
              <span className="text-xs font-semibold mt-1">
                {user.name || "Account"}
              </span>
            </button>

            {openMenu === "profile" && (
              <div className="absolute right-0 top-12 w-44 bg-white shadow-lg rounded-lg overflow-hidden text-sm z-50">
                <Link
                  to="/profile"
                  onClick={() => setOpenMenu(null)}
                  className="block px-4 py-2 hover:bg-green-50"
                >
                  Profile
                </Link>
                <Link
                  to="/chat"
                  onClick={() => setOpenMenu(null)}
                  className="block px-4 py-2 hover:bg-green-50"
                >
                  Chat 
                </Link>
             <Link
                  to="/change-password"
                  onClick={() => setOpenMenu(null)}
                  className="block px-4 py-2 hover:bg-green-50"
                >
                  Change Password 
                </Link>
              </div>
            )}
          </div>
        )}

        {/* ✅ LOGIN / LOGOUT IN SAME PLACE */}
        {user ? (
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded text-sm"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="text-green-700 font-semibold hover:underline text-sm"
          >
            Login
          </Link>
        )}

      </div>
    </nav>
  );
}
