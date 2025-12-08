"use client";

import AdminNavbar from "@/components/adminNavbar";
import AdminSidebar from "@/components/adminSideBar";
import getBaseUrl from "@/app/api/baseUrl";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import feather from "feather-icons";
import { useRouter } from "next/navigation";
import RoleGuard from "@/utils/RoleGuard";
import ModeratorNavbar from "@/components/moderatorNavbar";
import ModeratorSidebar from "@/components/moderatorSidebar";

export default function Page() {
  const router = useRouter();
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const token = Cookies.get("token");
  const base_url = getBaseUrl();

  // Fetch all words
  useEffect(() => {
    const fetchWords = async () => {
      try {
        if (!token) {
          setError("Authentication required");
          setLoading(false);
          return;
        }

        const res = await fetch(`${base_url}/user/word/list`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            setError("Unauthorized access");
          } else {
            throw new Error("Failed to fetch words");
          }
          return;
        }

        const data = await res.json();
        // Handle both array response and object with words property
        const wordsData = Array.isArray(data) ? data : (data.words || []);
        setWords(wordsData);
      } 
      catch (err) {
        console.error("Failed to load words:", err);
        setError(err.message || "Failed to load words");
      } 
      finally {
        setLoading(false);
      }
    };

    fetchWords();
  }, [base_url, token]);

  // Initialize feather icons
  useEffect(() => {
    feather.replace();
  }, [words, loading]);

  // Filter words based on search and status
  const filteredWords = words.filter(word => {
    const matchesSearch = searchTerm === "" || 
      word.word?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.meaning?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.creatorEmail?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || word.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredWords.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedWords = filteredWords.slice(startIndex, startIndex + itemsPerPage);

  // Handle word click
  const handleWordClick = (id) => {
    router.push(`/moderator/word/edit/${id}`);
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">Approved</span>;
      case "rejected":
        return <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-full">Rejected</span>;
      default:
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">Pending</span>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-semibold">Loading words...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 text-red-500 mx-auto mb-4 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <p className="text-red-600 text-lg font-semibold mb-4">
            {error}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={["admin", "super_admin"]}>
      <div className="min-h-screen bg-gray-50">
        <ModeratorNavbar/>

        <div className="flex">
          <ModeratorSidebar />

          <main className="flex-1 p-4 md:p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
                  Word Submissions
                </h1>
                <p className="text-gray-600 text-base font-normal">
                  Review and manage word submissions from users
                </p>
              </div>


              <div className="text-sm text-gray-500">
                <span className="font-semibold text-gray-700">{words.length}</span> total words
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <i data-feather="clock" className="w-6 h-6 text-yellow-600"></i>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {words.filter(w => w.status === "pending").length}
                    </p>
                    <p className="text-sm text-gray-500">Pending Review</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <i data-feather="check-circle" className="w-6 h-6 text-green-600"></i>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {words.filter(w => w.status === "approved").length}
                    </p>
                    <p className="text-sm text-gray-500">Approved</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                    <i data-feather="x-circle" className="w-6 h-6 text-red-600"></i>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {words.filter(w => w.status === "rejected").length}
                    </p>
                    <p className="text-sm text-gray-500">Rejected</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="lg:col-span-2">
                  <div className="relative">
                    <i data-feather="search" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4"></i>
                    <input
                      type="text"
                      placeholder="Search words, meanings, or submitter..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                    />
                  </div>
                </div>

                <div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 bg-white"
                  >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setStatusFilter("all");
                      setCurrentPage(1);
                    }}
                    className="px-4 py-2.5 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center gap-2"
                  >
                    <i data-feather="refresh-cw" className="w-4 h-4"></i>
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Words Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              {filteredWords.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-16 h-16 text-gray-300 mx-auto mb-4 flex items-center justify-center">
                    <i data-feather="file-text" className="w-16 h-16"></i>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No words found</h3>
                  <p className="text-gray-500">
                    {searchTerm || statusFilter !== "all" 
                      ? "Try adjusting your filters" 
                      : "No words have been submitted yet"}
                  </p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Word</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Meaning</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Submitted By</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                          <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {paginatedWords.map((word) => (
                          <tr 
                            key={word._id || word.id} 
                            className="hover:bg-gray-50 transition-colors cursor-pointer"
                            onClick={() => handleWordClick(word._id || word.id)}
                          >
                            <td className="px-6 py-4">
                              <div className="font-semibold text-gray-900">{word.word}</div>
                              {word.pronunciation && (
                                <div className="text-sm text-gray-500 mt-1">{word.pronunciation}</div>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-gray-700 line-clamp-2">{word.meaning}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-700">
                                {word.created_by || word.creator || "Unknown"}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {getStatusBadge(word.status)}
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-500">
                                {formatDate(word.created_at || word.created_date)}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleWordClick(word._id || word.id);
                                }}
                                className="flex items-center gap-2 px-3 py-1.5 bg-yellow-500 text-white text-xs font-semibold rounded-lg hover:bg-yellow-600 transition-colors"
                              >
                                <i data-feather="eye" className="w-3 h-3"></i>
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="border-t border-gray-200 px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          Showing <span className="font-semibold">{startIndex + 1}</span> to{" "}
                          <span className="font-semibold">
                            {Math.min(startIndex + itemsPerPage, filteredWords.length)}
                          </span>{" "}
                          of <span className="font-semibold">{filteredWords.length}</span> words
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Previous
                          </button>
                          {[...Array(totalPages)].map((_, index) => (
                            <button
                              key={index + 1}
                              onClick={() => handlePageChange(index + 1)}
                              className={`px-3 py-1.5 border rounded-lg text-sm font-semibold ${
                                currentPage === index + 1
                                  ? "bg-yellow-500 border-yellow-500 text-white"
                                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              {index + 1}
                            </button>
                          ))}
                          <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

          </main>
        </div>
      </div>
    </RoleGuard>
  );
}