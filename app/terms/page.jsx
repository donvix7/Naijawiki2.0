"use client";

import React from "react";
import CustomNavbar from "@/components/navBar";
import CustomFooter from "@/components/customFooter";

export default function TermsOfUse() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800 font-inter">
      <CustomNavbar />

      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-6 text-gray-900">Terms of Use</h1>

        <section className="mb-10 bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">1. Acceptance of Terms</h2>
          <p className="leading-relaxed text-gray-700">
            By accessing and using this website, you agree to comply with these Terms of Use and
            all applicable laws and regulations. If you do not agree with any part of these terms,
            you are prohibited from using this platform.
          </p>
        </section>

        <section className="mb-10 bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">2. Use License</h2>
          <p className="leading-relaxed text-gray-700 mb-3">
            Permission is granted to temporarily download one copy of any content for personal,
            non-commercial viewing only. Under this license, you may not:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Modify or copy the content</li>
            <li>Use the content for commercial purposes</li>
            <li>Attempt to reverse-engineer any system or software on this website</li>
            <li>Remove copyright or ownership notices</li>
          </ul>
        </section>

        <section className="mb-10 bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">3. Disclaimer</h2>
          <p className="leading-relaxed text-gray-700">
            All materials on this website are provided "as is". We make no warranties, expressed or
            implied, and hereby disclaim all responsibility concerning accuracy, reliability, or
            suitability of the content.
          </p>
        </section>

        <section className="mb-10 bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">4. Limitations</h2>
          <p className="leading-relaxed text-gray-700">
            In no event shall the website owners or developers be liable for any damages arising out
            of the use or inability to use the materials on this platform.
          </p>
        </section>

        <section className="mb-10 bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">5. Revisions and Updates</h2>
          <p className="leading-relaxed text-gray-700">
            We may revise these Terms of Use at any time without prior notice. By using this
            website, you agree to be bound by the latest version of these terms.
          </p>
        </section>

        <section className="mb-10 bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900">6. Governing Law</h2>
          <p className="leading-relaxed text-gray-700">
            These terms are governed by applicable local and international laws, without regard to
            conflict-of-law principles.
          </p>
        </section>
      </main>

      <CustomFooter />
    </div>
  );
}
