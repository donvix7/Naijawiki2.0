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
  
  const [user, setUser] = useState(null);
  const [submittedWords, setSubmittedWords] = useState([]);
  const [wordsLoading, setWordsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState({ message: "", type: "" });

  const token = Cookies.get("token");
  const base_url = getBaseUrl();

  // Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`${base_url}/admin/users/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch user");

        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        console.error(err);
        setError("Unable to load user.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id, base_url, token]);

  // Fetch user's submitted words
  useEffect(() => {
    const fetchUserWords = async () => {
      try {
        const res = await fetch(`${base_url}/admin/users/${id}/words`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch user words");

        const data = await res.json();
        setSubmittedWords(data.words || []);
      } catch (err) {
        console.error("Error fetching user words:", err);
        setSubmittedWords([]);
      } finally {
        setWordsLoading(false);
      }
    };

    if (user) {
      fetchUserWords();
    }
  }, [id, base_url, token, user]);

  // Initialize feather icons
  useEffect(() => {
    feather.replace();
  }, [loading, actionLoading, submittedWords]);

  // Update user role
  const updateUserRole = async (newRole) => {
    setActionLoading(true);
    setStatus({ message: "", type: "" });

    try {
      const res = await fetch(`${base_url}/admin/users/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to update user");

      setUser({ ...user, role: newRole });
      setStatus({
        message: `User role updated to ${newRole} successfully!`,
        type: "success"
      });
    } catch (err) {
      console.error(err);
      setStatus({
        message: err.message || "Error updating user role",
        type: "error"
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Reset user password
  const resetPassword = async () => {
    if (!confirm("Are you sure you want to reset this user's password? They will receive an email with instructions.")) {
      return;
    }

    setActionLoading(true);
    setStatus({ message: "", type: "" });

    try {
      const res = await fetch(`${base_url}/admin/users/${id}/reset-password`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to reset password");

      setStatus({
        message: "Password reset email sent successfully!",
        type: "success"
      });
    } catch (err) {
      console.error(err);
      setStatus({
        message: err.message || "Error resetting password",
        type: "error"
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Toggle user status
  const toggleUserStatus = async () => {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    const action = newStatus === 'active' ? 'activate' : 'deactivate';
    
    if (!confirm(`Are you sure you want to ${action} this user?`)) {
      return;
    }

    setActionLoading(true);
    setStatus({ message: "", type: "" });

    try {
      const res = await fetch(`${base_url}/admin/users/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to update user status");

      setUser({ ...user, status: newStatus });
      setStatus({
        message: `User ${action}d successfully!`,
        type: "success"
      });
    } catch (err) {
      console.error(err);
      setStatus({
        message: err.message || "Error updating user status",
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

  // -------- STATES RENDERING -------- //

  if (loading) {
    return (
      <RoleGuard allowedRoles={["admin", "super_admin"]}>
        <div className="min-h-screen bg-gray-50">
          <AdminNavbar />
          <div className="flex">
            <AdminSidebar />
            <div className="flex-1 flex justify-center items-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-yellow-500 mx-auto mb-5"></div>
                <p className="text-gray-700 text-base font-semibold">Loading user...</p>
              </div>
            </div>
          </div>
        </div>
      </RoleGuard>
    );
  }

  if (error || !user) {
    return (
      <RoleGuard allowedRoles={["admin", "super_admin"]}>
        <div className="min-h-screen bg-gray-50">
          <AdminNavbar />
          <div className="flex">
            <AdminSidebar />
            <div className="flex-1 flex justify-center items-center">
              <div className="text-center max-w-md mx-auto px-6">
                <i data-feather="user-x" className="w-16 h-16 text-gray-400 mx-auto mb-5"></i>
                <p className="text-gray-600 font-semibold text-base mb-6">{error || "User not found"}</p>
                <button
                  onClick={() => router.push('/admin/users')}
                  className="bg-yellow-500 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-yellow-500-dark transition-colors text-sm"
                >
                  Back to Users
                </button>
              </div>
            </div>
          </div>
        </div>
      </RoleGuard>
    );
  }

  // -------- MAIN UI -------- //

  return (
    <RoleGuard allowedRoles={["admin", "super_admin"]}>
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />

        <div className="flex">
          <AdminSidebar />

          <main className="flex-1 p-6 lg:p-8">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
                  User Details
                </h1>
                <p className="text-gray-600 text-base font-normal">
                  View and manage user account information
                </p>
              </div>
              
              <button
                onClick={() => router.push('/admin/users')}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                <i data-feather="arrow-left" className="w-4 h-4"></i>
                Back to Users
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
              {/* User Information */}
              <div className="lg:col-span-2 space-y-6">
                {/* User Information Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                    User Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Basic Info */}
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

                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-3 tracking-wide uppercase text-xs">
                          Email Address
                        </label>
                        <p className="text-base font-semibold text-gray-900">
                          {user.email || "—"}
                        </p>
                      </div>
                    </div>

                    {/* Account Info */}
                    <div className="space-y-5">
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-3 tracking-wide uppercase text-xs">
                          User ID
                        </label>
                        <p className="text-sm font-mono text-gray-600 bg-gray-50 p-3 rounded">
                          {user.id}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-3 tracking-wide uppercase text-xs">
                          Account Created
                        </label>
                        <p className="text-gray-900 text-sm">
                          {new Date(user.created_at).toLocaleDateString()} at{" "}
                          {new Date(user.created_at).toLocaleTimeString()}
                        </p>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-3 tracking-wide uppercase text-xs">
                          Last Updated
                        </label>
                        <p className="text-gray-900 text-sm">
                          {new Date(user.updatedAt).toLocaleDateString()} at{" "}
                          {new Date(user.updatedAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* User's Submitted Words */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                      User's Submitted Words
                    </h2>
                    <span className="text-sm text-gray-600 font-medium">
                      {submittedWords.length} total
                    </span>
                  </div>

                  {wordsLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto mb-3"></div>
                      <p className="text-gray-600 text-sm">Loading user's words...</p>
                    </div>
                  ) : submittedWords.length === 0 ? (
                    <div className="text-center py-8">
                      <i data-feather="book" className="w-12 h-12 text-gray-400 mx-auto mb-3"></i>
                      <p className="text-gray-600 font-medium text-base mb-2">No words submitted yet</p>
                      <p className="text-gray-500 text-sm">This user hasn't submitted any words.</p>
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
                              Submitted on {new Date(word.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => router.push(`/admin/word/${word.id}`)}
                              className="p-2 text-gray-600 hover:text-yellow-500 transition-colors"
                              title="View Details"
                            >
                              <i data-feather="eye" className="w-4 h-4"></i>
                            </button>
                            {word.status === 'pending' && (
                              <button
                                onClick={() => router.push(`/admin/word/review/${word.id}`)}
                                className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                                title="Review Word"
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

                {/* User Management */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                    User Management
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Role Management */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-3 tracking-wide uppercase text-xs">
                        Change User Role
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {['creator', 'moderator', 'admin'].map((roleOption) => (
                          <button
                            key={roleOption}
                            onClick={() => updateUserRole(roleOption)}
                            disabled={actionLoading || user.role === roleOption}
                            className={`px-4 py-2.5 rounded-lg font-semibold capitalize transition-colors text-sm ${
                              user.role === roleOption
                                ? 'bg-yellow-500 text-white cursor-default'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            } ${actionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {roleOption}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Status Management */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-3 tracking-wide uppercase text-xs">
                        Account Status
                      </label>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                          user.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {user.status || 'active'}
                        </span>
                        <button
                          onClick={toggleUserStatus}
                          disabled={actionLoading}
                          className={`px-4 py-2.5 rounded-lg font-semibold transition-colors text-sm ${
                            user.status === 'active'
                              ? 'bg-red-100 text-red-700 hover:bg-red-200'
                              : 'bg-green-100 text-green-700 hover:bg-green-200'
                          } ${actionLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                          {user.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sidebar Actions */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => router.push(`/admin/users/edit/${user.id}`)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-500-dark transition-colors text-sm"
                    >
                      <i data-feather="edit" className="w-4 h-4"></i>
                      Edit User
                    </button>
                    
                    <button
                      onClick={resetPassword}
                      disabled={actionLoading}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-blue-100 text-blue-700 font-semibold rounded-lg hover:bg-blue-200 transition-colors text-sm disabled:opacity-50"
                    >
                      <i data-feather="refresh-cw" className="w-4 h-4"></i>
                      Reset Password
                    </button>

                    <button
                      onClick={() => router.push(`/admin/users/${user.id}/activity`)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-green-100 text-green-700 font-semibold rounded-lg hover:bg-green-200 transition-colors text-sm"
                    >
                      <i data-feather="activity" className="w-4 h-4"></i>
                      View Activity
                    </button>
                  </div>
                </div>

                {/* Current Status */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Status</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Role:</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                        user.role === 'admin' 
                          ? 'bg-purple-100 text-purple-800'
                          : user.role === 'moderator'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Status:</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        user.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {user.status || 'active'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Words Submitted:</span>
                      <span className="font-semibold text-gray-900">
                        {submittedWords.length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* User Stats */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Word Statistics</h3>
                  <div className="space-y-3">
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
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Rejected:</span>
                      <span className="font-semibold text-red-600">
                        {submittedWords.filter(w => w.status === 'rejected').length}
                      </span>
                    </div>
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