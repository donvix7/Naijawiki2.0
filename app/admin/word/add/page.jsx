"use client";
import AdminNavbar from '@/components/adminNavbar';
import AdminSidebar from '@/components/adminSideBar';
import Cookies from 'js-cookie';
import React, { useState } from 'react';

const page = () => {
  const [word, setWord] = useState("");
  const [language, setLanguage] = useState("");
  const [meaning, setMeaning] = useState("");
  const [example, setExample] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("approved");
  const [message, setMessage] = useState("");
  const base_url = process.env.NEXT_PUBLIC__BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tokenCookie = Cookies.get('token');
    const token = tokenCookie ? tokenCookie.value : null;

    if (!token) {
      setMessage("You must be logged in to add a word.");
      return;
    }

    try {
      const res = await fetch(`${base_url}/words`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ word, meaning, language, example, category, status }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Failed to save word.");
        return;
      }

      setMessage("Word added successfully!");
      // Reset form
      setWord("");
      setLanguage("");
      setMeaning("");
      setExample("");
      setCategory("");
      setStatus("approved");
    } catch (error) {
      console.log(error);
      setMessage("An error occurred while submitting the word.");
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className="flex">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-secondary">Add New Word</h1>
            <a href="/admin/words" className="text-primary hover:underline flex items-center gap-2">
              <i data-feather="arrow-left"></i> Back to Words
            </a>
          </div>

          {message && (
            <div className="mb-4 text-center text-white bg-green-500 p-2 rounded">
              {message}
            </div>
          )}

          <div className="bg-white rounded-xl shadow-sm p-6">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Word/Phrase*</label>
                  <input
                    type="text"
                    required
                    value={word}
                    onChange={(e) => setWord(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Language*</label>
                  <select
                    required
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                  >
                    <option value="">Select Language</option>
                    <option>Pidgin</option>
                    <option>Yoruba</option>
                    <option>Igbo</option>
                    <option>Hausa</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Meaning*</label>
                <textarea
                  rows="3"
                  required
                  value={meaning}
                  onChange={(e) => setMeaning(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Example Usage</label>
                <textarea
                  rows="2"
                  value={example}
                  onChange={(e) => setExample(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                  >
                    <option value="">Select Category</option>
                    <option>Slang</option>
                    <option>Proverb</option>
                    <option>Greeting</option>
                    <option>Food</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status*</label>
                  <select
                    required
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                  >
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-6">
                <button
                  type="reset"
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="bg-primary hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
                >
                  <i data-feather="save"></i> Save Word
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default page;
