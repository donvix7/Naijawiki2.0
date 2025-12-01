"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import CustomNavbar from "@/components/navBar";
import CustomFooter from "@/components/customFooter";
import feather from "feather-icons";
import getBaseUrl from "@/app/api/baseUrl";

export default function WordDetails() {
  const params = useParams();
  const id = params.id;
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
  }, [id, base_url]);

  // Replace feather icons after mount or when word loads
  useEffect(() => {
    feather.replace();
  }, [word, isPlaying, audioError]);

  // Handle audio playback
  const handlePlayAudio = async () => {
    if (!word) return;

    // Stop current audio if playing
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlaying(false);
    }

    // Check for audio availability
    const audioUrl = word.audio_url || word.audioUrl || word.audio;
    console.log("Audio URL:", audioUrl);
    
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
        audioRef.current = null;
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
      audioRef.current = null;
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
      <div className="min-h-screen flex flex-col">
        <CustomNavbar />
        <div className="flex-grow flex items-center justify-center text-gray-500 py-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-yellow-500 mx-auto mb-5"></div>
            <p className="text-base text-gray-600">Loading word details...</p>
          </div>
        </div>
        <CustomFooter />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <CustomNavbar />
        <div className="flex-grow flex items-center justify-center text-red-600 py-24">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="w-16 h-16 text-red-500 mx-auto mb-5 flex items-center justify-center">
              <i data-feather="alert-triangle"></i>
            </div>
            <h2 className="text-xl font-semibold mb-4">Unable to Load Word</h2>
            <p className="text-gray-600 mb-6 text-base">{error}</p>
            <a
              href="/explore"
              className="inline-flex items-center gap-2 bg-yellow-500 text-white px-5 py-2.5 rounded-lg hover:bg-yellow-500-dark transition-colors text-base"
            >
              <i data-feather="arrow-left"></i>
              Back to Explore
            </a>
          </div>
        </div>
        <CustomFooter />
      </div>
    );
  }

  if (!word) {
    return (
      <div className="min-h-screen flex flex-col">
        <CustomNavbar />
        <div className="flex-grow flex items-center justify-center text-gray-600 py-24">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="w-16 h-16 text-gray-500 mx-auto mb-5 flex items-center justify-center">
              <i data-feather="alert-triangle"></i>
            </div>
            <h2 className="text-xl font-semibold mb-4">Word Not Found</h2>
            <p className="text-gray-600 mb-6 text-base">The word you're looking for doesn't exist or may have been removed.</p>
            <a
              href="/explore"
              className="inline-flex items-center gap-2 bg-yellow-500 text-white px-5 py-2.5 rounded-lg hover:bg-yellow-500-dark transition-colors text-base"
            >
              <i data-feather="arrow-left"></i>
              Back to Explore
            </a>
          </div>
        </div>
        <CustomFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <CustomNavbar />

      <main className="flex-grow">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-3xl mx-auto">
            {/* Back Button */}
            <div className="mb-10">
              <a
                href="/explore"
                className="inline-flex items-center gap-2.5 text-yellow-500 hover:text-yellow-500-dark transition-colors text-base font-medium group"
              >
                <i data-feather="arrow-left" className="group-hover:-translate-x-0.5 transition-transform"></i>
                Back to Explore
              </a>
            </div>

            {/* Word Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-8">
                {/* Word Header */}
                <div className="mb-10">
                  <h1 className="text-3xl font-bold text-gray-900 leading-tight tracking-tight">
                    {word.word || "Unknown Word"}
                  </h1>
                </div>

                <div className="space-y-8">
                  {/* Meaning Section */}
                  <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Meaning
                    </h2>
                    <p className="text-gray-700 text-base leading-relaxed">{word.meaning || "—"}</p>
                  </section>

                  {/* Pronunciation Section */}
                  <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Pronunciation
                    </h2>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-wrap">
                      <span className="text-gray-700 text-base font-medium bg-gray-50 px-4 py-2.5 rounded-lg border border-gray-200">
                        {word.pronunciation || word.prononciation || "N/A"}
                      </span>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={isPlaying ? handleStopAudio : handlePlayAudio}
                          disabled={!hasAudio}
                          className={`flex items-center gap-2.5 px-5 py-2.5 rounded-lg transition-all duration-200 font-medium text-base ${
                            isPlaying 
                              ? "bg-red-500 text-white hover:bg-red-600 shadow-sm" 
                              : "bg-yellow-500 text-red hover:bg-yellow-500-dark disabled:bg-gray-300 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
                          }`}
                        >
                          {isPlaying ? (
                            <>
                              <i data-feather="square"></i>
                              <span>Stop</span>
                            </>
                          ) : (
                            <>
                              <i data-feather="play"></i>
                              <span>Listen</span>
                            </>
                          )}
                        </button>
                        
                        {/* Audio availability indicator */}
                        {hasAudio && (
                          <span className="text-xs text-green-600 bg-green-50 px-2.5 py-1.5 rounded border border-green-200">
                            <i data-feather="volume-2" className="w-3 h-3 inline mr-1"></i>
                            Audio
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {/* Audio error message */}
                    {audioError && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                        <div className="flex items-center gap-2">
                          <i data-feather="alert-triangle"></i>
                          <span>{audioError}</span>
                        </div>
                      </div>
                    )}
                  </section>

                  {/* Example Usage Section */}
                  <section>
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Example Usage
                    </h2>
                    <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                      <p className="text-gray-700 text-base leading-relaxed mb-3">{word.use_case || word.example || "—"}</p>
                      {word.translation && (
                        <p className="text-gray-500 text-sm border-t border-gray-200 pt-3">
                          <span className="font-medium">Translation:</span> "{word.translation}"
                        </p>
                      )}
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <CustomFooter />
    </div>
  );
}