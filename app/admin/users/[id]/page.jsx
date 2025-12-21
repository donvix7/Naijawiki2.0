"use client";

import AdminNavbar from "@/components/adminNavbar";
import AdminSidebar from "@/components/adminSideBar";
import getBaseUrl from "@/app/api/baseUrl";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import feather from "feather-icons";
import { useParams, useRouter } from "next/navigation";
import RoleGuard from "@/utils/RoleGuard";
import UserDelBtn from "@/components/userDelBtn";

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
  const [hydrated, setHydrated] = useState(false);
  const [editing, setEditing] = useState(false);
  
  // Form data for inline editing
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  
  const token = Cookies.get("token");
  const base_url = getBaseUrl();

  // Hydration guard
  useEffect(() => {
    setHydrated(true);
  }, []);

  // Initialize feather icons
  useEffect(() => {
    if (hydrated && typeof window !== "undefined") {
      try {
        feather.replace();
      } catch (err) {
        console.warn("Feather init failed", err);
      }
    }
  }, [hydrated, loading, actionLoading, submittedWords, editing]);

  // Fetch user profile and their words
  useEffect(() => {
    if (!hydrated) return;
    if (!token) {
      setError("Authentication required");
      setLoading(false);
      return;
    }

    let mounted = true;
    const fetchUserData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch user info - using admin endpoint
        const userRes = await fetch(`${base_url}/admin/users/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!userRes.ok) {
          // Try alternative endpoint if admin endpoint fails
          const fallbackRes = await fetch(`${base_url}/manage/user/${id}`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          
          if (!fallbackRes.ok) {
            const errData = await fallbackRes.json().catch(() => ({}));
            throw new Error(errData.message || "Failed to fetch user");
          }
          
          const fallbackData = await fallbackRes.json();
          if (!mounted) return;
          const userData = fallbackData.user || fallbackData;
          setUser(userData);
          
          // Initialize form data
          setFormData({
            firstName: userData.firstName || userData.first_name || "",
            lastName: userData.lastName || userData.last_name || "",
            email: userData.email || "",
            phone: userData.phone || userData.phoneNumber || "",
          });
        } else {
          const userData = await userRes.json();
          if (!mounted) return;
          const userObj = userData.user || userData;
          setUser(userObj);
          
          // Initialize form data
          setFormData({
            firstName: userObj.firstName || userObj.first_name || "",
            lastName: userObj.lastName || userObj.last_name || "",
            email: userObj.email || "",
            phone: userObj.phone || userObj.phoneNumber || "",
          });
        }

        // Fetch user's submitted words
        setWordsLoading(true);
        try {
          // Try admin endpoint first
          const wordsRes = await fetch(`${base_url}/admin/users/${id}/words`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (wordsRes.ok) {
            const wordsData = await wordsRes.json();
            if (!mounted) return;
            setSubmittedWords(wordsData.words || []);
          } else {
            // Fallback to general user words endpoint
            const fallbackRes = await fetch(`${base_url}/user/word/list`, {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });

            if (fallbackRes.ok) {
              const fallbackData = await fallbackRes.json();
              const allWords = Array.isArray(fallbackData.words) 
                ? fallbackData.words 
                : fallbackData || [];
              
              // Get current user data to filter by email
              const currentUserRes = await fetch(`${base_url}/manage/user/${id}`, {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${token}`,
                },
              });
              
              if (currentUserRes.ok) {
                const currentUserData = await currentUserRes.json();
                const userObj = currentUserData.user || currentUserData;
                const userEmail = userObj.email;
                
                // Filter to only this user's words
                const userWords = allWords.filter(word => 
                  word.user_id === id || 
                  word.userId === id || 
                  word.created_by === id ||
                  word.creatorEmail === userEmail ||
                  word.user_email === userEmail
                );
                
                if (!mounted) return;
                setSubmittedWords(userWords);
              } else {
                if (!mounted) return;
                setSubmittedWords([]);
              }
            } else {
              if (!mounted) return;
              setSubmittedWords([]);
            }
          }
        } catch (wordsErr) {
          console.error("Error fetching user words:", wordsErr);
          if (!mounted) return;
          setSubmittedWords([]);
        } finally {
          if (mounted) {
            setWordsLoading(false);
          }
        }

      } catch (err) {
        console.error("Error fetching user data:", err);
        if (mounted) setError(err.message || "Unable to load user.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (id && token) {
      fetchUserData();
    }
    
    return () => {
      mounted = false;
    };
  }, [hydrated, id, base_url, token]);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Update user profile (inline editing)
  const updateProfile = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    setStatus({ message: "", type: "" });

    try {
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
      };

      const res = await fetch(`${base_url}/manage/user/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update user");

      // Update local state
      setUser(prev => ({ 
        ...prev, 
        ...payload,
        first_name: payload.firstName,
        last_name: payload.lastName,
        phoneNumber: payload.phone
      }));
      
      setEditing(false);
      setStatus({ 
        message: "User updated successfully!", 
        type: "success" 
      });
    } catch (err) {
      console.error("Update user error:", err);
      setStatus({ 
        message: err.message || "Error updating user", 
        type: "error" 
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    // Reset form to original values
    setFormData({
      firstName: user?.firstName || user?.first_name || "",
      lastName: user?.lastName || user?.last_name || "",
      email: user?.email || "",
      phone: user?.phone || user?.phoneNumber || "",
    });
    setEditing(false);
  };

  // Update user role
  const updateUserRole = async (newRole) => {
    setActionLoading(true);
    setStatus({ message: "", type: "" });

    try {
      const res = await fetch(`${base_url}/manage/user/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to update user");

      setUser(prev => ({ ...prev, role: newRole }));
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
      const res = await fetch(`${base_url}/manage/user/${id}/reset-password`, {
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
      const res = await fetch(`${base_url}/manage/user/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to update user status");

      setUser(prev => ({ ...prev, status: newStatus }));
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

  // Get status badge color for words
  const getStatusColor = (statusVal) => {
    switch ((statusVal || "").toLowerCase()) {
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

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  // Loading state
  if (!hydrated) {
    return null;
  }

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

  // Error or no user
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
                  className="bg-yellow-500 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-yellow-600 transition-colors text-sm"
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

  // Calculate word statistics
  const approvedCount = submittedWords.filter(w => w.status === 'approved').length;
  const pendingCount = submittedWords.filter(w => w.status === 'pending').length;
  const rejectedCount = submittedWords.filter(w => w.status === 'rejected').length;

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
                {/* User Information Card with Inline Editing */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                      User Information
                    </h2>
                    {!editing && (
                      <div className="flex gap-3">
                      <button
                        onClick={() => setEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors text-sm"
                      >
                        <i data-feather="edit" className="w-4 h-4"></i>
                        Edit Details
                      </button>
                      <UserDelBtn id={user.id} base_url={base_url} token={token} />

                      </div>
                    )}
                  </div>

                  {editing ? (
                    // Edit Form (revealed when editing)
                    <form onSubmit={updateProfile} className="space-y-6" noValidate>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-3 uppercase text-xs tracking-wide">
                            First Name *
                          </label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 font-normal text-base placeholder-gray-500 transition-all duration-200"
                            placeholder="Enter first name"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-3 uppercase text-xs tracking-wide">
                            Last Name *
                          </label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 font-normal text-base placeholder-gray-500 transition-all duration-200"
                            placeholder="Enter last name"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-3 uppercase text-xs tracking-wide">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 font-normal text-base placeholder-gray-500 transition-all duration-200"
                          placeholder="Enter email address"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-3 uppercase text-xs tracking-wide">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 font-normal text-base placeholder-gray-500 transition-all duration-200"
                          placeholder="Enter phone number"
                        />
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button
                          type="submit"
                          disabled={actionLoading}
                          className="bg-yellow-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-yellow-600 transition-colors text-sm disabled:opacity-50"
                        >
                          {actionLoading ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    // Display View (default view)
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-5">
                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-3 tracking-wide uppercase text-xs">
                            Name
                          </label>
                          <p className="text-base font-semibold text-gray-900">
                            {user.firstName || user.first_name} {user.lastName || user.last_name}
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-3 tracking-wide uppercase text-xs">
                            Email Address
                          </label>
                          <p className="text-base font-semibold text-gray-900 break-all">
                            {user.email || "—"}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-5">
                        

                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-3 tracking-wide uppercase text-xs">
                            User ID
                          </label>
                          <p className="text-sm font-mono text-gray-600 bg-gray-50 p-3 rounded break-all">
                            {user.id || user._id}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Account dates (always shown) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 pt-6 border-t border-gray-200">
                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-3 tracking-wide uppercase text-xs">
                        Account Created
                      </label>
                      <p className="text-gray-900 text-sm">
                        {formatDate(user.created_at || user.createdAt || user.created_date)}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-800 mb-3 tracking-wide uppercase text-xs">
                        Last Updated
                      </label>
                      <p className="text-gray-900 text-sm">
                        {formatDate(user.updated_at || user.updatedAt || user.updated_date)}
                      </p>
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
                          key={word.id || word._id || index}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold text-gray-900 text-base">
                                {word.word}
                              </h3>
                              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(word.status)}`}>
                                {word.status || 'pending'}
                              </span>
                            </div>
                            <p className="text-gray-700 text-sm mb-1 line-clamp-2">
                              {word.meaning}
                            </p>
                            <p className="text-gray-500 text-xs mt-2">
                              Submitted on {formatDate(word.created_at || word.createdAt)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => router.push(`/word-details/${word.id || word._id}`)}
                              className="p-2 text-gray-600 hover:text-yellow-500 transition-colors"
                              title="View Details"
                            >
                              <i data-feather="eye" className="w-4 h-4"></i>
                            </button>
                            {(word.status === 'pending' || !word.status) && (
                              <button
                                onClick={() => router.push(`//word/edit/${word.id || word._id}`)}
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
                        {['admin','super_admin', 'creator', 'moderator'].map((roleOption) => (
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
                            {roleOption.replace('_', ' ')}
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
                

                {/* Current Status */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Status</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Role:</span>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                        user.role === 'admin' || user.role === 'super_admin'
                          ? 'bg-purple-100 text-purple-800'
                          : user.role === 'moderator'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role?.replace('_', ' ') || 'user'}
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
                        {approvedCount}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Pending:</span>
                      <span className="font-semibold text-yellow-600">
                        {pendingCount}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Rejected:</span>
                      <span className="font-semibold text-red-600">
                        {rejectedCount}
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