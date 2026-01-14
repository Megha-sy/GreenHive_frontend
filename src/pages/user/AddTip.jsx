import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/api";

export default function AddTip() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    plantName: "",
    content: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/tips", formData);
      navigate("/community-tips");
    } catch (err) {
      alert("Failed to post tip");
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-green-50 flex justify-center items-start py-10 px-4">
      <div className="bg-white w-full max-w-2xl rounded-xl shadow-md border border-green-100 p-8">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-green-800">
            Share a Plant Tip 🌿
          </h1>
          <Link
            to="/community-tips"
            className="text-green-700 font-semibold hover:underline"
          >
            ← Back
          </Link>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* PLANT NAME */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Plant Name <span className="text-gray-400">(optional)</span>
            </label>
            <input
              type="text"
              name="plantName"
              placeholder="Eg: Money Plant, Rose"
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* TITLE */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Tip Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="Eg: Best way to grow Money Plant indoors"
              required
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* CONTENT */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Tip Description
            </label>
            <textarea
              name="content"
              placeholder="Share your plant care experience or advice..."
              rows="6"
              required
              onChange={handleChange}
              className="w-full border rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold transition"
          >
            Post Tip 🌱
          </button>
        </form>

        {/* FOOTER NOTE */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Your tip will help other plant lovers grow better 🌼
        </p>
      </div>
    </div>
  );
}
