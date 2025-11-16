"use client";

import React, { useEffect, useState } from "react";
import AdminNavbar from "@/components/adminNavbar";
import AdminSidebar from "@/components/adminSideBar";
import getBaseUrl from "@/app/api/baseUrl";
import Cookies from "js-cookie";
import RoleGuard from "@/utils/RoleGuard";
import DeleteBtn from "@/components/deleteBtn";
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
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-secondary">Manage Users</h1>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                
                {/* Role Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Filter by Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">All Roles</option>
                    <option value="creator">Creator</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Search Users
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search by email..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full p-2 pl-10 border border-gray-300 rounded-lg"
                    />
                    <i
                      data-feather="search"
                      className="absolute left-3 top-2.5 text-gray-400"
                    ></i>
                  </div>
                </div>

              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr>
                        <td className="px-6 py-4" colSpan="3">
                          Loading users...
                        </td>
                      </tr>
                    ) : filteredUsers.length === 0 ? (
                      <tr>
                        <td
                          colSpan="3"
                          className="px-6 py-6 text-center text-gray-500"
                        >
                          No users match your filters.
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap font-medium">
                            {user.email}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap capitalize">
                            {user.role}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap flex gap-3">
                            <a
                              href={`/admin/users/${user.id}`}
                              className="text-primary hover:underline"
                            >
                              View
                            </a>

                            <UserDelBtn
                              id={user.id}
                              base_url={base_url}
                              token={token}
                            />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Placeholder */}
              <div className="mt-6 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  Showing {filteredUsers.length} of {users.length} results
                </div>

                <div className="flex gap-2">
                  <button className="px-3 py-1 border rounded-md bg-white">
                    Previous
                  </button>
                  <button className="px-3 py-1 border rounded-md bg-primary text-white">
                    1
                  </button>
                  <button className="px-3 py-1 border rounded-md bg-white">
                    Next
                  </button>
                </div>
              </div>

            </div>
          </main>
        </div>
      </div>
    </RoleGuard>
  );
};

export default Page;
