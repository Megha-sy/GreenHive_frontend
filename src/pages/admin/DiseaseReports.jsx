import { useEffect, useState } from "react";
import {
  getAdminDiseaseReports,
  deleteAdminDiseaseReport,
} from "../../api/api";

export default function DiseaseReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const res = await getAdminDiseaseReports();
      setReports(res.data);
    } catch {
      alert("Failed to load disease reports");
    } finally {
      setLoading(false);
    }
  };

  const removeReport = async (id) => {
    if (!window.confirm("Delete this report?")) return;
    await deleteAdminDiseaseReport(id);
    loadReports();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Disease Reports Review 🧪
      </h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white shadow rounded overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">Plant</th>
                <th className="p-3 text-left">Disease</th>
                <th className="p-3 text-left">Severity</th>
                <th className="p-3 text-left">Confidence</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {reports.map((r) => (
                <tr key={r._id} className="border-t">
                  <td className="p-3">
                    <div className="font-medium">{r.user?.name}</div>
                    <div className="text-xs text-gray-500">
                      {r.user?.email}
                    </div>
                  </td>

                  <td className="p-3">{r.plantName}</td>
                  <td className="p-3">{r.disease}</td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        r.severity === "Severe"
                          ? "bg-red-100 text-red-700"
                          : r.severity === "Moderate"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {r.severity}
                    </span>
                  </td>

                  <td className="p-3">
                    {Math.round((r.confidence || 0) * 100)}%
                  </td>

                  <td className="p-3">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-3">
                    <button
                      onClick={() => removeReport(r._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {!reports.length && (
                <tr>
                  <td
                    colSpan="7"
                    className="p-4 text-center text-gray-500"
                  >
                    No disease reports found
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
