"use client";

import React, { useEffect, useState } from "react";
import ModeratorNavbar from "@/components/moderatorNavbar";
import ModeratorSidebar from "@/components/moderatorSidebar";
import Cookies from "js-cookie";
import feather from "feather-icons";
import RoleGuard from "@/utils/RoleGuard";
import getBaseUrl from "../api/baseUrl";

//  Fetch Moderator Stats
const fetchModeratorStats = async () => {
  const token = Cookies.get("token");
  const base_url = getBaseUrl();

  try {
    const res = await fetch(`${base_url}/user/word/list`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch moderator stats");

    const data = await res.json();
    const words = Array.isArray(data) ? data : data.words || [];

    const pending = words.filter(w => w.status === "pending").length;
    const reviewed = words.filter(w => ["approved", "rejected"].includes(w.status)).length;
    const flagged = words.filter(w => w.flagged).length;
    const wordsNeedingReview = words.filter(w => w.status === "pending").slice(0, 5);

    return { pending, reviewed, flagged, wordsNeedingReview, allWords: words };
  } catch (err) {
    console.error("❌ Error fetching moderator stats:", err);
    return { pending: 0, reviewed: 0, flagged: 0, wordsNeedingReview: [], allWords: [] };
  }
};

// ✅ Update Word Status (Approve/Reject)
const updateWordStatus = async (wordId, status) => {
  const token = Cookies.get("token");
  const base_url = getBaseUrl();

  try {
    const res = await fetch(`${base_url}/user/word/update/${wordId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) throw new Error("Failed to update word status");

    return await res.json();
  } catch (err) {
    console.error("❌ Error updating word status:", err);
    throw err;
  }
};

const ModeratorDashboard = () => {
  const [stats, setStats] = useState({
    pending: 0,
    reviewed: 0,
    flagged: 0,
    wordsNeedingReview: [],
    allWords: [],
  });

  // Search and status filters
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [filteredWords, setFilteredWords] = useState([]);

  useEffect(() => {
    fetchModeratorStats().then(setStats);
  }, []);

  // Apply filters whenever search term, status filter, or words change
  useEffect(() => {
    const filtered = stats.allWords.filter(word => {
      // Search filter
      const matchesSearch = searchTerm === "" || 
        word.word?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.meaning?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.submittedBy?.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus = statusFilter === "all" || word.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    setFilteredWords(filtered);
  }, [searchTerm, statusFilter, stats.allWords]);

  useEffect(() => {
    feather.replace();
  }, [stats, filteredWords]);

  // ✅ Handle Approve / Reject
  const handleStatusUpdate = async (wordId, status) => {
    try {
      await updateWordStatus(wordId, status);

      // Update UI immediately
      setStats((prev) => ({
        ...prev,
        wordsNeedingReview: prev.wordsNeedingReview.filter(w => w.id !== wordId),
        reviewed: prev.reviewed + 1,
        pending: Math.max(prev.pending - 1, 0),
        allWords: prev.allWords.map(w => 
          w.id === wordId ? { ...w, status } : w
        )
      }));

      alert(`Word ${status === "approved" ? "approved" : "rejected"} successfully.`);
    } catch (err) {
      alert("Failed to update word status. Please try again.");
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("pending");
  };

  return (
    <RoleGuard allowedRoles={["admin", "super_admin", "moderator"]}>
      <div className="min-h-screen bg-gray-50">
        <ModeratorNavbar />
        <div className="flex">
          <ModeratorSidebar />
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  Moderator Dashboard
                </h1>
                <p className="text-gray-600 font-medium">
                  Review and manage word submissions
                </p>
              </div>
            </div>

            {/* ✅ Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
              {[
                { label: "Pending Words", value: stats.pending, icon: "clock", color: "border-yellow-500 text-yellow-600", bgColor: "bg-yellow-50" },
                { label: "Words Reviewed", value: stats.reviewed, icon: "check-circle", color: "border-green-500 text-green-600", bgColor: "bg-green-50" },
                { label: "Flagged Words", value: stats.flagged, icon: "flag", color: "border-red-500 text-red-600", bgColor: "bg-red-50" },
              ].map((card, idx) => (
                <div
                  key={idx}
                  className={`${card.bgColor} p-4 md:p-6 rounded-xl shadow-sm border-l-4 ${card.color} hover:shadow-md transition-shadow duration-300`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">{card.label}</p>
                      <h3 className="text-2xl md:text-3xl font-bold mt-1">{card.value}</h3>
                    </div>
                    <i data-feather={card.icon} className="w-6 h-6 md:w-8 md:h-8"></i>
                  </div>
                </div>
              ))}
            </div>

            {/* ✅ Search and Status Filters */}
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6 md:mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Filters</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {/* Search Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Words
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by word, meaning, or submitter..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                    />
                    <i
                      data-feather="search"
                      className="absolute left-3 top-3 text-gray-400 w-4 h-4"
                    ></i>
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="pending">Pending Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="all">All Status</option>
                  </select>
                </div>
              </div>

              {/* Active Filters and Clear Button */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-gray-600">
                    Showing {filteredWords.length} of {stats.allWords.length} words
                  </span>
                  {(searchTerm || statusFilter !== "pending") && (
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">Active filters:</span>
                      {searchTerm && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          Search: "{searchTerm}"
                        </span>
                      )}
                      {statusFilter !== "pending" && statusFilter !== "all" && (
                        <span className={`px-2 py-1 rounded-full text-xs capitalize ${
                          statusFilter === "approved" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-red-100 text-red-800"
                        }`}>
                          {statusFilter}
                        </span>
                      )}
                      {statusFilter === "all" && (
                        <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs">
                          All Status
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {(searchTerm || statusFilter !== "pending") && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors text-sm"
                  >
                    <i data-feather="x" className="w-4 h-4"></i>
                    Clear Filters
                  </button>
                )}
              </div>
            </div>

            {/* ✅ Words List */}
            <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {statusFilter === "pending" ? "Words Needing Review" : 
                   statusFilter === "approved" ? "Approved Words" :
                   statusFilter === "rejected" ? "Rejected Words" : "All Words"}
                </h2>
                <a
                  href="/moderator/review"
                  className="flex items-center gap-2 text-primary hover:text-primary-dark font-semibold transition-colors"
                >
                  View Detailed List
                  <i data-feather="arrow-right" className="w-4 h-4"></i>
                </a>
              </div>

              <div className="space-y-4">
                {filteredWords.length === 0 ? (
                  <div className="text-center py-8">
                    <i data-feather="inbox" className="w-12 h-12 text-gray-400 mx-auto mb-4"></i>
                    <p className="text-gray-500">
                      {searchTerm || statusFilter !== "pending" 
                        ? "No words found matching your filters." 
                        : "No words pending review. Great job!"
                      }
                    </p>
                  </div>
                ) : (
                  filteredWords.slice(0, 10).map((word) => ( // Show only first 10 words for dashboard
                    <div
                      key={word.id || word.word}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200 gap-4"
                    >
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <h3 className="font-bold text-lg text-gray-900">{word.word}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            word.status === "approved" 
                              ? "bg-green-100 text-green-800"
                              : word.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {word.status}
                          </span>
                          {word.language && (
                            <span className="bg-primary text-white px-2 py-1 rounded-full text-xs capitalize">
                              {word.language}
                            </span>
                          )}
                          {word.category && (
                            <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs capitalize">
                              {word.category}
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600">
                          {word.meaning || "No meaning provided"}
                        </p>
                        {word.example && (
                          <p className="text-gray-500 text-sm mt-1 italic">
                            "{word.example}"
                          </p>
                        )}
                        <div className="mt-2 text-xs text-gray-500">
                          Submitted by: {word.submittedBy || "Anonymous"}
                        </div>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {word.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(word.id, "approved")}
                              className="flex items-center gap-2 bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-green-600 transition-colors"
                            >
                              <i data-feather="check" className="w-4 h-4"></i> Approve
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(word.id, "rejected")}
                              className="flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-red-600 transition-colors"
                            >
                              <i data-feather="x" className="w-4 h-4"></i> Reject
                            </button>
                          </>
                        )}
                        <a
                          href={`/moderator/review-detail/${word.id}`}
                          className="flex items-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors"
                        >
                          <i data-feather="edit" className="w-4 h-4"></i> {word.status === "pending" ? "Review" : "View"}
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {filteredWords.length > 10 && (
                <div className="mt-6 text-center">
                  <a
                    href="/moderator/review"
                    className="inline-flex items-center gap-2 bg-primary text-white font-semibold py-2 px-6 rounded-lg hover:bg-primary-dark transition-colors"
                  >
                    View All {filteredWords.length} Words
                    <i data-feather="arrow-right" className="w-4 h-4"></i>
                  </a>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </RoleGuard>
  );
};

export default ModeratorDashboard;