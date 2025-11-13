"use client";

import React, { useEffect, useState } from "react";
import AdminNavbar from "@/components/adminNavbar";
import AdminSideBar from "@/components/adminSideBar";
import Cookies from "js-cookie";
import feather from "feather-icons";
import getBaseUrl from "@/utils/baseUrl";

const AdminPage = () => {

  const base_url = getBaseUrl();
  const [words, setWords] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    feather.replace();
  }, [words]);

  useEffect(() => {
    async function fetchWords() {
      try {
        const token = Cookies.get("token");
        if (!token) {
          console.warn("No token found — please log in.");
          setLoading(false);
          return;
        }

        const res = await fetch(`${base_url}/user/word/list`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error(`Fetch failed: ${res.statusText}`);

        const data = await res.json();
        const wordsData = Array.isArray(data) ? data : data.words || [];

        const counts = {
          total: wordsData.length,
          pending: wordsData.filter((w) => w.status === "pending").length,
          approved: wordsData.filter((w) => w.status === "approved").length,
          rejected: wordsData.filter((w) => w.status === "rejected").length,
        };

        setWords(wordsData);
        setStats(counts);
      } catch (err) {
        console.error("Error fetching words:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchWords();
  }, []);

  return (
    <div>
      <AdminNavbar />
      <div className="flex">
        <AdminSideBar />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold text-secondary mb-6">Admin Dashboard</h1>

          {/* Stats Cards */}
          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-primary">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-500">Pending Words</p>
                    <h3 className="text-3xl font-bold">{stats.pending}</h3>
                  </div>
                  <i data-feather="clock" className="text-primary text-2xl"></i>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-secondary">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-500">Total Words</p>
                    <h3 className="text-3xl font-bold">{stats.total}</h3>
                  </div>
                  <i data-feather="book" className="text-secondary text-2xl"></i>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-accent">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-500">Approved Words</p>
                    <h3 className="text-3xl font-bold">{stats.approved}</h3>
                  </div>
                  <i data-feather="check-circle" className="text-accent text-2xl"></i>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-500">Rejected Words</p>
                    <h3 className="text-3xl font-bold">{stats.rejected}</h3>
                  </div>
                  <i data-feather="x-circle" className="text-green-500 text-2xl"></i>
                </div>
              </div>
            </div>
          )}

          {/* Recent Word Submissions */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Recent Word Submissions</h2>
              <a href="/admin/words" className="text-primary hover:underline">
                View All
              </a>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y-10px divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Word</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Language</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted By</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {words.length > 0 ? (
                    words.slice(0, 5).map((word) => (
                      <tr key={word.id}>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">{word.word}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{word.language || "N/A"}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              word.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : word.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {word.status || "unknown"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{word.user?.email || "Unknown"}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <a
                            href={`/admin/word/edit/${word.id}`}
                            className="text-primary hover:underline mr-3"
                          >
                            Review
                          </a>
                          <a href="#" className="text-red-500 hover:underline">
                            Delete
                          </a>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-gray-500">
                        No word submissions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
