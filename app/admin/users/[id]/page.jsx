"use client";

import AdminNavbar from "@/components/adminNavbar";
import AdminSidebar from "@/components/adminSideBar";
import getBaseUrl from "@/app/api/baseUrl";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import feather from "feather-icons";
import { useParams } from "next/navigation";
import RoleGuard from "@/utils/RoleGuard";

export default function Page() {

  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = Cookies.get("token");
  const base_url = getBaseUrl();

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
      } catch (err) {
        console.error(err);
        setError("Unable to load user.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, base_url, token]);

  // Initialize feather icons once
  useEffect(() => {
    feather.replace();
  }, []);

  // Approve/edit user
  const approveUser = async () => {
    setActionLoading(true);

    try {
      const res = await fetch(`${base_url}/user/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to update user");

      alert("User updated successfully");
    } catch (err) {
      console.error(err);
      alert("Error updating user");
    } finally {
      setActionLoading(false);
    }
  };

  // -------- STATES RENDERING -------- //

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
      <div className="flex justify-center items-center h-screen text-gray-600">
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

          <main className="flex-1 p-8">
            <h1 className="text-3xl font-bold mb-6 text-secondary">
              Manage User
            </h1>

            <div className="bg-white rounded-xl shadow p-6 space-y-3">

              <table className="min-w-full divide-y divide-gray-200">
                <tbody>
                  <tr>
                    <td className="px-4 py-3 font-semibold">Username</td>
                    <td className="px-4 py-3">{user.username || "—"}</td>
                  </tr>

                  <tr>
                    <td className="px-4 py-3 font-semibold">Email</td>
                    <td className="px-4 py-3">{user.email || "—"}</td>
                  </tr>

                  <tr>
                    <td className="px-4 py-3 font-semibold">Role</td>
                    <td className="px-4 py-3 capitalize">{user.role || "—"}</td>
                  </tr>
                </tbody>
              </table>

              <div className="pt-4">
                <button
                  onClick={approveUser}
                  disabled={actionLoading}
                  className={`px-4 py-2 rounded text-white transition 
                    ${actionLoading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}
                  `}
                >
                  {actionLoading ? "Updating..." : "Save Changes"}
                </button>
              </div>

            </div>
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
