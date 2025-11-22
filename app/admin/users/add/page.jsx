"use client";

import React, { useState, useEffect } from "react";
import feather from "feather-icons";
import { useRouter } from "next/navigation";
import AdminNavbar from "@/components/adminNavbar";
import AdminSidebar from "@/components/adminSideBar";
import RoleGuard from "@/utils/RoleGuard";
import getBaseUrl from "@/app/api/baseUrl";

export default function Page() {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState("creator"); // Default role
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
      const res = await fetch(`${base_url}/admin/users`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${Cookies.get("token")}`
        },
        body: JSON.stringify({
          firstname: trimmedFirst,
          lastname: trimmedLast,
          email: trimmedEmail,
          password,
          role: role
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus({
          message: data.message || "User creation failed. Please try again.",
          type: "error",
        });
      } else {
        setStatus({
          message: "User account created successfully!",
          type: "success",
        });

        // Reset input fields
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setConfirm("");
        setRole("creator");

        // Redirect to users list after success
        setTimeout(() => {
          router.push("/admin/users");
        }, 1500);
      }
    } catch (error) {
      console.error("User creation error:", error);
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
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="flex">
          <AdminSidebar />

          <main className="flex-1 p-4 md:p-6 lg:p-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  Add New User
                </h1>
                <p className="text-gray-600 font-medium">
                  Create a new user account with specific role permissions
                </p>
              </div>
              
              <button
                onClick={() => router.push('/admin/users')}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors"
              >
                <i data-feather="arrow-left" className="w-4 h-4"></i>
                Back to Users
              </button>
            </div>

            {/* Status Message */}
            {status.message && (
              <div className={`mb-6 p-4 rounded-xl ${
                status.type === "success" 
                  ? "bg-green-100 border border-green-300 text-green-800" 
                  : "bg-red-100 border border-red-300 text-red-800"
              }`}>
                <div className="flex items-center gap-3">
                  <i data-feather={status.type === "success" ? "check-circle" : "alert-circle"} className="w-5 h-5"></i>
                  <span className="font-semibold">{status.message}</span>
                </div>
              </div>
            )}

            {/* Form Card */}
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                User Information
              </h2>

              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {/* First Name */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-lg">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={firstname}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 font-medium"
                      placeholder="John"
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-lg">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={lastname}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 font-medium"
                      placeholder="Doe"
                    />
                  </div>

                  {/* Email */}
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-semibold mb-2 text-lg">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 font-medium"
                      placeholder="user@example.com"
                    />
                  </div>

                  {/* Role Selection */}
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-semibold mb-2 text-lg">
                      User Role *
                    </label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 font-medium"
                    >
                      <option value="creator">Creator</option>
                      <option value="moderator">Moderator</option>
                      <option value="admin">Admin</option>
                    </select>
                    <p className="mt-2 text-sm text-gray-600">
                      {role === "creator" && "Can create and manage their own content"}
                      {role === "moderator" && "Can moderate user content and manage words"}
                      {role === "admin" && "Full administrative access to all features"}
                    </p>
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-lg">
                      Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 font-medium"
                      placeholder="••••••••"
                    />
                    <p className="mt-1 text-sm text-gray-500">Minimum 8 characters</p>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 text-lg">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      required
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 font-medium"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => router.push('/admin/users')}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all duration-200"
                  >
                    <i data-feather="x" className="w-4 h-4"></i>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-all duration-200 shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Creating User...
                      </>
                    ) : (
                      <>
                        <i data-feather="user-plus" className="w-4 h-4"></i>
                        Create User
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Help Information */}
            <div className="max-w-2xl mx-auto mt-6 bg-blue-50 rounded-xl p-4 md:p-6 border border-blue-200">
              <div className="flex items-start gap-3">
                <i data-feather="info" className="w-5 h-5 text-blue-600 mt-0.5"></i>
                <div>
                  <p className="text-blue-800 font-semibold text-sm mb-2">User Role Information</p>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• <strong>Creator:</strong> Can submit and manage their own words and content</li>
                    <li>• <strong>Moderator:</strong> Can review, approve, and manage all user submissions</li>
                    <li>• <strong>Admin:</strong> Full system access including user management and settings</li>
                  </ul>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}