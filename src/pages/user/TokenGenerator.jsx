import { useState } from "react";
import API from "../../api/api";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function TokenGenerator() {
  const [refreshToken, setRefreshToken] = useState("");
  const [newAccessToken, setNewAccessToken] = useState("");

  const generateNewToken = async () => {
    try {
      const res = await API.post("/auth/refresh-token", {
        refreshToken,
      });

      setNewAccessToken(res.data.accessToken);
      localStorage.setItem("token", res.data.accessToken);

      alert("✅ New Access Token Generated!");
    } catch (err) {
      alert("❌ Invalid refresh token");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <div className="flex-1 flex items-center justify-center bg-green-50">
        <div className="bg-white p-8 shadow rounded w-full max-w-md">

          <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
            Generate New Access Token
          </h2>

          <textarea
            placeholder="Paste Refresh Token Here"
            rows="4"
            className="w-full border p-2 rounded mb-4"
            value={refreshToken}
            onChange={(e) => setRefreshToken(e.target.value)}
          ></textarea>

          <button
            onClick={generateNewToken}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Generate Access Token
          </button>

          {newAccessToken && (
            <div className="mt-4">
              <p className="text-sm font-semibold text-gray-700 mb-1">
                New Access Token:
              </p>
              <textarea
                rows="4"
                value={newAccessToken}
                readOnly
                className="w-full border p-2 rounded"
              ></textarea>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
