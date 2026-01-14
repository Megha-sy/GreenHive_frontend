import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFeaturedPlants, getOfferPlants } from "../../api/api";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

export default function Home() {
  // ✅ HERO SLIDER IMAGES
  const heroImages = ["/hero1.jpg", "/hero2.jpg", "/hero3.jpg"];

  const [currentSlide, setCurrentSlide] = useState(0);
const [featuredPlants, setFeaturedPlants] = useState([]);
const [offers, setOffers] = useState([]);

  // ✅ SERVICES DATA (✅ MUST BE OUTSIDE useEffect)
  const services = [
    {
      title: "Water Gardening",
      img: "/services/water-gardening.jpg",
    },
    {
      title: "Landscaping Design",
      img: "/services/landscaping.jpg",
    },
    {
      title: "Lawn Maintenance",
      img: "/services/lawn.jpg",
    },
  ];
  useEffect(() => {
  getFeaturedPlants().then((res) => setFeaturedPlants(res.data));
  getOfferPlants().then((res) => setOffers(res.data));
}, []);


  // ✅ HERO SLIDER AUTO PLAY (FIXED)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <div className="min-h-screen flex flex-col bg-green-50">

      {/* ✅ MAIN CONTENT */}
      <main className="flex-1">
        {/* ✅ HERO SLIDER SECTION */}
        <section className="relative h-[580px] overflow-hidden">
          <img
            src={heroImages[currentSlide]}
            alt="GreenHive"
            className="w-full h-full object-cover transition-all duration-700"
          />

          {/* ✅ DARK OVERLAY */}
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-center">
            <div className="max-w-3xl px-10 text-white">
              <h1 className="text-5xl md:text-6xl font-extrabold leading-tight tracking-wide drop-shadow-lg">
                Professional{" "}
                <span className="text-green-400">Gardening</span> & Plant Care
              </h1>

              <p className="mt-6 text-xl md:text-2xl font-medium text-gray-200 drop-shadow">
                Buy plants, detect diseases using AI, and get expert care tips.
              </p>

              <div className="mt-10 flex justify-center gap-6">
                <Link
                  to="/browse"
                  className="bg-green-500 hover:bg-green-600 px-8 py-4 rounded-xl text-lg font-bold shadow-lg transition"
                >
                  Browse Plants
                </Link>

                <Link
                  to="/ai-detect"
                  className="bg-white text-green-700 px-8 py-4 rounded-xl text-lg font-bold shadow-lg hover:bg-gray-100 transition"
                >
                  AI Plant Scan
                </Link>
              </div>
            </div>
          </div>

          {/* ✅ SLIDER DOTS */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
            {heroImages.map((_, i) => (
              <div
                key={i}
                onClick={() => setCurrentSlide(i)}
                className={`w-3 h-3 rounded-full cursor-pointer ${
                  currentSlide === i ? "bg-green-500" : "bg-white"
                }`}
              ></div>
            ))}
          </div>
        </section>

<section className="py-14 bg-white">
  <h2 className="text-3xl font-bold text-center mb-10 text-green-800">
    Best Offers
  </h2>

  {offers.length === 0 ? (
    <p className="text-center text-gray-500">No offers available</p>
  ) : (
    <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-6 px-6">
      {offers.map((plant) => {
        const discountedPrice = Math.round(
          plant.price - (plant.price * plant.discountPercent) / 100
        );

        return (
          <div
            key={plant._id}
            className="relative bg-green-50 rounded-xl shadow hover:shadow-xl transition overflow-hidden"
          >
            {/* 🔥 OFFER END DATE BANNER */}
            {plant.offerEndsAt && (
              <div className="absolute top-3 left-0 bg-red-600 text-white px-3 py-1 text-xs font-semibold rounded-r-full z-10">
                ⏰ Ends on{" "}
                {new Date(plant.offerEndsAt).toLocaleDateString()}
              </div>
            )}

            {/* 🌿 IMAGE */}
            <img
              src={plant.images?.[0] || "/placeholder.jpg"}
              alt={plant.name}
              className="h-60 w-full object-cover"
            />

            {/* 📄 CONTENT */}
            <div className="p-4">
              <h3 className="font-bold text-lg">{plant.name}</h3>

              <p className="text-sm line-through text-gray-500">
                ₹{plant.price}
              </p>

              <p className="text-xl font-bold text-green-700">
                ₹{discountedPrice}
                <span className="text-sm text-red-500 ml-2">
                  ({plant.discountPercent}% OFF)
                </span>
              </p>

              <Link
                to={`/product/${plant._id}`}
                className="inline-block mt-3 bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded text-sm transition"
              >
                View
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  )}
</section>

 
        {/* ✅ SERVICES SECTION */}
        <section className="py-16 bg-green-50">
          <h2 className="text-3xl font-bold text-center mb-10">
            We Provide the Best Services
          </h2>

          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-6">
            {services.map((item, i) => (
              <div
                key={i}
                className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition"
              >
                {/* ✅ IMAGE */}
                <img
                  src={item.img}
                  alt={item.title}
                  className="h-72 w-full object-cover"
                />

                <div className="p-5">
                  <h3 className="font-bold text-xl">{item.title}</h3>
                  <p className="text-gray-600 text-sm mt-2">
                    Professional maintenance for healthy green plants.
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

{/* 🌱 FUTURE IS NATURE SECTION */}
<section className="py-20 bg-[#E8FFCE]">
  <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center px-8">

    {/* LEFT CONTENT */}
    <div>
      <h2 className="text-4xl font-extrabold text-green-900 mb-6">
        Future is nature
      </h2>

      <p className="text-lg text-green-900/80 leading-relaxed mb-8">
        Our commitment to excellence drives us to continuously refine and
        improve plant.id API. We are always exploring ways to improve your
        experience and provide the best possible identification results.
      </p>

    </div>

    {/* RIGHT IMAGE */}
    <div>
      <img
        src="/future-nature.jpg"   // 👈 add this image in public folder
        alt="Plant research"
        className="rounded-lg shadow-xl w-full object-cover"
      />
    </div>

  </div>
</section>
{/* 🌿 CTA SECTION */}
<section className="bg-green-900 py-17 text-center px-6">
  <h2 className="text-4xl md:text-5xl font-extrabold text-yellow-400 mb-6">
    Let’s plant the next big success together!
  </h2>

  <p className="max-w-3xl mx-auto text-lg text-yellow-200 mb-10">
    Enhance your applications with our cutting-edge plant identification
    technology. Captivate your users and transform their experience with
    plant.id. Your journey starts now.
  </p>

    <div className="max-w-2xl mx-auto  mb-10" >
      <img
        src="/planttogether.jpg"   // 👈 add this image in public folder
        alt="Plant research"
        className="rounded-lg shadow-xl w-150 h-100 "
      />
    </div>
</section>

{/* 🌿 FEATURED PLANTS */}
<section className="py-16 bg-green-50">
  <h2 className="text-3xl font-bold text-center mb-10">
    Featured Plants
  </h2>

  {featuredPlants.length === 0 ? (
    <p className="text-center text-gray-500">
      No featured plants available
    </p>
  ) : (
    <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-6">
      {featuredPlants.map((plant) => (
        <div
          key={plant._id}
          className="relative bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden"
        >
          {/* 🔥 CARD BANNER */}
          <div className="absolute top-3 left-0 bg-red-500 text-white px-3 py-1 text-xs font-semibold rounded-r-full z-10 flex items-center gap-1">
            ⚡ Selling Out Fast
          </div>

          {/* 🌿 IMAGE */}
          <img
            src={plant.images?.[0] || "/placeholder.jpg"}
            alt={plant.name}
            className="h-48 w-full object-cover"
          />

          {/* 📄 CONTENT */}
          <div className="p-4">
            <h3 className="font-bold text-lg">{plant.name}</h3>

            <p className="text-sm text-gray-600 line-clamp-2">
              {plant.description || "Healthy, natural plant for your home."}
            </p>

            <div className="flex justify-between items-center mt-3">
              <span className="font-bold text-green-700">
                ₹{plant.price}
              </span>

              <Link
                to={`/product/${plant._id}`}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded text-sm transition"
              >
                View
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</section>



      </main>

    
    </div>
  );
}
