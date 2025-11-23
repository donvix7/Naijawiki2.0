"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import CustomNavbar from "@/components/navBar";
import CustomFooter from "@/components/customFooter";
import feather from "feather-icons";
import getBaseUrl from "@/app/api/baseUrl";

export default function WordDetails() {
  const params = useParams();
  const id = params.id
  const [word, setWord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioError, setAudioError] = useState(null);
  const audioRef = useRef(null);
  const base_url = getBaseUrl();

  useEffect(() => {
    const fetchWord = async () => {
      try {
        const res = await fetch(`${base_url}/word/${id}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch word data");
        const data = await res.json();
        setWord(data.word || data);
      } catch (err) {
        console.error(err);
        setError("Unable to load word details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchWord();
  }, [id]);

  // Replace feather icons after mount or when word loads
  useEffect(() => {
    feather.replace();
  }, [word]);

  // Handle audio playback
  const handlePlayAudio = async () => {
    if (!word) return;

    // Stop current audio if playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlaying(false);
    }

    // Check for audio availability - fixed the property names
    const audioUrl = word.audio_url || word.audioUrl || word.audio;
    console.log("Audio URL:", audioUrl); // Fixed the typo from console,log to console.log
    
    if (!audioUrl) {
      setAudioError(`No audio available for "${word.word}"`);
      return;
    }

    try {
      setAudioError(null);
      setIsPlaying(true);

      // Create audio element
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

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
        setIsPlaying(false);
      });

      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        audioRef.current = null;
      });

      audio.addEventListener('pause', () => {
        setIsPlaying(false);
      });

      // Attempt to play
      await audio.play();
      
    } catch (error) {
      console.error("Audio play failed:", error);
      setAudioError(`Couldn't play audio for "${word.word}". Please try again.`);
      setIsPlaying(false);
    }
  };

  // Stop audio
  const handleStopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
      setIsPlaying(false);
    }
  };

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Check if audio is available for the word
  const hasAudio = word && (word.audio_url || word.audioUrl || word.audio);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          Loading word details...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600">
        <div className="text-center">
          <div className="w-16 h-16 text-red-500 mx-auto mb-4 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          {error}
        </div>
      </div>
    );
  }

  if (!word) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        <div className="text-center">
          <div className="w-16 h-16 text-gray-500 mx-auto mb-4 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          Word not found.
        </div>
      </div>
    );
  }

  return (
    <div>
      <CustomNavbar />

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Back Button + Language */}
          <div className="flex items-center justify-between mb-8">
            <a
              href="/explore"
              className="text-primary hover:underline flex items-center gap-2"
            >
              <i data-feather="arrow-left"></i> Back to Explore
            </a>
            <span className="bg-primary text-white px-3 py-1 rounded-full text-sm">
              {word.language || "Pidgin"}
            </span>
          </div>

          {/* Word Card */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <h1 className="text-4xl font-bold text-secondary">
                  {word.word || "Unknown Word"}
                </h1>
              </div>

              <div className="space-y-6">
                {/* Meaning */}
                <section>
                  <h2 className="text-xl font-bold text-secondary mb-2">
                    Meaning
                  </h2>
                  <p className="text-gray-700">{word.meaning || "—"}</p>
                </section>

                {/* Pronunciation */}
                <section>
                  <h2 className="text-xl font-bold text-secondary mb-2">
                    Pronunciation
                  </h2>
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-gray-700">
                      {word.pronunciation || word.prononciation || "N/A"}
                    </span>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={isPlaying ? handleStopAudio : handlePlayAudio}
                        disabled={!hasAudio}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                          isPlaying 
                            ? "bg-red-500 text-white hover:bg-red-600" 
                            : "bg-primary text-white hover:bg-primary-dark disabled:bg-gray-300 disabled:cursor-not-allowed"
                        }`}
                      >
                        {isPlaying ? (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect x="6" y="4" width="4" height="16"></rect>
                              <rect x="14" y="4" width="4" height="16"></rect>
                            </svg>
                            <span>Stop</span>
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polygon points="5 3 19 12 5 21 5 3"></polygon>
                            </svg>
                            <span>Listen</span>
                          </>
                        )}
                      </button>
                      
                      {/* Audio availability indicator */}
                      {hasAudio && (
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                          Audio Available
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Audio error message */}
                  {audioError && (
                    <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                      {audioError}
                    </div>
                  )}
                </section>

                {/* Example Usage */}
                <section>
                  <h2 className="text-xl font-bold text-secondary mb-2">
                    Example Usage
                  </h2>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 mb-2">{word.use_case || word.example || "—"}</p>
                    {word.translation && (
                      <p className="text-gray-500 text-sm">
                        (Meaning: "{word.translation}")
                      </p>
                    )}
                  </div>
                </section>

                {/* Related Words */}
                {word.related && word.related.length > 0 && (
                  <section>
                    <h2 className="text-xl font-bold text-secondary mb-2">
                      Related Words
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {word.related.map((relatedWord, index) => (
                        <a
                          key={index}
                          href={`/word/${relatedWord}`}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm"
                        >
                          {relatedWord}
                        </a>
                      ))}
                    </div>
                  </section>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <CustomFooter />
    </div>
  );
}