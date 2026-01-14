import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../api/api";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    shopName: "", // ⭐ NEW
    address: {
      line1: "",
      line2: "",
      city: "",
      district: "",
      state: "",
      pincode: "",
    },
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setForm({
        ...form,
        address: { ...form.address, [field]: value },
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // ⭐ OPTIONAL VALIDATION (SAFE)
    if (form.role === "seller" && !form.shopName.trim()) {
      setError("Shop name is required for seller registration");
      setLoading(false);
      return;
    }

    try {
      await API.post("/auth/register", form);
      alert(
        form.role === "seller"
          ? "Seller application submitted. Await admin approval."
          : "Registration successful. Please login."
      );
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <div
        className="w-full max-w-3xl rounded-xl shadow-lg relative overflow-hidden"
        style={{
          backgroundImage: "url('/reg1.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-white/70"></div>

        <div className="relative z-10 p-6">
          <h2 className="text-2xl font-bold text-black-800 text-center">
            Registration
          </h2>
          <p className="text-gray-500 mb-4 text-center">
            Create your account
          </p>

          {error && (
            <p className="bg-red-100 text-red-700 p-2 rounded mb-3 text-center">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">

            {/* ROLE */}
            <div>
              <label className="text-sm font-semibold text-black-600">
                Register As
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="mt-1 w-full border rounded-lg px-3 py-2"
              >
                <option value="user">User</option>
                <option value="seller">Seller</option>
              </select>
            </div>

            {/* NAME */}
            <div>
              <label className="text-sm font-semibold text-black-600">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="mt-1 w-full border rounded-lg px-3 py-2"
                required
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm font-semibold text-black-600">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="mt-1 w-full border rounded-lg px-3 py-2"
                required
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-semibold text-black-600">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="mt-1 w-full border rounded-lg px-3 py-2"
                required
              />
            </div>

            {/* ⭐ SHOP NAME — ONLY FOR SELLER */}
            {form.role === "seller" && (
              <div className="col-span-2 bg-green-50 p-4 rounded-lg border">
                <label className="text-sm font-semibold text-black-600">
                  Shop Name
                </label>
                <input
                  type="text"
                  name="shopName"
                  value={form.shopName}
                  onChange={handleChange}
                  placeholder="Enter your shop name"
                  className="mt-1 w-full border rounded-lg px-3 py-2"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  This will be visible after admin approval
                </p>
              </div>
            )}

            {/* ADDRESS LINE */}
            <div className="col-span-2">
              <input
                type="text"
                placeholder="Address line 1"
                name="address.line1"
                value={form.address.line1}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            {/* CITY / DISTRICT */}
            <div>
              <input
                type="text"
                placeholder="City"
                name="address.city"
                value={form.address.city}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="District"
                name="address.district"
                value={form.address.district}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            {/* STATE */}
            <div>
              <input
                type="text"
                placeholder="State"
                name="address.state"
                value={form.address.state}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            {/* PINCODE */}
            <div className="col-span-2">
              <input
                type="text"
                placeholder="Pincode"
                name="address.pincode"
                value={form.address.pincode}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>
             <div className="col-span-2">
              <input
                type="text"
                placeholder="Phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
              />
            </div>

            {/* BUTTON */}
            <div className="col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
              >
                {loading ? "Registering..." : "Create Account"}
              </button>
            </div>
          </form>

          <p className="text-center mt-4 text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-semibold">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
