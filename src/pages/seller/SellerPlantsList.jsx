import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getSellerPlants,
  deletePlant,
  getCategories,
} from "../../api/api";

export default function SellerPlantsList() {
  const [plants, setPlants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 🔍 FILTER STATES
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [maxStock, setMaxStock] = useState("");

  /* =========================
     LOAD DATA
  ========================= */
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

  const loadCategories = async () => {
    const res = await getCategories();
    setCategories(res.data);
  };

  useEffect(() => {
    loadPlants();
    loadCategories();
  }, []);

  /* =========================
     DELETE
  ========================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this plant?")) return;
    await deletePlant(id);
    loadPlants();
  };

  /* =========================
     FILTER LOGIC
  ========================= */
  const filteredPlants = plants.filter((p) => {
    const matchName = p.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchCategory =
      category === "All" ||
      p.category?._id === category;

    const matchMinPrice =
      minPrice === "" || p.price >= Number(minPrice);

    const matchMaxPrice =
      maxPrice === "" || p.price <= Number(maxPrice);

    const matchStock =
      maxStock === "" || p.stock <= Number(maxStock);

    return (
      matchName &&
      matchCategory &&
      matchMinPrice &&
      matchMaxPrice &&
      matchStock
    );
  });

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">
          My Plants
        </h1>
        <button
          onClick={() => navigate("/seller/plants/add")}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Add Plant
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded shadow mb-6 grid md:grid-cols-5 gap-3">

        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="All">All Categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border p-2 rounded"
        />

        <input
          type="number"
          placeholder="Max Stock"
          value={maxStock}
          onChange={(e) => setMaxStock(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      {/* PLANT GRID */}
      <div className="grid md:grid-cols-3 gap-6">
        {filteredPlants.map((p) => (
          <div
            key={p._id}
            className="bg-white p-4 rounded shadow"
          >
            <img
              src={p.images?.[0]}
              alt={p.name}
              className="h-64 w-full object-cover rounded"
            />

            <h3 className="font-bold mt-2">
              {p.name}
            </h3>
            <p>₹{p.price}</p>
            <p className="text-sm text-gray-500">
              Stock: {p.stock}
            </p>
            <p className="text-xs text-gray-400">
              Category: {p.category?.name}
            </p>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() =>
                  navigate(`/seller/plants/edit/${p._id}`)
                }
                className="flex-1 border border-green-600 text-green-700 py-1 rounded"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(p._id)}
                className="flex-1 bg-red-500 text-white py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {!loading && filteredPlants.length === 0 && (
          <p className="text-gray-500">
            No plants match your filters.
          </p>
        )}
      </div>
    </div>
  );
}
