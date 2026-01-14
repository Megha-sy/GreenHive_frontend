import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/api";
import { FaHeart, FaRegHeart } from "react-icons/fa";

export default function BrowsePlants() {
  const [plants, setPlants] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [addedItems, setAddedItems] = useState({});
  const [wishlist, setWishlist] = useState({});
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const res = await API.get("/products");
        setPlants(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
    loadWishlist();
  }, []);

  const loadWishlist = async () => {
    try {
      const res = await API.get("/wishlist");
      const map = {};
      res.data.items.forEach((i) => {
        if (i.product) {
          map[i.product._id] = true;
        }
      });
      setWishlist(map);
    } catch {}
  };

  // ✅ FIXED: Optimistic UI so icon switches instantly
  const toggleWishlist = async (id) => {
    setWishlist((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));

    try {
      if (wishlist[id]) {
        await API.delete(`/wishlist/${id}`);
      } else {
        await API.post("/wishlist/add", { productId: id });
      }
    } catch {
      alert("Login required ❤️");

      // rollback if API fails
      setWishlist((prev) => ({
        ...prev,
        [id]: !prev[id],
      }));
    }
  };

  const handleAdd = async (id) => {
    try {
      await API.post("/cart/add", { productId: id, qty: 1 });
      setAddedItems((prev) => ({ ...prev, [id]: true }));
    } catch {
      alert("Login required 🛒");
    }
  };

  const filteredPlants = plants.filter((p) => {
    const s = p.name.toLowerCase().includes(search.toLowerCase());
    const c = category === "All" || p.category === category;
    return s && c;
  });

  return (
    <div className="min-h-screen bg-[#f5f6f3] px-10 py-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl text-[#0b3d2e] font-semibold">
          Search Product
        </h1>

        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Search plants"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-5 py-3 rounded-full w-64 shadow text-black"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-5 py-3 rounded-full shadow text-black"
          >
            <option>All</option>
            <option>Indoor</option>
            <option>Outdoor</option>
            <option>Medicinal</option>
          </select>
        </div>
      </div>

      {loading && <p>Loading...</p>}

      {/* PRODUCT GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
        {filteredPlants.map((plant) => (
          <div key={plant._id} className="relative">

            {/* SALE TAG */}
            {plant.discountPercent > 0 && (
              <span className="absolute top-3 left-3 z-10 bg-red-600 text-white text-xs px-3 py-1">
                -{plant.discountPercent}%
              </span>
            )}

            {/* ❤️ WISHLIST ICON */}
            <button
              onClick={() => toggleWishlist(plant._id)}
              className={`absolute top-3 right-3 z-10 p-2 rounded-full transition 
                ${
                  wishlist[plant._id]
                    ? "bg-red-100 scale-110"
                    : "bg-white hover:bg-red-50"
                }`}
            >
              {wishlist[plant._id] ? (
                <FaHeart className="text-red-600 text-xl" />
              ) : (
                <FaRegHeart className="text-gray-500 hover:text-red-500 text-xl" />
              )}
            </button>

            {/* IMAGE */}
            <div className="h-[320px] flex items-center justify-center">
              <img
                src={plant.images?.[0]}
                alt={plant.name}
                onClick={() => setPreviewImage(plant.images?.[0])}
                className="h-full w-full object-cover rounded cursor-zoom-in hover:scale-105 transition"
              />
            </div>

            {/* INFO */}
            <div className="mt-4 relative">

              {/* OFFER END DATE */}
              {plant.discountPercent > 0 && plant.offerEndsAt && (
                <span className="absolute top-0 right-0 text-[11px] text-gray-500">
                  Ends on {new Date(plant.offerEndsAt).toLocaleDateString()}
                </span>
              )}

              <h3 className="text-base font-medium text-gray-900 leading-tight pr-20">
                {plant.name}
              </h3>

              {/* PRICE */}
              <div className="mt-1">
                {plant.originalPrice && (
                  <span className="text-gray-400 line-through mr-2">
                    Rs. {plant.originalPrice}
                  </span>
                )}
                <span className="text-red-600 font-semibold text-lg">
                  Rs. {plant.price}
                </span>
              </div>

              {/* RATING */}
              <div className="flex items-center gap-1 mt-1">
                <div className="text-yellow-400 text-sm">
                  {"★".repeat(Math.round(plant.rating || 0))}
                  {"☆".repeat(5 - Math.round(plant.rating || 0))}
                </div>
                <span className="text-xs text-gray-500">
                  ({plant.reviewCount || 0})
                </span>
              </div>

              {/* ADD TO CART */}
              <button
                onClick={() => handleAdd(plant._id)}
                disabled={addedItems[plant._id]}
                className={`mt-4 w-full py-3 text-sm font-semibold tracking-wide ${
                  addedItems[plant._id]
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-[#0b3d2e] text-white hover:bg-[#072b20]"
                }`}
              >
                {addedItems[plant._id] ? "ADDED ✔" : "ADD TO CART"}
              </button>

              <Link
                to={`/product/${plant._id}`}
                className="block mt-2 text-center text-sm text-[#0b3d2e] font-medium hover:underline"
              >
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>

      {!loading && filteredPlants.length === 0 && (
        <p className="mt-10 text-gray-600">No products found</p>
      )}

      {/* IMAGE PREVIEW */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative bg-white p-4 rounded-xl max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-3 right-3 text-2xl text-gray-700 hover:text-black"
            >
              ✕
            </button>

            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}
