"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import feather from "feather-icons";
import CustomNavbar from "@/components/navBar";
import CustomFooter from "@/components/customFooter";
import getBaseUrl from "@/app/api/baseUrl";

export default function UserProfilePage() {
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [user, setUser] = useState(null);
  const [submittedWords, setSubmittedWords] = useState([]);
  const [wordsLoading, setWordsLoading] = useState(true);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editingBank, setEditingBank] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState({ message: "", type: "" });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [bankData, setBankData] = useState({
    bank_name: "",
    account_number: "",
  });

  // Store the feather replacement instance
  const featherInstanceRef = useRef(null);
  // Track if icons have been initialized
  const iconsInitializedRef = useRef(false);

  const token = typeof window !== "undefined" ? Cookies.get("token") : null;
  const base_url = getBaseUrl();

  // Helper to check if user is staff (admin/moderator/super_admin)
  const isStaffUser = user && ['admin', 'super_admin', 'moderator'].includes(user.role);
  
  // Helper to check if user is regular user (not staff)
  const isRegularUser = user && !isStaffUser;

  // Hydration guard
  useEffect(() => {
    setHydrated(true);
    
    return () => {
      // Cleanup feather icons on unmount
      if (featherInstanceRef.current) {
        try {
          // Feather doesn't have a proper cleanup method, but we can
          // clear any scheduled replacements
          featherInstanceRef.current = null;
        } catch (err) {
          // Ignore cleanup errors
        }
      }
      iconsInitializedRef.current = false;
    };
  }, []);

  // Initialize feather icons - with better cleanup
  useEffect(() => {
    if (!hydrated || typeof window === "undefined") return;
    
    // Clear any previous instance
    if (featherInstanceRef.current) {
      try {
        featherInstanceRef.current = null;
      } catch (err) {
        // Ignore
      }
    }
    
    // Use a timeout to avoid running during React updates
    const timer = setTimeout(() => {
      try {
        // Replace icons
        feather.replace();
        iconsInitializedRef.current = true;
      } catch (err) {
        // Ignore feather errors - they're usually harmless
        if (!err.message?.includes('removeChild') && !err.message?.includes('Node')) {
          console.warn("Feather icons update failed:", err);
        }
      }
    }, 100);
    
    return () => {
      clearTimeout(timer);
    };
  }, [hydrated, loading, actionLoading, editing, editingBank]);

  // Fetch user profile
  useEffect(() => {
    if (!hydrated) return;
    if (!token) {
      router.push("/");
      return;
    }

    const fetchUserProfile = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const res = await fetch(`${base_url}/user/profile`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || "Failed to fetch user profile");
        }

        const data = await res.json();
        const fetchedUser = data.user || data;
        setUser(fetchedUser);

        setFormData({
          firstName: fetchedUser.firstName || fetchedUser.first_name || "",
          lastName: fetchedUser.lastName || fetchedUser.last_name || "",
          email: fetchedUser.email || "",
        });

        // Only set bank data for regular users
        if (!['admin', 'super_admin', 'moderator'].includes(fetchedUser.role)) {
          setBankData({
            bank_name: fetchedUser.bank_name || "",
            account_number: fetchedUser.account_number || "",
          });
        }
      } catch (err) {
        console.error("Fetch profile error:", err);
        setError("Unable to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [hydrated, base_url, token, router]);

  // Fetch submitted words
  useEffect(() => {
    if (!hydrated) return;
    if (!user) return;

    const fetchSubmittedWords = async () => {
      setWordsLoading(true);
      try {
        const endpoint =  `${base_url}/user/word/list`;  // Regular users see only their words
        
        const res = await fetch(endpoint, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.message || "Failed to fetch submitted words");
        }

        const data = await res.json();
        setSubmittedWords(Array.isArray(data.words) ? data.words : data || []);
      } catch (err) {
        console.error("Error fetching words:", err);
        setSubmittedWords([]);
      } finally {
        setWordsLoading(false);
      }
    };

    fetchSubmittedWords();
  }, [hydrated, base_url, token, user, isStaffUser]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBankInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "account_number") {
      const formattedValue = value.replace(/\D/g, "");
      setBankData((prev) => ({ ...prev, [name]: formattedValue }));
    } else {
      setBankData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    
    setActionLoading(true);
    setStatus({ message: "", type: "" });

    try {
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
      };

      // Only include bank details for regular users
      if (isRegularUser) {
        payload.bank_name = bankData.bank_name.trim();
        payload.account_number = bankData.account_number;
      }

      const res = await fetch(`${base_url}/user/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      
      if (!res.ok) throw new Error(data.message || "Failed to update profile");

      const updatedUser = data.user || data;
      setUser((prev) => ({ ...prev, ...updatedUser }));
      setEditing(false);
      setStatus({ message: "Profile updated successfully!", type: "success" });
      
      // Force a full page reload instead of router.refresh()
      // This ensures feather icons are properly re-initialized
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error("Update profile error:", err);
      setStatus({ message: err.message || "Error updating profile", type: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  const updateBankDetails = async (e) => {
    e.preventDefault();
    
    setActionLoading(true);
    setStatus({ message: "", type: "" });

    if (!bankData.bank_name.trim()) {
      setStatus({ message: "Bank name is required", type: "error" });
      setActionLoading(false);
      return;
    }

    if (bankData.account_number.length < 10) {
      setStatus({
        message: "Valid account number is required (minimum 10 digits)",
        type: "error",
      });
      setActionLoading(false);
      return;
    }

    try {
      const payload = {
        bank_name: bankData.bank_name.trim(),
        account_number: bankData.account_number,
      };

      const res = await fetch(`${base_url}/user/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      
      if (!res.ok) throw new Error(data.message || "Failed to update bank details");

      setUser((prev) => ({ 
        ...prev, 
        bank_name: payload.bank_name,
        account_number: payload.account_number
      }));
      setEditingBank(false);
      setStatus({ message: "Bank details updated successfully!", type: "success" });
      
      // Force a full page reload instead of router.refresh()
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error("Update bank error:", err);
      setStatus({ message: err.message || "Error updating bank details", type: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  const changePassword = async () => {
    const newPassword = prompt("Enter your new password (min 8 characters):");
    if (!newPassword || newPassword.length < 8) {
      setStatus({ message: "Password must be at least 8 characters long.", type: "error" });
      return;
    }

    setActionLoading(true);
    setStatus({ message: "", type: "" });

    try {
      const res = await fetch(`${base_url}/user/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: newPassword }),
      });

      const data = await res.json().catch(() => ({}));
      
      if (!res.ok) throw new Error(data.message || "Failed to change password");

      setStatus({ message: "Password changed successfully!", type: "success" });
      
      // Force a full page reload instead of router.refresh()
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error("Password change error:", err);
      setStatus({ message: err.message || "Error changing password", type: "error" });
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (statusVal) => {
    switch ((statusVal || "").toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formataccount_number = (account_number) => {
    if (!account_number) return "";
    const numStr = account_number.toString();
    if (numStr.length <= 4) return numStr;
    return numStr.replace(/(\d{4})(?=\d)/g, "$1 ");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2
    }).format(amount || 0);
  };

  // Loading state
  if (!hydrated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <CustomNavbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-yellow-500 mx-auto mb-5"></div>
            <p className="text-gray-700 text-base font-semibold">Loading profile...</p>
          </div>
        </div>
        <CustomFooter />
      </div>
    );
  }

  // Error or no user
  if (error || !user) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <CustomNavbar />
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-6">
            <i data-feather="user-x" className="w-16 h-16 text-gray-400 mx-auto mb-5"></i>
            <p className="text-gray-600 font-semibold text-base mb-6">{error || "Profile not found"}</p>
            <button
              onClick={() => router.push("/")}
              className="bg-yellow-500 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-yellow-600 transition-colors text-sm"
            >
              Back to Home
            </button>
          </div>
        </div>
        <CustomFooter />
      </div>
    );
  }

  const walletBalance = user.wallet_balance || 0;
  const bank_name = user.bank_name || "";
  const account_number = user.account_number || "";
  const firstName = user.firstName || user.first_name || "";
  const lastName = user.lastName || user.last_name || "";

  // Get role display name
  const getRoleDisplay = (role) => {
    switch (role) {
      case 'super_admin': return 'Super Admin';
      case 'admin': return 'Admin';
      case 'moderator': return 'Moderator';
      default: return 'User';
    }
  };

  // Get role color
  const getRoleColor = (role) => {
    switch (role) {
      case 'super_admin': return 'bg-red-100 text-red-800';
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'moderator': return 'bg-blue-100 text-blue-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

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
                  {getRoleDisplay(user.role)} Profile
                </h1>
                <p className="text-gray-600 text-base font-normal">
                  {isStaffUser 
                    ? "Manage your account information and view all submissions" 
                    : "Manage your account information and view your submissions"}
                </p>
              </div>

              <button
                onClick={() => router.push("/")}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                <i data-feather="arrow-left" className="w-4 h-4"></i>
                Back to Home
              </button>
            </div>

            {/* Status Message */}
            {status.message && (
              <div
                className={`mb-6 p-4 rounded-xl ${
                  status.type === "success" ? "bg-green-100 border border-green-300 text-green-800" : "bg-red-100 border border-red-300 text-red-800"
                }`}
              >
                <div className="flex items-center gap-3">
                  <i data-feather={status.type === "success" ? "check-circle" : "alert-circle"} className="w-5 h-5"></i>
                  <span className="font-semibold text-sm">{status.message}</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Profile Information */}
              <div className="lg:col-span-2 space-y-6">
                {/* Wallet Balance Card - Only show for regular users */}
                {isRegularUser && (
                  <div className="bg-gradient-to-r from-yellow-500 to-yellow-500 rounded-xl shadow-lg p-6 text-white">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-lg font-semibold mb-2">Wallet Balance</h2>
                        <p className="text-3xl font-bold mb-1">{formatCurrency(walletBalance)}</p>
                        <p className="text-yellow-100 text-sm opacity-90">Available for withdrawal</p>
                      </div>
                      <div className="bg-white bg-opacity-20 p-3 rounded-full">
                        <i data-feather="credit-card" className="w-6 h-6"></i>
                      </div>
                    </div>
                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => router.push("/withdraw")}
                        disabled={walletBalance <= 0}
                        className={`flex-1 py-2.5 px-4 rounded-lg font-semibold text-sm transition-all ${walletBalance > 0 
                          ? "bg-white text-yellow-600 hover:bg-gray-100" 
                          : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                      >
                        Withdraw Funds
                      </button>
                      <button
                        onClick={() => router.push("/transactions")}
                        className=" text-gray-500 flex-1 py-2.5 px-4 bg-white bg-opacity-20 rounded-lg font-semibold text-sm hover:bg-opacity-30 transition-all"
                      >
                        View Transactions
                      </button>
                    </div>
                  </div>
                )}

                

                {/* Profile Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
                    {!editing && (
                      <button
                        onClick={() => setEditing(true)}
                        className={`flex items-center gap-2 px-4 py-2 text-white font-semibold rounded-lg transition-colors text-sm ${
                          isStaffUser ? "bg-purple-500 hover:bg-purple-600" : "bg-yellow-500 hover:bg-yellow-600"
                        }`}
                      >
                        <i data-feather="edit" className="w-4 h-4"></i>
                        Edit Profile
                      </button>
                    )}
                  </div>

                  {editing ? (
                    <form onSubmit={updateProfile} className="space-y-6" noValidate>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-3 uppercase text-xs tracking-wide">First Name</label>
                          <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 font-normal text-base placeholder-gray-500 transition-all duration-200"
                            placeholder="Enter your first name"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-3 uppercase text-xs tracking-wide">Last Name</label>
                          <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 font-normal text-base placeholder-gray-500 transition-all duration-200"
                            placeholder="Enter your last name"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-3 uppercase text-xs tracking-wide">Email Address</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 font-normal text-base placeholder-gray-500 transition-all duration-200"
                          placeholder="Enter your email address"
                          required
                        />
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button
                          type="submit"
                          disabled={actionLoading}
                          className={`text-white font-semibold py-3 px-6 rounded-lg transition-colors text-sm disabled:opacity-50 ${
                            isStaffUser ? "bg-purple-500 hover:bg-purple-600" : "bg-yellow-500 hover:bg-yellow-600"
                          }`}
                        >
                          {actionLoading ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditing(false);
                            setFormData({
                              firstName: firstName,
                              lastName: lastName,
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
                          <label className="block text-sm font-semibold text-gray-800 mb-3 uppercase text-xs tracking-wide">First Name</label>
                          <p className="text-base font-semibold text-gray-900">{firstName || "—"}</p>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-3 uppercase text-xs tracking-wide">Last Name</label>
                          <p className="text-base font-semibold text-gray-900">{lastName || "—"}</p>
                        </div>
                      </div>

                      <div className="space-y-5">
                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-3 uppercase text-xs tracking-wide">Email Address</label>
                          <p className="text-base font-semibold text-gray-900">{user.email || "—"}</p>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-3 uppercase text-xs tracking-wide">User Role</label>
                          <span
                            className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold capitalize ${getRoleColor(user.role)}`}
                          >
                            {getRoleDisplay(user.role)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Bank Details Section - Only show for regular users */}
                {isRegularUser && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-200">
                      <h2 className="text-lg font-semibold text-gray-900">Bank Details</h2>
                      {!editingBank && (
                        <button
                          onClick={() => setEditingBank(true)}
                          className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors text-sm"
                        >
                          <i data-feather="edit" className="w-4 h-4"></i>
                          {bank_name ? "Edit Bank Details" : "Add Bank Details"}
                        </button>
                      )}
                    </div>

                    {editingBank ? (
                      <form onSubmit={updateBankDetails} className="space-y-6" noValidate>
                        <div className="space-y-6">
                          <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-3 uppercase text-xs tracking-wide">Bank Name</label>
                            <input
                              type="text"
                              name="bank_name"
                              value={bankData.bank_name}
                              onChange={handleBankInputChange}
                              className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 font-normal text-base placeholder-gray-500 transition-all duration-200"
                              placeholder="Enter your bank name (e.g., GTBank, Access Bank)"
                              required
                            />
                            <p className="text-gray-500 text-xs mt-2">Enter the name of your bank as it appears on your account</p>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-3 uppercase text-xs tracking-wide">Account Number</label>
                            <input
                              type="text"
                              name="account_number"
                              value={bankData.account_number}
                              onChange={handleBankInputChange}
                              className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 font-normal text-base placeholder-gray-500 transition-all duration-200"
                              placeholder="Enter 10-digit account number"
                              maxLength={10}
                              required
                            />
                            <p className="text-gray-500 text-xs mt-2">Enter your 10-digit account number (numbers only)</p>
                          </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                          <button
                            type="submit"
                            disabled={actionLoading}
                            className="bg-yellow-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-yellow-600 transition-colors text-sm disabled:opacity-50"
                          >
                            {actionLoading ? "Saving..." : "Save Bank Details"}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingBank(false);
                              setBankData({
                                bank_name: bank_name,
                                account_number: account_number,
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
                            <label className="block text-sm font-semibold text-gray-800 mb-3 uppercase text-xs tracking-wide">Bank Name</label>
                            {bank_name ? (
                              <p className="text-base font-semibold text-gray-900">{bank_name}</p>
                            ) : (
                              <div className="flex items-center gap-2 text-gray-500">
                                <i data-feather="alert-circle" className="w-4 h-4"></i>
                                <span className="text-sm">No bank details added</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="space-y-5">
                          <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-3 uppercase text-xs tracking-wide">Account Number</label>
                            {account_number ? (
                              <p className="text-base font-semibold text-gray-900 font-mono">{formataccount_number(account_number)}</p>
                            ) : (
                              <div className="flex items-center gap-2 text-gray-500">
                                <i data-feather="alert-circle" className="w-4 h-4"></i>
                                <span className="text-sm">No account number added</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Security Note */}
                    {!editingBank && (bank_name || account_number) && (
                      <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                        <div className="flex items-start gap-3">
                          <i data-feather="shield" className="w-5 h-5 text-blue-600 mt-0.5"></i>
                          <div>
                            <p className="text-sm font-medium text-green-500 mb-1">Your bank details are updated and secure</p>
                            <p className="text-xs text-blue-600">Your bank information is encrypted and only used for payment purposes.</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Submitted Words Section */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {isStaffUser ? "All Submitted Words" : "My Submitted Words"}
                    </h2>
                    <span className="text-sm text-gray-600 font-medium">{submittedWords.length} total</span>
                  </div>

                  {wordsLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto mb-3"></div>
                      <p className="text-gray-600 text-sm">Loading words...</p>
                    </div>
                  ) : submittedWords.length === 0 ? (
                    <div className="text-center py-8">
                      <i data-feather="book" className="w-12 h-12 text-gray-400 mx-auto mb-3"></i>
                      <p className="text-gray-600 font-medium text-base mb-2">
                        {isStaffUser ? "No words submitted yet" : "No words submitted yet"}
                      </p>
                      <p className="text-gray-500 text-sm mb-4">
                        {isStaffUser 
                          ? "Users will appear here when they submit words" 
                          : "Start contributing to the dictionary!"}
                      </p>
                      {!isStaffUser && (
                        <button
                          onClick={() => router.push("/submit-word")}
                          className="bg-yellow-500 text-white font-semibold py-2.5 px-6 rounded-lg hover:bg-yellow-600 transition-colors text-sm"
                        >
                          Submit Your First Word
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {submittedWords.map((word, index) => {
                        // Check if current user can edit this word
                        const canEditWord = () => {
                          // Only moderators, admins, and super_admins can edit
                          const hasEditPermission = ['moderator', 'admin', 'super_admin'].includes(user?.role);
                          
                          if (!hasEditPermission) return false;
                          
                          // If user is a moderator, they can only edit their own submitted words
                          if (user?.role === 'moderator') {
                            // Check if word was submitted by this moderator
                            return word.submitted_by_id === user.id || word.submitted_by === user.username;
                          }
                          
                          // Admin and super_admin can edit all words
                          return true;
                        };
                        
                        // Check if user can view edit button
                        const showEditButton = canEditWord() && word.status === "pending";
                        
                        return (
                          <div
                            key={word.id ?? index}
                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-gray-900 text-base">{word.word}</h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(word.status)}`}>
                                  {word.status}
                                </span>
                              </div>
                              <p className="text-gray-700 text-sm mb-1">{word.meaning}</p>
                              {word.language && <p className="text-gray-500 text-xs">Language: {word.language}</p>}
                              {isStaffUser && word.submitted_by && (
                                <p className="text-gray-500 text-xs">Submitted by: {word.submitted_by}</p>
                              )}
                              <p className="text-gray-500 text-xs mt-2">
                                Submitted on {word.created_at ? new Date(word.created_at).toLocaleDateString() : "—"}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => router.push(`/word-details/${word.id}`)}
                                className="p-2 text-gray-600 hover:text-yellow-500 transition-colors"
                                title="View Details"
                              >
                                <i data-feather="eye" className="w-4 h-4"></i>
                              </button>
                              
                              {/* Edit button - only shown to authorized users for pending words */}
                              {showEditButton && (
                                <button
                                  onClick={() => {
                                    // Determine the correct edit route based on user role
                                    const editRoute = user?.role === 'moderator' 
                                      ? `/moderator/word/edit/${word.id}`
                                      : `/admin/word/edit/${word.id}`;
                                    router.push(editRoute);
                                  }}
                                  className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                                  title="Edit Word"
                                >
                                  <i data-feather="edit" className="w-4 h-4"></i>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
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
                    {!isStaffUser && (
                      <button
                        onClick={() => router.push("/submit-word")}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors text-sm"
                      >
                        <i data-feather="plus" className="w-4 h-4"></i>
                        Add New Word
                      </button>
                    )}

                    <button
                      onClick={() => router.push("/explore")}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-green-100 text-green-700 font-semibold rounded-lg hover:bg-green-200 transition-colors text-sm"
                    >
                      <i data-feather="search" className="w-4 h-4"></i>
                      Explore Words
                    </button>

                    {/* Staff-specific links */}
                    {isStaffUser && (
                      <>
                        <button
                          onClick={() => router.push("/admin/dashboard")}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-purple-500 text-white font-semibold rounded-lg hover:bg-purple-600 transition-colors text-sm"
                        >
                          <i data-feather="dashboard" className="w-4 h-4"></i>
                          Admin Dashboard
                        </button>

                        <button
                          onClick={() => router.push("/admin/users")}
                          className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-blue-100 text-blue-700 font-semibold rounded-lg hover:bg-blue-200 transition-colors text-sm"
                        >
                          <i data-feather="users" className="w-4 h-4"></i>
                          Manage Users
                        </button>

                        
                      </>
                    )}
                  </div>
                </div>

                {/* Stats Summary */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
                  <div className="space-y-3">
                    {/* Show wallet balance only for regular users */}
                    {isRegularUser && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">Wallet Balance:</span>
                        <span className="font-semibold text-green-600">{formatCurrency(walletBalance)}</span>
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Total Words:</span>
                      <span className="font-semibold text-gray-900">{submittedWords.length}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Approved:</span>
                      <span className="font-semibold text-green-600">
                        {submittedWords.filter((w) => w.status === "approved").length}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Pending:</span>
                      <span className="font-semibold text-yellow-600">
                        {submittedWords.filter((w) => w.status === "pending").length}
                      </span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Rejected:</span>
                      <span className="font-semibold text-red-600">
                        {submittedWords.filter((w) => w.status === "rejected").length}
                      </span>
                    </div>
                    
                    {/* Only show bank details for regular users */}
                    {isRegularUser && (
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 text-sm">Bank Details:</span>
                        <span className={`font-semibold ${bank_name && account_number ? "text-green-600" : "text-yellow-600"}`}>
                          {bank_name && account_number ? "Complete" : "Incomplete"}
                        </span>
                      </div>
                    )}
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