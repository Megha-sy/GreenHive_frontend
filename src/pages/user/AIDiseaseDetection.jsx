import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

export default function AIDiseaseDetection() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  // 📸 Image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
  };

  // 🤖 AI Scan
  const handleScan = async () => {
    if (!image) {
      alert("Please upload a plant image first!");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("image", image);

      const res = await axios.post(
        "http://localhost:5000/api/ai/detect",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setResult(res.data.report);
    } catch (error) {
      console.error("AI Scan Error:", error);
      alert("AI scan failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-800">
          AI Plant Disease Detection 🤖🌿
        </h1>

        <Link
          to="/ai-scan-history"
          className="text-green-700 font-semibold"
        >
          View Scan History →
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* LEFT: UPLOAD */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-green-700 mb-4">
            Upload Plant Image
          </h2>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="mb-4"
          />

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-full h-72 object-cover rounded-lg mb-4"
            />
          )}

          <button
            onClick={handleScan}
            disabled={loading}
            className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? "Scanning..." : "Scan Now"}
          </button>

          {loading && (
            <p className="text-center text-green-700 mt-4 font-semibold">
              Analyzing plant disease...
            </p>
          )}
        </div>

        {/* RIGHT: RESULT */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-bold text-green-700 mb-4">
            Scan Result
          </h2>

          {!result ? (
            <p className="text-gray-600 text-center mt-10">
              Upload an image and scan to see results 🌱
            </p>
          ) : (
            <div className="space-y-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Plant</p>
                <p className="font-bold text-green-800 text-lg">
                  {result.plantName || "Unknown"}
                </p>
              </div>

              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Disease Detected</p>
                <p className="font-bold text-red-700 text-lg">
                  {result.disease}
                </p>
              </div>

              <div className="bg-yellow-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Severity</p>
                <p className="font-bold text-yellow-700 text-lg">
                  {result.severity}
                </p>
              </div>

<div className="bg-blue-50 p-4 rounded-lg">
  <p className="text-sm text-gray-500 mb-2">
    Recommended Treatment
  </p>

  {/* Chemical */}
  {result.treatment?.chemical?.length > 0 && (
    <div className="mb-2">
      <p className="font-semibold text-blue-700">🧪 Chemical</p>
      <ul className="list-disc list-inside text-gray-700">
        {result.treatment.chemical.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  )}

  {/* Biological */}
  {result.treatment?.biological?.length > 0 && (
    <div className="mb-2">
      <p className="font-semibold text-green-700">🌿 Biological</p>
      <ul className="list-disc list-inside text-gray-700">
        {result.treatment.biological.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  )}

  {/* Prevention */}
  {result.treatment?.prevention?.length > 0 && (
    <div>
      <p className="font-semibold text-orange-700">⚠️ Prevention</p>
      <ul className="list-disc list-inside text-gray-700">
        {result.treatment.prevention.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    </div>
  )}

  {/* ✅ FALLBACK MESSAGE */}
  {(!result.treatment?.chemical?.length &&
    !result.treatment?.biological?.length &&
    !result.treatment?.prevention?.length) && (
    <p className="text-blue-700 font-semibold">
      Remove infected leaves, avoid overhead watering, and apply a suitable
      fungicide as recommended by an agricultural expert.
    </p>
  )}
</div>



             <p className="text-sm text-gray-500 text-right">
                Confidence:{" "}
                {result.confidence
                  ? `${(result.confidence * 100).toFixed(1)}%`
                  : "N/A"}
              </p>

            </div>
          )}
        </div>
      </div>
    </div>
  );
}
