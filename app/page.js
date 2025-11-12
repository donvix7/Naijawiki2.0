"use client";

import React, { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import CustomFooter from "@/components/customFooter";
import CustomNavbar from "@/components/navBar";
import feather from "feather-icons";

export default function Home() {
  const [recentWords, setRecentWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const audioRef = useRef(null); // track current audio
  const base_url = process.env.NEXT_PUBLIC_BASE_URL;
  // Initialize feather icons once
  useEffect(() => {
    feather.replace();
  }, []);

  // Fetch recent words and limit to 5/day
  useEffect(() => {
    const fetchRecentWords = async () => {
      const token = Cookies.get("token");
      try {
        const res = await fetch(`${base_url}/words`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed to fetch words");

        const data = await res.json();
        const words = data.words || [];

        // Group words by date and limit to 5 per day
        const grouped = {};
        words.forEach((word) => {
          const dateKey = word.createdAt
            ? new Date(word.createdAt).toDateString()
            : "Unknown Date";
          if (!grouped[dateKey]) grouped[dateKey] = [];
          if (grouped[dateKey].length < 5) grouped[dateKey].push(word);
        });

        // Sort by most recent date
        const sortedWords = Object.entries(grouped)
          .sort(
            (a, b) =>
              new Date(b[0]).getTime() - new Date(a[0]).getTime()
          )
          .flatMap(([_, words]) => words);

        setRecentWords(sortedWords);
      } catch (err) {
        console.error("Error fetching words:", err);
        setError("Failed to load recent words.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecentWords();

    const interval = setInterval(fetchRecentWords, 24 * 60 * 60 * 1000); // refresh daily
    return () => clearInterval(interval);
  }, []);

  // Handle audio play
  const handlePlayAudio = (audioUrl, word) => {
    try {
      if (audioRef.current) {
        audioRef.current.pause();
      }

      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.play().catch(() => {
        alert(`Audio for "${word}" is not available.`);
      });
    } catch (err) {
      console.error("Error playing audio:", err);
      alert(`Couldn't play audio for "${word}".`);
    }
  };

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
            <button
              aria-label="Search"
              className="absolute right-2 top-2 bg-secondary text-white p-2 rounded-full"
            >
              <i data-feather="search"></i>
            </button>
          </div>
        </div>
      </section>

      {/* Recent Words Section */}
      <section className="py-16 container mx-auto px-6">
        <h2 className="text-3xl font-bold mb-8 text-center">Recent Words This Week</h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading recent words...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : recentWords.length === 0 ? (
          <p className="text-center text-gray-500">No recent words found this week.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentWords.map((word) => (
              <div
                key={word.id || word.word}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-bold text-secondary">
                      {word.word || "Unknown"}
                    </h3>
                    <span className="bg-primary text-white px-3 py-1 rounded-full text-sm">
                      {word.language || "Unknown"}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-600">
                    {word.meaning || "No meaning provided"}
                  </p>
                  <div className="mt-4 flex items-center">
                    <button
                      className="flex items-center text-primary hover:underline"
                      aria-label={`Listen to ${word.word}`}
                      onClick={() =>
                        handlePlayAudio(
                          word.audioUrl ||
                            `https://wiki-server.giguild.com/audio/${word.word}.mp3`,
                          word.word
                        )
                      }
                    >
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
