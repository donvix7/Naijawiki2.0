"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import feather from "feather-icons";
import AdminNavbar from "@/components/adminNavbar";
import AdminSideBar from "@/components/adminSideBar";
import RoleGuard from "@/utils/RoleGuard";
import getBaseUrl from "@/utils/baseUrl";

export default function AdminActivityPage() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const base_url = getBaseUrl();
  // Placeholder user (until API is ready)
  const user = {
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
  };

  // Fetch activity/word list
  const fetchActivityData = async (token) => {
    try {
      const res = await fetch(`${base_url}/user/word/list`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch activity data");
      const data = await res.json();
      setWords(data.words || []);
    } catch (err) {
      console.error("Activity fetch error:", err);
      setError("Failed to fetch activity logs.");
    } finally {
      setLoading(false);
    }
  };

  // Initialization
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      setError("No token found. Please log in again.");
      setLoading(false);
      return;
    }

    fetchActivityData(token);
  }, []);

  // Replace feather icons when data changes
  useEffect(() => {
    feather.replace();
  }, [words]);

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-500 dark:text-gray-300">
        <i data-feather="loader" className="animate-spin w-6 h-6 mb-3"></i>
        <p className="text-lg font-medium">Loading dashboard data...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-red-500">
        <i data-feather="alert-triangle" className="w-6 h-6 mb-3"></i>
        <p className="text-lg">{error}</p>
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={["admin", "super_admin"]}>
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {/* Navbar with placeholder user */}
        <AdminNavbar user={user} />

        <div className="flex flex-1">
          <AdminSideBar />

          <main className="flex-1 p-6 md:p-8 overflow-y-auto">
            <h1 className="text-3xl font-bold text-secondary mb-6 flex items-center gap-2">
              <i data-feather="activity"></i> User Activity Log
            </h1>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-300">
              {words.length === 0 ? (
                <p className="text-center text-gray-500 py-10">
                  No recorded activities yet.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr>
                        {["Action", "User", "Target", "Timestamp", "Details"].map(
                          (header) => (
                            <th
                              key={header}
                              className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider"
                            >
                              {header}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {words.map((item, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                item.action === "approved"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                  : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              }`}
                            >
                              <i
                                data-feather={
                                  item.action === "approved" ? "check" : "edit"
                                }
                                className="w-3 h-3 mr-1"
                              ></i>
                              {item.action}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.userEmail || user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.target || "—"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {new Date(item.timestamp).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button className="text-primary hover:underline flex items-center gap-1 transition">
                              <i data-feather="eye" className="w-4 h-4"></i> View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}
