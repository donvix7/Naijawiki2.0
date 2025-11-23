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

  // Search states
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const audioRef = useRef(null);
  const base_url = getBaseUrl();
  const token = Cookies.get("token");

  /* ------------------------------
     Feather Icons
  -------------------------------*/
  useEffect(() => {
    feather.replace();
  }, [recentWords, searchResults]);

  /* ------------------------------
     Fetch recent words
  -------------------------------*/
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

        // Group by date and limit to 5 per day
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

  /* ------------------------------
     SEARCH HANDLER (debounced)
  -------------------------------*/
  useEffect(() => {
    if (!search.trim()) {
      setSearchResults([]);
      return;
    }

    const controller = new AbortController();
    const delayDebounce = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await fetch(
          `${base_url}/words?search=${encodeURIComponent(search)}`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            signal: controller.signal,
          }
        );
        if (!res.ok) throw new Error("Failed fetching search results");

        const data = await res.json();
        const list = Array.isArray(data) ? data : data.words || [];
        const filtered = list.filter((w) => w.status === "approved");

        setSearchResults(filtered);
      } catch (err) {
        if (err.name !== "AbortError") console.error(err);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 400);

    return () => {
      clearTimeout(delayDebounce);
      controller.abort();
    };
  }, [search, base_url, token]);

  /* ------------------------------
     Audio Play Handler
  -------------------------------*/
  const handlePlayAudio = (audioUrl, word) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    if (!audioUrl) return alert(`Audio not available for "${word}"`);

    const audio = new Audio(audioUrl);
    audioRef.current = audio;
    audio
      .play()
      .catch(() => alert(`Couldn't play audio for "${word}".`));
  };

  /* ------------------------------
     Render Word Card
  -------------------------------*/
  const renderWordCard = (word) => (
    <div
      key={word.id}
      className="bg-white text-gray-900 rounded-xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300 hover:border-primary"
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-2xl font-bold text-secondary-dark break-words">
          <a
            href={`/word-details/${word.id}`}
            className="hover:text-primary-dark transition-colors duration-200"
          >
            {word.word}
          </a>
        </h3>
        <span className="bg-primary text-neutral px-3 py-1 rounded-full text-sm font-semibold min-w-[80px] text-center shrink-0 ml-2">
          {word.language}
        </span>
      </div>

      <p className="text-gray-800 mb-4 leading-relaxed font-medium break-words">
        {word.meaning}
      </p>

      <button
        className="flex items-center text-primary-dark font-semibold hover:text-primary transition-colors duration-200 px-3 py-2 rounded-lg hover:bg-primary-light"
        onClick={() =>
          handlePlayAudio(
            word.audioUrl || `${base_url}/audio/${word.word}.mp3`,
            word.word
          )
        }
        aria-label={`Listen to pronunciation of ${word.word}`}
      >
        <i data-feather="play-circle" className="mr-2" aria-hidden="true"></i>
        Listen
      </button>
    </div>
  );

  /* ------------------------------
     MAIN UI
  -------------------------------*/
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <CustomNavbar />

      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-primary to-secondary py-16 md:py-20 text-white">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight break-words text-black">
            Preserve Nigerian Languages & Culture
          </h1>
          <p className="text-lg sm:text-xl md:text-xl mb-6 md:mb-8 max-w-4xl mx-auto leading-relaxed font-medium break-words px-4 text-gray-500">
            Discover, learn, and contribute to the rich linguistic heritage of Nigeria.
          </p>

          {/* SEARCH BAR */}
          <div className="max-w-2xl mx-auto relative px-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search Naija words..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full py-3 sm:py-4 px-4 sm:px-6 rounded-full text-gray-900 shadow-xl border-2 border-transparent focus:border-primary focus:outline-none text-base sm:text-lg font-medium"
                aria-label="Search for Nigerian words"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-accent text-white p-2 sm:p-3 rounded-full hover:bg-accent-dark transition-colors duration-200"
                aria-label="Search"
                onClick={() => setSearch(search.trim())}
              >
                <i data-feather="search" className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true"></i>
              </button>
            </div>

            {/* SEARCH RESULTS */}
            {search && (
              <div className="absolute top-full left-0 right-0 bg-white mt-2 rounded-xl shadow-2xl border border-gray-200 max-h-96 overflow-y-auto z-50">
                {searchLoading ? (
                  <div className="p-4 text-center">
                    <p className="text-gray-700 font-medium">Searching...</p>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="p-4 text-center">
                    <p className="text-gray-700 font-medium break-words">
                      No results found for "{search}"
                    </p>
                  </div>
                ) : (
                  <ul className="divide-y divide-gray-100">
                    {searchResults.map((word) => (
                      <li
                        key={word.id}
                        className="hover:bg-gray-50 transition-colors duration-150"
                      >
                        <a
                          href={`/word-details/${word.id}`}
                          className="block p-4 hover:no-underline"
                        >
                          <div className="flex justify-between items-start gap-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-gray-900 text-base sm:text-lg mb-1 break-words">
                                {word.word}
                              </h4>
                              <p className="text-gray-700 font-medium text-sm break-words">
                                {word.meaning}
                              </p>
                            </div>
                            <span className="bg-primary text-neutral px-2 py-1 rounded text-xs font-semibold whitespace-nowrap shrink-0 ml-2">
                              {word.language}
                            </span>
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* RECENT WORDS SECTION */}
      <section className="py-12 md:py-16 container mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-8 md:mb-12 text-center text-gray-900 break-words">
          Recent Words This Week
        </h2>

        {loading ? (
          <div className="text-center">
            <p className="text-gray-700 text-lg font-medium">Loading words...</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <p className="text-red-600 text-lg font-semibold bg-red-50 inline-block px-4 py-2 rounded-lg break-words">
              {error}
            </p>
          </div>
        ) : recentWords.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-700 text-lg font-medium break-words">
              No words available yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {recentWords.map(renderWordCard)}
          </div>
        )}
      </section>

      <CustomFooter />
    </div>
  );
}