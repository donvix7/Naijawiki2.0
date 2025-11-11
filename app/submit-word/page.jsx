"use client";

import React, { useState } from "react";
import CustomFooter from "@/components/customFooter";
import CustomNavbar from "@/components/navBar";
import SubmitWordForm from "@/components/submitWordForm";
import RoleGuard from "@/utils/RoleGuard";

export default function SubmitWordPage() {
  const [status, setStatus] = useState({ loading: false, message: "" });

  const handleFormSubmit = async (formData) => {
    setStatus({ loading: true, message: "" });
    try {
      const res = await fetch("https://api.naijiwiki.org/words", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Submission failed");

      setStatus({
        loading: false,
        message: "Thank you! Your word has been submitted for review.",
      });
    } catch (error) {
      setStatus({
        loading: false,
        message: "Something went wrong. Please try again.",
      });
    }
  };

  return (
      <RoleGuard allowedRoles={["admin", "super_admin", "moderator", "creator"]}>
    <div>
      
      <CustomNavbar />

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            {/* Optional header text could go here */}
          </div>

          <div className="bg-white rounded-xl shadow-md overflow-hidden p-8">
            <SubmitWordForm onSubmit={handleFormSubmit} submitting={status.loading} />
            {status.message && (
              <p
                className={`mt-4 text-center ${
                  status.message.startsWith("✅") ? "text-green-600" : "text-red-600"
                }`}
              >
                {status.message}
              </p>
            )}
          </div>

          <div className="mt-8 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <i data-feather="info" className="h-5 w-5 text-blue-400"></i>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Submission Guidelines</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Please ensure the word is genuinely used in Nigerian contexts</li>
                    <li>Provide accurate meanings and examples</li>
                    <li>All submissions will be reviewed before publishing</li>
                    <li>
                      By submitting, you agree to our{" "}
                      <a href="/terms" className="text-blue-600 hover:underline">
                        Terms of Use
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <CustomFooter />
    </div>

          </RoleGuard>
      
  );
}
