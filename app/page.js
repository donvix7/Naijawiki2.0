"use client";

import React, { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import CustomFooter from "@/components/customFooter";
import CustomNavbar from "@/components/navBar";
import feather from "feather-icons";
import getBaseUrl from "./api/baseUrl";

export default function Home() {
  const [weeklyWords, setWeeklyWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Search states
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const [currentAudio, setCurrentAudio] = useState(null);
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [audioError, setAudioError] = useState(null);
  const base_url = getBaseUrl();
  const token = Cookies.get("token");

  // Get current week number
  const getWeekNumber = () => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const pastDaysOfYear = (now - startOfYear) / 86400000;
    return Math.ceil((pastDaysOfYear + startOfYear.getDay() + 1) / 7);
  };

  /* ------------------------------
     Feather Icons
  -------------------------------*/
  useEffect(() => {
    feather.replace();
  }, [weeklyWords, searchResults]);

  /* ------------------------------
     Fetch 5 random words for the week
  -------------------------------*/
  useEffect(() => {
    const fetchWeeklyWords = async () => {
      try {
        // Get the current week number for localStorage key
        const currentWeek = getWeekNumber();
        const year = new Date().getFullYear();
        const storageKey = `weeklyWords_${year}_week_${currentWeek}`;
        
        // Check if we have cached words for this week
        const cachedWords = localStorage.getItem(storageKey);
        if (cachedWords) {
          const parsedWords = JSON.parse(cachedWords);
          setWeeklyWords(parsedWords);
          setLoading(false);
          return;
        }

        // Fetch all approved words
        const res = await fetch(`${base_url}/words`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          cache: "no-store",
        });
        
        if (!res.ok) throw new Error("Failed to fetch words");

        const data = await res.json();
        const words = data.words || [];
        
        // Filter only approved words
        const approvedWords = words.filter(word => word.status === "approved");
        
        // If we have less than 5 approved words, use what we have
        if (approvedWords.length <= 5) {
          setWeeklyWords(approvedWords);
          localStorage.setItem(storageKey, JSON.stringify(approvedWords));
          setLoading(false);
          return;
        }
        
        // Shuffle array and pick 5 random words
        const shuffled = [...approvedWords].sort(() => 0.5 - Math.random());
        const selectedWords = shuffled.slice(0, 5);
        
        setWeeklyWords(selectedWords);
        
        // Cache for the week
        localStorage.setItem(storageKey, JSON.stringify(selectedWords));
        
      } catch (err) {
        console.error(err);
        setError("Failed to load weekly words.");
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyWords();
  }, [base_url, token]);

  /* ------------------------------
     Clear old weekly words cache
  -------------------------------*/
  useEffect(() => {
    // Clear any old weekly words cache from previous weeks
    const currentWeek = getWeekNumber();
    const year = new Date().getFullYear();
    
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('weeklyWords_')) {
        const [_, keyYear, keyWeek] = key.match(/weeklyWords_(\d+)_week_(\d+)/) || [];
        if (keyYear && keyWeek) {
          const cachedYear = parseInt(keyYear);
          const cachedWeek = parseInt(keyWeek);
          
          // Clear if it's from a different year or different week
          if (cachedYear !== year || cachedWeek !== currentWeek) {
            localStorage.removeItem(key);
          }
        }
      }
    });
  }, []);

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
  const handlePlayAudio = async (word) => {
    // Stop current audio if playing
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
      setPlayingAudioId(null);
    }

    // Check for audio availability
    const audioUrl = word.audio_url || word.audioUrl || word.audio;
    console.log("Attempting to play audio:", audioUrl);
    
    if (!audioUrl) {
      setAudioError(`No audio available for "${word.word}"`);
      return;
    }

    try {
      setAudioError(null);
      setPlayingAudioId(word.id);

      // Create audio element
      const audio = new Audio(audioUrl);
      setCurrentAudio(audio);

      // Set up event listeners
      audio.addEventListener('loadeddata', () => {
        console.log("Audio loaded successfully");
      });

      audio.addEventListener('canplaythrough', () => {
        console.log("Audio can play through");
      });

      audio.addEventListener('error', (e) => {
        console.error("Audio error:", e);
        setAudioError(`Couldn't play audio for "${word.word}". The file may be missing or corrupted.`);
        setPlayingAudioId(null);
        setCurrentAudio(null);
      });

      audio.addEventListener('ended', () => {
        setPlayingAudioId(null);
        setCurrentAudio(null);
      });

      audio.addEventListener('pause', () => {
        setPlayingAudioId(null);
      });

      // Attempt to play
      await audio.play();
      
    } catch (error) {
      console.error("Audio play failed:", error);
      setAudioError(`Couldn't play audio for "${word.word}". Please try again.`);
      setPlayingAudioId(null);
      setCurrentAudio(null);
    }
  };

  /* ------------------------------
     Stop Audio
  -------------------------------*/
  const handleStopAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
      setPlayingAudioId(null);
    }
  };

  /* ------------------------------
     Render Word Card
  -------------------------------*/
  const renderWordCard = (word) => {
    // Check if audio is available for this word
    const hasAudio = word.audio_url || word.audioUrl || word.audio;
    
    return (
      <div
        key={word.id}
        className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-300 hover:border-yellow-500"
      >
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-900 break-words">
            <a
              href={`/word-details/${word.id}`}
              className="hover:text-yellow-500 transition-colors duration-200"
            >
              {word.word}
            </a>
          </h3>
          <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-semibold min-w-[80px] text-center shrink-0 ml-2">
            {word.language}
          </span>
        </div>

        <p className="text-gray-700 mb-4 leading-relaxed font-normal text-base break-words">
          {word.meaning}
        </p>

        <div className="flex items-center gap-2">
          <button
            className={`flex items-center font-semibold transition-colors duration-200 px-3 py-2 rounded-lg text-sm ${
              playingAudioId === word.id 
                ? "text-red-600 hover:text-red-700 bg-red-50" 
                : "text-yellow-500 hover:text-yellow-500-dark hover:bg-yellow-500-light"
            } ${!hasAudio ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => 
              playingAudioId === word.id 
                ? handleStopAudio() 
                : handlePlayAudio(word)
            }
            disabled={!hasAudio}
            aria-label={
              playingAudioId === word.id 
                ? `Stop pronunciation of ${word.word}` 
                : `Listen to pronunciation of ${word.word}`
            }
          >
            <i 
              data-feather={playingAudioId === word.id ? "square" : "play"} 
              className="mr-2 w-4 h-4" 
              aria-hidden="true"
            ></i>
            {playingAudioId === word.id ? "Stop" : "Listen"}
          </button>
          
          {/* Audio format indicator */}
          {hasAudio && (
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded border border-green-200">
              Audio
            </span>
          )}
        </div>
      </div>
    );
  };

  /* ------------------------------
     Clean up audio on unmount
  -------------------------------*/
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        setCurrentAudio(null);
      }
    };
  }, [currentAudio]);

  /* ------------------------------
     MAIN UI
  -------------------------------*/
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <CustomNavbar />

      {/* HERO SECTION */}
      <section className=" py-16 text-black">
        <div className="container mx-auto px-6 text-center ">
          <h1 className="text-3xl font-bold mb-4 leading-tight tracking-tight text-black">
            Preserve Nigerian Languages & Culture
          </h1>
          <p className=" text-yellow-500">
            Discover, learn, and contribute to the rich linguistic heritage of Nigeria.
          </p>

          {/* SEARCH BAR */}
          <div className="max-w-4xl mx-auto relative px-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search Naija words..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full py-3.5 px-6 rounded-full text-gray-900 shadow-sm border border-gray-200 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 focus:outline-none text-base font-normal placeholder-gray-500"
                aria-label="Search for Nigerian words"
              />
              <button
                type="button"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-yellow-500 text-white p-3 rounded-full hover:bg-yellow-500-dark transition-colors duration-200"
                aria-label="Search"
                onClick={() => setSearch(search.trim())}
              >
                <i data-feather="search" className="w-4 h-4" aria-hidden="true"></i>
              </button>
            </div>

            {/* SEARCH RESULTS */}
            {search && (
              <div className="absolute top-full left-0 right-0 bg-white mt-2 rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-50">
                {searchLoading ? (
                  <div className="p-4 text-center">
                    <p className="text-gray-700 font-normal text-sm">Searching...</p>
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="p-4 text-center">
                    <p className="text-gray-700 font-normal text-sm break-words">
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
                              <h4 className="font-semibold text-gray-900 text-base mb-1 break-words">
                                {word.word}
                              </h4>
                              <p className="text-gray-700 font-normal text-sm break-words">
                                {word.meaning}
                              </p>
                            </div>
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

      {/* WEEKLY WORDS SECTION */}
      <section className="py-12 container mx-auto px-6">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold mb-3 tracking-tight text-gray-900">
            Featured Words This Week
          </h2>
        
          
        </div>

        {/* Audio Error Display */}
        {audioError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center text-sm">
            {audioError}
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto mb-3"></div>
            <p className="text-gray-700 font-normal text-base">Loading weekly words...</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <p className="text-red-600 font-semibold text-sm bg-red-50 inline-block px-4 py-2 rounded-lg break-words">
              {error}
            </p>
          </div>
        ) : weeklyWords.length === 0 ? (
          <div className="text-center">
            <p className="text-gray-700 font-normal text-base break-words">
              No words available yet. Be the first to contribute!
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {weeklyWords.map(renderWordCard)}
            </div>
            
           
          </>
        )}
        
        {/* Explore More CTA */}
        {!loading && weeklyWords.length > 0 && (
          <div className="text-center mt-12">
            <a
              href="/explore"
              className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors duration-200 text-sm"
            >
              <i data-feather="compass" className="w-4 h-4"></i>
              Explore More Words
            </a>
          </div>
        )}
      </section>

      <CustomFooter />
    </div>
  );
}