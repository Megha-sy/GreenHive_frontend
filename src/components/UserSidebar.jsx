import { Link } from "react-router-dom";

export default function UserSidebar() {
  return (
    <div className="w-64 bg-green-700 text-white min-h-screen p-5">
      <h2 className="text-2xl font-bold mb-8">🌿 GreenHive</h2>

      <nav className="space-y-3">
        <Link to="/user/dashboard">📊 Dashboard</Link>
        <Link to="/user/browse">🛒 Browse Plants</Link>
        <Link to="/user/cart">🛍️ Cart</Link>
        <Link to="/user/orders">📦 Orders</Link>
        <Link to="/user/ai-detect">🤖 AI Detection</Link>
        <Link to="/user/community-tips">💬 Community Tips</Link>
        <Link to="/user/wishlist">❤️ Wishlist</Link>
        <Link to="/user/my-plants">🪴 My Plants</Link>
        <Link to="/user/settings">⚙️ Settings</Link>
        <Link to="/user/profile">👤 Profile</Link>
      </nav>
    </div>
  );
}
