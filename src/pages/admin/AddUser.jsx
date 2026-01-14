import { useState } from "react";
import { addUser } from "../../api/api";

export default function AddUser({ onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    isActive: true, // ✅ new
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      await addUser(form);
      alert("User added successfully ✅");
      onSuccess && onSuccess();
      setForm({
        name: "",
        email: "",
        password: "",
        role: "user",
        isActive: true,
      });
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to add user"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="bg-white p-6 rounded-xl shadow mb-6"
    >
      <h2 className="text-xl font-bold mb-4">
        ➕ Add User
      </h2>

      {error && (
        <p className="mb-3 text-red-600 text-sm">
          {error}
        </p>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email Address"
          value={form.email}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Temporary Password"
          value={form.password}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />

        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value="user">User</option>
          <option value="seller">Seller</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* ACTIVE STATUS */}
      <div className="mt-4 flex items-center gap-2">
        <input
          type="checkbox"
          name="isActive"
          checked={form.isActive}
          onChange={handleChange}
        />
        <span className="text-sm text-gray-700">
          Account Active
        </span>
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`mt-4 px-6 py-2 rounded text-white ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {loading ? "Creating..." : "Create User"}
      </button>
    </form>
  );
}
