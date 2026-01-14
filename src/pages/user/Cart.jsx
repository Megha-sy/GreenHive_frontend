import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/api";

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Load cart from backend
  const loadCart = async () => {
    try {
      const res = await API.get("/cart");
      setCart(res.data);
    } catch (err) {
      console.error("Failed to load cart:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  // ✅ Increase qty
  const increaseQty = async (productId, currentQty, stock) => {
    if (currentQty >= stock) return;
    await API.put(`/cart/item/${productId}`, { qty: currentQty + 1 });
    loadCart();
  };

  // ✅ Decrease qty
  const decreaseQty = async (productId, currentQty) => {
    if (currentQty <= 1) return;
    await API.put(`/cart/item/${productId}`, { qty: currentQty - 1 });
    loadCart();
  };

  // ✅ Remove single item
  const removeItem = async (productId) => {
    await API.delete(`/cart/item/${productId}`);
    loadCart();
  };

  // ✅ CLEAR CART
  const clearCart = async () => {
    await API.delete("/cart/clear");
    loadCart();
  };

  if (loading) return <p className="p-6 text-center">Loading cart...</p>;

  if (!cart || cart.items.length === 0)
    return (
      <div className="min-h-screen bg-green-50 p-6">
        <h1 className="text-3xl font-bold text-green-800 mb-6">My Cart 🛒</h1>
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <p className="text-gray-600 text-lg">Your cart is empty 🌱</p>
          <Link
            to="/browse"
            className="inline-block mt-4 bg-green-600 text-white px-6 py-2 rounded-lg"
          >
            Browse Plants
          </Link>
        </div>
      </div>
    );

  const cartItems = cart.items;
  const subtotal = cartItems.reduce(
    (total, item) => total + item.product.price * item.qty,
    0
  );

return (
  <div className="min-h-screen bg-green-50 p-6">

    {/* PAGE TITLE */}
    <h1 className="text-3xl font-bold text-green-800 mb-6">
      Shopping Cart 🛒
    </h1>

    <div className="grid md:grid-cols-3 gap-8">

      {/* LEFT SIDE – CART ITEMS */}
      <div className="md:col-span-2">
        <div className="bg-white rounded-2xl shadow p-6">

          {/* TABLE HEAD */}
          <div className="grid grid-cols-4 text-gray-500 text-sm font-medium pb-3 border-b">
            <p className="col-span-2">Product</p>
            <p className="text-center">Quantity</p>
            <p className="text-right">Total</p>
          </div>

          {/* CART ITEMS */}
          {cartItems.map((item) => (
            <div
              key={item.product._id}
              className="grid grid-cols-4 items-center py-5 border-b hover:bg-green-50 transition"
            >
              {/* PRODUCT INFO */}
              <div className="col-span-2 flex items-center gap-4">
                <img
                  src={item.product.images?.[0]}
                  alt={item.product.name}
                  className="w-20 h-20 rounded-xl object-cover border"
                />
                <div>
                  <p className="text-lg font-semibold text-gray-800">
                    {item.product.name}
                  </p>
                  <p className="text-gray-500 text-sm">
                    ₹{item.product.price} each
                  </p>
                </div>
              </div>

              {/* QUANTITY SELECTOR */}
              <div className="flex justify-center">
                <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 shadow-sm">
                  <button
                    onClick={() =>
                      decreaseQty(item.product._id, item.qty)
                    }
                    className="px-3 text-xl font-bold"
                  >
                    −
                  </button>

                  <span className="px-4 text-lg font-semibold">
                    {item.qty}
                  </span>

                  <button
                    onClick={() =>
                      increaseQty(item.product._id, item.qty, item.product.stock)
                    }
                    className="px-3 text-xl font-bold"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* TOTAL PRICE + DELETE */}
              <div className="flex items-center justify-end gap-4">
                <p className="text-green-700 font-bold text-lg">
                  ₹{item.product.price * item.qty}
                </p>

                {/* DELETE ICON */}
                <button
                  onClick={() => removeItem(item.product._id)}
                  className="text-red-500 hover:text-red-700 text-xl"
                  title="Remove item"
                >
                  🗑
                </button>
              </div>
            </div>
          ))}

        </div>

        {/* CLEAR CART BUTTON */}
        <div className="flex justify-end mt-4">
          <button
            onClick={clearCart}
            className="px-6 py-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow"
          >
            Clear Cart
          </button>
        </div>
      </div>

      {/* RIGHT SIDE – ORDER SUMMARY */}
      <div>
        <div className="bg-white rounded-2xl shadow p-6">

          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Order Summary
          </h2>

          <div className="space-y-2 text-gray-700">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>₹40</span>
            </div>
          </div>

          <div className="border-t mt-4 pt-4 flex justify-between text-xl font-bold">
            <span>Total</span>
            <span>₹{subtotal + 40}</span>
          </div>

          <Link
            to="/payment"
            className="block mt-6 bg-green-700 text-white py-2 rounded-full text-center font-semibold hover:bg-green-800 shadow"
          >
            Checkout Now
          </Link>
        </div>
      </div>
    </div>
  </div>
);

}
