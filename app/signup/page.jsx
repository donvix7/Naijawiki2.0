"use client";

import React, { useState, useEffect } from "react";
import CustomFooter from "@/components/customFooter";
import CustomNavbar from "@/components/navBar";
import feather from "feather-icons";
import { useRouter } from "next/navigation";
import getBaseUrl from "../api/baseUrl";

export default function RegisterPage() {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [status, setStatus] = useState({ message: "", type: "" });
  const [loading, setLoading] = useState(false);
  const base_url = getBaseUrl();

  const router = useRouter();
  useEffect(() => {
    feather.replace();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    // Trim spaces
    const trimmedEmail = email.trim();
    const trimmedFirst = firstname.trim();
    const trimmedLast = lastname.trim();

    if (!trimmedFirst || !trimmedLast || !trimmedEmail) {
      setStatus({ message: "Please fill in all required fields.", type: "error" });
      return;
    }

    if (password.length < 8) {
      setStatus({ message: "Password must be at least 8 characters.", type: "error" });
      return;
    }

    if (password !== confirm) {
      setStatus({ message: "Passwords do not match.", type: "error" });
      return;
    }

    setLoading(true);
    setStatus({ message: "", type: "" });

    try {
      const res = await fetch(`${base_url}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstname: trimmedFirst,
          lastname: trimmedLast,
          email: trimmedEmail,
          password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus({
          message: data.message || "Registration failed. Please try again.",
          type: "error",
        });
      } else {
        setStatus({
          message: "Account created successfully!",
          type: "success",
        });
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setConfirm("");

        // Redirect to login page after successful registration
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setStatus({
        message: "Something went wrong. Please try again later.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <CustomNavbar />

      <main className="flex-grow flex items-center justify-center py-16 px-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden p-10">
          {/* Header Section */}
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 tracking-tight">
              Create Account
            </h1>
            <p className="text-gray-600 text-base font-normal leading-relaxed">
              Join our community of language enthusiasts
            </p>
          </div>

          {/* Status Message */}
          {status.message && (
            <div
              className={`mb-6 p-4 rounded-lg text-center text-sm font-medium ${
                status.type === "success" 
                  ? "bg-green-50 text-green-700 border border-green-200" 
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {status.message}
            </div>
          )}

          <form className="space-y-7" onSubmit={handleSubmit}>
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label
                  htmlFor="first-name"
                  className="block text-sm font-semibold text-gray-800 mb-3 tracking-wide uppercase text-xs"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="first-name"
                  required
                  value={firstname}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 font-normal text-base placeholder-gray-500 transition-all duration-200"
                  placeholder="John"
                />
              </div>
              <div>
                <label
                  htmlFor="last-name"
                  className="block text-sm font-semibold text-gray-800 mb-3 tracking-wide uppercase text-xs"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="last-name"
                  required
                  value={lastname}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 font-normal text-base placeholder-gray-500 transition-all duration-200"
                  placeholder="Doe"
                />
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-800 mb-3 tracking-wide uppercase text-xs"
                >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 font-normal text-base placeholder-gray-500 transition-all duration-200"
                placeholder="your@email.com"
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-800 mb-3 tracking-wide uppercase text-xs"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 font-normal text-base placeholder-gray-500 transition-all duration-200"
                placeholder="Enter your password"
              />
              <p className="mt-2 text-xs text-gray-500 font-normal">
                Must be at least 8 characters
              </p>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirm-password"
                className="block text-sm font-semibold text-gray-800 mb-3 tracking-wide uppercase text-xs"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirm-password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 font-normal text-base placeholder-gray-500 transition-all duration-200"
                placeholder="Confirm your password"
              />
            </div>

            {/* Terms Agreement */}
            <div className="flex items-start">
              <div className="flex items-center h-5 mt-0.5">
                <input
                  id="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-yellow-500 focus:ring-2 focus:ring-yellow-500 border border-gray-300 rounded"
                />
              </div>
              <div className="ml-3">
                <label htmlFor="terms" className="text-sm font-normal text-gray-700 leading-relaxed">
                  I agree to the{" "}
                  <a href="/terms" className="font-semibold text-yellow-500 hover:underline transition-colors">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="/privacy" className="font-semibold text-yellow-500 hover:underline transition-colors">
                    Privacy Policy
                  </a>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-yellow-500 to-black hover:from-black hover:to-yellow-500 text-white font-semibold text-base py-3.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </button>

            {/* Login Link */}
            <div className="text-center text-sm font-normal text-gray-600 pt-6 border-t border-gray-200">
              Already have an account?{" "}
              <a href="/login" className="font-semibold text-yellow-500 hover:underline transition-colors">
                Sign in
              </a>
            </div>
          </form>
        </div>
      </main>

      <CustomFooter />
    </div>
  );
}