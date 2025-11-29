"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import feather from "feather-icons";
import CustomNavbar from "@/components/navBar";
import CustomFooter from "@/components/customFooter";
import getBaseUrl from "@/app/api/baseUrl";

export default function UserProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [submittedWords, setSubmittedWords] = useState([]);
  const [wordsLoading, setWordsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState({ message: "", type: "" });

  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    email: "",
  });

  const token = Cookies.get("token");
  const base_url = getBaseUrl();
  const id = Cookies.get("id");

  // Fetch user profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await fetch(`${base_url}/users/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch user profile");

        const data = await res.json();
        setUser(data.user);
        setFormData({
          firstname: data.user.firstname || "",
          lastname: data.user.lastname || "",
          email: data.user.email || "",
        });
      } catch (err) {
        console.error(err);
        setError("Unable to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [base_url, token]);

  // Fetch submitted words
  useEffect(() => {
    const fetchSubmittedWords = async () => {
      try {
        const res = await fetch(`${base_url}/user/words`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch submitted words");

        const data = await res.json();
        setSubmittedWords(data.words || []);
      } catch (err) {
        console.error("Error fetching words:", err);
        setSubmittedWords([]);
      } finally {
        setWordsLoading(false);
      }
    };

    if (user) {
      fetchSubmittedWords();
    }
  }, [base_url, token, user]);

  // Initialize feather icons
  useEffect(() => {
    feather.replace();
  }, [loading, actionLoading, editing, submittedWords]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Update user profile
  const updateProfile = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setStatus({ message: "", type: "" });

    try {
      const res = await fetch(`${base_url}/user/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to update profile");

      setUser(data.user);
      setEditing(false);
      setStatus({
        message: "Profile updated successfully!",
        type: "success"
      });
    } catch (err) {
      console.error(err);
      setStatus({
        message: err.message || "Error updating profile",
        type: "error"
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Change password
  const changePassword = async () => {
    const newPassword = prompt("Enter your new password (min 8 characters):");
    if (!newPassword || newPassword.length < 8) {
      setStatus({
        message: "Password must be at least 8 characters long.",
        type: "error"
      });
      return;
    }

    setActionLoading(true);
    setStatus({ message: "", type: "" });

    try {
      const res = await fetch(`${base_url}/user/change-password`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: newPassword }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to change password");

      setStatus({
        message: "Password changed successfully!",
        type: "success"
      });
    } catch (err) {
      console.error(err);
      setStatus({
        message: err.message || "Error changing password",
        type: "error"
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <CustomNavbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-primary mx-auto mb-5"></div>
            <p className="text-gray-700 text-base font-semibold">Loading profile...</p>
          </div>
        </div>
        <CustomFooter />
      </div>
    );
  }

  // Error state
  if (error || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <CustomNavbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-6">
            <i data-feather="user-x" className="w-16 h-16 text-gray-400 mx-auto mb-5"></i>
            <p className="text-gray-600 font-semibold text-base mb-6">{error || "Profile not found"}</p>
            <button
              onClick={() => router.push('/')}
              className="bg-primary text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-primary-dark transition-colors text-sm"
            >
              Back to Home
            </button>
          </div>
        </div>
        <CustomFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <CustomNavbar />

      <main className="flex-grow">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
                  My Profile
                </h1>
                <p className="text-gray-600 text-base font-normal">
                  Manage your account information and view your submissions
                </p>
              </div>
              
              <button
                onClick={() => router.push('/')}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                <i data-feather="arrow-left" className="w-4 h-4"></i>
                Back to Home
              </button>
            </div>

            {/* Status Message */}
            {status.message && (
              <div className={`mb-6 p-4 rounded-xl ${
                status.type === "success" 
                  ? "bg-green-100 border border-green-300 text-green-800" 
                  : "bg-red-100 border border-red-300 text-red-800"
              }`}>
                <div className="flex items-center gap-3">
                  <i data-feather={status.type === "success" ? "check-circle" : "alert-circle"} className="w-5 h-5"></i>
                  <span className="font-semibold text-sm">{status.message}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Information */}
              <div className="lg:col-span-2 space-y-6">
                {/* Profile Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Profile Information
                    </h2>
                    {!editing && (
                      <button
                        onClick={() => setEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors text-sm"
                      >
                        <i data-feather="edit" className="w-4 h-4"></i>
                        Edit Profile
                      </button>
                    )}
                  </div>

                  {editing ? (
                    <form onSubmit={updateProfile} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-3 tracking-wide uppercase text-xs">
                            First Name
                          </label>
                          <input
                            type="text"
                            name="firstname"
                            value={formData.firstname}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 font-normal text-base placeholder-gray-500 transition-all duration-200"
                            placeholder="Enter your first name"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-3 tracking-wide uppercase text-xs">
                            Last Name
                          </label>
                          <input
                            type="text"
                            name="lastname"
                            value={formData.lastname}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 font-normal text-base placeholder-gray-500 transition-all duration-200"
                            placeholder="Enter your last name"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-3 tracking-wide uppercase text-xs">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 font-normal text-base placeholder-gray-500 transition-all duration-200"
                          placeholder="Enter your email address"
                          required
                        />
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button
                          type="submit"
                          disabled={actionLoading}
                          className="bg-primary text-white font-semibold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors text-sm disabled:opacity-50"
                        >
                          {actionLoading ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditing(false);
                            setFormData({
                              firstname: user.firstname || "",
                              lastname: user.lastname || "",
                              email: user.email || "",
                            });
                          }}
                          className="bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-5">
                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-3 tracking-wide uppercase text-xs">
                            First Name
                          </label>
                          <p className="text-base font-semibold text-gray-900">
                            {user.firstname || "—"}
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-3 tracking-wide uppercase text-xs">
                            Last Name
                          </label>
                          <p className="text-base font-semibold text-gray-900">
                            {user.lastname || "—"}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-5">
                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-3 tracking-wide uppercase text-xs">
                            Email Address
                          </label>
                          <p className="text-base font-semibold text-gray-900">
                            {user.email || "—"}
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-3 tracking-wide uppercase text-xs">
                            User Role
                          </label>
                          <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${
                            user.role === 'admin' 
                              ? 'bg-purple-100 text-purple-800'
                              : user.role === 'moderator'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {user.role || 'user'}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submitted Words Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                      My Submitted Words
                    </h2>
                    <span className="text-sm text-gray-600 font-medium">
                      {submittedWords.length} total
                    </span>
                  </div>

                  {wordsLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-3"></div>
                      <p className="text-gray-600 text-sm">Loading your words...</p>
                    </div>
                  ) : submittedWords.length === 0 ? (
                    <div className="text-center py-8">
                      <i data-feather="book" className="w-12 h-12 text-gray-400 mx-auto mb-3"></i>
                      <p className="text-gray-600 font-medium text-base mb-2">No words submitted yet</p>
                      <p className="text-gray-500 text-sm mb-4">Start contributing to the dictionary!</p>
                      <button
                        onClick={() => router.push('/submit-word')}
                        className="bg-primary text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-primary-dark transition-colors text-sm"
                      >
                        Submit Your First Word
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {submittedWords.map((word, index) => (
                        <div
                          key={word.id || index}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-gray-900 text-base">
                                {word.word}
                              </h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(word.status)}`}>
                                {word.status}
                              </span>
                            </div>
                            <p className="text-gray-700 text-sm mb-1">
                              {word.meaning}
                            </p>
                            {word.language && (
                              <p className="text-gray-500 text-xs">
                                Language: {word.language}
                              </p>
                            )}
                            <p className="text-gray-500 text-xs mt-2">
                              Submitted on {new Date(word.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => router.push(`/word-details/${word.id}`)}
                              className="p-2 text-gray-600 hover:text-primary transition-colors"
                              title="View Details"
                            >
                              <i data-feather="eye" className="w-4 h-4"></i>
                            </button>
                            {word.status === 'pending' && (
                              <button
                                onClick={() => router.push(`/edit-word/${word.id}`)}
                                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                                title="Edit Word"
                              >
                                <i data-feather="edit" className="w-4 h-4"></i>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Account Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                    Account Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          User ID
                        </label>
                        <p className="text-sm font-mono text-gray-600 bg-gray-50 p-3 rounded">
                          {user.id}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Account Status
                        </label>
                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                          user.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status || 'active'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Member Since
                        </label>
                        <p className="text-gray-900 text-sm">
                          {new Date(user.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Last Updated
                        </label>
                        <p className="text-gray-900 text-sm">
                          {new Date(user.updatedAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Actions */}
              <div className="space-y-6">
                {/* Security */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Security</h3>
                  <div className="space-y-3">
                    <button
                      onClick={changePassword}
                      disabled={actionLoading}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-blue-100 text-blue-700 font-semibold rounded-lg hover:bg-blue-200 transition-colors text-sm disabled:opacity-50"
                    >
                      <i data-feather="lock" className="w-4 h-4"></i>
                      Change Password
                    </button>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => router.push('/submit-word')}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors text-sm"
                    >
                      <i data-feather="plus" className="w-4 h-4"></i>
                      Add New Word
                    </button>

                    <button
                      onClick={() => router.push('/explore')}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-green-100 text-green-700 font-semibold rounded-lg hover:bg-green-200 transition-colors text-sm"
                    >
                      <i data-feather="search" className="w-4 h-4"></i>
                      Explore Words
                    </button>
                  </div>
                </div>

                {/* Stats Summary */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">My Stats</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Total Submitted:</span>
                      <span className="font-semibold text-gray-900">
                        {submittedWords.length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Approved:</span>
                      <span className="font-semibold text-green-600">
                        {submittedWords.filter(w => w.status === 'approved').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Pending:</span>
                      <span className="font-semibold text-yellow-600">
                        {submittedWords.filter(w => w.status === 'pending').length}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <CustomFooter />
    </div>
  );
}