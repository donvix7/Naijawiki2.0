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
      <div>
        <AdminNavbar />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-8">
            <h1 className="text-3xl font-bold text-secondary mb-6">
              Admin Dashboard
            </h1>

            {loading ? (
              <p>Loading data...</p>
            ) : (
              <>
                {/* --- STAT CARDS --- */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-primary">
                    <p className="text-gray-500">Pending Words</p>
                    <h3 className="text-3xl font-bold">{pendingWords}</h3>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-secondary">
                    <p className="text-gray-500">Total Words</p>
                    <h3 className="text-3xl font-bold">{totalWords}</h3>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-accent">
                    <p className="text-gray-500">Total Users</p>
                    <h3 className="text-3xl font-bold">{users}</h3>
                  </div>

                  <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                    <p className="text-gray-500">Approved Today</p>
                    <h3 className="text-3xl font-bold">{approvedToday}</h3>
                  </div>
                </div>

                {/* --- RECENT ACTIVITY --- */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Recent Activity</h2>
                    <a
                      href="/admin/activity"
                      className="text-primary hover:underline"
                    >
                      View All
                    </a>
                  </div>

                  <div className="space-y-4">
                    {words.slice(0, 5).map((w, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 pb-4 border-b border-gray-100"
                      >
                        <div className="bg-gray-100 p-2 rounded-full">
                          <i
                            data-feather="plus-circle"
                            className="text-primary"
                          ></i>
                        </div>
                        <div>
                          <p className="font-medium">New word submission</p>
                          <p className="text-gray-500 text-sm">
                            "{w.word}" by {w.submittedBy}
                          </p>
                          <p className="text-gray-400 text-xs mt-1">
                            {new Date(w.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    ))}
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
