"use client";

import React, { useEffect, useState } from "react";
import AdminNavbar from "@/components/adminNavbar";
import AdminSidebar from "@/components/adminSideBar";
import getBaseUrl from "@/app/api/baseUrl";
import Cookies from "js-cookie";
import RoleGuard from "@/utils/RoleGuard";

const Page = () => {
  const base_url = getBaseUrl();
    const token = Cookies.get("token");
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [language, setLanguage] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  // Fetch all words dynamically
  useEffect(() => {
    const fetchWords = async () => {
      try {
        setLoading(true);

        // placeholder until backend is ready
        const res = await fetch(`${base_url}/user/word/list`, {
          method: "GET",
          
          headers: {
             "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
             },
        });

        if (!res.ok) throw new Error("Failed to fetch words");

        const data = await res.json();

        // Expecting array of word objects
        setWords(data.words || []);
      } catch (err) {
        console.error("Error loading words:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWords();
  }, [base_url]);

  // Filter + Search Logic
  const filteredWords = words.filter((w) => {
    return (
      (!language || w.language === language) &&
      (!status || w.status === status) &&
      (!search || w.word.toLowerCase().includes(search.toLowerCase()))
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
            <h1 className="text-3xl font-bold text-secondary">Manage Words</h1>

            <a
              href="/admin/word/add"
              className="bg-primary hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition"
            >
              <i data-feather="plus"></i> Add Word
            </a>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="">All Languages</option>
                  <option value="pidgin">Pidgin</option>
                  <option value="yoruba">Yoruba</option>
                  <option value="igbo">Igbo</option>
                  <option value="hausa">Hausa</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search words..."
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Word</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Language</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted By</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>

                <tbody className="bg-white divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td className="px-6 py-4" colSpan="5">
                        Loading words...
                      </td>
                    </tr>
                  ) : filteredWords.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-6 text-center text-gray-500">
                        No words match your filters.
                      </td>
                    </tr>
                  ) : (
                    filteredWords.map((item) => (
                      <tr key={item._id}>
                        <td className="px-6 py-4 whitespace-nowrap font-medium">{item.word}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{item.language}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              item.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : item.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">{item.creator || "—"}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <a
                            href={`/admin/word/edit/${item.id}`}
                            className="text-primary hover:underline mr-3"
                          >
                            Edit
                          </a>

                          <button className="text-red-500 hover:underline">
                            Delete
                          </button>
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
                Showing {filteredWords.length} of {words.length} results
              </div>

              <div className="flex gap-2">
                <button className="px-3 py-1 border rounded-md bg-white">Previous</button>
                <button className="px-3 py-1 border rounded-md bg-primary text-white">1</button>
                <button className="px-3 py-1 border rounded-md bg-white">Next</button>
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
