import { useEffect, useState } from "react";
import { getSellerNotifications } from "../../api/api";

export default function SellerNotifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    getSellerNotifications().then((res) => setNotifications(res.data));
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>

      {notifications.map((n) => (
        <div key={n._id} className="bg-white p-4 shadow mb-2">
          <h3 className="font-bold">{n.title}</h3>
          <p>{n.message}</p>
        </div>
      ))}
    </div>
  );
}
