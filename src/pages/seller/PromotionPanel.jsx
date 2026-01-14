import { useEffect, useState } from "react";
import {
  getSellerPlants,
  updatePlant,
  applyPromotion,
} from "../../api/api";

export default function PromotionPanel() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState(null);
  const [discounts, setDiscounts] = useState({});
  const [offerDates, setOfferDates] = useState({});
  const [filter, setFilter] = useState("all");

  // =========================
  // LOAD PLANTS
  // =========================
  const loadPlants = async () => {
    try {
      setLoading(true);
      const res = await getSellerPlants();
      setPlants(res.data);
    } catch {
      alert("Failed to load plants");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlants();
  }, []);

  // =========================
  // HELPERS
  // =========================
  const updatePromotion = async (id, data) => {
    await applyPromotion(id, data);
    loadPlants();
  };

  const toggleActive = async (id, isActive) => {
    await updatePlant(id, { isActive });
    loadPlants();
  };

  const filteredPlants = plants.filter((p) => {
    if (filter === "all") return true;
    if (filter === "active") return p.isActive;
    if (filter === "hidden") return !p.isActive;
    if (filter === "featured") return p.isFeatured;
    if (filter === "discounted") return p.discountPercent > 0;
    return true;
  });

  if (loading) {
    return (
      <p className="p-6 text-center text-gray-500">
        Loading products...
      </p>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">
        Promotions 🎯
      </h1>

      {/* FILTER */}
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="mb-6 border px-3 py-2 rounded"
      >
        <option value="all">All Products</option>
        <option value="active">Active</option>
        <option value="hidden">Hidden</option>
        <option value="featured">Featured</option>
        <option value="discounted">Discounted</option>
      </select>

      <div className="grid md:grid-cols-3 gap-6">
        {filteredPlants.map((p) => (
          <div
            key={p._id}
            className="bg-white rounded shadow overflow-hidden"
          >
            {/* IMAGE */}
            <img
              src={p.images?.[0]}
              alt={p.name}
              className="h-60 w-full object-cover"
            />

            <div className="p-4">
              {/* TITLE */}
              <div className="flex justify-between items-center">
                <h3 className="font-bold">{p.name}</h3>
                {p.isFeatured && (
                  <span className="text-xs bg-yellow-200 px-2 py-1 rounded">
                    ⭐ Featured
                  </span>
                )}
              </div>

         {/* PRICE */}
<p className="text-green-700 font-semibold mt-1">
  ₹{p.price}
  {p.discountPercent > 0 && (
    <span className="text-red-500 text-sm ml-2">
      {p.discountPercent}% OFF
    </span>
  )}
</p>

{p.discountPercent > 0 && p.offerEndsAt && (
  <p className="mt-1 text-xs text-gray-500">
    Offer valid till{" "}
    <span className="font-medium">
      {new Date(p.offerEndsAt).toLocaleDateString()}
    </span>
  </p>
)}




              {/* QUICK ACTIONS */}
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() =>
                    setExpanded(
                      expanded === p._id ? null : p._id
                    )
                  }
                  className="flex-1 border py-2 rounded text-sm"
                >
                  Promotion Settings
                </button>

                <button
                  onClick={() =>
                    toggleActive(p._id, !p.isActive)
                  }
                  className={`flex-1 py-2 rounded text-sm text-white ${
                    p.isActive
                      ? "bg-gray-600"
                      : "bg-green-600"
                  }`}
                >
                  {p.isActive ? "Hide" : "Activate"}
                </button>
              </div>

              {/* COLLAPSIBLE PROMOTION */}
              {expanded === p._id && (
                <div className="mt-4 border-t pt-4 space-y-3">
                  {/* DISCOUNT */}
                  <div>
                    <label className="text-sm">
                      Discount %
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="90"
                      value={
                        discounts[p._id] ??
                        p.discountPercent ??
                        0
                      }
                      onChange={(e) =>
                        setDiscounts({
                          ...discounts,
                          [p._id]: e.target.value,
                        })
                      }
                      onBlur={() =>
                        updatePromotion(p._id, {
                          discountPercent: Number(
                            discounts[p._id]
                          ),
                        })
                      }
                      className="border p-2 rounded w-full"
                    />
                  </div>

                  {/* OFFER DATE */}
                  <div>
                    <label className="text-sm">
                      Offer Ends On
                    </label>
                    <input
                      type="date"
                      value={
                        offerDates[p._id] ??
                        (p.offerEndsAt
                          ? p.offerEndsAt.split("T")[0]
                          : "")
                      }
                      onChange={(e) =>
                        setOfferDates({
                          ...offerDates,
                          [p._id]: e.target.value,
                        })
                      }
                      onBlur={() =>
                        updatePromotion(p._id, {
                          offerEndsAt:
                            offerDates[p._id] || null,
                        })
                      }
                      className="border p-2 rounded w-full"
                    />
                  </div>

                  {/* FEATURE */}
                  <button
                    onClick={() =>
                      updatePromotion(p._id, {
                        isFeatured: !p.isFeatured,
                      })
                    }
                    className="w-full bg-yellow-500 text-white py-2 rounded"
                  >
                    {p.isFeatured
                      ? "Remove Featured"
                      : "Mark as Featured"}
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
