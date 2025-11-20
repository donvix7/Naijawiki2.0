"use client";

import React from "react";
import CustomNavbar from "@/components/navBar";
import CustomFooter from "@/components/customFooter";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800 font-inter">
      <CustomNavbar />

      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold mb-6 text-gray-900">Privacy Policy</h1>

        <section className="mb-8 bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold mb-3 text-gray-900">Introduction</h2>
          <p className="leading-relaxed text-gray-700">
            We respect your privacy and are committed to protecting your personal data. This
            Privacy Policy explains how we collect, use, store, and disclose information when you
            use our website.
          </p>
        </section>

        <section className="mb-8 bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold mb-3 text-gray-900">Information We Collect</h2>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Personal information you provide (name, email address, contact details)</li>
            <li>Usage data collected automatically (IP address, browser type, pages visited)</li>
            <li>Cookies and similar tracking technologies</li>
          </ul>
        </section>

        <section className="mb-8 bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold mb-3 text-gray-900">How We Use Your Information</h2>
          <p className="leading-relaxed text-gray-700">
            We use collected information to operate and improve the website, respond to inquiries,
            send updates, and personalize your experience. We do not sell your personal data to
            third parties.
          </p>
        </section>

        <section className="mb-8 bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold mb-3 text-gray-900">Cookies</h2>
          <p className="leading-relaxed text-gray-700">
            Cookies help us provide a better user experience. You can disable cookies via your
            browser settings, but some features of the site may not function properly.
          </p>
        </section>

        <section className="mb-8 bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold mb-3 text-gray-900">Data Security</h2>
          <p className="leading-relaxed text-gray-700">
            We implement reasonable measures to protect your information from unauthorized access,
            alteration, disclosure, or destruction. However, no method of transmission over the
            internet is completely secure.
          </p>
        </section>

        <section className="mb-8 bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold mb-3 text-gray-900">Third-Party Links</h2>
          <p className="leading-relaxed text-gray-700">
            Our site may contain links to third-party websites. We are not responsible for the
            privacy practices of those sites. Please review their privacy policies separately.
          </p>
        </section>

        <section className="mb-8 bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold mb-3 text-gray-900">Changes to This Policy</h2>
          <p className="leading-relaxed text-gray-700">
            We may update this Privacy Policy periodically. The revised policy will be posted on
            this page with an updated effective date.
          </p>
        </section>

        <section className="mb-8 bg-white p-6 rounded-2xl shadow-md">
          <h2 className="text-2xl font-semibold mb-3 text-gray-900">Contact Us</h2>
          <p className="leading-relaxed text-gray-700">
            If you have questions or concerns about this policy, please contact us at the email
            address provided on the website.
          </p>
        </section>
      </main>

      <CustomFooter />
    </div>
  );
}
