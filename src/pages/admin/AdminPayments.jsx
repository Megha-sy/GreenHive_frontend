import React, { useEffect, useState } from "react";
import API from "../../api/api";

export default function AdminPayments() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    API.get("/orders").then((res) => setOrders(res.data));
  }, []);

  const refund = async (id) => {
    await API.put(`/orders/${id}/refund`);
    window.location.reload();
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Payment Dashboard</h1>

      <table className="w-full bg-white shadow rounded">
        <thead className="bg-green-600 text-white">
          <tr>
            <th className="p-3">Order</th>
            <th>Amount</th>
            <th>Method</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((o) => (
            <tr key={o._id} className="border-b">
              <td className="p-3">{o._id}</td>
              <td>₹{o.totalPrice}</td>
              <td>{o.payment?.method}</td>
              <td>{o.payment?.status}</td>
              <td>
                {o.payment?.status === "success" && (
                  <button
                    onClick={() => refund(o._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Refund
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
