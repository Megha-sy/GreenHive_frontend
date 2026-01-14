import UserSellerList from "./UserSellerList";
import SellerUserList from "./SellerUserList";

export default function ChatEntry() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return null;

  if (user.role === "user") {
    return <UserSellerList />;
  }

  if (user.role === "seller") {
    return <SellerUserList />;
  }

  return <p>No chat access</p>;
}
