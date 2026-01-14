import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/api";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState({});

  // Load wishlist items
  const loadWishlist = async () => {
    try {
      const res = await API.get("/wishlist");
      setWishlist(res.data.items || []);
    } catch (err) {
      console.error("Failed to load wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, []);

  // Add item to cart
  const addToCart = async (productId) => {
    try {
      setCartLoading((prev) => ({ ...prev, [productId]: true }));

      await API.post("/cart/add", {
        productId,
        qty: 1,
      });

      alert("Item added to cart!");
    } catch (err) {
      console.error("Add to cart failed:", err);
      alert("Please login to add to cart!");
    } finally {
      setCartLoading((prev) => ({ ...prev, [productId]: false }));
    }
  };

  // Remove from wishlist
  const removeFromWishlist = async (productId) => {
    try {
      await API.delete(`/wishlist/${productId}`);
      loadWishlist();
    } catch (err) {
      console.error("Failed to remove from wishlist:", err);
    }
  };

  if (loading)
    return <p className="text-center p-6 text-gray-600">Loading wishlist...</p>;

  if (!wishlist.length)
    return (
      <div className="min-h-screen bg-green-50 p-6">
        <h1 className="text-3xl font-bold text-green-800 mb-6">
          My Wishlist ❤️🌿
        </h1>

        <div className="bg-white rounded-xl shadow p-8 text-center">
          <p className="text-gray-600 text-lg">Your wishlist is empty 🌱</p>
          <Link
            to="/browse"
            className="inline-block mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
          >
            Browse Plants
          </Link>
        </div>
      </div>
    );
return (
  <div className="min-h-screen bg-green-50 p-6">

    {/* HEADER */}
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-green-800">My Wishlist ❤️</h1>

      <Link
        to="/browse"
        className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700"
      >
        Browse Plants
      </Link>
    </div>

    {/* TABLE */}
    <div className="bg-white rounded-xl shadow overflow-x-auto">
      <table className="w-full text-left border-collapse">
        
        {/* TABLE HEAD */}
        <thead>
          <tr className="border-b bg-green-100 text-gray-700">
            <th className="py-3 px-4">Delete</th>
            <th className="py-3 px-4">Image</th>
            <th className="py-3 px-4">Product</th>
            <th className="py-3 px-4">Price</th>
            <th className="py-3 px-4">Stock Status</th>
            <th className="py-3 px-4">Add To Cart</th>
          </tr>
        </thead>

        {/* TABLE BODY */}
        <tbody>
          {wishlist
  .filter(item => item.product) // ✅ IMPORTANT
  .map(({ product }) =>(
            <tr
              key={product._id}
              className="border-b hover:bg-green-50 transition"
            >
              {/* DELETE */}
              <td className="py-4 px-4 text-red-500 text-lg cursor-pointer"
                  onClick={() => removeFromWishlist(product._id)}>
                ✖
              </td>

              {/* IMAGE */}
              <td className="py-3 px-4">
                <img
                  src={product.images?.[0]}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded border"
                />
              </td>

              {/* PRODUCT NAME */}
              <td className="py-4 px-4 font-medium text-gray-800">
                {product.name}
              </td>

              {/* PRICE */}
              <td className="py-4 px-4 font-semibold text-green-700">
                ₹{product.price}
              </td>

              {/* STOCK */}
           {/* STOCK */}
            <td className="py-4 px-4">
              {product.stock > 0 ? (
                <span className="text-green-700 font-medium">
                  {product.stock} in stock
                </span>
              ) : (
                <span className="text-red-500 font-medium">Out of Stock</span>
              )}
            </td>


              {/* ADD TO CART */}
              <td className="py-4 px-4">
                <button
                    onClick={() => addToCart(product._id)}
                    disabled={cartLoading[product._id] || product.stock <= 0}
                    className={`px-4 py-2 rounded text-white font-medium transition 
                      ${
                        product.stock <= 0
                          ? "bg-gray-400 cursor-not-allowed"
                          : cartLoading[product._id]
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                  >
                    {product.stock <= 0
                      ? "Unavailable"
                      : cartLoading[product._id]
                      ? "Adding..."
                      : "Add To Cart"}
                  </button>

              </td>
            </tr>
          ))}
        </tbody>

      </table>
    </div>
  </div>
);



}
