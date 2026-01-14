import { useEffect, useState } from "react";
import { getProductAnalytics } from "../../api/api";

export default function ProductAnalytics() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔍 FILTER STATES
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [minSold, setMinSold] = useState("");

  // =========================
  // LOAD ANALYTICS
  // =========================
  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const res = await getProductAnalytics();
      setPlants(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load product analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  // =========================
  // FILTER LOGIC
  // =========================
  const filteredPlants = plants.filter((p) => {
    const matchesSearch = p.name
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all"
        ? true
        : statusFilter === "high"
        ? p.totalSold > 20
        : statusFilter === "moderate"
        ? p.totalSold > 0 && p.totalSold <= 20
        : p.totalSold === 0;

    const matchesPrice = minPrice
      ? p.price >= Number(minPrice)
      : true;

    const matchesSold = minSold
      ? p.totalSold >= Number(minSold)
      : true;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPrice &&
      matchesSold
    );
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER + FILTERS */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">
          Product Analytics 📊
        </h1>

        {/* FILTER BAR */}
        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="text"
            placeholder="Search product"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          >
            <option value="all">All Status</option>
            <option value="high">High Demand</option>
            <option value="moderate">Moderate</option>
            <option value="none">No Sales</option>
          </select>

          <input
            type="number"
            placeholder="Min Price ₹"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="border rounded px-3 py-2 text-sm w-28"
          />

          <input
            type="number"
            placeholder="Min Sold"
            value={minSold}
            onChange={(e) => setMinSold(e.target.value)}
            className="border rounded px-3 py-2 text-sm w-24"
          />

          <button
            onClick={() => {
              setSearch("");
              setStatusFilter("all");
              setMinPrice("");
              setMinSold("");
            }}
            className="bg-gray-200 px-3 py-2 rounded text-sm hover:bg-gray-300"
          >
            Clear
          </button>
        </div>
      </div>

      {/* TABLE HEADER */}
      <div className="hidden md:grid grid-cols-7 bg-green-600 text-white px-4 py-3 rounded-t font-semibold">
        <span>Product</span>
        <span>Price</span>
        <span>Stock</span>
        <span>Orders</span>
        <span>Units Sold</span>
        <span>Revenue</span>
        <span>Status</span>
      </div>

      {/* TABLE BODY */}
      <div className="bg-white rounded-b shadow divide-y">
        {filteredPlants.map((p) => (
          <div
            key={p.productId}
            className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center px-4 py-4"
          >
            {/* PRODUCT */}
            <div className="flex items-center gap-3">
              <img
                src={p.image || "https://via.placeholder.com/80"}
                alt={p.name}
                className="w-14 h-14 rounded object-cover"
              />
              <span className="font-semibold">
                {p.name}
              </span>
            </div>

            {/* PRICE */}
            <span>₹{p.price}</span>

            {/* STOCK */}
            <span
              className={`font-semibold ${
                p.stock === 0
                  ? "text-red-600"
                  : p.stock < 10
                  ? "text-yellow-600"
                  : "text-green-700"
              }`}
            >
              {p.stock}
            </span>

            {/* ORDERS */}
            <span>{p.orderCount}</span>

            {/* SOLD */}
            <span>{p.totalSold}</span>

            {/* REVENUE */}
            <span className="font-semibold text-green-700">
              ₹{p.totalRevenue}
            </span>

            {/* STATUS */}
            <span>
              {p.totalSold > 20 ? (
                <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                  High Demand 🔥
                </span>
              ) : p.totalSold > 0 ? (
                <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                  Moderate 📈
                </span>
              ) : (
                <span className="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-full">
                  No Sales
                </span>
              )}
            </span>
          </div>
        ))}

        {!loading && filteredPlants.length === 0 && (
          <p className="text-gray-500 p-6">
            No matching products found.
          </p>
        )}
      </div>
    </div>
  );
}
