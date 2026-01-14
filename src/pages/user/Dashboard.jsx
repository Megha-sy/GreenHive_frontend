import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/api";

export default function Dashboard() {
  // ================== STATES ==================
  const [stats, setStats] = useState({
    orders: 0,
    scans: 0,
    tips: 0,
    wishlist: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [aiReports, setAiReports] = useState([]);
  const [likedTips, setLikedTips] = useState([]);
  const [myTips, setMyTips] = useState([]); // ✅ FIXED
  const [loading, setLoading] = useState(true);

  // ================== LOAD DASHBOARD ==================
  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const [
        ordersRes,
        scansRes,
        tipsRes,
        wishlistRes,
        myTipsRes,
      ] = await Promise.all([
        API.get("/orders/my"),
        API.get("/ai/history"),
        API.get("/tips"),
        API.get("/wishlist"),
        API.get("/tips/my"),
      ]);

      // ---------- STATS ----------
      setStats({
        orders: ordersRes?.data?.length || 0,
        scans: scansRes?.data?.history?.length || 0,
        tips: tipsRes?.data?.length || 0,
        wishlist: wishlistRes?.data?.items?.length || 0,
      });

      // ---------- DATA ----------
      setRecentOrders(ordersRes?.data || []);
      setAiReports(scansRes?.data?.history || []);
      setMyTips(myTipsRes?.data || []);

      const currentUser = JSON.parse(localStorage.getItem("user"));
      const userId = currentUser?._id;

      setLikedTips(
        (tipsRes?.data || []).filter((tip) =>
          tip?.upvotedBy?.includes(userId)
        )
      );
    } catch (err) {
      console.error("Dashboard load failed", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">
        Loading dashboard...
      </div>
    );
  }

  // ================== UI ==================
  return (
    <div className="min-h-screen bg-green-50 p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-800">
          My Dashboard 🌿
        </h1>
        <Link
          to="/browse"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Explore Plants
        </Link>
      </div>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-6 mb-8">
        {[
          { title: "My Orders", value: stats.orders },
          { title: "AI Scans", value: stats.scans },
          { title: "Saved Tips", value: stats.tips },
          { title: "Wishlist Items", value: stats.wishlist },
        ].map((item, i) => (
          <div
            key={i}
            className="bg-white rounded-xl shadow p-5 border-l-4 border-green-500"
          >
            <h2 className="text-gray-500 text-sm">{item.title}</h2>
            <p className="text-2xl font-bold text-gray-800 mt-2">
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* MAIN GRID */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* RECENT ORDERS */}
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-xl font-bold text-green-700 mb-4">
            Recent Orders
          </h2>

          {recentOrders.length === 0 ? (
            <p className="text-gray-500">No orders yet</p>
          ) : (
            recentOrders.slice(0, 3).map((order) => (
              <div
                key={order._id}
                className="flex justify-between items-center border-b py-3"
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    Order #{order._id?.slice(-4)}
                  </p>
                  <p className="text-sm text-gray-500">
                    ₹{order.totalAmount}
                  </p>
                </div>
                <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  {order.status || "Placed"}
                </span>
              </div>
            ))
          )}

          <Link
            to="/orders"
            className="block text-center mt-4 text-green-700 font-semibold"
          >
            View All Orders →
          </Link>
        </div>

        {/* AI REPORTS */}
        <div className="bg-white rounded-xl shadow p-5">
          <h2 className="text-xl font-bold text-green-700 mb-4">
            AI Disease Reports
          </h2>

          {aiReports.length === 0 ? (
            <p className="text-gray-500">No scans yet</p>
          ) : (
            aiReports.slice(0, 3).map((report) => (
              <div
                key={report._id}
                className="flex justify-between items-center border-b py-3"
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    {report.disease || "Disease Detected"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {report.plantName || "Plant"} •{" "}
                    {report.severity || "N/A"}
                  </p>
                </div>
                <Link
                  to="/ai-scan-history"
                  className="text-sm bg-green-600 text-white px-3 py-1 rounded-full"
                >
                  View
                </Link>
              </div>
            ))
          )}

          <Link
            to="/ai-detect"
            className="block text-center mt-4 text-green-700 font-semibold"
          >
            Scan New Plant →
          </Link>
        </div>

        {/* MY TIPS */}
        <div className="bg-white rounded-xl shadow p-5 md:col-span-2">
          <h2 className="text-xl font-bold text-green-700 mb-4">
            My Shared Tips
          </h2>

          {myTips.length === 0 ? (
            <p className="text-gray-500">You haven’t shared any tips yet</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {myTips.slice(0, 2).map((tip) => (
                <div
                  key={tip._id}
                  className="border rounded-lg p-4 hover:shadow"
                >
                  <h3 className="font-bold text-gray-800">
                    {tip.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {tip.content
                      ? tip.content.slice(0, 80)
                      : ""}
                    ...
                  </p>
                  <div className="text-sm text-green-600 mt-2 font-semibold">
                    👍 {tip.upvotes || 0} Likes
                  </div>
                </div>
              ))}
            </div>
          )}

          <Link
            to="/community-tips"
            className="block text-center mt-4 text-green-700 font-semibold"
          >
            Explore All Tips →
          </Link>
        </div>
      </div>
    </div>
  );
}
