"use client";

import React, { useState, useEffect } from "react";
import feather from "feather-icons";
import CustomFooter from "@/components/customFooter";
import CustomNavbar from "@/components/navBar";
import SubmitWordForm from "@/components/submitWordForm";
import RoleGuard from "@/utils/RoleGuard";

export default function SubmitWordPage() {
  const [status, setStatus] = useState({ message: "", type: "" });

  useEffect(() => {
    // Replace icons only once when component mounts
    feather.replace();
  }, []); // Empty dependency array ensures this runs only once

  return (
    <RoleGuard allowedRoles={["admin", "super_admin", "moderator", "creator"]}>
      <div>
        <CustomNavbar />

        <main className="container mx-auto px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-md p-8">
              <SubmitWordForm setStatus={setStatus} />

              {status.message && (
                <p
                  className={`mt-4 p-3 rounded-lg text-sm font-medium ${
                    status.type === "success"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {status.message}
                </p>
              )}
            </div>

            <div className="mt-8 bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  {/* Use a regular SVG or icon component instead of data-feather */}
                  <svg 
                    className="h-5 w-5 text-blue-400" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">
                    Submission Guidelines
                  </h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <ul className="list-disc pl-5 space-y-1">
                      <li>The word must be genuinely used in Nigerian contexts.</li>
                      <li>Provide accurate meanings and examples.</li>
                      <li>All submissions are reviewed before publishing.</li>
                      <li>
                        By submitting, you agree to our{" "}
                        <a href="/terms" className="text-red-600 hover:underline">
                          Terms of Use
                        </a>.
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