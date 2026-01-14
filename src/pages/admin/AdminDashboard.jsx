import { useEffect, useState } from "react";
import { getAdminDashboard } from "../../api/api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 📅 Selected month index
  const [monthIndex, setMonthIndex] = useState(0);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await getAdminDashboard();
      setData(res.data);
      setMonthIndex(res.data.monthlyRevenue.length - 1); // latest month
    } catch {
      alert("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;

  const monthly = data.monthlyRevenue || [];

  // 🧮 Selected month data
  const selectedMonth =
    monthly[monthIndex] || { month: "-", revenue: 0 };

  const previousMonthRevenue =
    monthIndex > 0 ? monthly[monthIndex - 1].revenue : 0;

  // ⬅️ ➡️ HANDLERS
  const prevMonth = () => {
    if (monthIndex > 0) setMonthIndex(monthIndex - 1);
  };

  const nextMonth = () => {
    if (monthIndex < monthly.length - 1)
      setMonthIndex(monthIndex + 1);
  };

  // 📅 Calendar select
  const handleMonthSelect = (e) => {
    const index = monthly.findIndex(
      (m) => m.month === e.target.value
    );
    if (index !== -1) setMonthIndex(index);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen space-y-8">
      <h1 className="text-3xl font-bold">
        Admin Dashboard 📊
      </h1>

      {/* ================= SUMMARY ================= */}
      <div className="grid md:grid-cols-5 gap-5">
        <StatCard title="Users" value={data.totalUsers} />
        <StatCard title="Sellers" value={data.totalSellers} />
        <StatCard title="Plants" value={data.totalPlants} />
        <StatCard title="Orders" value={data.totalOrders} />
        <StatCard
          title="Total Revenue"
          value={`₹${data.totalRevenue}`}
        />
     
      </div>

      {/* ================= MONTH CONTROLS ================= */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl shadow">
        <button
          onClick={prevMonth}
          disabled={monthIndex === 0}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          ⬅ Previous
        </button>

        <select
          value={selectedMonth.month}
          onChange={handleMonthSelect}
          className="border p-2 rounded"
        >
          {monthly.map((m) => (
            <option key={m.month} value={m.month}>
              {m.month}
            </option>
          ))}
        </select>

        <button
          onClick={nextMonth}
          disabled={monthIndex === monthly.length - 1}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next ➡
        </button>
      </div>

      {/* ================= GRAPH ================= */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-xl font-bold mb-4">
          Revenue for {selectedMonth.month}
        </h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={[selectedMonth]}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar
              dataKey="revenue"
              fill="#16a34a"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}


function StatCard({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow text-center">
      <h2 className="text-gray-500 text-sm">
        {title}
      </h2>
      <p className="text-2xl font-bold mt-2">
        {value}
      </p>
    </div>
  );
}
