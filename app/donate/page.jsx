"use client";

import React from "react";
import CustomNavbar from "@/components/navBar";
import CustomFooter from "@/components/customFooter";
import { ArrowRight } from "lucide-react";

export default function Donate() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800 font-inter">
      <CustomNavbar />

      <main className="flex-1 w-full max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-6 text-gray-900">Support Our Project</h1>

        <section className="mb-10 bg-white p-6 rounded-2xl shadow-md">
          <p className="leading-relaxed text-gray-700 mb-4">
            Your support helps us maintain and improve this platform. Donations go into hosting,
            development, security improvements, and new features. Every contribution makes a
            difference.
          </p>
          <p className="leading-relaxed text-gray-700">
            If you find value in our work, consider supporting us using any of the methods below.
          </p>
        </section>

        <section className="mb-10 bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Donation Methods</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Bank Transfer</li>
            <li>Credit / Debit Card</li>
            <li>Crypto Payment (BTC, ETH, USDT)</li>
            <li>Mobile Money / Fintech Wallets</li>
          </ul>
        </section>

        <section className="mb-10 bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">Make a Donation</h2>
          <p className="leading-relaxed text-gray-700 mb-4">
            Click the button below to proceed to our secure donation page.
          </p>

          <button
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-xl shadow transition-all"
          >
            Donate Now <ArrowRight size={18} />
          </button>
        </section>
      </main>

      <CustomFooter />
    </div>
  );
}