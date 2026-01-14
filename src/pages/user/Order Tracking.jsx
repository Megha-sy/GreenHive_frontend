import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../../api/api";

export default function OrderTracking() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔴 Cancel modal state
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelLoading, setCancelLoading] = useState(false);

  // =========================
  // LOAD ORDER
  // =========================
  const loadOrder = async () => {
    try {
      const res = await API.get(`/orders/${id}`);
      setOrder(res.data);
    } catch (err) {
      console.error("Failed to load order:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  // =========================
  // CANCEL ORDER
  // =========================
  const confirmCancel = async () => {
    if (!cancelReason.trim()) {
      alert("Please enter cancellation reason");
      return;
    }

    try {
      setCancelLoading(true);
      await API.put(`/orders/${id}/cancel`, {
        reason: cancelReason,
      });

      alert("Order cancelled successfully");
      setShowCancelModal(false);
      setCancelReason("");
      loadOrder();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel order");
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) {
    return (
      <p className="text-center p-6 text-gray-600">
        Loading order...
      </p>
    );
  }

  if (!order) {
    return (
      <p className="text-center p-6 text-red-500">
        Order not found or access denied.
      </p>
    );
  }

  // =========================
  // ADDRESS FORMAT
  // =========================
  const formattedAddress = order.address
    ? [
        order.address.line1,
        order.address.city,
        order.address.district,
        order.address.state &&
          `${order.address.state} - ${order.address.pincode}`,
        order.address.country || "India",
      ]
        .filter(Boolean)
        .join(", ")
    : "Address not available";

  // =========================
  // STATUS LOGIC
  // =========================
  const STATUS_INDEX = {
    pending: 0,
    processing: 1,
    packed: 2,
    shipped: 3,
    delivered: 4,
  };

  const steps = [
    "Order Placed",
    "Processing",
    "Packed",
    "Shipped",
    "Delivered",
  ];

  const currentIndex = STATUS_INDEX[order.status] ?? 0;
  const isCancelled = order.status === "cancelled";

  return (
    <div className="min-h-screen bg-green-50 p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-800">
          Order Tracking 🚚
        </h1>
        <Link
          to="/orders"
          className="text-green-700 font-semibold hover:underline"
        >
          ← Back to Orders
        </Link>
      </div>

      {/* ORDER SUMMARY */}
      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <div className="grid md:grid-cols-4 gap-4">

          <div>
            <p className="text-gray-500 text-sm">Order ID</p>
            <p className="font-bold">{order._id}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Items</p>
            <p className="font-bold">{order.products.length}</p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Total Amount</p>
            <p className="font-bold text-green-700">
              ₹{order.totalPrice}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-sm">Payment</p>
            <p
              className={`font-bold ${
                order.payment?.status === "success"
                  ? "text-green-600"
                  : order.payment?.status === "refunded"
                  ? "text-blue-600"
                  : "text-red-500"
              }`}
            >
              {order.payment?.method || "Online"} —{" "}
              {order.payment?.status?.toUpperCase() || "PENDING"}
            </p>
          </div>
        </div>
      </div>

      {/* ADDRESS */}
      <div className="bg-white rounded-xl shadow p-5 mb-6">
        <h2 className="text-xl font-bold text-green-700 mb-2">
          Delivery Address
        </h2>
        <p className="text-gray-700">{formattedAddress}</p>
      </div>

      {/* STATUS CARD */}
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-green-700">
            Order Status
          </h2>

          {/* ❌ CANCEL ICON */}
          {["pending", "processing"].includes(order.status) && (
            <button
              title="Cancel Order"
              onClick={() => setShowCancelModal(true)}
              className="text-red-600 hover:text-red-700 text-2xl"
            >
              ❌
            </button>
          )}
        </div>

        {/* CANCELLED VIEW */}
        {isCancelled ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-2xl font-bold text-red-600 mb-2">
              ❌ Order Cancelled
            </p>
            <p className="text-gray-700">
              Reason: {order.cancelReason || "Not specified"}
            </p>

            {order.payment?.status === "refunded" && (
              <p className="mt-3 text-green-700 font-semibold">
                💰 Refund Initiated
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center gap-4">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold
                    ${
                      index <= currentIndex
                        ? "bg-green-600 text-white"
                        : "bg-gray-300 text-gray-600"
                    }`}
                >
                  {index + 1}
                </div>
                <p
                  className={`font-semibold ${
                    index <= currentIndex
                      ? "text-green-700"
                      : "text-gray-600"
                  }`}
                >
                  {step}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ========================= */}
      {/* CANCEL MODAL */}
      {/* ========================= */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <h2 className="text-xl font-bold text-red-600 mb-3">
              Cancel Order
            </h2>

            <textarea
              rows="4"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Enter cancellation reason..."
              className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-red-400"
            />

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg"
              >
                Close
              </button>

              <button
                disabled={cancelLoading}
                onClick={confirmCancel}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                {cancelLoading ? "Cancelling..." : "Confirm Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
