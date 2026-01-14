import { useEffect, useState } from "react";
import API from "../../api/api";

export default function SellerManagement() {
  const [sellers, setSellers] = useState([]);
  const [filter, setFilter] = useState("all"); // ⭐ NEW

  useEffect(() => {
    loadSellers();
  }, []);

  const loadSellers = async () => {
    const res = await API.get("/admin/sellers");
    setSellers(res.data);
  };

  const updateStatus = async (id, status) => {
    await API.put(`/admin/sellers/${id}`, { status });
    loadSellers();
  };

  // ⭐ FILTER LOGIC
  const filteredSellers = sellers.filter((s) => {
    if (filter === "all") return true;
    return s.sellerStatus === filter;
  });

  return (
    <div>
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          Seller Management 🏪
        </h1>

        {/* FILTER */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded px-3 py-2"
        >
          <option value="all">All Sellers</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* ================= TABLE ================= */}
      <div className="overflow-x-auto bg-white shadow rounded">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Shop</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Approved Date</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredSellers.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="p-4 text-center text-gray-500"
                >
                  No sellers found.
                </td>
              </tr>
            )}

            {filteredSellers.map((s) => (
              <tr
                key={s._id}
                className="border-t hover:bg-gray-50"
              >
                <td className="p-3">{s.name}</td>
                <td className="p-3">{s.email}</td>

                <td className="p-3">
                  {s.shopName || "-"}
                </td>

                <td className="p-3 capitalize">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      s.sellerStatus === "approved"
                        ? "bg-green-100 text-green-700"
                        : s.sellerStatus === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {s.sellerStatus}
                  </span>
                </td>

                <td className="p-3">
                  {s.sellerApprovedAt
                    ? new Date(
                        s.sellerApprovedAt
                      ).toLocaleDateString()
                    : "-"}
                </td>

                <td className="p-3 space-x-2">
                  {s.sellerStatus === "pending" ? (
                    <>
                      <button
                        onClick={() =>
                          updateStatus(
                            s._id,
                            "approved"
                          )
                        }
                        className="bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() =>
                          updateStatus(
                            s._id,
                            "rejected"
                          )
                        }
                        className="bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Reject
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-400 text-sm">
                      —
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
