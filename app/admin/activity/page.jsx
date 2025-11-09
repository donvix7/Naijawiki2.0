"use client";
import AdminNavbar from '@/components/adminNavbar';
import AdminSideBar from '@/components/adminSideBar';
import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

const Page = () => {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getWords = async () => {
    const token = Cookies.get("token"); // get token from login
    if (!token) {
      setError("No token found. Please login.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("http://wiki-server.giguild.com/api/user/word/list", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        }
      });

      if (!res.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await res.json();
      setWords(data.words || []); // adjust according to your API response
      setLoading(false);

    } catch (err) {
      console.error(err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getWords();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div>
      <AdminNavbar />
      <div className="flex">
        <AdminSideBar />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold text-secondary mb-6">Activity Log</h1>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Target</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Timestamp</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Details</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {words.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium 
                          ${item.action === 'approved' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                          <i data-feather={item.action === 'approved' ? "check" : "edit"} className="w-3 h-3 mr-1"></i>
                          {item.action}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.userEmail}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.target}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{item.timestamp}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button className="text-primary hover:underline">View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Page;
