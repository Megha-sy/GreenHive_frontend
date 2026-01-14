import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { payNow } from "../../utils/razorpayPayment";
import API from "../../api/api";

function Payment() {
  const navigate = useNavigate();
  const [method, setMethod] = useState("COD");
  const [loading, setLoading] = useState(false);

  /* ===============================
     CASH ON DELIVERY
  ================================ */
  const handleCOD = async () => {
    try {
      setLoading(true);

      await API.post("/orders", {
        payment: {
          method: "cod",
          status: "unpaid",
        },
      });

      navigate("/orders");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     ONLINE PAYMENT
  ================================ */
  const handleOnlinePayment = () => {
    payNow({
      onSuccess: () => {
        navigate("/orders");
      },
      onFailure: () => {
        alert("Payment failed");
      },
    });
  };

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <h1 className="text-2xl font-bold mb-6 text-green-800">
        Choose Payment Method
      </h1>

      <div className="bg-white max-w-md mx-auto p-6 rounded-xl shadow">
        <label className="flex items-center gap-2 mb-3">
          <input
            type="radio"
            checked={method === "COD"}
            onChange={() => setMethod("COD")}
          />
          Cash on Delivery
        </label>

        <label className="flex items-center gap-2 mb-6">
          <input
            type="radio"
            checked={method === "ONLINE"}
            onChange={() => setMethod("ONLINE")}
          />
          Online Payment
        </label>

        {method === "COD" ? (
          <button
            onClick={handleCOD}
            disabled={loading}
            className="w-full bg-yellow-500 text-white py-2 rounded"
          >
            {loading ? "Placing Order..." : "Place Order (COD)"}
          </button>
        ) : (
          <button
            onClick={handleOnlinePayment}
            className="w-full bg-green-600 text-white py-2 rounded"
          >
            Pay Online
          </button>
        )}
      </div>
    </div>
  );
}

export default Payment; // ✅ THIS LINE FIXES THE ERROR
