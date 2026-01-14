import { useEffect, useState } from "react";
import {
  getAdminTips,
  getDeletedTips,
  deleteAdminTip,
} from "../../api/api";

export default function TipModeration() {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("active"); // active | deleted

  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [reason, setReason] = useState("");

  useEffect(() => {
    loadTips();
  }, [tab]);

  const loadTips = async () => {
    setLoading(true);
    const res =
      tab === "active"
        ? await getAdminTips()
        : await getDeletedTips();

    setTips(res.data);
    setLoading(false);
  };

  const openDelete = (id) => {
    setDeleteId(id);
    setReason("");
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!reason.trim()) {
      alert("Please enter a reason");
      return;
    }

    await deleteAdminTip(deleteId, { reason });
    setShowModal(false);
    loadTips();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        Tip Moderation 💡
      </h1>

      {/* TABS */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setTab("active")}
          className={`px-4 py-2 rounded ${
            tab === "active"
              ? "bg-green-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Active Tips
        </button>

        <button
          onClick={() => setTab("deleted")}
          className={`px-4 py-2 rounded ${
            tab === "deleted"
              ? "bg-red-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Deleted Tips
        </button>
      </div>

      {/* TABLE */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white shadow rounded overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Plant</th>
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">
                  {tab === "active" ? "Upvotes" : "Date"}
                </th>
                 <th className="p-3 text-left">
                  {tab === "active" ? "Actions" : "Reason"}
                </th>              </tr>
            </thead>

            <tbody>
              {tips.map((t) => (
                <tr key={t._id} className="border-t">
                  <td className="p-3 font-medium">{t.title}</td>
                  <td className="p-3">{t.plantName || "-"}</td>

                  <td className="p-3">
                    <div>{t.user?.name}</div>
                    <div className="text-xs text-gray-500">
                      {t.user?.email}
                    </div>
                  </td>

                  <td className="p-3">
                    {tab === "active" ? (
                      t.upvotes
                    ) : (
                      <div className="text-xs text-gray-600">
                        <div>
                          {new Date(t.deletedAt).toLocaleDateString()}
                        </div>
                        
                        <div>
                          <b>By:</b>{" "}
                          {t.deletedBy?.name || "Admin"}
                        </div>
                      </div>
                    )}
                  </td>

                  <td className="p-3">
                    {tab === "active" ? (
                      <button
                        onClick={() => openDelete(t._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                    ) : (
                       <div>{t.deleteReason}</div>                    )}
                  </td>
                </tr>
              ))}

              {!tips.length && (
                <tr>
                  <td
                    colSpan="5"
                    className="p-4 text-center text-gray-500"
                  >
                    No tips found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* DELETE MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-3">
              Delete Tip
            </h2>

            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full border p-2 rounded mb-4"
              rows="3"
              placeholder="Reason for deletion..."
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="border px-4 py-2 rounded"
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
