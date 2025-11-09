"use client";

import React, { useState } from "react";
import CustomFooter from "@/components/customFooter";
import CustomNavbar from "@/components/navBar";

const Volunteer = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    languages: "",
    roles: [],
    motivation: "",
  });

  const [status, setStatus] = useState({ loading: false, message: "" });

  const handleChange = (e) => {
    const { name, value, type, selectedOptions } = e.target;
    if (type === "select-multiple") {
      const values = Array.from(selectedOptions, (option) => option.value);
      setFormData((prev) => ({ ...prev, [name]: values }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, message: "" });

    try {
      const res = await fetch("https://api.naijiwiki.org/volunteers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Submission failed");

      setStatus({ loading: false, message: "✅ Application submitted successfully!" });
      setFormData({
        name: "",
        email: "",
        phone: "",
        languages: "",
        roles: [],
        motivation: "",
      });
    } catch (error) {
      setStatus({ loading: false, message: "❌ Something went wrong. Please try again." });
    }
  };

  return (
    <div>
      <CustomNavbar />

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-secondary mb-8 text-center">
            Volunteer With Us
          </h1>

          <div className="bg-white rounded-xl shadow-md p-8 mb-8">
            <h2 className="text-2xl font-bold text-secondary mb-6">
              Help Preserve Nigerian Languages
            </h2>
            <p className="text-gray-700 mb-6">
              NaijaLingo relies on volunteers to help document, verify, and expand our collection of
              Nigerian words and phrases. Join our team of language enthusiasts!
            </p>

            <h3 className="text-xl font-bold text-secondary mb-4">Volunteer Roles</h3>
            <div className="space-y-4 mb-8">
              <div className="border-l-4 border-primary pl-4 py-2">
                <h4 className="font-bold">Language Contributor</h4>
                <p className="text-gray-600 text-sm">
                  Add new words and meanings from your native language
                </p>
              </div>
              <div className="border-l-4 border-secondary pl-4 py-2">
                <h4 className="font-bold">Content Moderator</h4>
                <p className="text-gray-600 text-sm">Review and verify submissions for accuracy</p>
              </div>
              <div className="border-l-4 border-accent pl-4 py-2">
                <h4 className="font-bold">Translation Specialist</h4>
                <p className="text-gray-600 text-sm">Help translate content between languages</p>
              </div>
            </div>

            <h3 className="text-xl font-bold text-secondary mb-4">Volunteer Application</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name*</label>
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Languages You Speak*
                </label>
                <textarea
                  name="languages"
                  required
                  value={formData.languages}
                  onChange={handleChange}
                  placeholder="List all Nigerian languages you're fluent in"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Volunteer Role(s) Interested In*
                </label>
                <select
                  name="roles"
                  multiple
                  required
                  value={formData.roles}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                >
                  <option>Language Contributor</option>
                  <option>Content Moderator</option>
                  <option>Translation Specialist</option>
                  <option>Community Outreach</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Why do you want to volunteer with us?*
                </label>
                <textarea
                  name="motivation"
                  required
                  rows="4"
                  value={formData.motivation}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                />
              </div>

              <button
                type="submit"
                disabled={status.loading}
                className="w-full bg-primary hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                {status.loading ? "Submitting..." : "Submit Application"}
              </button>

              {status.message && (
                <p
                  className={`text-center mt-4 ${
                    status.message.startsWith("✅") ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {status.message}
                </p>
              )}
            </form>
          </div>
        </div>
      </main>

      <CustomFooter />
    </div>
  );
};

export default Volunteer;
