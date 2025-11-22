"use client";

import ModeratorNavbar from '@/components/moderatorNavbar';
import ModeratorSidebar from '@/components/moderatorSidebar';
import React from 'react';
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import getBaseUrl from '@/app/api/baseUrl';
import feather from 'feather-icons';

export default function Page() {
  const [words, setWords] = useState([]);
  const [filteredWords, setFilteredWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const base_url = getBaseUrl();

  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("pending");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    const getModeratorWords = async () => {
      const token = Cookies.get("token");
      try {
        const res = await fetch(`${base_url}/user/word/list`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const wordsList = Array.isArray(data) ? data : data.words || [];
        setWords(wordsList);
        setFilteredWords(wordsList.filter(word => word.status === "pending"));
      } catch (error) {
        console.error("Error fetching words:", error);
      } finally {
        setLoading(false);
      }
    };

    getModeratorWords();
  }, []);

  // Apply filters whenever filters or words change
  useEffect(() => {
    const filtered = words.filter(word => {
      // Status filter
      const matchesStatus = statusFilter === "all" || word.status === statusFilter;

      // Search filter
      const matchesSearch = searchTerm === "" || 
        word.word?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.meaning?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        word.submittedBy?.toLowerCase().includes(searchTerm.toLowerCase());

      // Language filter
      const matchesLanguage = languageFilter === "all" || word.language === languageFilter;

      // Category filter
      const matchesCategory = categoryFilter === "all" || word.category === categoryFilter;

      return matchesStatus && matchesSearch && matchesLanguage && matchesCategory;
    });

    setFilteredWords(filtered);
  }, [searchTerm, statusFilter, languageFilter, categoryFilter, words]);

  // Update feather icons
  useEffect(() => {
    feather.replace();
  }, [filteredWords, loading]);

  // Handle status update
  const handleStatusUpdate = async (wordId, newStatus) => {
    const token = Cookies.get("token");
    try {
      const res = await fetch(`${base_url}/user/word/update/${wordId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        // Update local state
        setWords(prevWords => prevWords.filter(word => word.id !== wordId));
        alert(`Word ${newStatus === "approved" ? "approved" : "rejected"} successfully!`);
      } else {
        alert("Failed to update word status.");
      }
    } catch (error) {
      console.error("Error updating word status:", error);
      alert("Error updating word status.");
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("pending");
    setLanguageFilter("all");
    setCategoryFilter("all");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ModeratorNavbar />
        <div className="flex">
          <ModeratorSidebar />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading submissions...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ModeratorNavbar />
      <div className="flex">
        <ModeratorSidebar />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Review Submissions</h1>
              <p className="text-gray-600">Review and moderate word submissions from users</p>
            </div>
          </div>

          {/* Filters Section */}
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Filters</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Submissions
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

              {/* Language Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Language
                </label>
                <select
                  value={languageFilter}
                  onChange={(e) => setLanguageFilter(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="all">All Languages</option>
                  <option value="yoruba">Yoruba</option>
                  <option value="igbo">Igbo</option>
                  <option value="hausa">Hausa</option>
                  <option value="pidgin">Pidgin</option>
                  <option value="english">English</option>
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="all">All Categories</option>
                  <option value="greeting">Greeting</option>
                  <option value="food">Food</option>
                  <option value="family">Family</option>
                  <option value="numbers">Numbers</option>
                  <option value="verbs">Verbs</option>
                  <option value="nouns">Nouns</option>
                  <option value="adjectives">Adjectives</option>
                  <option value="phrases">Common Phrases</option>
                </select>
              </div>
            </div>

            {/* Active Filters and Clear Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-600">
                  Showing {filteredWords.length} of {words.length} submissions
                </span>
                {(searchTerm || statusFilter !== "pending" || languageFilter !== "all" || categoryFilter !== "all") && (
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
                    {languageFilter !== "all" && (
                      <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs capitalize">
                        {languageFilter}
                      </span>
                    )}
                    {categoryFilter !== "all" && (
                      <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs capitalize">
                        {categoryFilter}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {(searchTerm || statusFilter !== "pending" || languageFilter !== "all" || categoryFilter !== "all") && (
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

          {/* Submissions Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {filteredWords.length === 0 ? (
              <div className="text-center py-12">
                <i data-feather="inbox" className="w-16 h-16 text-gray-400 mx-auto mb-4"></i>
                <p className="text-gray-600 text-lg mb-2">No submissions found</p>
                <p className="text-gray-500">
                  {words.length === 0 
                    ? "No word submissions available." 
                    : "Try adjusting your filters to see more results."
                  }
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Word
                        </th>
                        <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Language
                        </th>
                        <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Submitted By
                        </th>
                        <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Submitted
                        </th>
                        <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredWords.map((word) => (
                        <tr key={word.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{word.word}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {word.meaning}
                            </div>
                          </td>
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                            <span className="bg-primary text-white px-2 py-1 rounded-full text-xs capitalize">
                              {word.language}
                            </span>
                          </td>
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                            {word.category ? (
                              <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs capitalize">
                                {word.category}
                              </span>
                            ) : (
                              <span className="text-gray-400 text-xs">—</span>
                            )}
                          </td>
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {word.submittedBy || "Anonymous"}
                          </td>
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(word.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              word.status === "approved" 
                                ? "bg-green-100 text-green-800"
                                : word.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {word.status}
                            </span>
                          </td>
                          <td className="px-4 md:px-6 py-4 whitespace-nowrap">
                            <div className="flex gap-2">
                              {word.status === "pending" && (
                                <>
                                  <button 
                                    onClick={() => handleStatusUpdate(word.id, "approved")}
                                    className="bg-green-500 text-white px-3 py-1 rounded text-sm font-semibold hover:bg-green-600 transition-colors flex items-center gap-1"
                                  >
                                    <i data-feather="check" className="w-3 h-3"></i> Approve
                                  </button>
                                  <button 
                                    onClick={() => handleStatusUpdate(word.id, "rejected")}
                                    className="bg-red-500 text-white px-3 py-1 rounded text-sm font-semibold hover:bg-red-600 transition-colors flex items-center gap-1"
                                  >
                                    <i data-feather="x" className="w-3 h-3"></i> Reject
                                  </button>
                                </>
                              )}
                              <a
                                href={`/moderator/review-detail/${word.id}`}
                                className="bg-blue-500 text-white px-3 py-1 rounded text-sm font-semibold hover:bg-blue-600 transition-colors flex items-center gap-1"
                              >
                                <i data-feather="edit" className="w-3 h-3"></i> Review
                              </a>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="px-4 md:px-6 py-4 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-gray-500">
                      Showing <span className="font-medium">{filteredWords.length}</span> of{' '}
                      <span className="font-medium">{words.length}</span> results
                    </div>
                    <div className="flex gap-2">
                      <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 transition-colors text-sm">
                        Previous
                      </button>
                      <button className="px-3 py-1 border border-gray-300 rounded-md bg-primary text-white text-sm">
                        1
                      </button>
                      <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 transition-colors text-sm">
                        2
                      </button>
                      <button className="px-3 py-1 border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 transition-colors text-sm">
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}