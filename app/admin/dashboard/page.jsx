"use client";

import React, { useEffect, useState } from "react";
import AdminNavbar from "@/components/adminNavbar";
import AdminSideBar from "@/components/adminSideBar";
import Cookies from "js-cookie";
import feather from "feather-icons";
import getBaseUrl from "@/app/api/baseUrl";
import RoleGuard from "@/utils/RoleGuard";

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
  }, [base_url]);

  return (
    <RoleGuard allowedRoles={["admin", "super_admin"]}>
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="flex">
          <AdminSideBar />
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            {/* Header */}
            <div className="mb-6 md:mb-8">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 font-medium">
                Overview of word submissions and system status
              </p>
            </div>

            {/* Stats Cards */}
            {loading ? (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="bg-white p-6 rounded-xl shadow-lg animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
                <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border-l-4 border-yellow-500">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-700 font-semibold text-sm md:text-base mb-1">Pending Words</p>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{stats.pending}</h3>
                    </div>
                    <i data-feather="clock" className="text-yellow-500 text-xl md:text-2xl"></i>
                  </div>
                  <p className="text-gray-500 text-xs md:text-sm mt-2">Awaiting review</p>
                </div>

                <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border-l-4 border-primary">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-700 font-semibold text-sm md:text-base mb-1">Total Words</p>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{stats.total}</h3>
                    </div>
                    <i data-feather="book" className="text-primary text-xl md:text-2xl"></i>
                  </div>
                  <p className="text-gray-500 text-xs md:text-sm mt-2">All submissions</p>
                </div>

                <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border-l-4 border-green-500">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-700 font-semibold text-sm md:text-base mb-1">Approved Words</p>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{stats.approved}</h3>
                    </div>
                    <i data-feather="check-circle" className="text-green-500 text-xl md:text-2xl"></i>
                  </div>
                  <p className="text-gray-500 text-xs md:text-sm mt-2">Published words</p>
                </div>

                <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border-l-4 border-red-500">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-700 font-semibold text-sm md:text-base mb-1">Rejected Words</p>
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{stats.rejected}</h3>
                    </div>
                    <i data-feather="x-circle" className="text-red-500 text-xl md:text-2xl"></i>
                  </div>
                  <p className="text-gray-500 text-xs md:text-sm mt-2">Not approved</p>
                </div>
              </div>
            )}

            {/* Recent Word Submissions */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-4 md:px-6 py-4 border-b border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h2 className="text-xl font-bold text-gray-900">Recent Word Submissions</h2>
                  <a 
                    href="/admin/words" 
                    className="text-primary font-semibold hover:underline flex items-center gap-2 text-lg"
                  >
                    Manage All Words
                    <i data-feather="arrow-right" className="w-4 h-4"></i>
                  </a>
                </div>
              </div>

              {loading ? (
                <div className="p-6 md:p-8">
                  <div className="animate-pulse space-y-4">
                    {[1, 2, 3, 4, 5].map((item) => (
                      <div key={item} className="flex items-center space-x-4">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : words.length > 0 ? (
                <>
                  {/* Mobile Cards View */}
                  <div className="md:hidden space-y-4 p-4">
                    {words.slice(0, 5).map((word) => (
                      <div key={word.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-bold text-gray-900 text-lg">{word.word}</h3>
                          <span
                            className={`px-3 py-1 text-sm font-semibold rounded-full ${
                              word.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : word.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {word.status || "unknown"}
                          </span>
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-600 mb-4">
                          <div className="flex justify-between">
                            <span className="font-medium">Language:</span>
                            <span>{word.language || "N/A"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Submitted By:</span>
                            <span>{word.user?.email || word.submittedBy || "Unknown"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="font-medium">Date:</span>
                            <span>{new Date(word.createdAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <a
                            href={`/admin/word/edit/${word.id}`}
                            className="flex-1 bg-secondary text-white font-semibold py-2 px-3 rounded-lg text-center text-sm hover:bg-secondary-dark transition-colors flex items-center justify-center gap-1"
                          >
                            <i data-feather="eye" className="w-3 h-3"></i>
                            Review
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Word</th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Language</th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Submitted By</th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Action</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {words.slice(0, 5).map((word) => (
                          <tr key={word.id} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="font-semibold text-gray-900 text-lg">
                                {word.word}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-gray-700 font-medium">
                                {word.language || "N/A"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-3 py-1 text-sm font-semibold rounded-full ${
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
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-gray-700 font-medium">
                                {word.user?.email || word.submittedBy || "Unknown"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-gray-600 text-sm">
                                {new Date(word.createdAt).toLocaleDateString()}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <a
                                href={`/admin/word/edit/${word.id}`}
                                className="bg-secondary text-white font-semibold py-2 px-4 rounded-lg hover:bg-secondary-dark transition-colors text-sm flex items-center gap-1"
                              >
                                <i data-feather="eye" className="w-3 h-3"></i>
                                Review
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <i data-feather="inbox" className="w-16 h-16 text-gray-400 mx-auto mb-4"></i>
                  <p className="text-gray-600 font-semibold text-lg mb-2">No word submissions found</p>
                  <p className="text-gray-500">Word submissions will appear here once users start contributing.</p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              <a
                href="/admin/word"
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-transparent hover:border-primary/20 group"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <i data-feather="edit" className="text-primary w-6 h-6"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Manage Words</h3>
                    <p className="text-gray-600 text-sm">Edit, approve, and manage all words</p>
                  </div>
                </div>
              </a>

              <a
                href="/admin/word/add"
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-transparent hover:border-secondary/20 group"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-secondary/10 p-3 rounded-lg group-hover:bg-secondary/20 transition-colors">
                    <i data-feather="plus" className="text-secondary w-6 h-6"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Add New Word</h3>
                    <p className="text-gray-600 text-sm">Create a new word entry manually</p>
                  </div>
                </div>
              </a>

              <a
                href="/admin/users"
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border-2 border-transparent hover:border-accent/20 group"
              >
                <div className="flex items-center gap-4">
                  <div className="bg-accent/10 p-3 rounded-lg group-hover:bg-accent/20 transition-colors">
                    <i data-feather="users" className="text-accent w-6 h-6"></i>
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">User Management</h3>
                    <p className="text-gray-600 text-sm">Manage user accounts and permissions</p>
                  </div>
                </div>
              </a>
            </div>
          </main>
        </div>
      </div>
    </RoleGuard>
  );
};

export default AdminPage;