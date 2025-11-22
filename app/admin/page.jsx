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
    const created = new Date(w.createdAt);
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
            <h1 className="text-4xl font-bold text-gray-900 mb-8">
              Admin Dashboard
            </h1>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <p className="text-gray-700 text-lg font-semibold">Loading dashboard data...</p>
              </div>
            ) : (
              <>
                {/* --- STAT CARDS --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-primary">
                    <p className="text-gray-700 font-semibold text-lg mb-2">Pending Words</p>
                    <h3 className="text-4xl font-bold text-gray-900">{pendingWords}</h3>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-secondary">
                    <p className="text-gray-700 font-semibold text-lg mb-2">Total Words</p>
                    <h3 className="text-4xl font-bold text-gray-900">{totalWords}</h3>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-accent">
                    <p className="text-gray-700 font-semibold text-lg mb-2">Total Users</p>
                    <h3 className="text-4xl font-bold text-gray-900">{users}</h3>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-600">
                    <p className="text-gray-700 font-semibold text-lg mb-2">Approved Today</p>
                    <h3 className="text-4xl font-bold text-gray-900">{approvedToday}</h3>
                  </div>
                </div>

                {/* --- RECENT ACTIVITY --- */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Recent Activity</h2>
                    <a
                      href="/admin/activity"
                      className="text-primary font-semibold hover:underline text-lg"
                    >
                      View All
                    </a>
                  </div>

                  <div className="space-y-4">
                    {words.slice(0, 5).map((w, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 pb-4 border-b border-gray-200 last:border-b-0"
                      >
                        <div className="bg-primary/10 p-3 rounded-full">
                          <i
                            data-feather="plus-circle"
                            className="text-primary w-5 h-5"
                          ></i>
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900 text-lg">New word submission</p>
                          <p className="text-gray-700 font-medium text-base mt-1">
                            "{w.word}" by {w.submittedBy}
                          </p>
                          <p className="text-gray-600 text-sm mt-2 font-medium">
                            {new Date(w.createdAt).toLocaleTimeString()} • {new Date(w.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
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
                        <p className="text-gray-600 font-medium text-lg">No recent activity</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* --- QUICK ACTIONS --- */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <a
                      href="/admin/words"
                      className="bg-primary hover:bg-primary-dark text-white font-bold py-4 px-6 rounded-xl text-center transition-colors duration-200"
                    >
                      Manage Words
                    </a>
                    <a
                      href="/admin/users"
                      className="bg-secondary hover:bg-secondary-dark text-white font-bold py-4 px-6 rounded-xl text-center transition-colors duration-200"
                    >
                      Manage Users
                    </a>
                    <a
                      href="/admin/analytics"
                      className="bg-accent hover:bg-accent-dark text-white font-bold py-4 px-6 rounded-xl text-center transition-colors duration-200"
                    >
                      View Analytics
                    </a>
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