import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../../api/api"; // axios instance

export default function ProductDetails() {
  const { id } = useParams();
  const [qty, setQty] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch product from backend
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error("Failed to fetch product", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const increaseQty = () => setQty(qty + 1);
  const decreaseQty = () => qty > 1 && setQty(qty - 1);

  // 🛒 Add to Cart
  const addToCart = () => {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];

    const existing = cart.find((item) => item.productId === id);

    if (existing) {
      existing.qty += qty;
    } else {
      cart.push({
        productId: id,
        name: product.name,
        price: product.price,
        image: product.images?.[0],
        qty,
      });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert("Added to cart!");
  };

  // ⏳ Loading
  if (loading) {
    return <p className="text-center p-6">Loading product...</p>;
  }

  if (!product) {
    return (
      <p className="text-center text-red-600 p-6">
        Product not found!
      </p>
    );
  }

  // 🌱 Care instructions
  const care = [
    "Water every 3-4 days",
    "Keep in indirect sunlight",
    "Use well-drained soil",
    "Wipe leaves weekly",
  ];

  return (
    <div className="min-h-screen bg-green-50 p-6">
      {/* BACK LINK */}
      <Link
        to="/browse"
        className="text-green-700 font-semibold mb-4 inline-block"
      >
        ← Back to Browse
      </Link>

      {/* MAIN GRID (NARROW WIDTH + CENTERED) */}
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-6 grid md:grid-cols-2 gap-8">
        
        {/* IMAGE */}
        <div>
          <img
            src={product.images?.[0] || "https://via.placeholder.com/500"}
            alt={product.name}
            className="w-full h-[400px] object-cover rounded-lg"
          />
        </div>

        {/* DETAILS */}
        <div>
          <h1 className="text-3xl font-bold text-green-800">
            {product.name}
          </h1>

          <p className="text-gray-600 mt-2">
            {product.description}
          </p>

          <div className="mt-4 flex items-center gap-4">
            <span className="text-2xl font-bold text-green-700">
              ₹{product.price}
            </span>
           <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
  {product.category?.name}
</span>

          </div>

          {/* QUANTITY */}
          <div className="mt-6 flex items-center gap-4">
            <span className="font-semibold">Quantity:</span>
            <div className="flex items-center border rounded-lg">
              <button
                onClick={decreaseQty}
                className="px-3 py-1 text-lg font-bold"
              >
                −
              </button>
              <span className="px-4 font-semibold">{qty}</span>
              <button
                onClick={increaseQty}
                className="px-3 py-1 text-lg font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="mt-6 flex gap-4">
            <button 
              className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700"
              onClick={addToCart}
            >
              Add to Cart
            </button>

            <button className="border border-green-600 text-green-700 px-6 py-2 rounded-lg font-semibold hover:bg-green-50">
              ❤️ Wishlist
            </button>
          </div>

          {/* SELLER INFO */}
          <div className="mt-8 border-t pt-4">
        <h3 className="text-lg font-bold text-gray-800">
          Seller Information
        </h3>

        <p className="text-gray-700 mt-1">
          👤 {product.seller?.name}
        </p>

        {product.seller?.shopName && (
          <p className="text-gray-600">
            🏪 {product.seller.shopName}
          </p>
        )}
      </div>

        </div>
      </div>

      {/* PLANT CARE SECTION */}
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-6 mt-8">
        <h2 className="text-2xl font-bold text-green-800 mb-4">
          Plant Care Instructions 🌱
        </h2>

        <ul className="grid md:grid-cols-2 gap-4 list-disc list-inside text-gray-700">
          {care.map((tip, index) => (
            <li key={index}>{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
