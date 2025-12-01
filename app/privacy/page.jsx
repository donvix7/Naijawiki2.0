"use client";

import React from "react";
import CustomNavbar from "@/components/navBar";
import CustomFooter from "@/components/customFooter";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <CustomNavbar />

      <main className="flex-grow">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Header Section */}
            <div className="text-center mb-10">
              <h1 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
                Privacy Policy
              </h1>
              <p className="text-gray-600 text-base font-normal">
                How we protect and handle your personal information
              </p>
            </div>

            {/* Introduction Section */}
            <section className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Introduction</h2>
              <p className="text-gray-700 text-base leading-relaxed">
                We respect your privacy and are committed to protecting your personal data. This
                Privacy Policy explains how we collect, use, store, and disclose information when you
                use our website.
              </p>
            </section>

            {/* Information Collection Section */}
            <section className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Information We Collect</h2>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-base">Personal information you provide (name, email address, contact details)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-base">Usage data collected automatically (IP address, browser type, pages visited)</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-base">Cookies and similar tracking technologies</span>
                </li>
              </ul>
            </section>

            {/* Information Usage Section */}
            <section className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">How We Use Your Information</h2>
              <p className="text-gray-700 text-base leading-relaxed">
                We use collected information to operate and improve the website, respond to inquiries,
                send updates, and personalize your experience. We do not sell your personal data to
                third parties.
              </p>
            </section>

            {/* Cookies Section */}
            <section className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Cookies</h2>
              <p className="text-gray-700 text-base leading-relaxed">
                Cookies help us provide a better user experience. You can disable cookies via your
                browser settings, but some features of the site may not function properly.
              </p>
            </section>

            {/* Data Security Section */}
            <section className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Security</h2>
              <p className="text-gray-700 text-base leading-relaxed">
                We implement reasonable measures to protect your information from unauthorized access,
                alteration, disclosure, or destruction. However, no method of transmission over the
                internet is completely secure.
              </p>
            </section>

            {/* Third-Party Links Section */}
            <section className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Third-Party Links</h2>
              <p className="text-gray-700 text-base leading-relaxed">
                Our site may contain links to third-party websites. We are not responsible for the
                privacy practices of those sites. Please review their privacy policies separately.
              </p>
            </section>

            {/* Policy Changes Section */}
            <section className="mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Changes to This Policy</h2>
              <p className="text-gray-700 text-base leading-relaxed">
                We may update this Privacy Policy periodically. The revised policy will be posted on
                this page with an updated effective date.
              </p>
            </section>

            {/* Contact Section */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-700 text-base leading-relaxed">
                If you have questions or concerns about this policy, please contact us at the email
                address provided on the website.
              </p>
            </section>
          </div>
        </div>
      </main>

      <CustomFooter />
    </div>
  );
}