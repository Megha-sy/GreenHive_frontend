import { useEffect, useState } from "react";
import {
  getAdminProducts,
  deleteProduct,
} from "../../api/api";
import { Link } from "react-router-dom";


export default function ProductModeration() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // ⭐ DELETE MODAL STATE
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [reason, setReason] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const res = await getAdminProducts();
      setProducts(res.data);
    } catch {
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // OPEN MODAL
  const openDeleteModal = (id) => {
    setDeleteId(id);
    setReason("");
    setShowModal(true);
  };

  // CONFIRM DELETE
  const confirmDelete = async () => {
    if (!reason.trim()) {
      alert("Please enter a reason");
      return;
    }

    await deleteProduct(deleteId, { reason });
    setShowModal(false);
    setDeleteId(null);
    loadProducts();
  };

  return (
    <div>
    <div className="flex items-center justify-between mb-6">
  <h1 className="text-2xl font-bold">
    Product Moderation 🌱
  </h1>

  <Link
  to="/admin/deleted-plants"
  className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
>
  🗑️ View Deleted Plants
</Link>

</div>


      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white shadow rounded overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Seller</th>
                <th className="p-3 text-left">Price</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-t">
                  <td className="p-3">
                    <img
                      src={p.images?.[0]}
                      alt={p.name}
                      className="w-14 h-14 object-cover rounded"
                    />
                  </td>

                  <td className="p-3 font-medium">
                    {p.name}
                  </td>

                  <td className="p-3">
                    <div className="font-medium">
                      {p.seller?.name || "-"}
                    </div>
                    {p.seller?.shopName && (
                      <div className="text-xs text-gray-500">
                        Shop: {p.seller.shopName}
                      </div>
                    )}
                  </td>

                  <td className="p-3">₹{p.price}</td>

                  <td className="p-3">
                    <button
                      onClick={() => openDeleteModal(p._id)}
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {!products.length && (
                <tr>
                  <td
                    colSpan="5"
                    className="p-4 text-center text-gray-500"
                  >
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= DELETE MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-3">
              Delete Product
            </h2>

            <p className="text-sm text-gray-600 mb-3">
              Please provide a reason for deleting this product.
            </p>

            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border rounded p-2 mb-4"
              rows="3"
              placeholder="Reason for deletion..."
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 rounded border"
              >
                Cancel
              </button>

              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
