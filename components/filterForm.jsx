"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import feather from "feather-icons";
import getBaseUrl from "@/app/api/baseUrl";

export default function FilterForm({ isLoggedIn }) {
  const base_url = getBaseUrl();

  const [search, setSearch] = useState("");
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentAudio, setCurrentAudio] = useState(null);
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [audioError, setAudioError] = useState("");

  /** Init feather icons */
  useEffect(() => {
    feather.replace();
  });

  /** Fetch All Words */
  const fetchAllWords = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${base_url}/words`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setWords(data.words ?? []);
      setError("");
    } catch {
      setError("⚠ Failed to fetch words. Please retry.");
    } finally {
      setLoading(false);
    }
  }, [base_url]);

  useEffect(() => {
    fetchAllWords();
  }, [fetchAllWords]);

  /** Search */
  const searchWords = async () => {
    if (!search.trim()) return fetchAllWords();
    setLoading(true);
    try {
      const res = await fetch(`${base_url}/words?search=${search}`);
      const data = await res.json();
      setWords(data.words ?? []);
      setError("");
    } catch {
      setError("No results found.");
      setWords([]);
    } finally {
      setLoading(false);
    }
  };

  /** Fixed Audio Controls */
  const playAudio = useCallback(async (word) => {
    const url = word.audio_url || word.audioUrl || word.audio;
    
    if (!url) {
      setAudioError(`No audio available for "${word.word}"`);
      return;
    }

    // Stop current audio if playing
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }

    try {
      setAudioError("");
      setPlayingAudioId(word.id);

      // Create new audio element
      const audio = new Audio(url);
      setCurrentAudio(audio);

      // Set up event listeners
      const handleEnded = () => {
        setPlayingAudioId(null);
        setCurrentAudio(null);
      };

      const handleError = (e) => {
        console.error("Audio error:", e);
        setAudioError(`Couldn't play audio for "${word.word}". The file may be missing or corrupted.`);
        setPlayingAudioId(null);
        setCurrentAudio(null);
      };

      const handlePause = () => {
        if (audio.currentTime > 0 && !audio.ended) {
          // Only clear if manually paused, not when ended
          return;
        }
      };

      // Add event listeners
      audio.addEventListener('ended', handleEnded);
      audio.addEventListener('error', handleError);
      audio.addEventListener('pause', handlePause);

      // Play audio
      await audio.play();
      
      // Store cleanup function
      return () => {
        audio.removeEventListener('ended', handleEnded);
        audio.removeEventListener('error', handleError);
        audio.removeEventListener('pause', handlePause);
      };
    } catch (error) {
      console.error("Audio play failed:", error);
      setAudioError(`Couldn't play audio for "${word.word}". Please try again.`);
      setPlayingAudioId(null);
      setCurrentAudio(null);
    }
  }, [currentAudio]);

  const stopAudio = useCallback(() => {
    if (!currentAudio) return;
    
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
      setPlayingAudioId(null);
    } catch (error) {
      console.error("Error stopping audio:", error);
    }
  }, [currentAudio]);

  // Clean up audio on component unmount
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        setCurrentAudio(null);
      }
    };
  }, [currentAudio]);

  // Clear audio error after 5 seconds
  useEffect(() => {
    if (audioError) {
      const timer = setTimeout(() => {
        setAudioError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [audioError]);

  return (
    <main className="container mx-auto px-6 py-16">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-16">
        <div>
          <h1 className="text-5xl font-bold tracking-tight text-gray-900">
            Nigerian Word Explorer
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            Listen, Learn & Discover Languages Across Nigeria 🇳🇬
          </p>
        </div>

        {isLoggedIn && (
          <a
            href="/submit-word"
            className="mt-6 md:mt-0 bg-gradient-to-r from-yellow-500 to-yellow-500 text-white font-semibold px-6 py-3 rounded-full shadow-lg hover:scale-105 hover:shadow-2xl transition-all flex items-center gap-2"
          >
            <i data-feather="plus"></i> Add Word
          </a>
        )}
      </header>

      {/* Error Displays */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
          {error}
          <button 
            onClick={() => setError("")}
            className="float-right text-lg font-bold hover:text-gray-700"
          >
            ×
          </button>
        </div>
      )}

      {audioError && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-700 text-center">
          {audioError}
          <button 
            onClick={() => setAudioError("")}
            className="float-right text-lg font-bold hover:text-gray-700"
          >
            ×
          </button>
        </div>
      )}

      {/* SEARCH PANEL */}
      <div className="backdrop-blur-lg bg-white/60 p-6 rounded-2xl shadow-xl border border-gray-100 mb-12">
        <div className="flex flex-col md:flex-row gap-4">

          <div className="flex-1 relative">
            <input
              value={search}
              onChange={(e)=> setSearch(e.target.value)}
              onKeyDown={(e)=> e.key === "Enter" && searchWords()}
              placeholder="Search Igbo, Yoruba, Hausa, Pidgin..."
              className="w-full p-4 pl-12 rounded-xl border border-gray-200 shadow-sm text-lg focus:ring-2 focus:ring-yellow-500 outline-none"
            />
            <i data-feather="search" className="absolute left-4 top-4 text-gray-400"></i>

            {loading && (
              <div className="absolute right-4 top-4 animate-spin w-5 h-5 border-2 border-yellow-500 border-b-transparent rounded-full"/>
            )}
          </div>

          <button
            onClick={searchWords}
            disabled={loading}
            className="px-6 py-4 bg-yellow-500 text-white font-semibold rounded-xl hover:bg-yellow-600 transition disabled:opacity-50"
          >
            Search
          </button>

          <button
            onClick={() => { setSearch(""); fetchAllWords(); }}
            className="px-6 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition"
          >
            Clear
          </button>

        </div>
      </div>


      {/* COUNT */}
      <p className="text-gray-500 mb-8 font-medium text-lg">
        {words.length} word{words.length !== 1 && "s"} found
      </p>


      {/* WORDS GRID — PREMIUM CARD LAYOUT */}
      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">

        {loading && (
          <div className="col-span-full text-center py-16">
            <div className="animate-spin w-14 h-14 border-4 border-yellow-500 border-b-transparent rounded-full mx-auto"></div>
          </div>
        )}

        {!loading && words.length === 0 && (
          <p className="col-span-full text-center text-gray-600 text-xl py-16">
            No words found.
          </p>
        )}

        {words.map((word)=>{

          const hasAudio = word.audio_url || word.audio || word.audioUrl;

          return (
            <div
              key={word.id}
              className="group bg-white rounded-2xl p-6 shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all border border-gray-100"
            >
              <h2 className="text-3xl font-semibold text-gray-900">
                {word.word}
              </h2>

              <p className="text-gray-600 mt-3 min-h-[60px] leading-relaxed">
                {word.meaning}
              </p>

              <div className="flex justify-between items-center mt-6">

                {/* AUDIO BTN */}
                <button
                  disabled={!hasAudio}
                  onClick={()=>
                    playingAudioId === word.id ? stopAudio() : playAudio(word)
                  }
                  className={`flex items-center gap-2 font-medium
                    ${playingAudioId === word.id 
                      ? "text-red-600 hover:text-red-700" 
                      : hasAudio 
                        ? "text-yellow-600 hover:text-yellow-700" 
                        : "opacity-50 cursor-not-allowed"
                    }
                  `}
                >
                  <i data-feather={playingAudioId===word.id?"square":"play-circle"}/>
                  {playingAudioId===word.id ? "Stop" : "Listen"}
                </button>

                <a
                  href={`/word-details/${word.id}`}
                  className="text-blue-700 hover:underline font-semibold flex items-center gap-1"
                >
                  View <i data-feather="arrow-right"/>
                </a>

              </div>
            </div>
          );
        })}

      </section>
    </main>
  );
}