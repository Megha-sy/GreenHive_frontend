import { useEffect, useState } from "react";
import { getAdminOrders, refundOrder } from "../../api/api";

export default function OrderMonitoring() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [sellerSearch, setSellerSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOrders();
  }, [status, fromDate, toDate]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const res = await getAdminOrders({
        status: status || undefined,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
      });
      setOrders(res.data);
    } catch {
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // 🔍 FILTER BY SELLER NAME
  const filteredOrders = orders.filter((order) =>
    order.products.some((p) =>
      p.seller?.name?.toLowerCase().includes(
        sellerSearch.toLowerCase()
      )
    )
  );

  // =========================
  // ORDER STATUS COLORS
  // =========================
  const statusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "processing":
      case "confirmed":
        return "bg-yellow-100 text-yellow-700";
      case "shipped":
        return "bg-blue-100 text-blue-700";
      case "cancel_requested":
        return "bg-orange-100 text-orange-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // =========================
  // PAYMENT HELPERS
  // =========================
  const paymentMethodLabel = (method) => {
    if (!method) return "—";
    if (method === "cod") return "Cash on Delivery";
    if (method === "online") return "Online";
    return method;
  };

  const paymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-700";
      case "unpaid":
        return "bg-yellow-100 text-yellow-700";
      case "refunded":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // =========================
  // REFUND HANDLER (ADMIN)
  // =========================
  const handleRefund = async (orderId) => {
    const confirmRefund = window.confirm(
      "Approve refund for this order?"
    );

    if (!confirmRefund) return;

    try {
      await refundOrder(orderId);
      alert("Refund approved & processed");
      loadOrders();
    } catch (err) {
      alert(
        err.response?.data?.message || "Refund failed"
      );
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Order Monitoring 📦
      </h1>

      {/* FILTERS */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancel_requested">Cancel Requested</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <input
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          className="border px-3 py-2 rounded"
        />

        <input
          type="date"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          className="border px-3 py-2 rounded"
        />

        <input
          type="text"
          placeholder="Search seller name"
          value={sellerSearch}
          onChange={(e) => setSellerSearch(e.target.value)}
          className="border px-3 py-2 rounded w-56"
        />
      </div>

      {/* TABLE */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white shadow rounded overflow-x-auto">
          <table className="w-full text-sm text-center">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 text-left">Order ID</th>
                <th className="p-3">Buyer</th>
                <th className="p-3">Order Status</th>
                <th className="p-3">Payment</th>
                <th className="p-3">Payment Status</th>
                <th className="p-3">Total</th>
                <th className="p-3">Date</th>
                <th className="p-3">Sellers</th>
                <th className="p-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredOrders.map((o) => (
                <tr key={o._id} className="border-t hover:bg-gray-50">
                  <td className="p-3 text-left font-mono">
                    {o._id}
                  </td>

                  <td className="p-3">
                    {o.buyer?.name || "-"}
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${statusColor(
                        o.status
                      )}`}
                    >
                      {o.status}
                    </span>
                  </td>

                  <td className="p-3">
                    {paymentMethodLabel(o.payment?.method)}
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${paymentStatusColor(
                        o.payment?.status
                      )}`}
                    >
                      {o.payment?.status || "—"}
                    </span>
                  </td>

                  <td className="p-3 font-semibold">
                    ₹{o.totalPrice}
                  </td>

                  <td className="p-3">
                    {new Date(o.createdAt).toLocaleDateString(
                      "en-GB"
                    )}
                  </td>

                  <td className="p-3">
                    {[...new Set(
                      o.products.map(
                        (p) => p.seller?.name
                      )
                    )].join(", ")}
                  </td>

                  {/* ✅ ADMIN ACTION */}
                  <td className="p-3">
                    {o.status === "cancel_requested" &&
                    o.payment?.status === "paid" ? (
                      <button
                        onClick={() =>
                          handleRefund(o._id)
                        }
                        className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                      >
                        Approve Refund
                      </button>
                    ) : (
                      <span className="text-gray-400 text-xs">
                        —
                      </span>
                    )}
                  </td>
                </tr>
              ))}

              {!filteredOrders.length && (
                <tr>
                  <td
                    colSpan="9"
                    className="p-4 text-center text-gray-500"
                  >
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
