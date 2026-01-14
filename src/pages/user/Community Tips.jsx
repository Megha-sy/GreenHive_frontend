import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/api";

export default function CommunityTips() {
  const [tips, setTips] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const loadTips = async () => {
    const res = await API.get("/tips");
    setTips(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadTips();
  }, []);

  const handleUpvote = async (id) => {
    try {
      await API.post(`/tips/${id}/upvote`);
      loadTips();
    } catch (err) {
      alert(err.response?.data?.message || "Vote failed");
    }
  };

  const filteredTips = tips.filter((tip) =>
    tip.plantName?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <div className="min-h-screen bg-green-50 p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-800">
          Community Plant Tips 🌿
        </h1>

        <Link
          to="/add-tip"
          className="bg-green-600 text-white px-4 py-2 rounded-lg"
        >
          + Share a Tip
        </Link>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search by plant name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full max-w-md mb-6 px-4 py-2 border rounded-lg"
      />

      {/* TIPS */}
      <div className="space-y-6 max-w-4xl mx-auto">
        {filteredTips.length === 0 ? (
          <div className="bg-white p-6 text-center">
            No tips found
          </div>
        ) : (
          filteredTips.map((tip) => (
            <div key={tip._id} className="bg-white rounded-xl shadow p-5">
              <div className="flex justify-between mb-2">
                <h2 className="text-xl font-bold text-green-800">
                  {tip.title}
                </h2>
                <span className="text-sm text-gray-500">
                  {new Date(tip.createdAt).toLocaleDateString()}
                </span>
              </div>

              {tip.plantName && (
                <p className="text-sm text-green-700 mb-1">
                  🌱 {tip.plantName}
                </p>
              )}

              <p className="text-gray-700 mb-3">
                {tip.content}
              </p>

              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Shared by <b>{tip.user?.name}</b>
                </span>

                <button
                  onClick={() => handleUpvote(tip._id)}
                  className="text-green-700 font-semibold"
                >
                  👍 {tip.upvotes}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
