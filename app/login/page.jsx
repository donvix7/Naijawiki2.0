"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import CustomNavbar from "@/components/navBar";
import CustomFooter from "@/components/customFooter";
import getBaseUrl from "../api/baseUrl";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const base_url = getBaseUrl();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${base_url}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("Login response:", data);

      if (!res.ok || !data?.token) {
        alert(data?.message || "Login failed. Please check your credentials.");
        setLoading(false);
        return;
      }

      // Store token, email, and role in cookies
      Cookies.set("token", data.token, { expires: 1, secure: true, sameSite: "strict" });
      Cookies.set("email", data.user?.email || "user", { expires: 1, secure: true, sameSite: "strict" });
      Cookies.set("role", data.user?.role || "user", { expires: 1, secure: true, sameSite: "strict" });
      Cookies.set("id", data.user?.id || "user", { expires: 1, secure: true, sameSite: "strict" });

      // Redirect based on role
      const role = data.user?.role;
      if (role === "admin" || role === "super_admin") {
        router.push("/admin/dashboard");
      } else if (role === "moderator") {
        router.push("/moderator");
      } else if (role === "creator") {
        router.push("/");
      } else {
        alert("User has no role. Redirecting to home.");
        router.push("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Please try again.");
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
              Welcome Back
            </h1>
            <p className="text-gray-600 text-base font-normal leading-relaxed">
              Sign in to your NaijaWiki account to continue your journey
            </p>
          </div>

          <form className="space-y-7" onSubmit={handleSubmit}>
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
                placeholder="Enter your email address"
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
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 text-yellow-500 focus:ring-2 focus:ring-yellow-500 border border-gray-300 rounded"
                />
                <label
                  htmlFor="remember"
                  className="ml-3 block text-sm font-medium text-gray-700"
                >
                  Remember me
                </label>
              </div>
              <a
                href="/forgot-password"
                className="text-sm font-semibold text-yellow-500 hover:underline transition-colors"
              >
                Forgot password?
              </a>
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
                  Signing In...
                </span>
              ) : (
                "Sign In"
              )}
            </button>

            {/* Sign Up Link */}
            <div className="text-center text-sm font-normal text-gray-600 pt-6 border-t border-gray-200">
              Don't have an account?{" "}
              <a href="/signup" className="font-semibold text-yellow-500 hover:underline transition-colors">
                Create account
              </a>
            </div>
          </form>
        </div>
      </main>

      <CustomFooter />
    </div>
  );
}