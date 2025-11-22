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
      Cookies.set("email", data.user?.email || "", { expires: 1, secure: true, sameSite: "strict" });
      Cookies.set("role", data.user?.role || "user", { expires: 1, secure: true, sameSite: "strict" });

      // Redirect based on role
      const role = data.user?.role;
      if (role === "admin" || role === "super_admin") {
        router.push("/admin");
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

      <main className="flex-grow flex items-center justify-center py-12 px-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">Welcome Back</h1>
            <p className="text-gray-600 text-lg font-medium">Login to your NaijaWiki account</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-lg font-semibold text-gray-800 mb-2"
              >
                Email*
              </label>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 font-medium"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-lg font-semibold text-gray-800 mb-2"
              >
                Password*
              </label>
              <input
                type="password"
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 font-medium"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-5 w-5 text-primary focus:ring-2 focus:ring-primary border-2 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember"
                  className="ml-3 block text-lg font-medium text-gray-700"
                >
                  Remember me
                </label>
              </div>
              <a
                href="/forgot-password"
                className="text-lg font-semibold text-primary hover:underline"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark text-white font-bold text-lg py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed btn-outline"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>

            <div className="text-center text-lg font-medium text-gray-600 pt-4 border-t border-gray-200">
              Don't have an account?{" "}
              <a href="/signup" className="font-bold text-primary hover:underline">
                Sign up
              </a>
            </div>
          </form>
        </div>
      </main>

      <CustomFooter />
    </div>
  );
}