"use client";

import React, { useEffect, useState } from "react";
import AdminNavbar from "@/components/adminNavbar";
import AdminSidebar from "@/components/adminSideBar";
import getBaseUrl from "@/app/api/baseUrl";
import Cookies from "js-cookie";
import RoleGuard from "@/utils/RoleGuard";
import feather from "feather-icons";
import UserDelBtn from "@/components/userDelBtn";

const Page = () => {
  const base_url = getBaseUrl();
  const token = Cookies.get("token");

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [role, setRole] = useState("");
  const [search, setSearch] = useState("");

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        const res = await fetch(`${base_url}/admin/users`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch users");

        const data = await res.json();

        setUsers(data.users || []);
      } catch (err) {
        console.error("Error loading users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Update feather icons
  useEffect(() => {
    feather.replace();
  }, [users]);

  // Filter + Search Logic
  const filteredUsers = users.filter((u) => {
    return (
      (!role || u.role === role) &&
      (!search || u.email.toLowerCase().includes(search.toLowerCase()))
    );
  });

  return (
    <RoleGuard allowedRoles={["admin", "super_admin"]}>
      <div>
        <AdminNavbar />

        <div className="flex">
          <AdminSidebar />

          <main className="flex-1 p-8 bg-gray-50 min-h-screen">
            {/* Header with Add User Button */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  Manage Users
                </h1>
                <p className="text-gray-600 font-medium">
                  View and manage all user accounts
                </p>
              </div>
              
              <a
                href="/admin/users/add"
                className="bg-[var(--neutral)] hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg flex items-center gap-2 transition-colors shadow-md hover:shadow-lg"
              >
                <i data-feather="plus" className="w-4 h-4"></i>
                Add New User
              </a>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <p className="text-gray-700 font-semibold text-sm mb-1">Total Users</p>
                <h3 className="text-2xl font-bold text-gray-900">{users.length}</h3>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <p className="text-gray-700 font-semibold text-sm mb-1">Creators</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.role === 'creator').length}
                </h3>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <p className="text-gray-700 font-semibold text-sm mb-1">Moderators</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.role === 'moderator').length}
                </h3>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm">
                <p className="text-gray-700 font-semibold text-sm mb-1">Admins</p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {users.filter(u => u.role === 'admin').length}
                </h3>
              </div>
            </div>

            {/* Filters Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Filters & Search</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                
                {/* Role Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Filter by Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                  >
                    <option value="">All Roles</option>
                    <option value="creator">Creator</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {/* Search */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Users
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by email..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full p-3 pl-12 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                    />
                    <i
                      data-feather="search"
                      className="absolute left-4 top-3 text-gray-400 w-4 h-4"
                    ></i>
                  </div>
                </div>
              </div>

              {/* Results Count and Clear Filters */}
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-semibold">
                  Showing {filteredUsers.length} of {users.length} users
                </span>
                {(role || search) && (
                  <button
                    onClick={() => {
                      setRole("");
                      setSearch("");
                    }}
                    className="text-primary font-semibold hover:underline flex items-center gap-2"
                  >
                    <i data-feather="x" className="w-4 h-4"></i>
                    Clear Filters
                  </button>
                )}
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-gray-700 font-semibold text-lg">Loading users...</p>
                  </div>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-12">
                  <i data-feather="users" className="w-16 h-16 text-gray-400 mx-auto mb-4"></i>
                  <p className="text-gray-600 font-semibold text-lg mb-2">No users found</p>
                  <p className="text-gray-500 mb-4">
                    {users.length === 0 ? "No users have been registered yet." : "Try adjusting your filters."}
                  </p>
                  <a
                    href="/admin/users/add"
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg transition-colors"
                  >
                    <i data-feather="plus" className="w-4 h-4"></i>
                    Add First User
                  </a>
                </div>
              ) : (
                <>
                  {/* Desktop Table View */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                            Email
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                            Role
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>

                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="font-medium text-gray-900">{user.email}</div>
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 text-sm font-semibold rounded-full capitalize ${
                                user.role === "admin" 
                                  ? "bg-purple-100 text-purple-800"
                                  : user.role === "moderator"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                              }`}>
                                {user.role}
                              </span>
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
                                user.status === "active" 
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}>
                                {user.status || "active"}
                              </span>
                            </td>

                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex gap-3">
                                <a
                                  href={`/admin/users/${user.id}`}
                                  className="text-primary hover:text-primary-dark font-semibold flex items-center gap-1"
                                >
                                  <i data-feather="eye" className="w-4 h-4"></i>
                                  View
                                </a>
                                <a
                                  href={`/admin/users/edit/${user.id}`}
                                  className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                                >
                                  <i data-feather="edit" className="w-4 h-4"></i>
                                  Edit
                                </a>
                                <UserDelBtn
                                  id={user.id}
                                  base_url={base_url}
                                  token={token}
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards View */}
                  <div className="md:hidden space-y-4 p-4">
                    {filteredUsers.map((user) => (
                      <div key={user.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-bold text-gray-900">{user.email}</h3>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                            user.role === "admin" 
                              ? "bg-purple-100 text-purple-800"
                              : user.role === "moderator"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}>
                            {user.role}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            user.status === "active" 
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {user.status || "active"}
                          </span>
                        </div>
                        
                        <div className="flex gap-2">
                          <a
                            href={`/admin/users/${user.id}`}
                            className="flex-1 bg-black text-white font-semibold py-2 px-3 rounded text-center text-sm hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-1"
                          >
                            <i data-feather="eye" className="w-3 h-3"></i>
                            View
                          </a>
                          <a
                            href={`/admin/users/edit/${user.id}`}
                            className="flex-1 bg-blue-600 text-white font-semibold py-2 px-3 rounded text-center text-sm hover:bg-blue-900 transition-colors flex items-center justify-center gap-1"
                          >
                            <i data-feather="edit" className="w-3 h-3"></i>
                            Edit
                          </a>
                            <UserDelBtn id={user.id} base_url={base_url} token={token} />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Pagination */}
            {filteredUsers.length > 0 && (
              <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-gray-700 font-semibold">
                  Showing {filteredUsers.length} of {users.length} results
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
                    Previous
                  </button>
                  <button className="px-4 py-2 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors">
                    1
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
                    Next
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </RoleGuard>
  );
};

export default Page;