"use client";

import AdminNavbar from "@/components/adminNavbar";
import AdminSidebar from "@/components/adminSideBar";
import getBaseUrl from "@/app/api/baseUrl";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import feather from "feather-icons";
import { useParams, useRouter } from "next/navigation";
import RoleGuard from "@/utils/RoleGuard";

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const [word, setWord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const token = Cookies.get("token");
  const base_url = getBaseUrl();

  // Fetch only the single word
  useEffect(() => {
    const fetchWord = async () => {
      try {
        const res = await fetch(`${base_url}/word/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch word");

        const data = await res.json();
        setWord(data.word);
      } 
      catch (err) {
        console.error("Failed to load word:", err);
      } 
      finally {
        setLoading(false);
      }
    };

    fetchWord();
  }, [id, base_url, token]);

  // Load feather icons once word loads
  useEffect(() => {
    feather.replace();
  }, [word]);

  // Approve
  const approveWord = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`${base_url}/word/approve-word/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      });

      if (!res.ok) throw new Error("Failed to approve word");

      setWord((prev) => ({ ...prev, status: "approved" }));
      alert("Word approved successfully!");
    } 
    catch (err) {
      console.error(err);
      alert("Error approving word");
    }
    finally {
      setActionLoading(false);
    }
  };

  // Reject
  const rejectWord = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`${base_url}/word/reject-word/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      });

      if (!res.ok) throw new Error("Failed to reject word");

      setWord((prev) => ({ ...prev, status: "rejected" }));
      alert("Word rejected!");
    } 
    catch (err) {
      console.error(err);
      alert("Error rejecting word");
    }
    finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-semibold">Loading word details...</p>
        </div>
      </div>
    );
  }

  if (!word) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i data-feather="alert-circle" className="w-16 h-16 text-red-500 mx-auto mb-4"></i>
          <p className="text-red-600 text-lg font-semibold mb-4">Word not found</p>
          <button 
            onClick={() => router.push('/admin/words')}
            className="px-6 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors"
          >
            Back to Words
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
          <AdminSidebar />

          <main className="flex-1 p-4 md:p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  Word Details
                </h1>
                <p className="text-gray-600 font-medium">
                  Review and manage this word submission
                </p>
              </div>
              
              <div className="flex gap-2">
                <a
                  href={`/admin/word/edit/${id}`}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-dark transition-colors shadow-lg hover:shadow-xl"
                >
                  <i data-feather="edit" className="w-4 h-4"></i>
                  Edit Word
                </a>
                <button
                  onClick={() => router.push('/admin/word')}
                  className="flex items-center gap-2 px-4 py-2 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <i data-feather="arrow-left" className="w-4 h-4"></i>
                  Back to Words
                </button>
              </div>
            </div>

            {/* Word Information Card */}
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 md:mb-6 pb-2 border-b border-gray-200">
                Word Information
              </h2>
              
              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">Word</label>
                  <p className="text-gray-900 font-bold text-xl">{word.word}</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">Language</label>
                  <p className="text-gray-900 font-medium">{word.language || "Not specified"}</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">Meaning</label>
                  <p className="text-gray-900 font-medium">{word.meaning || "No meaning provided"}</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">Status</label>
                  <span
                    className={`px-3 py-1 text-sm font-semibold rounded-full ${
                      word.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : word.status === "rejected"
                        ? "bg-red-100 text-red-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {word.status?.charAt(0).toUpperCase() + word.status?.slice(1) || "Unknown"}
                  </span>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">Submitted By</label>
                  <p className="text-gray-900 font-medium">{word.creatorEmail || word.submittedBy || "Unknown"}</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <label className="block text-gray-700 font-semibold mb-2 text-sm">Date Submitted</label>
                  <p className="text-gray-900 font-medium">
                    {new Date(word.createdAt).toLocaleDateString()} at {new Date(word.createdAt).toLocaleTimeString()}
                  </p>
                </div>
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <tbody className="bg-white divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">Word</td>
                      <td className="px-6 py-4 whitespace-nowrap text-lg font-bold text-gray-900">{word.word}</td>
                    </tr>
                    
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">Language</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">{word.language || "Not specified"}</td>
                    </tr>
                    
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">Meaning</td>
                      <td className="px-6 py-4 text-gray-900 font-medium">{word.meaning || "No meaning provided"}</td>
                    </tr>
                    
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">Status</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-3 py-1 text-sm font-semibold rounded-full ${
                            word.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : word.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {word.status?.charAt(0).toUpperCase() + word.status?.slice(1) || "Unknown"}
                        </span>
                      </td>
                    </tr>
                    
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">Submitted By</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">{word.creatorEmail || word.submittedBy || "Unknown"}</td>
                    </tr>
                    
                    <tr className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">Date Submitted</td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-900 font-medium">
                        {new Date(word.createdAt).toLocaleDateString()} at {new Date(word.createdAt).toLocaleTimeString()}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Actions Card */}
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 md:mb-6 pb-2 border-b border-gray-200">
                Quick Actions
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={approveWord}
                  disabled={actionLoading || word.status === "approved"}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {actionLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <i data-feather="check" className="w-5 h-5"></i>
                  )}
                  <span className="text-lg">
                    {word.status === "approved" ? "Already Approved" : "Approve Word"}
                  </span>
                </button>

                <button
                  onClick={rejectWord}
                  disabled={actionLoading || word.status === "rejected"}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                >
                  {actionLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <i data-feather="x" className="w-5 h-5"></i>
                  )}
                  <span className="text-lg">
                    {word.status === "rejected" ? "Already Rejected" : "Reject Word"}
                  </span>
                </button>

                <a
                  href={`/admin/word/edit/${id}`}
                  className="bg-gradient-to-r from-primary to-secondary hover:from-primary-dark hover:to-secondary-dark text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                >
                  <i data-feather="edit-3" className="w-5 h-5"></i>
                  <span className="text-lg">Edit Word Details</span>
                </a>
              </div>

              {/* Additional Information */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  <i data-feather="info" className="w-5 h-5 text-blue-600 mt-0.5"></i>
                  <div>
                    <p className="text-blue-800 font-semibold text-sm">Word Review Guidelines</p>
                    <p className="text-blue-700 text-sm mt-1">
                      Ensure the word is appropriate, culturally relevant, and follows platform guidelines before approval.
                      Use the "Edit Word Details" button to modify any information before approving.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </RoleGuard>
  );
}