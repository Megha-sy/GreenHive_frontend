import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  createPlant,
  updatePlant,
  getSellerPlants,
  getCategories,
} from "../../api/api";

export default function AddEditPlant() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(null);
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    description: "",
    images: [],
    discountPercent: 0,
    isActive: true,
  });

  /* =========================
     LOAD CATEGORIES
  ========================= */
  useEffect(() => {
    const loadCategories = async () => {
      const res = await getCategories();
      setCategories(res.data);
    };
    loadCategories();
  }, []);

  /* =========================
     LOAD PLANT FOR EDIT
  ========================= */
  useEffect(() => {
    if (!isEdit) return;

    const loadPlant = async () => {
      const res = await getSellerPlants();
      const plant = res.data.find(
        (p) => p._id === id
      );

      if (plant) {
        setForm({
          ...plant,
          category: plant.category?._id,
          images: [],
        });
        setPreview(plant.images?.[0]);
      }
    };

    loadPlant();
  }, [id]);

  /* =========================
     HANDLE CHANGE
  ========================= */
  const handleChange = (e) => {
    const { name, value, type, files, checked } =
      e.target;

    if (type === "file") {
      const file = files[0];
      setForm({
        ...form,
        images: Array.from(files),
      });
      setPreview(URL.createObjectURL(file));
    } else {
      setForm({
        ...form,
        [name]:
          type === "checkbox" ? checked : value,
      });
    }
  };

  /* =========================
     SUBMIT
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const fd = new FormData();
      Object.entries(form).forEach(
        ([key, value]) => {
          if (key !== "images")
            fd.append(key, value);
        }
      );

      form.images.forEach((img) =>
        fd.append("images", img)
      );

      if (isEdit) {
        await updatePlant(id, fd);
      } else {
        await createPlant(fd);
      }

      navigate("/seller/plants");
    } catch {
      alert("Failed to save plant");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">
        {isEdit ? "Edit Plant" : "Add New Plant"}
      </h1>

      <div className="bg-white rounded-xl shadow p-6 grid md:grid-cols-2 gap-8">

        {/* IMAGE */}
        <div>
          <div className="h-[350px] border rounded flex items-center justify-center">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="h-full object-contain"
              />
            ) : (
              <span className="text-gray-400">
                Upload Image
              </span>
            )}
          </div>

          <input
            type="file"
            name="images"
            onChange={handleChange}
            className="mt-4 w-full border p-2 rounded"
          />
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Plant Name"
            className="w-full border p-3 rounded"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              placeholder="Price"
              className="border p-3 rounded"
              required
            />

            <input
              name="stock"
              type="number"
              value={form.stock}
              onChange={handleChange}
              placeholder="Stock"
              className="border p-3 rounded"
              required
            />
          </div>

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full border p-3 rounded"
            required
          >
            <option value="">
              Select Category
            </option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name}
              </option>
            ))}
          </select>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description"
            className="w-full border p-3 rounded"
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
            />
            Active
          </label>

          <button
            disabled={saving}
            className={`w-full py-3 rounded text-white ${
              saving
                ? "bg-gray-400"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {saving
              ? "Saving..."
              : isEdit
              ? "Update Plant"
              : "Add Plant"}
          </button>
        </form>
      </div>
    </div>
  );
}
