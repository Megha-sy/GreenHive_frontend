import API from "../api/api";

/* ===============================
   LOAD RAZORPAY SCRIPT
================================ */
const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true);

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

/* ===============================
   PAY NOW (ONLINE)
================================ */
export const  payNow = async ({ onSuccess, onFailure }) => {
  try {
    // 1️⃣ Load Razorpay
    const loaded = await loadRazorpay();
    if (!loaded) throw new Error("Razorpay SDK failed");

    // 2️⃣ Create Razorpay order (BACKEND calculates amount)
    const orderRes = await API.post("/payment/razorpay");
    const { orderId, amount } = orderRes.data;

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY,
      order_id: orderId,
      amount: amount * 100,
      currency: "INR",
      name: "GreenHive 🌱",
      description: "Plant Purchase",

      handler: async (response) => {
        try {
          // ✅ CREATE ORDER ONLY ONCE (HERE)
          await API.post("/orders", {
            payment: {
              method: "online",
              status: "paid",
              transactionId: response.razorpay_payment_id,
            },
          });

          onSuccess?.();
        } catch (err) {
          console.error("Order creation failed:", err);
          onFailure?.();
        }
      },
    };

    const razorpay = new window.Razorpay(options);

    razorpay.on("payment.failed", () => {
      onFailure?.();
    });

    razorpay.open();
  } catch (err) {
    console.error("Payment error:", err);
    onFailure?.();
  }
};
