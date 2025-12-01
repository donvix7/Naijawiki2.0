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
  const [error, setError] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [reason, setReason] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    word: "",
    meaning: "",
    pronunciation: "",
    use_case: "",
    language: "",
    category: ""
  });

  const token = Cookies.get("token");
  const base_url = getBaseUrl();

  // Fetch only the single word
  useEffect(() => {
    const fetchWord = async () => {
      try {
        if (!token) {
          setError("Authentication required");
          setLoading(false);
          return;
        }

        const res = await fetch(`${base_url}/word/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 404) {
            setError("Word not found");
          } else if (res.status === 401) {
            setError("Unauthorized access");
          } else {
            throw new Error("Failed to fetch word");
          }
          return;
        }

        const data = await res.json();
        const wordData = data.word || data;
        setWord(wordData);
        // Initialize edit form with current data
        setEditForm({
          word: wordData.word || "",
          meaning: wordData.meaning || "",
          pronunciation: wordData.pronunciation || "",
          use_case: wordData.use_case || "",
          language: wordData.language || "",
          category: wordData.category || ""
        });
      } 
      catch (err) {
        console.error("Failed to load word:", err);
        setError(err.message || "Failed to load word");
      } 
      finally {
        setLoading(false);
      }
    };

    fetchWord();
  }, [id, base_url, token]);

  // Initialize feather icons
  useEffect(() => {
    feather.replace();
  }, [isEditing]);

  // Handle edit form changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit edited word
  const submitEdit = async () => {
    if (!word || !id) return;
    
    setActionLoading(true);
    try {
      console.log("Updating word with ID:", id);
      
      const res = await fetch(`${base_url}/word/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm)
      });

      console.log("Update response status:", res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Update error response:", errorText);
        throw new Error(`Failed to update word: ${res.status} ${errorText}`);
      }

      const data = await res.json();
      console.log("Update success:", data);
      
      // Update local state with new data
      setWord(prev => ({ ...prev, ...editForm }));
      setIsEditing(false);
      alert("Word updated successfully!");
    } 
    catch (err) {
      console.error("Update error:", err);
      alert("Error updating word: " + err.message);
    }
    finally {
      setActionLoading(false);
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    // Reset form to original values
    setEditForm({
      word: word?.word || "",
      meaning: word?.meaning || "",
      pronunciation: word?.pronunciation || "",
      use_case: word?.use_case || "",
      language: word?.language || "",
      category: word?.category || ""
    });
    setIsEditing(false);
  };

  // Approve word
  const approveWord = async () => {
    if (!word || !id) return;
    
    setActionLoading(true);
    try {
      console.log("Approving word with ID:", id);
      
      const res = await fetch(`${base_url}/word/approve-word/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      });

      console.log("Approve response status:", res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Approve error response:", errorText);
        throw new Error(`Failed to approve word: ${res.status} ${errorText}`);
      }

      const data = await res.json();
      console.log("Approve success:", data);
      
      setWord(prev => ({ ...prev, status: "approved" }));
      alert("Word approved successfully!");
    } 
    catch (err) {
      console.error("Approve error:", err);
      alert("Error approving word: " + err.message);
    }
    finally {
      setActionLoading(false);
    }
  };

  // Open reject modal
  const openRejectModal = () => {
    setShowRejectModal(true);
    setReason("");
  };

  // Close reject modal
  const closeRejectModal = () => {
    setShowRejectModal(false);
    setReason("");
  };

  // Reject word with reason
  const rejectWord = async () => {
    if (!word || !id || !reason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }
    
    setActionLoading(true);
    try {
      console.log("Rejecting word with ID:", id, "Reason:", reason);
      
      const res = await fetch(`${base_url}/word/reject-word/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reason: reason.trim()
        })
      });

      console.log("Reject response status:", res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Reject error response:", errorText);
        throw new Error(`Failed to reject word: ${res.status} ${errorText}`);
      }

      const data = await res.json();
      console.log("Reject success:", data);
      
      setWord(prev => ({ ...prev, status: "rejected" }));
      alert("Word rejected successfully!");
      closeRejectModal();
    } 
    catch (err) {
      console.error("Reject error:", err);
      alert("Error rejecting word: " + err.message);
    }
    finally {
      setActionLoading(false);
    }
  };

  // Handle back to words list
  const handleBack = () => {
    router.push('/admin/word');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-semibold">Loading word details...</p>
        </div>
      </div>
    );
  }

  if (error || !word) {
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
            {error || "Word not found"}
          </p>
          <button 
            onClick={handleBack}
            className="px-6 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-500-dark transition-colors"
          >
            Back to Words
          </button>
        </div>
      </div>
    );
  }

  // Manual SVG icons
  const icons = {
    arrowLeft: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12"></line>
        <polyline points="12 19 5 12 12 5"></polyline>
      </svg>
    ),
    check: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    ),
    x: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    ),
    edit: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
      </svg>
    ),
    save: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
        <polyline points="17 21 17 13 7 13 7 21"></polyline>
        <polyline points="7 3 7 8 15 8"></polyline>
      </svg>
    ),
    cancel: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    ),
    info: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
    ),
    alert: (
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
    )
  };

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
                <h1 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
                  Word Details
                </h1>
                <p className="text-gray-600 text-base font-normal">
                  Review and manage this word submission
                </p>
              </div>
              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:text-gray-900 font-semibold hover:bg-gray-100 rounded-lg transition-colors text-sm"
              >
                {icons.arrowLeft}
                Back to Words
              </button>
            </div>

            {/* Word Information Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
              <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Word Information
                </h2>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors text-sm"
                  >
                    {icons.edit}
                    Edit Details
                  </button>
                )}
              </div>
              
              {isEditing ? (
                // Edit Form
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-3 tracking-wide uppercase text-xs">
                        Word
                      </label>
                      <input
                        type="text"
                        name="word"
                        value={editForm.word}
                        onChange={handleEditChange}
                        className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 font-normal text-base placeholder-gray-500 transition-all duration-200"
                        placeholder="Enter the word"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-3 tracking-wide uppercase text-xs">
                        Language
                      </label>
                      <input
                        type="text"
                        name="language"
                        value={editForm.language}
                        onChange={handleEditChange}
                        className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 font-normal text-base placeholder-gray-500 transition-all duration-200"
                        placeholder="Enter language"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-3 tracking-wide uppercase text-xs">
                      Meaning
                    </label>
                    <textarea
                      name="meaning"
                      value={editForm.meaning}
                      onChange={handleEditChange}
                      rows="3"
                      className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 font-normal text-base placeholder-gray-500 transition-all duration-200 resize-none"
                      placeholder="Enter word meaning"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-3 tracking-wide uppercase text-xs">
                        Pronunciation
                      </label>
                      <input
                        type="text"
                        name="pronunciation"
                        value={editForm.pronunciation}
                        onChange={handleEditChange}
                        className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 font-normal text-base placeholder-gray-500 transition-all duration-200"
                        placeholder="Enter pronunciation guide"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-3 tracking-wide uppercase text-xs">
                        Category
                      </label>
                      <input
                        type="text"
                        name="category"
                        value={editForm.category}
                        onChange={handleEditChange}
                        className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 font-normal text-base placeholder-gray-500 transition-all duration-200"
                        placeholder="Enter category"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-3 tracking-wide uppercase text-xs">
                      Example Usage
                    </label>
                    <textarea
                      name="use_case"
                      value={editForm.use_case}
                      onChange={handleEditChange}
                      rows="3"
                      className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 font-normal text-base placeholder-gray-500 transition-all duration-200 resize-none"
                      placeholder="Enter example usage"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={submitEdit}
                      disabled={actionLoading}
                      className="flex items-center gap-2 bg-primary text-white font-semibold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors text-sm disabled:opacity-50"
                    >
                      {actionLoading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        icons.save
                      )}
                      Save Changes
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="flex items-center gap-2 bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                    >
                      {icons.cancel}
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                // Display View
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-3 tracking-wide uppercase text-xs">
                        Word
                      </label>
                      <p className="text-base font-semibold text-gray-900">
                        {word.word || "N/A"}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-3 tracking-wide uppercase text-xs">
                        Language
                      </label>
                      <p className="text-base font-semibold text-gray-900">
                        {word.language || "N/A"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-800 mb-3 tracking-wide uppercase text-xs">
                      Meaning
                    </label>
                    <p className="text-base font-normal text-gray-700 leading-relaxed">
                      {word.meaning || "No meaning provided"}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-3 tracking-wide uppercase text-xs">
                        Pronunciation
                      </label>
                      <p className="text-base font-normal text-gray-700">
                        {word.pronunciation || "N/A"}
                      </p>
                    </div>

                    
                  </div>

                  {word.use_case && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-3 tracking-wide uppercase text-xs">
                        Example Usage
                      </label>
                      <p className="text-base font-normal text-gray-700 leading-relaxed">
                        {word.use_case}
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-3 tracking-wide uppercase text-xs">
                        Status
                      </label>
                      <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold ${
                        word.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : word.status === "rejected"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {word.status ? word.status.charAt(0).toUpperCase() + word.status.slice(1) : "Pending"}
                      </span>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-3 tracking-wide uppercase text-xs">
                        Submitted By
                      </label>
                      <p className="text-base font-normal text-gray-700">
                        {word.creatorEmail || word.creator || word.created_by || "Unknown"}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                Quick Actions
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <button
                  onClick={approveWord}
                  disabled={actionLoading || word.status === "approved" || isEditing}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 disabled:cursor-not-allowed text-sm"
                >
                  {actionLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    icons.check
                  )}
                  <span>
                    {word.status === "approved" ? "Already Approved" : "Approve Word"}
                  </span>
                </button>

                <button
                  onClick={openRejectModal}
                  disabled={actionLoading || word.status === "rejected" || isEditing}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-3 disabled:cursor-not-allowed text-sm"
                >
                  {icons.x}
                  <span>
                    {word.status === "rejected" ? "Already Rejected" : "Reject Word"}
                  </span>
                </button>
              </div>

              {/* Additional Information */}
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-3">
                  {icons.info}
                  <div>
                    <p className="text-blue-800 font-semibold text-sm">Word Review Guidelines</p>
                    <p className="text-blue-700 text-sm mt-1 leading-relaxed">
                      Ensure the word is appropriate, culturally relevant, and follows platform guidelines before approval.
                      Use the edit functionality to modify any information before approving.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* Rejection Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="text-red-500">
                  {icons.alert}
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Reject Word</h3>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                  You are about to reject the word: <strong>"{word.word}"</strong>
                </p>
                <label htmlFor="rejectionReason" className="block text-sm font-semibold text-gray-700 mb-2">
                  Reason for Rejection *
                </label>
                <textarea
                  id="rejectionReason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please provide a clear reason for rejecting this word..."
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none text-sm"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  This reason will be recorded and may be shared with the submitter.
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={closeRejectModal}
                  disabled={actionLoading}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 font-semibold hover:bg-gray-100 rounded-lg transition-colors text-sm disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={rejectWord}
                  disabled={actionLoading || !reason.trim()}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 disabled:cursor-not-allowed text-sm"
                >
                  {actionLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    icons.x
                  )}
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </RoleGuard>
  );
}