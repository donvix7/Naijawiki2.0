"use client";

import AdminNavbar from '@/components/adminNavbar';
import AdminSidebar from '@/components/adminSideBar';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie'; // For handling cookies on client side
import RoleGuard from '@/utils/RoleGuard';

const page = () => {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWords = async () => {
    setLoading(true);
    try {
      const token = Cookies.get('token'); // Get token from cookie
      if (!token) {
        console.log("No token found");
        setLoading(false);
        return;
      }

      const res = await fetch("http://wiki-server.giguild.com/api/user/word/list", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error("Failed to fetch words");
      }

      const data = await res.json();
      setWords(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWords();
    const interval = setInterval(fetchWords, 60000); // Refresh every 60 seconds
    return () => clearInterval(interval);
  }, []);

  const pendingWords = words.filter(w => w.status === "pending").length;
  const totalWords = words.length;
  const approvedToday = words.filter(w => {
    const today = new Date();
    const created = new Date(w.createdAt);
    return w.status === "approved" &&
      created.getDate() === today.getDate() &&
      created.getMonth() === today.getMonth() &&
      created.getFullYear() === today.getFullYear();
  }).length;

  return (
    <RoleGuard allowedRoles={["admin"]}>

    <div>
      <AdminNavbar />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold text-secondary mb-6">Admin Dashboard</h1>

          {loading ? (
            <p>Loading data...</p>
          ) : (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-primary">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-500">Pending Words</p>
                      <h3 className="text-3xl font-bold">{pendingWords}</h3>
                    </div>
                    <i data-feather="clock" className="text-primary text-2xl"></i>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-secondary">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-500">Total Words</p>
                      <h3 className="text-3xl font-bold">{totalWords}</h3>
                    </div>
                    <i data-feather="book" className="text-secondary text-2xl"></i>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-accent">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-500">New Users</p>
                      <h3 className="text-3xl font-bold">28</h3>
                    </div>
                    <i data-feather="users" className="text-accent text-2xl"></i>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-500">Approved Today</p>
                      <h3 className="text-3xl font-bold">{approvedToday}</h3>
                    </div>
                    <i data-feather="check-circle" className="text-green-500 text-2xl"></i>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Recent Activity</h2>
                  <a href="/admin/activity" className="text-primary hover:underline">View All</a>
                </div>
                <div className="space-y-4">
                  {words.slice(0, 5).map((w, index) => (
                    <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-100">
                      <div className="bg-gray-100 p-2 rounded-full">
                        <i data-feather="plus-circle" className="text-primary"></i>
                      </div>
                      <div>
                        <p className="font-medium">New word submission</p>
                        <p className="text-gray-500 text-sm">"{w.word}" by {w.submittedBy}</p>
                        <p className="text-gray-400 text-xs mt-1">{new Date(w.createdAt).toLocaleTimeString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
    </RoleGuard>
  );
};

export default page;
