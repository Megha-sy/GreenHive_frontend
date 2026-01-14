import React, { useEffect, useState } from "react";
import {
  getSellerProfile,
  updateSellerProfile,
} from "../../api/api";

export default function SellerProfile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    shopName: "",
    address: {
      line1: "",
      city: "",
      district: "",
      state: "",
      pincode: "",
    },
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* =========================
     LOAD SELLER PROFILE
  ========================= */
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await getSellerProfile();

      setProfile({
        name: res.data.name || "",
        email: res.data.email || "",
        shopName: res.data.shopName || "",
        address: {
          line1: res.data.address?.line1 || "",
          city: res.data.address?.city || "",
          district: res.data.address?.district || "",
          state: res.data.address?.state || "",
          pincode: res.data.address?.pincode || "",
        },
      });
    } catch (err) {
      console.error("Failed to load seller profile", err);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     HANDLE INPUT CHANGE
  ========================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      address: {
        ...prev.address,
        [name]: value,
      },
    }));
  };

  /* =========================
     SAVE PROFILE
  ========================= */
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);

      await updateSellerProfile({
        name: profile.name,
        email: profile.email,
        shopName: profile.shopName,
        address: profile.address,
      });

      alert("Seller profile updated successfully ✅");
    } catch (err) {
      console.error("Failed to update seller profile", err);
      alert("Failed to update seller profile ❌");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <p className="text-center p-6 text-gray-600">
        Loading seller profile...
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 p-6">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-green-800">
          Seller Profile 🧑‍💼🌿
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your seller account information
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
        {/* LEFT CARD */}
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <div className="w-28 h-28 mx-auto rounded-full bg-gray-200 flex items-center justify-center text-4xl mb-4">
            🧑‍💼
          </div>

          <h2 className="text-xl font-bold text-gray-800">
            {profile.shopName || "Your Shop"}
          </h2>

          <p className="text-gray-500 text-sm mt-1">
            Owner: {profile.name}
          </p>

          <p className="text-gray-500 text-sm">
            {profile.email}
          </p>

          <button className="mt-4 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700">
            Change Logo
          </button>
        </div>

        {/* RIGHT CARD */}
        <div className="bg-white rounded-xl shadow p-6 md:col-span-2">
          <h2 className="text-xl font-bold text-green-700 mb-4">
            Edit Seller Details
          </h2>

          <form onSubmit={handleSave} className="space-y-5">
            {/* SHOP NAME */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Shop Name
              </label>
              <input
                type="text"
                name="shopName"
                value={profile.shopName}
                onChange={handleChange}
                className="mt-1 w-full border rounded-lg px-4 py-2"
                placeholder="Enter your shop name"
                required
              />
            </div>

            {/* SELLER NAME */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Seller Name
              </label>
              <input
                type="text"
                name="name"
                value={profile.name}
                onChange={handleChange}
                className="mt-1 w-full border rounded-lg px-4 py-2"
                required
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={profile.email}
                onChange={handleChange}
                className="mt-1 w-full border rounded-lg px-4 py-2"
                required
              />
            </div>

            {/* ADDRESS */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Business Address
              </label>

              <div className="grid md:grid-cols-2 gap-4 mt-2">
                <input
                  type="text"
                  name="line1"
                  placeholder="Address Line 1"
                  value={profile.address.line1}
                  onChange={handleAddressChange}
                  className="border rounded-lg px-4 py-2"
                />

                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={profile.address.city}
                  onChange={handleAddressChange}
                  className="border rounded-lg px-4 py-2"
                />

                <input
                  type="text"
                  name="district"
                  placeholder="District"
                  value={profile.address.district}
                  onChange={handleAddressChange}
                  className="border rounded-lg px-4 py-2"
                />

                <input
                  type="text"
                  name="state"
                  placeholder="State"
                  value={profile.address.state}
                  onChange={handleAddressChange}
                  className="border rounded-lg px-4 py-2"
                />

                <input
                  type="text"
                  name="pincode"
                  placeholder="Pincode"
                  value={profile.address.pincode}
                  onChange={handleAddressChange}
                  className="border rounded-lg px-4 py-2"
                />
              </div>
            </div>

            {/* SAVE */}
            <button
              type="submit"
              disabled={saving}
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
