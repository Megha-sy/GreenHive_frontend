import { useState } from "react";
import API from "../../api/api";

export default function AIPlantCare() {
  const [plantName, setPlantName] = useState("");
  const [loading, setLoading] = useState(false);
  const [care, setCare] = useState(null);
  const [error, setError] = useState("");

  const generateCare = async () => {
    if (!plantName.trim()) {
      return alert("Please enter a plant name");
    }

    try {
      setLoading(true);
      setError("");
      setCare(null);

      // const res = await API.post("/ai/generate-care", { plantName });
const res = await API.get(
  `/ai/generate-care/${encodeURIComponent(plantName)}`
);
      setCare(res.data);

    } catch (err) {
      console.error(err);
      setError("Failed to generate plant care");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 p-6 flex justify-center">
      <div className="bg-white rounded-xl shadow p-8 w-full max-w-3xl">

        <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">
          🌱 AI Plant Care Guide
        </h1>

        {/* INPUT */}
        <div className="flex gap-3 mb-6">
          <input
            type="text"
            placeholder="Enter plant name (e.g. Money Plant)"
            value={plantName}
            onChange={(e) => setPlantName(e.target.value)}
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-green-500"
          />

          <button
            onClick={generateCare}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Generate
          </button>
        </div>

        {/* LOADING */}
        {loading && (
          <p className="text-center text-green-700 font-semibold">
            Generating plant care...
          </p>
        )}

        {/* ERROR */}
        {error && (
          <p className="text-center text-red-600 font-semibold">
            {error}
          </p>
        )}

        {/* RESULT */}
        {care && care.careGuide && (
          <div className="space-y-4 mt-6">
            <CareCard title="☀️ Sunlight" value={care.careGuide.sunlight} />
            <CareCard title="💧 Watering" value={care.careGuide.watering} />
            <CareCard title="🌱 Soil" value={care.careGuide.soil} />
            <CareCard title="🌡 Temperature" value={care.careGuide.temperature} />
            <CareCard title="🛠 Maintenance" value={care.careGuide.maintenance} />

            <p className="text-xs text-gray-500 text-right">
              Source: {care.source}
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

function CareCard({ title, value }) {
  return (
    <div className="bg-green-100 rounded-lg p-4">
      <h3 className="font-bold text-green-800 mb-1">{title}</h3>
      <p className="text-green-900">{value}</p>
    </div>
  );
}
