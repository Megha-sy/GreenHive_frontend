import { useEffect, useState } from "react";
import { getSellers, createConversation } from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function UserSellerList() {
  const [sellers, setSellers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadSellers();
  }, []);

  const loadSellers = async () => {
    const res = await getSellers();
    console.log("SELLERS:", res.data); 
    setSellers(res.data);
  };

  const openChat = async (sellerId) => {
    const res = await createConversation({
      receiverId: sellerId,
    });
    navigate(`/chat/${res.data._id}`);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Sellers
      </h1>

      {sellers.length === 0 && (
        <p className="text-gray-500">
          No sellers found
        </p>
      )}

      {sellers.map((s) => (
        <div
          key={s._id}
          onClick={() => openChat(s._id)}
          className="bg-white p-4 rounded shadow mb-3 cursor-pointer"
        >
          <p className="font-semibold">
            {s.shopName || s.name}
          </p>
          <p className="text-sm text-gray-500">
            {s.email}
          </p>
        </div>
      ))}
    </div>
  );
}
