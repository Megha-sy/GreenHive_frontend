import { useEffect, useState } from "react";
import { getSellerDashboard } from "../../api/api";

export default function SellerDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await getSellerDashboard();
      setStats(res.data);
    } catch (err) {
      console.error("Dashboard load failed", err);
    }
  };

  if (!stats) return <p className="p-6">Loading dashboard...</p>;

  const topPlants = stats.topSellingPlants || [];
  const offerPlants = stats.discountedPlants || [];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Seller Dashboard 📊
      </h1>

      {/* STATS */}
      <div className="grid md:grid-cols-4 gap-6 mb-10">
        <StatCard title="Total Products" value={stats.totalProducts || 0} />
        <StatCard title="Active Products" value={stats.totalActiveProducts || 0} />
        <StatCard title="Total Orders" value={stats.totalOrders || 0} />
        <StatCard title="Revenue" value={`₹${stats.totalRevenue || 0}`} />
      </div>

      {/* 🔥 ACTIVE OFFERS */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-4">
          Active Offers 🔥
        </h2>

        {offerPlants.length === 0 ? (
          <p className="text-gray-500">No active offers</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {offerPlants.map((plant) => (
              <div
                key={plant._id}
                className="bg-white rounded shadow p-4 border-l-4 border-red-500"
              >
                <img
                  src={plant.images?.[0]}
                  alt={plant.name}
                  className="h-48 w-full object-cover rounded"
                />

                <h3 className="font-semibold mt-3">
                  {plant.name}
                </h3>

                <p className="text-sm text-gray-500 line-through">
                  ₹{plant.price}
                </p>

                <p className="text-green-700 font-bold text-lg">
                  ₹
                  {Math.round(
                    plant.price -
                      (plant.price * plant.discountPercent) / 100
                  )}
                </p>

                <p className="text-red-600 text-sm font-semibold">
                  🔥 {plant.discountPercent}% OFF
                </p>

                {plant.offerEndsAt && (
                  <p className="text-xs text-red-600 mt-1">
                    ⏳ Ends on{" "}
                    {new Date(plant.offerEndsAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 🌿 TOP SELLING PLANTS */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Top Selling Plants 🌿
        </h2>

        {topPlants.length === 0 ? (
          <p className="text-gray-500">No sales yet</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {topPlants.map((plant) => (
              <div
                key={plant._id}
                className="bg-white rounded shadow p-4"
              >
                <img
                  src={plant.images?.[0]}
                  alt={plant.name}
                  className="h-60 w-full object-cover rounded"
                />
                <h3 className="font-semibold mt-3">
                  {plant.name}
                </h3>
                <p className="text-green-600">
                  ₹{plant.price}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white p-6 rounded shadow">
      <p className="text-gray-500">{title}</p>
      <h2 className="text-3xl font-bold mt-2">{value}</h2>
    </div>
  );
}
