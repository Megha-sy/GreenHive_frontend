import { useEffect, useState } from "react";
import { getSalesDashboard, requestPayout } from "../../api/api";

export default function SalesPayoutDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const res = await getSalesDashboard();
      setData(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    const amount = prompt("Enter amount to withdraw");

    if (!amount || isNaN(amount)) return;

    try {
      await requestPayout({ amount: Number(amount) });
      alert("Payout request submitted");
      loadDashboard(); // refresh data
    } catch (err) {
      alert(err.response?.data?.message || "Withdraw failed");
    }
  };

  if (loading || !data) {
    return <p className="p-6 text-gray-600">Loading dashboard...</p>;
  }

  const summary = data.summary || {};
  const products = data.products || [];
  const payouts = data.payouts || [];

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-8">
      <h1 className="text-3xl font-bold">Sales & Payout Dashboard</h1>

      {/* ================= SUMMARY ================= */}
      <div className="grid md:grid-cols-4 gap-6">
        <Card title="Total Revenue" value={`₹${summary.totalRevenue || 0}`} />
        <Card title="This Month" value={`₹${summary.monthlyRevenue || 0}`} />
        <Card title="Withdrawn" value={`₹${summary.withdrawn || 0}`} />
        <Card
          title="Available"
          value={`₹${summary.available || 0}`}
          highlight
        />
      </div>

      {/* Withdraw Button */}
      <div>
        <button
          onClick={handleWithdraw}
          disabled={summary.available <= 0}
          className={`px-5 py-2 rounded text-white ${
            summary.available > 0
              ? "bg-green-600 hover:bg-green-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Request Withdrawal
        </button>
      </div>

      {/* ================= SALES REPORT ================= */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">Product Sales</h2>

        {products.length === 0 ? (
          <p className="text-gray-500">No sales yet</p>
        ) : (
      <table className="w-full border-collapse table-fixed">
  <thead className="bg-gray-100">
    <tr>
      <th className="p-3 text-left w-1/2">Product</th>
      <th className="p-3 text-center w-1/4">Sold</th>
      <th className="p-3 text-center w-1/4">Revenue</th>
    </tr>
  </thead>

  <tbody>
    {products.map((p, i) => (
      <tr key={i} className="border-t">
        <td className="p-3 font-medium text-left">
          {p.name}
        </td>
        <td className="p-3 text-center">
          {p.sold}
        </td>
        <td className="p-3 text-center font-semibold text-green-700">
          ₹{p.revenue}
        </td>
      </tr>
    ))}
  </tbody>
</table>

        )}
      </div>

      {/* ================= PAYOUT HISTORY ================= */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">Payout History 🏦</h2>

   <table className="w-full border-collapse table-fixed">
  <thead className="bg-gray-100">
    <tr>
      <th className="p-3 text-left w-1/3">Date</th>
      <th className="p-3 text-center w-1/3">Amount</th>
      <th className="p-3 text-center w-1/3">Status</th>
    </tr>
  </thead>

  <tbody>
    {payouts.length === 0 ? (
      <tr>
        <td colSpan="3" className="p-4 text-center text-gray-500">
          No payouts yet
        </td>
      </tr>
    ) : (
      payouts.map((p, i) => (
        <tr key={i} className="border-t">
          <td className="p-3 text-left">
            {new Date(p.createdAt).toLocaleDateString()}
          </td>
          <td className="p-3 text-center font-semibold">
            ₹{p.amount}
          </td>
          <td className="p-3 text-center">
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                p.status === "paid"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {p.status}
            </span>
          </td>
        </tr>
      ))
    )}
  </tbody>
</table>

      </div>
    </div>
  );
}

/* ================= CARD COMPONENT ================= */
function Card({ title, value, highlight }) {
  return (
    <div
      className={`p-5 rounded-xl shadow ${
        highlight ? "bg-green-600 text-white" : "bg-white"
      }`}
    >
      <p className="text-sm opacity-80">{title}</p>
      <h2 className="text-2xl font-bold mt-1">{value}</h2>
    </div>
  );
}
