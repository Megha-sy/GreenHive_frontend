import { useEffect, useState } from "react";
import {
  getSellerOrders,
  updateOrderStatus,
  markOrderAsPaid,
} from "../../api/api";

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);

  // FILTER STATES
  const [searchName, setSearchName] = useState("");
  const [filterDate, setFilterDate] = useState("");

  const loadOrders = async () => {
    try {
      const res = await getSellerOrders();
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to load seller orders", err);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, { status });
      loadOrders();
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  const handleMarkPaid = async (orderId) => {
    try {
      await markOrderAsPaid(orderId);
      loadOrders();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update payment");
    }
  };

  // FILTER LOGIC
  const filteredOrders = orders.filter((order) => {
    const matchesName = order.buyer?.name
      ?.toLowerCase()
      .includes(searchName.toLowerCase());

    const matchesDate = filterDate
      ? new Date(order.createdAt).toISOString().slice(0, 10) === filterDate
      : true;

    return matchesName && matchesDate;
  });

  const paymentBadge = (status) =>
    status === "paid"
      ? "bg-green-100 text-green-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          Orders Received 📦
        </h1>
        <p className="text-sm text-gray-500">
          Manage and track customer orders
        </p>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col md:flex-row gap-4 md:items-center">
        <input
          type="text"
          placeholder="Search customer"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          className="border rounded px-3 py-2 text-sm w-full md:w-60"
        />

        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="border rounded px-3 py-2 text-sm w-full md:w-44"
        />

        <button
          onClick={() => {
            setSearchName("");
            setFilterDate("");
          }}
          className="text-sm px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
        >
          Clear Filters
        </button>

        <span className="text-sm text-gray-500 md:ml-auto">
          {filteredOrders.length} orders
        </span>
      </div>

      {filteredOrders.length === 0 && (
        <p className="text-gray-500">
          No matching orders found.
        </p>
      )}

      {/* ORDER LIST */}
      <div className="space-y-6">
        {filteredOrders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-xl shadow p-5"
          >
            {/* ORDER HEADER */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4">
              <div>
                <p className="font-semibold">
                  {order.buyer?.name}
                </p>
                <p className="text-xs text-gray-500">
                  Order #{order._id.slice(-6)}
                </p>
                <p className="text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString("en-IN")}
                </p>
              </div>

              {/* STATUS */}
              <select
                value={order.status}
                onChange={(e) =>
                  handleStatusChange(order._id, e.target.value)
                }
                className={`border rounded px-3 py-2 text-sm font-medium ${
                  order.status === "delivered"
                    ? "bg-green-50 text-green-700"
                    : order.status === "cancelled"
                    ? "bg-red-50 text-red-600"
                    : "bg-yellow-50 text-yellow-700"
                }`}
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="packed">Packed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* PAYMENT INFO */}
            <div className="flex flex-wrap gap-4 mb-4 text-sm">
              <span className="px-3 py-1 rounded-full bg-gray-100">
                Method:{" "}
                <strong className="capitalize">
                  {order.payment?.method}
                </strong>
              </span>

              <span
                className={`px-3 py-1 rounded-full font-semibold ${paymentBadge(
                  order.payment?.status
                )}`}
              >
                {order.payment?.status}
              </span>

              {order.payment?.method === "cod" &&
                order.payment?.status === "unpaid" &&
                order.status === "delivered" && (
                  <button
                    onClick={() => handleMarkPaid(order._id)}
                    className="px-4 py-1 bg-green-600 text-white rounded-full text-xs hover:bg-green-700"
                  >
                    Mark as Paid
                  </button>
                )}
            </div>

            {/* PRODUCTS */}
            <div className="divide-y">
              {order.products.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 py-3"
                >
                  <img
                    src={
                      item.product?.images?.[0] ||
                      "https://via.placeholder.com/80"
                    }
                    alt={item.product?.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />

                  <div className="flex-1">
                    <p className="font-medium text-sm">
                      {item.product?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Qty {item.qty} × ₹{item.product?.price}
                    </p>
                  </div>

                  <p className="text-sm font-semibold text-gray-700">
                    ₹{item.qty * item.product?.price}
                  </p>
                </div>
              ))}
            </div>

            {/* TOTAL */}
            <div className="flex justify-between items-center mt-4 pt-4 border-t">
              <span className="text-sm text-gray-500">
                Order Total
              </span>
              <span className="text-lg font-bold text-green-700">
                ₹{order.totalPrice}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
