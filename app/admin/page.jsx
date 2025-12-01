"use client";

import AdminNavbar from "@/components/adminNavbar";
import AdminSidebar from "@/components/adminSideBar";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import RoleGuard from "@/utils/RoleGuard";
import getBaseUrl from "../api/baseUrl";

const Page = () => {
  const [users, setUsers] = useState(0);
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const base_url = getBaseUrl();

  // --- FETCH USERS ---
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        const token = Cookies.get("token");
        if (!token) {
          console.error("No token found for fetching users");
          return;
        }

        const res = await fetch(`${base_url}/admin/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch users");

        const data = await res.json();
        setUsers(data.users?.length || 0);
      } catch (err) {
        console.error("Error loading users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // --- FETCH WORDS ---
  const fetchWords = async () => {
    try {
      setLoading(true);

      const token = Cookies.get("token");
      if (!token) {
        console.error("No token found for words");
        return;
      }

      const res = await fetch(`${base_url}/user/word/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Failed to fetch words");

      const data = await res.json();
      setWords(data.words || []);
    } catch (error) {
      console.error("Error fetching words:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWords();
    const interval = setInterval(fetchWords, 60000);
    return () => clearInterval(interval);
  }, []);

  // --- DASHBOARD STATS ---
  const pendingWords = words.filter((w) => w.status === "pending").length;
  const totalWords = words.length;

  const approvedToday = words.filter((w) => {
    const today = new Date();
    const created = new Date(w.created_at);
    return (
      w.status === "approved" &&
      created.getDate() === today.getDate() &&
      created.getMonth() === today.getMonth() &&
      created.getFullYear() === today.getFullYear()
    );
  }).length;

  return (
    <RoleGuard allowedRoles={["admin", "super_admin"]}>
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 text-base font-normal">
                Overview of platform activities and statistics
              </p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-yellow-500 mx-auto mb-5"></div>
                  <p className="text-gray-700 text-base font-semibold">Loading dashboard data...</p>
                </div>
              </div>
            ) : (
              <>
                {/* --- STAT CARDS --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-gray-700 font-semibold text-sm mb-3 uppercase tracking-wide">Pending Words</p>
                    <h3 className="text-2xl font-bold text-gray-900">{pendingWords}</h3>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-gray-700 font-semibold text-sm mb-3 uppercase tracking-wide">Total Words</p>
                    <h3 className="text-2xl font-bold text-gray-900">{totalWords}</h3>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-gray-700 font-semibold text-sm mb-3 uppercase tracking-wide">Total Users</p>
                    <h3 className="text-2xl font-bold text-gray-900">{users}</h3>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-gray-700 font-semibold text-sm mb-3 uppercase tracking-wide">Approved Today</p>
                    <h3 className="text-2xl font-bold text-gray-900">{approvedToday}</h3>
                  </div>
                </div>

                {/* --- RECENT ACTIVITY --- */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                    <a
                      href="/admin/activity"
                      className="text-yellow-500 font-semibold hover:underline text-sm transition-colors"
                    >
                      View All
                    </a>
                  </div>

                  <div className="space-y-5">
                    {words.slice(0, 5).map((w, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 pb-5 border-b border-gray-200 last:border-b-0 last:pb-0"
                      >
                        <div className="bg-yellow-500/10 p-3 rounded-full mt-1">
                          <i
                            data-feather="plus-circle"
                            className="text-yellow-500 w-4 h-4"
                          ></i>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-sm">New word submission</p>
                          <p className="text-gray-700 font-normal text-sm mt-1">
                            "{w.word}" by {w.created_by}
                          </p>
                          <p className="text-gray-600 text-xs mt-2 font-medium">
                            {new Date(w.created_at).toLocaleTimeString()} • {new Date(w.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                          w.status === 'pending' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : w.status === 'approved'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {w.status}
                        </span>
                      </div>
                    ))}
                    {words.length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-gray-600 font-medium text-base">No recent activity</p>
                      </div>
                    )}
                  </div>
                </div>

               
              </>
            )}
          </main>
        </div>
      </div>
    </RoleGuard>
  );
};

export default Page;