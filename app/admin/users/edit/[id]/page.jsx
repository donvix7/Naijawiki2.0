"use client";

import AdminNavbar from "@/components/adminNavbar";
import AdminSidebar from "@/components/adminSideBar";
import getBaseUrl from "@/app/api/baseUrl";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import feather from "feather-icons";
import { useParams, useRouter } from "next/navigation";
import RoleGuard from "@/utils/RoleGuard";

export default function Page() {
  const { id } = useParams();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState({ message: "", type: "" });

  const token = Cookies.get("token");
  const base_url = getBaseUrl();

  // Editable fields
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    role: "",
    status: "active"
  });

  // Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${base_url}/admin/users/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();
        setUser(data.user);

        // Pre-fill form
        setForm({
          firstname: data.user.firstname || "",
          lastname: data.user.lastname || "",
          email: data.user.email || "",
          role: data.user.role || "",
          status: data.user.status || "active"
        });
      } catch (err) {
        console.error(err);
        setError("Unable to load user.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, base_url, token]);

  // Load Feather icons
  useEffect(() => {
    feather.replace();
  }, [loading, saving]);

  // Handle change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Save updated user
  const saveChanges = async () => {
    setSaving(true);
    setStatus({ message: "", type: "" });

    try {
      const res = await fetch(`${base_url}/admin/users/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to update user");

      setStatus({
        message: "User updated successfully!",
        type: "success"
      });

      // Refresh user data
      const updatedRes = await fetch(`${base_url}/admin/users/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (updatedRes.ok) {
        const updatedData = await updatedRes.json();
        setUser(updatedData.user);
      }

    } catch (err) {
      console.error(err);
      setStatus({
        message: err.message || "Error updating user",
        type: "error"
      });
    } finally {
      setSaving(false);
    }
  };

  // Reset password
  const resetPassword = async () => {
    if (!confirm("Are you sure you want to reset this user's password? They will receive an email with instructions.")) {
      return;
    }

    try {
      const res = await fetch(`${base_url}/admin/users/${id}/reset-password`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to reset password");

      setStatus({
        message: "Password reset email sent successfully!",
        type: "success"
      });
    } catch (err) {
      console.error(err);
      setStatus({
        message: err.message || "Error resetting password",
        type: "error"
      });
    }
  };

  // -------- STATES RENDER ---------- //

  if (loading) {
    return (
      <RoleGuard allowedRoles={["admin", "super_admin"]}>
        <div className="min-h-screen bg-gray-50">
          <AdminNavbar />
          <div className="flex">
            <AdminSidebar />
            <div className="flex-1 flex justify-center items-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
                <p className="text-gray-700 font-semibold text-lg">Loading user...</p>
              </div>
            </div>
          </div>
        </div>
      </RoleGuard>
    );
  }

  if (error || !user) {
    return (
      <RoleGuard allowedRoles={["admin", "super_admin"]}>
        <div className="min-h-screen bg-gray-50">
          <AdminNavbar />
          <div className="flex">
            <AdminSidebar />
            <div className="flex-1 flex justify-center items-center">
              <div className="text-center">
                <i data-feather="user-x" className="w-16 h-16 text-gray-400 mx-auto mb-4"></i>
                <p className="text-gray-600 font-semibold text-lg mb-2">{error || "User not found"}</p>
                <button
                  onClick={() => router.push('/admin/users')}
                  className="bg-yellow-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-yellow-500-dark transition-colors"
                >
                  Back to Users
                </button>
              </div>
            </div>
          </div>
        </div>
      </RoleGuard>
    );
  }

  // -------- MAIN UI -------- //

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
                  Edit User
                </h1>
                <p className="text-gray-600 font-medium">
                  Update user information and permissions
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Form */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                    User Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First Name */}
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstname"
                        value={form.firstname}
                        onChange={handleChange}
                        className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 font-medium"
                      />
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastname"
                        value={form.lastname}
                        onChange={handleChange}
                        className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 font-medium"
                      />
                    </div>

                    {/* Email */}
                    <div className="md:col-span-2">
                      <label className="block text-gray-700 font-semibold mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 font-medium"
                      />
                    </div>

                    {/* Role */}
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Role
                      </label>
                      <select
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 font-medium"
                      >
                        <option value="creator">Creator</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>

                    {/* Status */}
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">
                        Status
                      </label>
                      <select
                        name="status"
                        value={form.status}
                        onChange={handleChange}
                        className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 font-medium"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="suspended">Suspended</option>
                      </select>
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200 mt-6">
                    <button
                      onClick={() => router.push('/admin/users')}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-all duration-200"
                    >
                      <i data-feather="x" className="w-4 h-4"></i>
                      Cancel
                    </button>
                    <button
                      onClick={saveChanges}
                      disabled={saving}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-yellow-500 text-white font-bold rounded-xl hover:bg-yellow-500-dark transition-all duration-200 shadow-md hover:shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {saving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <i data-feather="save" className="w-4 h-4"></i>
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Sidebar Actions */}
              <div className="space-y-6">
                {/* User Summary */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">User Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">User ID:</span>
                      <span className="font-mono text-sm">{user.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Joined:</span>
                      <span className="text-gray-900">
                        {new Date(user.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Last Updated:</span>
                      <span className="text-gray-900">
                        {new Date(user.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={resetPassword}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-100 text-blue-700 font-semibold rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      <i data-feather="refresh-cw" className="w-4 h-4"></i>
                      Reset Password
                    </button>
                    <button
                      onClick={() => router.push(`/admin/users/${id}/activity`)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-100 text-green-700 font-semibold rounded-lg hover:bg-green-200 transition-colors"
                    >
                      <i data-feather="activity" className="w-4 h-4"></i>
                      View Activity
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}