import React, { useEffect, useState } from "react";
import API from "../../api/api";

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    address: {
      line1: "",
      city: "",
      district: "",
      state: "",
      pincode: "",
      phone: "",
    },
  });

  const [loading, setLoading] = useState(true);

  // =========================
  // LOAD PROFILE
  // =========================
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await API.get("/profile/me");

      setProfile({
        name: res.data.name || "",
        email: res.data.email || "",
        address: {
          line1: res.data.address?.line1 || "",
          city: res.data.address?.city || "",
          district: res.data.address?.district || "",
          state: res.data.address?.state || "",
          pincode: res.data.address?.pincode || "",
        },
        phone: res.data.phone || "",
      });
    } catch (err) {
      console.error("Failed to load profile", err);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // HANDLE INPUT CHANGE
  // =========================
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

  // =========================
  // SAVE PROFILE
  // =========================
  const handleSave = async (e) => {
    e.preventDefault();

    try {
      await API.put("/profile/me", {
        name: profile.name,
        email: profile.email,
        address: profile.address,
      });

      alert("Profile updated successfully ✅");
    } catch (err) {
      console.error("Failed to update profile", err);
      alert("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <p className="text-center p-6 text-gray-600">
        Loading profile...
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 p-6">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-green-800">
          My Profile 👤🌿
        </h1>
        <p className="text-gray-600 mt-1">
          Manage your personal information
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6">
        {/* LEFT CARD */}
        <div className="bg-white rounded-xl shadow p-6 text-center">
          <div className="w-28 h-28 mx-auto rounded-full bg-gray-200 flex items-center justify-center text-4xl mb-4">
            👤
          </div>

          <h2 className="text-xl font-bold text-gray-800">
            {profile.name}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {profile.email}
          </p>

          <button className="mt-4 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700">
            Change Photo
          </button>
        </div>

        {/* RIGHT CARD */}
        <div className="bg-white rounded-xl shadow p-6 md:col-span-2">
          <h2 className="text-xl font-bold text-green-700 mb-4">
            Edit Profile Details
          </h2>

          <form onSubmit={handleSave} className="space-y-5">
            {/* NAME */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Full Name
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
             <div>
              <label className="text-sm font-semibold text-gray-700">
                Phone
              </label>
              <input
                type="text"
                name="phone"
                value={profile.phone}
                onChange={handleChange}
                className="mt-1 w-full border rounded-lg px-4 py-2"
                required
              />
            </div>

            {/* ADDRESS */}
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Address
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
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
