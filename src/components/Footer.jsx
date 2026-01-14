import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-green-700 text-white mt-10">
      <div className="max-w-7xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-8">
        
        {/* LOGO & ABOUT */}
        <div>
          <h2 className="text-2xl font-bold mb-3">🌿 GreenHive</h2>
          <p className="text-sm text-green-100">
            Smart plant care & online nursery with AI-powered disease detection.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-green-100 text-sm">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/browse">Browse Plants</Link></li>
            <li><Link to="/community-tips">Community Tips</Link></li>
            <li><Link to="/wishlist">Wishlist</Link></li>
            <li><Link to="/my-plants">My Plants</Link></li>
          </ul>
        </div>

        {/* SUPPORT */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Support</h3>
          <ul className="space-y-2 text-green-100 text-sm">
            <li><Link to="/help">Help Center</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/terms">Terms & Conditions</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact</h3>
          <ul className="space-y-2 text-green-100 text-sm">
            <li>📍 Chennai, India</li>
            <li>📧 greenhive@gmail.com</li>
            <li>📞 +91 98765 43210</li>
          </ul>
        </div>
      </div>

      <div className="bg-green-800 text-center text-sm py-3">
        © {new Date().getFullYear()} GreenHive. All rights reserved.
      </div>
    </footer>
  );
}
