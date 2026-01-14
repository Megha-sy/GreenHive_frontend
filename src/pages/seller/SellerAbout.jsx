import React from "react";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { Link } from "react-router-dom";

export default function SellerAbout() {
  return (
    <div className="min-h-screen flex flex-col bg-green-50">

      {/* ✅ MAIN CONTENT */}
      <main className="flex-1">

        {/* 🌿 HERO SECTION */}
        <section className="relative h-[420px] bg-green-900 flex items-center justify-center text-center">
          <div className="max-w-4xl px-6 text-white">
            <h1 className="text-5xl font-extrabold mb-6">
              Grow Your Business with <span className="text-green-400">GreenHive</span>
            </h1>
            <p className="text-xl text-green-100">
              Empowering plant sellers with technology, reach, and trust.
            </p>
          </div>
        </section>

        {/* 🌱 WHO WE ARE */}
        <section className="py-20 bg-[#E8FFCE]">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center px-8">
            <div>
              <h2 className="text-4xl font-extrabold text-green-900 mb-6">
                Who We Are
              </h2>
              <p className="text-lg text-green-900/80 leading-relaxed mb-6">
                GreenHive is a digital marketplace built exclusively for plant
                sellers, nurseries, and gardening professionals. Our goal is to
                help you scale your business while staying rooted in nature.
              </p>
              <p className="text-lg text-green-900/80 leading-relaxed">
                From order management to AI-powered plant care insights, we
                provide everything you need to succeed online.
              </p>
            </div>

            <div>
              <img
                src="/seller-about.jpg"
                alt="Seller growth"
                className="rounded-xl shadow-xl w-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* 🌿 WHY SELL WITH US */}
        <section className="py-20 bg-white">
          <h2 className="text-3xl font-bold text-center mb-14 text-green-900">
            Why Sell on GreenHive?
          </h2>

          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-10 px-6">
            {[
              {
                title: "Wider Reach",
                desc: "Connect with thousands of plant lovers across the country.",
              },
              {
                title: "Smart Tools",
                desc: "Track sales, revenue, promotions, and inventory easily.",
              },
              {
                title: "Trusted Platform",
                desc: "Secure payments, verified buyers, and reliable delivery flow.",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-green-50 rounded-xl p-8 shadow hover:shadow-xl transition"
              >
                <h3 className="text-xl font-bold mb-3 text-green-800">
                  {item.title}
                </h3>
                <p className="text-green-700">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 🌱 FUTURE VISION (THEORY SECTION STYLE) */}
        <section className="py-20 bg-[#E8FFCE]">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center px-8">
            <div>
              <h2 className="text-4xl font-extrabold text-green-900 mb-6">
                Future is Nature
              </h2>
              <p className="text-lg text-green-900/80 leading-relaxed mb-8">
                We believe sustainability and technology must grow together.
                GreenHive continuously improves seller tools, analytics, and
                AI-driven plant insights to help your business thrive long-term.
              </p>
            </div>

            <div>
              <img
                src="/future-nature.jpg"
                alt="Green future"
                className="rounded-lg shadow-xl w-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* 🌿 CTA SECTION */}
        <section className="bg-green-900 py-20 text-center px-6">
          <h2 className="text-4xl md:text-5xl font-extrabold text-yellow-400 mb-6">
            Ready to Grow with Us?
          </h2>

          <p className="max-w-3xl mx-auto text-lg text-yellow-200 mb-10">
            Join GreenHive today and turn your passion for plants into a
            thriving digital business.
          </p>

          <Link
            to="/register"
            className="inline-block bg-yellow-400 text-green-900 px-10 py-4 rounded-xl font-bold text-lg shadow-lg hover:bg-yellow-300 transition"
          >
            Become a Seller 🌱
          </Link>
        </section>
      </main>

    </div>
  );
}
