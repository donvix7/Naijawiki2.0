"use client";

import React from "react";
import CustomNavbar from "@/components/navBar";
import CustomFooter from "@/components/customFooter";
import { ArrowRight } from "lucide-react";

export default function Donate() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <CustomNavbar />

      <main className="flex-grow">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-3xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-10">
              <h1 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
                Support Our Project
              </h1>
              <p className="text-gray-600 text-base font-normal">
                Help us preserve Nigerian languages for future generations
              </p>
            </div>

            {/* Introduction Section */}
            <section className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <p className="text-gray-700 text-base leading-relaxed mb-4">
                Your support helps us maintain and improve this platform. Donations go into hosting,
                development, security improvements, and new features. Every contribution makes a
                difference.
              </p>
              <p className="text-gray-700 text-base leading-relaxed">
                If you find value in our work, consider supporting us using any of the methods below.
              </p>
            </section>

            {/* Donation Methods Section */}
            <section className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Donation Methods</h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-base">Bank Transfer</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-base">Credit / Debit Card</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-base">Crypto Payment (BTC, ETH, USDT)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-base">Mobile Money / Fintech Wallets</span>
                </li>
              </ul>
            </section>

            {/* Donation Action Section */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Make a Donation</h2>
              <p className="text-gray-700 text-base leading-relaxed mb-6">
                Click the button below to proceed to our secure donation page.
              </p>

              <button
                className="flex items-center gap-3 bg-yellow-500 hover:bg-yellow-500-dark text-white font-semibold px-6 py-3.5 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 text-base"
              >
                Donate Now <ArrowRight size={16} />
              </button>
            </section>
          </div>
        </div>
      </main>

      <CustomFooter />
    </div>
  );
}