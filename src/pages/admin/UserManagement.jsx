import { useEffect, useState } from "react";
import { getAllUsers, updateUser } from "../../api/api";
import AddUser from "./AddUser";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState("all"); // ⭐ FILTER STATE

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers();
      setUsers(res.data);
    } catch {
      alert("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (user) => {
    await updateUser(user._id, {
      isActive: !user.isActive,
    });
    loadUsers();
  };

  const changeRole = async (user, role) => {
    await updateUser(user._id, { role });
    loadUsers();
  };

  // ⭐ FILTER LOGIC
  const filteredUsers = users.filter((u) => {
    if (filter === "all") return true;
    if (filter === "active") return u.isActive;
    if (filter === "disabled") return !u.isActive;
    return u.role === filter;
  });

  return (
    <div className="p-6">
      {/* ================= HEADER ================= */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          User Management 👥
        </h1>

        <div className="flex gap-3">
          {/* FILTER */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded px-3 py-2"
          >
            <option value="all">All Users</option>
            <option value="user">Users</option>
            <option value="seller">Sellers</option>
            <option value="admin">Admins</option>
            <option value="active">Active</option>
            <option value="disabled">Disabled</option>
          </select>

          {/* ADD USER */}
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            {showAdd ? "✖ Close" : "➕ Add User"}
          </button>
        </div>
      </div>

      {/* ================= ADD USER FORM ================= */}
      {showAdd && (
        <AddUser
          onSuccess={() => {
            setShowAdd(false);
            loadUsers();
          }}
        />
      )}

      {/* ================= USERS TABLE ================= */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Role</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((u) => (
                <tr
                  key={u._id}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>

                  {/* ROLE */}
                  <td className="p-3">
                    <select
                      value={u.role}
                      onChange={(e) =>
                        changeRole(u, e.target.value)
                      }
                      className="border rounded px-2 py-1"
                    >
                      <option value="user">User</option>
                      <option value="seller">Seller</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>

                  {/* STATUS */}
                  <td className="p-3">
                    {u.isActive ? (
                      <span className="text-green-600 font-medium">
                        Active
                      </span>
                    ) : (
                      <span className="text-red-600 font-medium">
                        Disabled
                      </span>
                    )}
                  </td>

                  {/* ACTION */}
                  <td className="p-3">
                    <button
                      onClick={() => toggleStatus(u)}
                      className={`px-3 py-1 rounded text-white ${
                        u.isActive
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {u.isActive ? "Disable" : "Enable"}
                    </button>
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td
                    colSpan="5"
                    className="p-4 text-center text-gray-500"
                  >
                    No users found
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
