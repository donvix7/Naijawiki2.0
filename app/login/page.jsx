"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import CustomNavbar from "@/components/navBar";
import CustomFooter from "@/components/customFooter";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("https://wiki-server.giguild.com/api/auth/login", {
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
        router.push("/admin/dashboard");
      } else if (role === "moderator") {
        router.push("/moderator/dashboard");
      } else if (role === "creator") {
        router.push("/");
      } else {
        alert("User role not recognized. Redirecting to home.");
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
    <div>
      <CustomNavbar />

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-black mb-2">Welcome Back</h1>
            <p className="text-gray-600">Login to your NaijaLingo account</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email*
              </label>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password*
              </label>
              <input
                type="password"
                id="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                />
                <label
                  htmlFor="remember"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>
              <a
                href="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="text-center text-sm text-gray-500">
              Don’t have an account?{" "}
              <a href="/signup" className="text-black hover:underline">
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
