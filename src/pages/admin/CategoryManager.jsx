import { useEffect, useState } from "react";
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../../api/api";

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await getCategories();
    setCategories(res.data);
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!name.trim()) return;

    if (editId) {
      await updateCategory(editId, { name });
    } else {
      await addCategory({ name });
    }

    setName("");
    setEditId(null);
    load();
  };

  const startEdit = (c) => {
    setName(c.name);
    setEditId(c._id);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Category Manager 🌱
      </h1>

      {/* ADD / EDIT */}
      <form
        onSubmit={submit}
        className="flex gap-3 mb-6"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
          className="border p-2 rounded w-64"
        />

        <button className="bg-green-600 text-white px-4 rounded">
          {editId ? "Update" : "Add"}
        </button>

        {editId && (
          <button
            type="button"
            onClick={() => {
              setName("");
              setEditId(null);
            }}
            className="border px-4 rounded"
          >
            Cancel
          </button>
        )}
      </form>

      {/* LIST */}
      <div className="bg-white shadow rounded">
        <table className="w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">Category</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {categories.map((c) => (
              <tr key={c._id} className="border-t">
                <td className="p-3">{c.name}</td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => startEdit(c)}
                    className="text-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCategory(c._id).then(load)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {!categories.length && (
              <tr>
                <td
                  colSpan="2"
                  className="p-4 text-center text-gray-500"
                >
                  No categories
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
