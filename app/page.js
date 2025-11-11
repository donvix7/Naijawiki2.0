"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import CustomFooter from "@/components/customFooter";
import CustomNavbar from "@/components/navBar";
import feather from "feather-icons";

export default function Home() {
  const [trendingWords, setTrendingWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Initialize feather icons once
  useEffect(() => {
  feather.replace(); // run once on mount
}   , []); // empty dependency array is correct

  // Fetch trending words from API
  useEffect(() => {
  const fetchTrendingWords = async () => {
    const token = Cookies.get("token");
    /*if (!token) {
      setError("You must be logged in to fetch words.");
      setLoading(false);
      return;
    }*/

    try {
      //http://wiki-server.giguild.com/api/user/word/list  for creator
      const res = await fetch("https://wiki-server.giguild.com/api/words", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch words");

      const data = await res.json();
      setTrendingWords(data.words?.slice(0, 6) || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load trending words.");
    } finally {
      setLoading(false);
    }
  };

  fetchTrendingWords();
}, []); // empty dependency array ensures this runs once on mount



  return (
    <div className="flex flex-col min-h-screen justify-center bg-zinc-50 font-sans dark:bg-black">
      <CustomNavbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-accent py-20 text-white">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Preserve Nigerian Languages & Culture
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover, learn, and contribute to the rich linguistic heritage of Nigeria
          </p>
          <div className="max-w-xl mx-auto relative">
            <input
              type="text"
              placeholder="Search Naija words or phrases..."
              className="w-full py-4 px-6 rounded-full text-gray-800 shadow-lg"
            />
            <button aria-label="Search" className="absolute right-2 top-2 bg-secondary text-white p-2 rounded-full">
              <i data-feather="search"></i>
            </button>
          </div>
        </div>
      </section>

      {/* Trending Words Section */}
      <section className="py-16 container mx-auto px-6">
        <h2 className="text-3xl font-bold mb-8 text-center">Trending Words This Week</h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading trending words...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : trendingWords.length === 0 ? (
          <p className="text-center text-gray-500">No trending words found this week.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {trendingWords.map((word) => (
              <div
                key={word.id || word.word}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-bold text-secondary">{word.word || "Unknown"}</h3>
                    <span className="bg-primary text-white px-3 py-1 rounded-full text-sm">
                      {word.language || "Unknown"}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-600">{word.meaning || "No meaning provided"}</p>
                  <div className="mt-4 flex items-center">
                    <button className="flex items-center text-primary" aria-label={`Listen to ${word.word}`}>
                      <i data-feather="play-circle" className="mr-2"></i>
                      Listen
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Community Section */}
      <section className="py-16 bg-secondary text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Join Our Growing Community</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Help preserve Nigerian languages by contributing words, meanings, and pronunciations
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <a
              href="/submit-word"
              className="bg-primary hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-full transition-colors"
            >
              Contribute a Word
            </a>
            <a
              href="/explore"
              className="bg-secondary hover:bg-gray-100 text-black font-bold py-3 px-6 rounded-full transition-colors"
            >
              Explore Words
            </a>
          </div>
        </div>
      </section>

      <CustomFooter />
    </div>
  );
}
