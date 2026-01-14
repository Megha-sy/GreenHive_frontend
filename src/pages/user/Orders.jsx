import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔴 Cancel popup state
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  // =========================
  // LOAD ORDERS
  // =========================
  const loadOrders = async () => {
    try {
      const res = await API.get("/orders/my");
      setOrders(res.data || []);
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // =========================
  // OPEN CANCEL POPUP
  // =========================
  const openCancelModal = (orderId) => {
    setCancelOrderId(orderId);
    setCancelReason("");
    setShowCancelModal(true);
  };

  // =========================
  // CONFIRM CANCEL
  // =========================
  const confirmCancel = async () => {
    if (!cancelReason.trim()) {
      alert("Please enter a reason for cancellation");
      return;
    }

    try {
      await API.put(`/orders/${cancelOrderId}/cancel`, {
        reason: cancelReason,
      });

      alert("Order cancelled successfully");
      setShowCancelModal(false);
      loadOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel order");
    }
  };

  // =========================
  // STATUS COLORS
  // =========================
  const statusColor = (status) => {
    switch (status) {
      case "delivered":
        return "bg-green-100 text-green-700";
      case "shipped":
        return "bg-blue-100 text-blue-700";
      case "pending":
      case "processing":
        return "bg-yellow-100 text-yellow-700";
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
      case "success":
        return "bg-green-100 text-green-700";
      case "unpaid":
        return "bg-yellow-100 text-yellow-700";
      case "refunded":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <p className="text-center p-6 text-gray-600">
        Loading your orders...
      </p>
    );
  }

  return (
    <div className="min-h-screen bg-green-50 p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-800">
          My Orders 📦
        </h1>
        <Link
          to="/browse"
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Shop More
        </Link>
      </div>

      {/* EMPTY STATE */}
      {orders.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <p className="text-gray-600 text-lg">
            You have not placed any orders yet 🌱
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Plant</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Amount</th>
                <th className="py-3 px-4 text-left">Payment Method</th>
                <th className="py-3 px-4 text-left">Payment Status</th>
                <th className="py-3 px-4 text-left">Order Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr
                  key={order._id}
                  className="border-b hover:bg-green-50"
                >
                  {/* PLANT */}
                  <td className="py-3 px-4 font-semibold">
                    {order.products?.[0]?.product?.name || "Product"}
                  </td>

                  {/* DATE */}
                  <td className="py-3 px-4">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>

                  {/* AMOUNT */}
                  <td className="py-3 px-4 font-bold text-green-700">
                    ₹{order.totalPrice}
                  </td>

                  {/* PAYMENT METHOD */}
                  <td className="py-3 px-4">
                    {paymentMethodLabel(order.payment?.method)}
                  </td>

                  {/* PAYMENT STATUS */}
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${paymentStatusColor(
                        order.payment?.status
                      )}`}
                    >
                      {order.payment?.status
                        ? order.payment.status.charAt(0).toUpperCase() +
                          order.payment.status.slice(1)
                        : "—"}
                    </span>

                    {/* ✅ REFUND LABEL */}
                    {order.payment?.status === "refunded" && (
                      <p className="text-xs text-red-600 mt-1">
                        Refund completed
                      </p>
                    )}
                  </td>

                  {/* ORDER STATUS */}
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColor(
                        order.status
                      )}`}
                    >
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </span>
                  </td>

                  {/* ACTION */}
                  <td className="py-3 px-4 text-center space-x-4">
                    <Link
                      to={`/order-tracking/${order._id}`}
                      className="text-green-700 font-semibold hover:underline"
                    >
                      Track
                    </Link>

                    {/* ❌ Hide cancel after refund */}
                    {["pending", "processing"].includes(order.status) &&
                      order.payment?.status !== "refunded" && (
                        <button
                          title="Cancel Order"
                          onClick={() => openCancelModal(order._id)}
                          className="text-red-600 text-xl hover:text-red-700"
                        >
                          ❌
                        </button>
                      )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ========================= */}
      {/* CANCEL REASON MODAL */}
      {/* ========================= */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-red-600 mb-3">
              Cancel Order
            </h2>

            <p className="text-gray-600 mb-3">
              Please tell us why you are cancelling this order:
            </p>

            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              rows="4"
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-400"
              placeholder="Enter cancellation reason..."
            />

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
              >
                Close
              </button>

              <button
                onClick={confirmCancel}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
