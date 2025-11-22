"use client";

import React, { useEffect, useState } from "react";
import AdminNavbar from "@/components/adminNavbar";
import AdminSidebar from "@/components/adminSideBar";
import getBaseUrl from "@/app/api/baseUrl";
import Cookies from "js-cookie";
import RoleGuard from "@/utils/RoleGuard";
import DeleteBtn from "@/components/deleteBtn";

const Page = () => {
  const base_url = getBaseUrl();
  const token = Cookies.get("token");
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  // Fetch all words dynamically
  useEffect(() => {
    const fetchWords = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${base_url}/user/word/list`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch words");

        const data = await res.json();
        setWords(data.words || []);
      } catch (err) {
        console.error("Error loading words:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWords();
  }, [base_url, token]);

  // Filter + Search Logic
  const filteredWords = words.filter((w) => {
    return (
      (!status || w.status === status) &&
      (!search || w.word.toLowerCase().includes(search.toLowerCase()))
    );
  });

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
                  Manage Words
                </h1>
                <p className="text-gray-600 font-medium">
                  Review, edit, and manage all word submissions
                </p>
              </div>

              <a
                href="/admin/word/add"
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark text-white font-bold py-3 px-6 rounded-xl flex items-center gap-3 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <i data-feather="plus" className="w-5 h-5"></i> 
                Add New Word
              </a>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 md:mb-8">
              <div className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-primary">
                <p className="text-gray-700 font-semibold text-sm mb-1">Total Words</p>
                <h3 className="text-2xl font-bold text-gray-900">{words.length}</h3>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-yellow-500">
                <p className="text-gray-700 font-semibold text-sm mb-1">Pending</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {words.filter(w => w.status === 'pending').length}
                </h3>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-green-500">
                <p className="text-gray-700 font-semibold text-sm mb-1">Approved</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {words.filter(w => w.status === 'approved').length}
                </h3>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-lg border-l-4 border-red-500">
                <p className="text-gray-700 font-semibold text-sm mb-1">Rejected</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {words.filter(w => w.status === 'rejected').length}
                </h3>
              </div>
            </div>

            {/* Filters Card */}
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Filters & Search</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <div>
                  <label className="block text-gray-700 font-semibold mb-2 text-lg">
                    Status Filter
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 font-medium"
                  >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-semibold mb-2 text-lg">
                    Search Words
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by word name..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full p-3 pl-12 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 font-medium"
                    />
                    <i
                      data-feather="search"
                      className="absolute left-4 top-3.5 text-gray-500 w-5 h-5"
                    ></i>
                  </div>
                </div>
              </div>

              {/* Results Count */}
              <div className="mt-4 flex justify-between items-center">
                <span className="text-gray-700 font-semibold">
                  Showing {filteredWords.length} of {words.length} words
                </span>
                {(status || search) && (
                  <button
                    onClick={() => {
                      setStatus("");
                      setSearch("");
                    }}
                    className="text-primary font-semibold hover:underline flex items-center gap-2"
                  >
                    <i data-feather="x" className="w-4 h-4"></i>
                    Clear Filters
                  </button>
                )}
              </div>
            </div>

            {/* Words Table/Cards */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-700 font-semibold text-lg">Loading words...</p>
                  </div>
                </div>
              ) : filteredWords.length === 0 ? (
                <div className="text-center py-12">
                  <i data-feather="search" className="w-16 h-16 text-gray-400 mx-auto mb-4"></i>
                  <p className="text-gray-600 font-semibold text-lg mb-2">No words found</p>
                  <p className="text-gray-500">
                    {words.length === 0 ? "No words have been submitted yet." : "Try adjusting your filters."}
                  </p>
                </div>
              ) : (
                <>
                  {/* Mobile Cards View */}
                  <div className="md:hidden space-y-4 p-4">
                    {filteredWords.map((item) => (
                      <div key={item.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-bold text-gray-900 text-lg">{item.word}</h3>
                          <span
                            className={`px-3 py-1 text-sm font-semibold rounded-full ${
                              item.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : item.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                        
                        <p className="text-gray-700 mb-3">{item.meaning}</p>
                        
                        <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                          <span className="font-medium">By: {item.submittedBy || item.creator || "—"}</span>
                          <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                        
                        <div className="flex gap-2">
                          <a
                            href={`/admin/word/edit/${item.id}`}
                            className="flex-1 bg-primary text-white font-semibold py-2 px-3 rounded-lg text-center text-sm hover:bg-primary-dark transition-colors flex items-center justify-center gap-1"
                          >
                            <i data-feather="edit" className="w-3 h-3"></i>
                            Edit
                          </a>
                          <a
                            href={`/admin/word/${item.id}`}
                            className="flex-1 bg-secondary text-white font-semibold py-2 px-3 rounded-lg text-center text-sm hover:bg-secondary-dark transition-colors flex items-center justify-center gap-1"
                          >
                            <i data-feather="eye" className="w-3 h-3"></i>
                            Review
                          </a>
                          <div className="flex-1">
                            <DeleteBtn id={item.id} base_url={base_url} token={token} />
                          </div>
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
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Meaning</th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Submitted By</th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredWords.map((item) => (
                          <tr key={item.id} className="hover:bg-gray-50 transition-colors duration-150">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="font-semibold text-gray-900 text-lg">
                                {item.word}
                              </span>
                            </td>
                            <td className="px-6 py-4 max-w-xs">
                              <p className="text-gray-700 font-medium truncate">
                                {item.meaning}
                              </p>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-3 py-1 text-sm font-semibold rounded-full ${
                                  item.status === "approved"
                                    ? "bg-green-100 text-green-800"
                                    : item.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {item.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-gray-700 font-medium">
                                {item.submittedBy || item.creator || "—"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-gray-600 text-sm">
                                {new Date(item.createdAt).toLocaleDateString()}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex gap-2">
                                <a
                                  href={`/admin/word/edit/${item.id}`}
                                  className="bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-dark transition-colors text-sm flex items-center gap-1"
                                >
                                  <i data-feather="edit" className="w-3 h-3"></i>
                                  Edit
                                </a>
                                <a
                                  href={`/admin/word/${item.id}`}
                                  className="bg-secondary text-white font-semibold py-2 px-4 rounded-lg hover:bg-secondary-dark transition-colors text-sm flex items-center gap-1"
                                >
                                  <i data-feather="eye" className="w-3 h-3"></i>
                                  Review
                                </a>
                                <DeleteBtn id={item.id} base_url={base_url} token={token} />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>

            {/* Pagination */}
            {filteredWords.length > 0 && (
              <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-gray-700 font-semibold">
                  Showing {filteredWords.length} of {words.length} results
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 border-2 border-gray-300 rounded-xl bg-white text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
                    Previous
                  </button>
                  <button className="px-4 py-2 bg-primary text-white font-semibold rounded-xl hover:bg-primary-dark transition-colors">
                    1
                  </button>
                  <button className="px-4 py-2 border-2 border-gray-300 rounded-xl bg-white text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
                    Next
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </RoleGuard>
  );
};

export default Page;