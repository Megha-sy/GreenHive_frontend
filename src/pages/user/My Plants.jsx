import { useEffect, useState } from "react";
import { getMyPlants, ratePlant } from "../../api/api";
import { Link } from "react-router-dom";

export default function MyPlants() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadPlants = async () => {
    const res = await getMyPlants();
    setPlants(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadPlants();
  }, []);

  const submitRating = async (productId, rating) => {
    await ratePlant({ productId, rating });
    loadPlants();
  };

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <h1 className="text-3xl font-bold text-green-800 mb-6">
        My Plants 🪴
      </h1>

      {plants.length === 0 ? (
        <div className="bg-white p-6 rounded shadow text-center">
          <p>No delivered plants yet 🌱</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {plants.map((p, i) => (
            <div key={i} className="bg-white rounded shadow">
              <img
                src={p.product.images?.[0] || "https://via.placeholder.com/300"}
                className="h-48 w-full object-cover rounded-t"
              />

              <div className="p-4">
                <h3 className="font-bold">{p.product.name}</h3>

                <p className="text-sm text-gray-600">
                  Delivered on{" "}
                  {new Date(p.purchaseDate).toLocaleDateString()}
                </p>

                {/* ⭐ Rating */}
                <div className="mt-3">
                  <p className="text-sm font-medium">Rate this plant</p>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      onClick={() =>
                        submitRating(p.product._id, star)
                      }
                      className={`text-xl ${
                        p.rating >= star
                          ? "text-yellow-500"
                          : "text-gray-300"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>

                <Link
                  to={`/ai/generate-care/${encodeURIComponent(p.product.name)}`}
                  className="block mt-4 bg-green-600 text-white text-center py-1 rounded"
                >
                  View Care Guide
                </Link>

                <Link
                  to={`/ai-detect?plant=${p.product.name}`}
                  className="block mt-2 border text-green-700 text-center py-1 rounded"
                >
                  AI Disease Scan
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
