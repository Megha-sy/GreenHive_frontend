import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/api";

export default function AIScanHistory() {
  const [scanHistory, setScanHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedScan, setSelectedScan] = useState(null);

  // 🔄 Load scan history
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await API.get("/ai/history");
      setScanHistory(res.data.history);
    } catch (err) {
      console.error("Failed to load scan history", err);
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ Delete scan
  const deleteScan = async (id) => {
    if (!window.confirm("Delete this scan?")) return;

    await API.delete(`/ai/history/${id}`);
    loadHistory();
  };
  // 🧹 Clear all scans
const clearAllScans = async () => {
  if (!window.confirm("Clear all AI scan history?")) return;

  await API.delete("/ai/history");
  setScanHistory([]);
};


  const severityColor = (level) => {
    if (level === "Mild") return "bg-green-100 text-green-700";
    if (level === "Moderate") return "bg-yellow-100 text-yellow-700";
    if (level === "Severe") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  if (loading) {
    return (
      <p className="text-center mt-20 text-green-700 font-semibold">
        Loading scan history...
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 p-6">
      {/* HEADER */}
   <div className="flex justify-between items-center mb-6">
  <h1 className="text-3xl font-bold text-green-800">
    AI Scan History 📸📊
  </h1>

  <div className="flex gap-3">
    {scanHistory.length > 0 && (
      <button
        onClick={clearAllScans}
        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
      >
        Clear All
      </button>
    )}

    <Link
      to="/ai-detect"
      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
    >
      New Scan
    </Link>
  </div>
</div>


{/* TABLE */}
{scanHistory.length === 0 ? (
  <div className="bg-white p-8 text-center text-gray-600 border">
    No AI scans found
  </div>
) : (
  <div className="bg-white border overflow-x-auto">
    <table className="w-full text-sm border-collapse">

      {/* HEADER */}
      <thead>
        <tr className="bg-[#27391C] text-white">
          <th className="py-4 px-5 text-left font-medium">Plant</th>
          <th className="py-4 px-5 text-left font-medium">Disease</th>
          <th className="py-4 px-5 text-left font-medium">Severity</th>
          <th className="py-4 px-5 text-left font-medium">Confidence</th>
          <th className="py-4 px-5 text-left font-medium">Date</th>
          <th className="py-4 px-5 text-center font-medium">Action</th>
        </tr>
      </thead>

      {/* BODY */}
      <tbody>
        {scanHistory.map((scan) => (
          <tr
            key={scan._id}
            className="border-b last:border-none hover:bg-gray-50"
          >
            <td className="py-4 px-5 font-medium text-[#1B211A]">
              {scan.plantName}
            </td>

            <td className="py-4 px-5 text-gray-700">
              {scan.disease}
            </td>

            <td className="py-4 px-5">
              <span
                className={`px-2 py-1 text-xs rounded ${severityColor(
                  scan.severity
                )}`}
              >
                {scan.severity}
              </span>
            </td>

            <td className="py-4 px-5 text-gray-700">
              {scan.confidence
                ? `${(scan.confidence * 100).toFixed(1)}%`
                : "N/A"}
            </td>

            <td className="py-4 px-5 text-gray-600">
              {new Date(scan.createdAt).toLocaleDateString()}
            </td>

            <td className="py-4 px-5 text-center">
              <button
                onClick={() => setSelectedScan(scan)}
                className="text-[#628141] font-medium hover:underline mr-4"
              >
                View
              </button>
              <button
                onClick={() => deleteScan(scan._id)}
                className="text-red-600 font-medium hover:underline"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}


      {/* VIEW MODAL */}
      {selectedScan && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-xl p-6">
            <h2 className="text-xl font-bold text-green-700 mb-4">
              Scan Details
            </h2>

            <p><b>Plant:</b> {selectedScan.plantName}</p>
            <p><b>Disease:</b> {selectedScan.disease}</p>
            <p><b>Severity:</b> {selectedScan.severity}</p>

 <div className="mt-3">
  <p className="font-semibold mb-1">Treatment:</p>

  {/* Chemical */}
  {selectedScan.treatment?.chemical?.length > 0 && (
    <>
      <p className="text-blue-700">🧪 Chemical</p>
      <ul className="list-disc list-inside text-gray-700">
        {selectedScan.treatment.chemical.map((c, i) => (
          <li key={i}>{c}</li>
        ))}
      </ul>
    </>
  )}

  {/* Biological */}
  {selectedScan.treatment?.biological?.length > 0 && (
    <>
      <p className="text-green-700 mt-2">🌿 Biological</p>
      <ul className="list-disc list-inside text-gray-700">
        {selectedScan.treatment.biological.map((b, i) => (
          <li key={i}>{b}</li>
        ))}
      </ul>
    </>
  )}

  {/* Prevention */}
  {selectedScan.treatment?.prevention?.length > 0 && (
    <>
      <p className="text-orange-700 mt-2">⚠️ Prevention</p>
      <ul className="list-disc list-inside text-gray-700">
        {selectedScan.treatment.prevention.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
    </>
  )}

  {/* ✅ FALLBACK (THIS IS IMPORTANT) */}
  {(!selectedScan.treatment?.chemical?.length &&
    !selectedScan.treatment?.biological?.length &&
    !selectedScan.treatment?.prevention?.length) && (
    <p className="text-gray-700 italic">
      Remove infected leaves, avoid overhead watering, improve air circulation,
      and apply a suitable fungicide if symptoms persist.
    </p>
  )}
</div>


            <button
              onClick={() => setSelectedScan(null)}
              className="mt-5 w-full bg-green-600 text-white py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
