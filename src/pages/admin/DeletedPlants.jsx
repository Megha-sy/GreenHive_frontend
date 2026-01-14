import { useEffect, useState } from "react";
import { getDeletedPlants } from "../../api/api";

export default function DeletedPlants() {
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlants();
  }, []);

  const loadPlants = async () => {
    try {
      setLoading(true);
      const res = await getDeletedPlants();
      setPlants(res.data);
    } catch {
      alert("Failed to load deleted plants");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Deleted Plants 🗑️
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white shadow rounded overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Plant</th>
                <th className="p-3 text-left">Seller</th>
                <th className="p-3 text-left">Delete Reason</th>
                <th className="p-3 text-left">Deleted At</th>
                <th className="p-3 text-left">Deleted By</th>
              </tr>
            </thead>

            <tbody>
              {plants.map((p) => (
                <tr
                  key={p._id}
                  className="border-t hover:bg-gray-50"
                >
                  {/* PLANT */}
                  <td className="p-3 font-medium">
                    {p.name}
                  </td>

                  {/* SELLER */}
                  <td className="p-3">
                    <div className="font-medium">
                      {p.seller?.name || "-"}
                    </div>
                    {p.seller?.shopName && (
                      <div className="text-xs text-gray-500">
                        Shop: {p.seller.shopName}
                      </div>
                    )}
                  </td>

                  {/* REASON */}
                  <td className="p-3 text-gray-700">
                    {p.deleteReason || "—"}
                  </td>

                  {/* DATE */}
                  <td className="p-3">
                    {p.deletedAt
                      ? new Date(
                          p.deletedAt
                        ).toLocaleString()
                      : "-"}
                  </td>

                  {/* ADMIN */}
                  <td className="p-3">
                    {p.deletedBy?.name || "-"}
                  </td>
                </tr>
              ))}

              {!plants.length && (
                <tr>
                  <td
                    colSpan="5"
                    className="p-4 text-center text-gray-500"
                  >
                    No deleted plants found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
