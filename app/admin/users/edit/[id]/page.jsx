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

  const token = Cookies.get("token");
  const base_url = getBaseUrl();

  // Editable fields
  const [form, setForm] = useState({
    username: "",
    email: "",
    role: "",
  });

  // Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${base_url}/user/${id}`, {
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
          username: data.user.username || "",
          email: data.user.email || "",
          role: data.user.role || "",
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

  // Load Feather icons once
  useEffect(() => {
    feather.replace();
  }, []);

  // Handle change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Save updated user
  const saveChanges = async () => {
    setSaving(true);

    try {
      const res = await fetch(`${base_url}/user/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to update user");

      alert("User profile updated successfully!");
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    } finally {
      setSaving(false);
    }
  };

  // -------- STATES RENDER ---------- //

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        <div className="animate-spin h-8 w-8 border-2 border-gray-400 border-t-transparent rounded-full mr-3" />
        Loading user…
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        {error || "User not found."}
      </div>
    );
  }

  // -------- MAIN UI -------- //

  return (
    <RoleGuard allowedRoles={["admin", "super_admin"]}>
      <div>
        <AdminNavbar />

        <div className="flex">
          <AdminSidebar />

          <main className="flex-1 p-8 max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-secondary flex items-center gap-2">
              <i data-feather="user-check" className="w-7" />
              Edit User Profile
            </h1>

            <div className="bg-white rounded-xl shadow p-6 space-y-6">

              {/* Username */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  className="w-full p-3 rounded border focus:ring-primary/50 focus:ring-2 outline-none"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full p-3 rounded border focus:ring-primary/50 focus:ring-2 outline-none"
                />
              </div>

              {/* Role */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full p-3 rounded border focus:ring-primary/50 focus:ring-2 outline-none"
                >
                  <option value="">Select role</option>
                  <option value="user">User</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                  <option value="super_admin">Super Admin</option>
                </select>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={saveChanges}
                  disabled={saving}
                  className={`px-5 py-2.5 rounded text-white font-medium transition 
                    ${saving ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}
                  `}
                >
                  {saving ? "Saving…" : "Save Changes"}
                </button>

                <button
                  onClick={() => router.back()}
                  className="px-5 py-2.5 rounded border text-gray-700 hover:bg-gray-100"
                >
                  Cancel
                </button>
              </div>

            </div>
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
