import { useEffect, useState } from "react";
import { getUsers, createConversation } from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function SellerUserList() {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await getUsers();
    setUsers(res.data);
  };

  const openChat = async (userId) => {
    const res = await createConversation({
      receiverId: userId,
    });
navigate(`/seller/chats/${res.data._id}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">
        Chat with Customers
      </h1>

      {users.map((u) => (
        <div
          key={u._id}
          onClick={() => openChat(u._id)}
          className="p-3 bg-white shadow rounded mb-2 cursor-pointer"
        >
          {u.name}
        </div>
      ))}
    </div>
  );
}
