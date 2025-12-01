"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import feather from "feather-icons";
import AdminNavbar from "@/components/adminNavbar";
import AdminSideBar from "@/components/adminSideBar";
import RoleGuard from "@/utils/RoleGuard";
import getBaseUrl from "@/app/api/baseUrl";

export default function AdminActivityPage() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const base_url = getBaseUrl();

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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-semibold">Loading activity data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i data-feather="alert-triangle" className="w-16 h-16 text-red-500 mx-auto mb-4"></i>
          <p className="text-red-600 text-lg font-semibold">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-500-dark transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={["admin", "super_admin"]}>
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        
        <div className="flex">
          <AdminSideBar />
          
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            {/* Header */}
            <div className="mb-6 md:mb-8">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <i data-feather="activity" className="w-6 h-6 md:w-7 md:h-7 text-yellow-500"></i> 
                User Activity Log
              </h1>
              <p className="text-gray-600 font-medium">
                Monitor all user activities and word submissions
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 md:mb-8">
              <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border-l-4 border-yellow-500">
                <p className="text-gray-700 font-semibold text-sm md:text-base mb-2">Total Activities</p>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">{words.length}</h3>
              </div>
              
              <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border-l-4 border-blue-900">
                <p className="text-gray-700 font-semibold text-sm md:text-base mb-2">Pending Reviews</p>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {words.filter(w => w.status === 'pending').length}
                </h3>
              </div>
              
              <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border-l-4 border-red-900">
                <p className="text-gray-700 font-semibold text-sm md:text-base mb-2">Approved Today</p>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {words.filter(w => 
                    w.status === 'approved' && 
                    new Date(w.created_at).toDateString() === new Date().toDateString()
                  ).length}
                </h3>
              </div>
              
              <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg border-l-4 border-green-600">
                <p className="text-gray-700 font-semibold text-sm md:text-base mb-2">Active Users</p>
                <h3 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {new Set(words.map(w => w.created_by)).size}
                </h3>
              </div>
            </div>

            {/* Activity Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-4 md:px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Recent Activities</h2>
              </div>

              {words.length === 0 ? (
                <div className="text-center py-12">
                  <i data-feather="inbox" className="w-16 h-16 text-gray-400 mx-auto mb-4"></i>
                  <p className="text-gray-600 font-semibold text-lg">No recorded activities yet.</p>
                  <p className="text-gray-500 mt-2">User activities will appear here once they start submitting words.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  {/* Mobile Cards View */}
                  <div className="md:hidden space-y-4 p-4">
                    {words.map((item, idx) => (
                      <div key={idx} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex justify-between items-start mb-3">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                            item.status === 'approved' 
                              ? 'bg-green-100 text-green-800' 
                              : item.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            <i
                              data-feather={
                                item.status === 'approved' ? 'check' : 
                                item.status === 'pending' ? 'clock' : 'edit'
                              }
                              className="w-3 h-3 mr-1"
                            ></i>
                            {item.status}
                          </span>
                          <span className="text-xs text-gray-500 font-medium">
                            {new Date(item.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <h3 className="font-bold text-gray-900 text-lg mb-2">{item.word}</h3>
                        <p className="text-gray-700 mb-2">{item.meaning}</p>
                        
                        <div className="flex justify-between items-center text-sm text-gray-600">
                          <span className="font-medium">By: {item.created_by || 'Unknown'}</span>
                          <span>{new Date(item.created_at).toLocaleTimeString()}</span>
                        </div>
                        
                        <div className="mt-3 flex gap-2">
                          <a href={`/word-details/${item.id}`}>
                            <button className="flex-1 bg-yellow-500 text-white font-semibold py-2 px-3 rounded-lg text-sm hover:bg-yellow-500-dark transition-colors">
                             View Details
                            </button>
                          </a>
                          {item.status === 'pending' && (
                            <a href={`/review/${item.id}`}>
                              <button className="flex-1 bg-blue-900 text-white font-semibold py-2 px-3 rounded-lg text-sm hover:bg-blue-900-dark transition-colors">
                                Review
                              </button>
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Desktop Table View */}
                  <table className="hidden md:table min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        {["Word", "Meaning", "Submitted By", "Status", "Date", "Actions"].map(
                          (header) => (
                            <th
                              key={header}
                              className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider"
                            >
                              {header}
                            </th>
                          )
                        )}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {words.map((item, idx) => (
                        <tr
                          key={idx}
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="font-semibold text-gray-900 text-lg">
                              {item.word}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-gray-700 font-medium max-w-xs truncate">
                              {item.meaning}
                            </p>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-gray-700 font-medium">
                              {item.created_by || 'Unknown'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                                item.status === 'approved'
                                  ? 'bg-green-100 text-green-800'
                                  : item.status === 'pending'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-blue-100 text-blue-800'
                              }`}
                            >
                              <i
                                data-feather={
                                  item.status === 'approved' ? 'check' : 
                                  item.status === 'pending' ? 'clock' : 'edit'
                                }
                                className="w-3 h-3 mr-1"
                              ></i>
                              {item.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-700">
                              <div className="font-medium">{new Date(item.created_at).toLocaleDateString()}</div>
                              <div className="text-gray-500">{new Date(item.created_at).toLocaleTimeString()}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex gap-2">
                              <a href={`/word-details/${item.id}`}>
                              <button className="bg-yellow-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-yellow-500-dark transition-colors text-sm">
                                View
                              </button>
                              </a>
                              {item.status === 'pending' && (
                                <button className="bg-blue-900 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-900-dark transition-colors text-sm">
                                  Review
                                </button>
                              )}
                            </div>
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