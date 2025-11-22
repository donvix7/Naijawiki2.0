"use client";
import getBaseUrl from '@/app/api/baseUrl';
import AdminNavbar from '@/components/adminNavbar';
import AdminSidebar from '@/components/adminSideBar';
import RoleGuard from '@/utils/RoleGuard';
import Cookies from 'js-cookie';
import feather from 'feather-icons';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Page = () => {
  const [word, setWord] = useState("");
  const [language, setLanguage] = useState("");
  const [meaning, setMeaning] = useState("");
  const [example, setExample] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("approved");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const base_url = getBaseUrl();
  const router = useRouter();

  useEffect(() => {
    feather.replace();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = Cookies.get('token');

    if (!token) {
      setMessage("You must be logged in to add a word.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${base_url}/words`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ word, meaning, example, language, category, status }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.message || "Failed to save word.");
        setLoading(false);
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
      
      // Redirect after success
      setTimeout(() => {
        router.push('/admin/words');
      }, 1500);
    } catch (error) {
      console.log(error);
      setMessage("An error occurred while submitting the word.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setWord("");
    setLanguage("");
    setMeaning("");
    setExample("");
    setCategory("");
    setStatus("approved");
    setMessage("");
  };

  return (
    <RoleGuard allowedRoles={["admin", "super_admin"]}>
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <div className="flex">
          <AdminSidebar />
          <main className="flex-1 p-4 md:p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  Add New Word
                </h1>
                <p className="text-gray-600 font-medium">
                  Create a new word entry for the dictionary
                </p>
              </div>
              
              <button
                onClick={() => router.push('/admin/words')}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-b from-gray-100 to-gray-200 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:from-gray-200 hover:to-gray-300 transition-colors shadow-sm"
              >
                <i data-feather="arrow-left" className="w-4 h-4"></i>
                Back to Words
              </button>
            </div>

            {/* Message Alert */}
            {message && (
              <div className={`mb-6 p-4 rounded-xl ${
                message.includes("success") 
                  ? "bg-gradient-to-b from-green-100 to-green-200 border border-green-300 text-green-800" 
                  : "bg-gradient-to-b from-red-100 to-red-200 border border-red-300 text-red-800"
              }`}>
                <div className="flex items-center gap-3">
                  <i data-feather={message.includes("success") ? "check-circle" : "alert-circle"} className="w-5 h-5"></i>
                  <span className="font-semibold">{message}</span>
                </div>
              </div>
            )}

            {/* Form Card */}
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 lg:p-8">
              <h2 className="text-xl font-bold text-gray-900 mb-6 pb-2 border-b border-gray-200">
                Word Information
              </h2>

              <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  {/* Word */}
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-semibold mb-3 text-lg">
                      Word/Phrase *
                    </label>
                    <input
                      type="text"
                      required
                      value={word}
                      onChange={(e) => setWord(e.target.value)}
                      className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 font-medium"
                      placeholder="Enter the word or phrase"
                    />
                  </div>

                  {/* Language */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-3 text-lg">
                      Language *
                    </label>
                    <select
                      required
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 font-medium"
                    >
                      <option value="">Select Language</option>
                      <option value="yoruba">Yoruba</option>
                      <option value="igbo">Igbo</option>
                      <option value="hausa">Hausa</option>
                      <option value="pidgin">Pidgin</option>
                      <option value="english">English</option>
                    </select>
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-3 text-lg">
                      Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 font-medium"
                    >
                      <option value="">Select Category</option>
                      <option value="greeting">Greeting</option>
                      <option value="food">Food</option>
                      <option value="family">Family</option>
                      <option value="numbers">Numbers</option>
                      <option value="verbs">Verbs</option>
                      <option value="nouns">Nouns</option>
                      <option value="adjectives">Adjectives</option>
                      <option value="phrases">Common Phrases</option>
                    </select>
                  </div>

                  {/* Status */}
                  <div>
                    <label className="block text-gray-700 font-semibold mb-3 text-lg">
                      Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 font-medium"
                    >
                      <option value="approved">Approved</option>
                      <option value="pending">Pending Review</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>

                  {/* Meaning */}
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-semibold mb-3 text-lg">
                      Meaning *
                    </label>
                    <textarea
                      rows="4"
                      required
                      value={meaning}
                      onChange={(e) => setMeaning(e.target.value)}
                      className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 font-medium resize-vertical"
                      placeholder="Provide the meaning and explanation of the word"
                    ></textarea>
                  </div>

                  {/* Example Usage */}
                  <div className="md:col-span-2">
                    <label className="block text-gray-700 font-semibold mb-3 text-lg">
                      Example Usage
                    </label>
                    <textarea
                      rows="3"
                      value={example}
                      onChange={(e) => setExample(e.target.value)}
                      className="w-full p-4 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 font-medium resize-vertical"
                      placeholder="Show how the word is used in a sentence (optional)"
                    ></textarea>
                  </div>
                </div>

                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-b from-gray-100 to-gray-200 border border-gray-300 text-gray-700 font-bold rounded-xl hover:from-gray-200 hover:to-gray-300 transition-all duration-200 shadow-sm"
                  >
                    <i data-feather="refresh-cw" className="w-4 h-4"></i>
                    Reset Form
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-b from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <i data-feather="save" className="w-4 h-4"></i>
                        Save Word
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Help Information */}
            <div className="mt-8 bg-gradient-to-b from-blue-50 to-blue-100 rounded-xl p-4 md:p-6 border border-blue-200">
              <div className="flex items-start gap-3">
                <i data-feather="info" className="w-5 h-5 text-blue-600 mt-0.5"></i>
                <div>
                  <p className="text-blue-800 font-semibold text-sm mb-2">Word Submission Guidelines</p>
                  <ul className="text-blue-700 text-sm space-y-1">
                    <li>• Ensure the word is culturally appropriate and accurate</li>
                    <li>• Provide clear and concise meanings</li>
                    <li>• Include relevant examples for better understanding</li>
                    <li>• Select the appropriate language and category</li>
                    <li>• Use "Pending Review" if unsure about word accuracy</li>
                  </ul>
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