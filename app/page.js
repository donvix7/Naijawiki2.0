"use client";

import React, { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import CustomFooter from "@/components/customFooter";
import CustomNavbar from "@/components/navBar";
import feather from "feather-icons";
import getBaseUrl from "./api/baseUrl";

export default function Home() {
  const [recentWords, setRecentWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // NEW STATES FOR SEARCH
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const audioRef = useRef(null);
  const base_url = getBaseUrl();
  const token = Cookies.get("token");

  /* -----------------------------------------
     Feather Icons
  ------------------------------------------ */
  useEffect(() => {
    feather.replace();
  }, []);

  /* -----------------------------------------
     Fetch recent words
  ------------------------------------------ */
  useEffect(() => {
    const fetchRecentWords = async () => {
      try {
        const res = await fetch(`${base_url}/words`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          cache: "no-store",
        });

        if (!res.ok) throw new Error("Failed to fetch words");

        const data = await res.json();
        const words = data.words || [];

        const grouped = {};
        words.forEach((word) => {
          const dateKey = new Date(word.createdAt).toDateString();
          if (!grouped[dateKey]) grouped[dateKey] = [];
          if (grouped[dateKey].length < 5) grouped[dateKey].push(word);
        });

        const sortedWords = Object.entries(grouped)
          .sort((a, b) => new Date(b[0]) - new Date(a[0]))
          .flatMap(([_, w]) => w);

        setRecentWords(sortedWords);
      } catch (err) {
        console.error(err);
        setError("Failed to load recent words.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecentWords();
  }, [base_url, token]);

  /* -----------------------------------------
     SEARCH HANDLER – calls /words?search=
  ------------------------------------------ */
  useEffect(() => {
    if (!search.trim()) {
      setSearchResults([]);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setSearchLoading(true);

      try {
        const res = await fetch(`${base_url}/words?search=${search}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (!res.ok) throw new Error("Failed fetching search results");

        const data = await res.json();
        const list = Array.isArray(data) ? data : data.words || [];

        // Only approved words
        const filtered = list.filter((w) => w.status === "approved");

        setSearchResults(filtered);
      } catch (err) {
        console.error(err);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 400); // debounce search

    return () => clearTimeout(delayDebounce);
  }, [search]);

  /* -----------------------------------------
     Audio Play Handler
  ------------------------------------------ */
  const handlePlayAudio = (audioUrl, word) => {
    try {
      if (audioRef.current) audioRef.current.pause();

      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      audio.play().catch(() => alert(`Audio not available for "${word}".`));
    } catch {
      alert(`Couldn't play audio for "${word}".`);
    }
  };

  /* -----------------------------------------
     MAIN UI
  ------------------------------------------ */
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-black">
      <CustomNavbar />

      {/* HERO */}
      <section className="bg-gradient-to-r from-primary to-accent py-20 text-white">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Preserve Nigerian Languages & Culture
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover, learn, and contribute to the rich linguistic heritage of Nigeria.
          </p>

          {/* SEARCH BAR */}
          <div className="max-w-xl mx-auto relative">
            <input
              type="text"
              placeholder="Search Naija words..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full py-4 px-6 rounded-full text-gray-800 shadow-lg"
            />
            <button className="absolute right-2 top-2 bg-secondary text-white p-2 rounded-full">
              <i data-feather="search"></i>
            </button>
          </div>

          {/* SEARCH RESULTS */}
          {search && (
            <div className="max-w-xl mx-auto bg-white mt-4 rounded-xl shadow-lg text-left p-4">
              {searchLoading ? (
                <p className="text-gray-500 text-center">Searching...</p>
              ) : searchResults.length === 0 ? (
                <p className="text-gray-500 text-center">No results found.</p>
              ) : (
                <ul className="space-y-3">
                  {searchResults.map((word) => (
                    <li
                      key={word.id}
                      className="border-b pb-2 cursor-pointer hover:text-primary"
                    >
                      <a href={`/word-details/${word.id}`} className="font-semibold">
                        {word.word}
                      </a>
                      <p className="text-gray-500 text-sm">{word.meaning}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </section>

      {/* RECENT WORDS */}
      <section className="py-16 container mx-auto px-6">
        <h2 className="text-3xl font-bold mb-8 text-center">Recent Words This Week</h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentWords.map((word) => (
              <div
                key={word.id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <h3 className="text-2xl font-bold text-secondary">
                    <a href={`/word-details/${word.id}`}>{word.word}</a>
                  </h3>
                  <span className="bg-primary text-white px-3 py-1 rounded-full text-sm">
                    {word.language}
                  </span>
                </div>

                <p className="mt-2 text-gray-600">{word.meaning}</p>

                <button
                  className="mt-4 flex items-center text-primary"
                  onClick={() =>
                    handlePlayAudio(
                      word.audioUrl || `${base_url}/audio/${word.word}.mp3`,
                      word.word
                    )
                  }
                >
                  <i data-feather="play-circle" className="mr-2"></i> Listen
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <CustomFooter />
    </div>
  );
}
