"use client";
import CustomNavbar from '@/components/navBar';
import CustomFooter from '@/components/customFooter';
import React, { useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("http://wiki-server.giguild.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
        console.log(data);
      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      // Store token in cookie
      Cookies.set("token", data.token, {
        expires: 1, // 1 day
        secure: true,
        sameSite: "strict"
      });
      // Store email in cookie
      Cookies.set("email", data.user.email, {
        expires: 1, // 1 day
        secure: true,
        sameSite: "strict"
      });
      // Store role in cookie
      Cookies.set("role", data.user.role, {
        expires: 1, // 1 day
        secure: true,
        sameSite: "strict"
      });

      // Redirect based on role
      if (data.user.role === "admin" || "super_admin") router.push("/admin/dashboard");
      else if (data.user.role === "moderator") router.push("/moderator/dashboard");
      else if (data.user.role === "creator") router.push("/");
      else alert("User role not recognized");

    } catch (error) {
      console.error(error);
      alert("Something went wrong. Please try again.");
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
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email*</label>
              <input type="email" id="email" required
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password*</label>
              <input type="password" id="password" required
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                placeholder="••••••••"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember" type="checkbox"
                  className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"/>
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700">Remember me</label>
              </div>
              <a href="/forgot-password" className="text-sm text-primary hover:underline">Forgot password?</a>
            </div>
            <button type="submit"
              className="w-full bg-primary hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition-colors">
              Login
            </button>
            <div className="text-center text-sm text-gray-500">
              Don't have an account? <a href="/signup" className="text-black hover:underline">Sign up</a>
            </div>
          </form>
        </div>
      </main>
      <CustomFooter />
    </div>
  );
}
