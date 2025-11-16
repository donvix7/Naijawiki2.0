"use client";

import React, { useState, useEffect } from "react";
import CustomFooter from "@/components/customFooter";
import CustomNavbar from "@/components/navBar";
import feather from "feather-icons";
import { useRouter } from "next/navigation";
import getBaseUrl from "../api/baseUrl";
import AdminNavbar from "@/components/adminNavbar";
import AdminSidebar from "@/components/adminSideBar";
import RoleGuard from "@/utils/RoleGuard"; // ✅ FIXED missing import

export default function Page() {
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
    // safer load
    setTimeout(() => feather.replace(), 50);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    const trimmedEmail = email.trim();
    const trimmedFirst = firstname.trim();
    const trimmedLast = lastname.trim();

    if (!trimmedFirst || !trimmedLast || !trimmedEmail) {
      setStatus({
        message: "Please fill in all required fields.",
        type: "error",
      });
      return;
    }

    if (password.length < 8) {
      setStatus({
        message: "Password must be at least 8 characters.",
        type: "error",
      });
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

        // Reset input fields
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setConfirm("");

        // SIMPLE browser alert — MUST ONLY take 1 argument
        alert(data.message || "Account created successfully!");

        router.push("/login");
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
    <RoleGuard allowedRoles={["admin", "super_admin"]}>
      <div>
        <AdminNavbar />
        <div className="flex">
          <AdminSidebar />

          <main className="container mx-auto px-6 py-12">
            <div className="max-w-md mx-auto bg-white rounded-xl shadow-md p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-secondary mb-2">
                  Create Account
                </h1>
                <p className="text-gray-600">
                  Join our community of language enthusiasts
                </p>
              </div>

              {status.message && (
                <div
                  className={`mb-4 text-center ${
                    status.type === "success"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {status.message}
                </div>
              )}

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="first-name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      First Name*
                    </label>
                    <input
                      type="text"
                      id="first-name"
                      required
                      value={firstname}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                      placeholder="John"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="last-name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Last Name*
                    </label>
                    <input
                      type="text"
                      id="last-name"
                      required
                      value={lastname}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                      placeholder="Doe"
                    />
                  </div>
                </div>

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
                    placeholder="you@email.com"
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

                <div>
                  <label
                    htmlFor="confirm-password"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Confirm Password*
                  </label>
                  <input
                    type="password"
                    id="confirm-password"
                    required
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                    placeholder="••••••••"
                  />
                </div>

                <div className="flex items-start">
                  <input
                    id="terms"
                    type="checkbox"
                    required
                    className="h-4 w-4 text-primary border-gray-300 rounded"
                  />
                
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-primary text-white font-bold py-3 rounded-lg transition ${
                    loading ? "opacity-70 cursor-not-allowed" : "hover:bg-yellow-600"
                  }`}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>

                
              </form>
            </div>
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
