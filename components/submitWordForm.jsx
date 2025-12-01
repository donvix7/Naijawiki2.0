"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import Cookies from "js-cookie";
import getBaseUrl from "@/app/api/baseUrl";

const SubmitWordForm = ({ setStatus }) => {
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const base_url = getBaseUrl();
  const [audioFile, setAudioFile] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  
  // Pagination state
  const [existingWords, setExistingWords] = useState([]);
  const [wordsLoading, setWordsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalWords, setTotalWords] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const pageSize = 10;

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const formRef = useRef(null);
  const audioRef = useRef(null);
  const progressRef = useRef(null);

  // Format time from seconds to MM:SS
  const formatTime = useCallback((time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  // Fetch existing words with pagination - memoized with useCallback
  const fetchExistingWords = useCallback(async (page = 1, search = "") => {
    setWordsLoading(true);
    try {
      const token = Cookies.get("token");
      const params = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString(),
        ...(search && { search })
      });

      const res = await fetch(`${base_url}/word/words?${params}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });

      if (res.ok) {
        const data = await res.json();
        setExistingWords(data.words || data.data || []);
        setTotalPages(data.totalPages || Math.ceil((data.totalCount || 0) / pageSize));
        setTotalWords(data.totalCount || 0);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error("Error fetching words:", error);
    } finally {
      setWordsLoading(false);
    }
  }, [base_url, pageSize]);

  // Load existing words on component mount only
  useEffect(() => {
    fetchExistingWords(1);
  }, [fetchExistingWords]);

  // Handle audio time updates
  const handleTimeUpdate = useCallback(() => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  }, []);

  // Handle progress bar click
  const handleProgressClick = useCallback((e) => {
    if (!audioRef.current || !progressRef.current) return;
    
    const progressBar = progressRef.current;
    const clickPosition = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.offsetWidth;
    const newTime = clickPosition * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  }, [duration]);

  // Handle volume change
  const handleVolumeChange = useCallback((e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  }, []);

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      setAudioFile(file);
      const url = URL.createObjectURL(file);
      setAudioURL(url);
      
      setTimeout(() => {
        if (audioRef.current) {
          setDuration(audioRef.current.duration || 0);
          setCurrentTime(0);
        }
      }, 100);
    }
  }, []);

  const handleRecord = useCallback(async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
          const url = URL.createObjectURL(audioBlob);
          setAudioURL(url);
          setAudioFile(new File([audioBlob], "recording.webm", { type: "audio/webm" }));
          
          setCurrentTime(0);
          setIsPlaying(false);
          
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Error accessing microphone:", err);
        alert("Microphone access denied. Please check your browser permissions.");
      }
    } else {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  }, [isRecording]);

  const handlePlayPause = useCallback(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => {
          console.error("Play failed:", error);
          setStatus({ loading: false, message: "Failed to play audio. Please try again." });
        });
      }
    }
  }, [isPlaying, setStatus]);

  const handleAudioEnded = useCallback(() => {
    setIsPlaying(false);
    setCurrentTime(0);
  }, []);

  const handleAudioLoaded = useCallback(() => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  }, []);

  const handleReset = useCallback(() => {
    if (formRef.current) {
      formRef.current.reset();
    }
    setAudioFile(null);
    setAudioURL(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    
    if (audioURL) {
      URL.revokeObjectURL(audioURL);
    }
  }, [audioURL]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    const token = Cookies.get("token");

    if (!token) {
      alert("You must be logged in to submit a word.");
      return;
    }

    setSubmissionLoading(true);
    setStatus({ loading: true, message: "Submitting word..." });

    try {
      const formData = new FormData(formRef.current);

      if (audioFile) {
        formData.append("audio", audioFile);
      }

      const res = await fetch(`${base_url}/word/submit-word`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Error submitting word");
      const data = await res.json();

      console.log("Submitted:", data);
      setStatus({ loading: false, message: "Word submitted successfully!" });
      handleReset();
      // Refresh the existing words list to show the new submission
      fetchExistingWords(1);
    } catch (error) {
      console.error("Submission failed:", error);
      setStatus({ loading: false, message: "Failed to submit word. Please try again." });
    } finally {
      setSubmissionLoading(false);
    }
  }, [audioFile, base_url, fetchExistingWords, handleReset, setStatus]);

  // Pagination handlers
  const handlePageChange = useCallback((page) => {
    fetchExistingWords(page, searchTerm);
  }, [fetchExistingWords, searchTerm]);

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    fetchExistingWords(1, searchTerm);
  }, [fetchExistingWords, searchTerm]);

  const clearSearch = useCallback(() => {
    setSearchTerm("");
    fetchExistingWords(1);
  }, [fetchExistingWords]);

  // Calculate progress percentage
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Generate page numbers for pagination
  const generatePageNumbers = useCallback(() => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  }, [currentPage, totalPages]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioURL) {
        URL.revokeObjectURL(audioURL);
      }
    };
  }, [audioURL]);

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 gap-8 mx-auto max-w-3xl">
        {/* Submission Form */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-blue-900 mb-6">Submit New Word</h2>
          
          <form ref={formRef} onSubmit={handleSubmit} id="wordForm" className="space-y-6">
            {/* Word */}
            <div>
              <label htmlFor="word" className="block text-sm font-medium text-gray-700 mb-1">
                Word/Phrase*
              </label>
              <input
                type="text"
                name="word"
                id="word"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="Enter word or phrase"
              />
            </div>

            {/* Meaning */}
            <div>
              <label htmlFor="meaning" className="block text-sm font-medium text-gray-700 mb-1">
                Meaning/Definition*
              </label>
              <textarea
                name="meaning"
                id="meaning"
                rows="3"
                required
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="Enter the meaning or definition"
              ></textarea>
            </div>

            {/* Example */}
            <div>
              <label htmlFor="use_case" className="block text-sm font-medium text-gray-700 mb-1">
                Example Usage
              </label>
              <textarea
                name="use_case"
                id="use_case"
                rows="2"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                placeholder="E.g., 'No wahala, I go do am'"
              ></textarea>
            </div>

            {/* Pronunciation + Audio */}
            <div>
              <label htmlFor="pronunciation" className="block text-sm font-medium text-gray-700 mb-1">
                Pronunciation / Audio
              </label>
              <div className="space-y-4">
                <div className="flex items-center gap-4 flex-wrap">
                  <input
                    type="text"
                    name="pronunciation"
                    id="pronunciation"
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                    placeholder="Phonetic spelling"
                  />
                  <button
                    type="button"
                    onClick={handleRecord}
                    className={`flex items-center gap-2 py-3 px-4 rounded-lg transition-colors ${
                      isRecording ? "bg-red-500 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                    }`}
                  >
                    {isRecording ? (
                      <>
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                        Recording...
                      </>
                    ) : (
                      "Record Audio"
                    )}
                  </button>
                  <div className="relative">
                    <input 
                      type="file" 
                      accept="audio/*" 
                      onChange={handleFileChange} 
                      className="text-sm cursor-pointer" 
                    />
                  </div>
                </div>
                
                {/* Enhanced Audio Preview Section */}
                {audioURL && (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <p className="text-sm font-medium text-gray-700 mb-3">Audio Preview:</p>
                    
                    {/* Quick Play Button - Prominently Displayed */}
                    <div className="flex items-center justify-between mb-4 p-3 bg-white rounded-lg border">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={handlePlayPause}
                          className={`flex items-center gap-2 py-2 px-4 rounded-lg transition-colors ${
                            isPlaying 
                              ? "bg-red-500 text-white hover:bg-red-600" 
                              : "bg-green-500 text-white hover:bg-green-600"
                          }`}
                        >
                          {isPlaying ? (
                            <>
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M6 4h4v16H6zM14 4h4v16h-4z"/>
                              </svg>
                              Stop Playback
                            </>
                          ) : (
                            <>
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z"/>
                              </svg>
                              Play Recording
                            </>
                          )}
                        </button>
                        
                        {/* Playing Indicator */}
                        {isPlaying && (
                          <div className="flex items-center gap-2">
                            <div className="flex gap-1">
                              <div className="w-1 h-3 bg-green-500 animate-audio-bar"></div>
                              <div className="w-1 h-4 bg-green-500 animate-audio-bar" style={{ animationDelay: '0.2s' }}></div>
                              <div className="w-1 h-3 bg-green-500 animate-audio-bar" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                            <span className="text-sm text-green-600 font-medium">Playing...</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-right">
                        <span className="text-sm text-gray-500 block">
                          {audioFile?.name || "Recording"}
                        </span>
                        {audioFile && (
                          <span className="text-xs text-gray-400">
                            {(audioFile.size / 1024).toFixed(1)} KB
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Advanced Audio Controls */}
                    <div className="space-y-3">
                      {/* Progress Bar */}
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 w-10">
                          {formatTime(currentTime)}
                        </span>
                        <div 
                          ref={progressRef}
                          className="flex-1 h-2 bg-gray-200 rounded-full cursor-pointer"
                          onClick={handleProgressClick}
                        >
                          <div 
                            className="h-full bg-yellow-500 rounded-full transition-all duration-100"
                            style={{ width: `${progressPercentage}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-10">
                          {formatTime(duration)}
                        </span>
                      </div>

                      {/* Volume Control */}
                      <div className="flex items-center gap-3">
                        <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                        </svg>
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          value={volume}
                          onChange={handleVolumeChange}
                          className="flex-1 accent-yellow-500"
                        />
                        <span className="text-xs text-gray-500 w-8">
                          {Math.round(volume * 100)}%
                        </span>
                      </div>
                    </div>

                    <audio
                      ref={audioRef}
                      src={audioURL}
                      onEnded={handleAudioEnded}
                      onPlay={() => setIsPlaying(true)}
                      onPause={() => setIsPlaying(false)}
                      onTimeUpdate={handleTimeUpdate}
                      onLoadedMetadata={handleAudioLoaded}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Submission */}
            <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleReset}
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Reset Form
              </button>
              <button
                type="submit"
                disabled={submissionLoading}
                className="w-fit bg-gradient-to-r from-yellow-500 to-black hover:from-black hover:to-yellow-500 text-white font-semibold text-base py-3.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {submissionLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Submitting...
                  </>
                ) : (
                  "Submit Word"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Audio Animation CSS */}
      <style jsx>{`
        @keyframes audio-bar {
          0%, 100% { transform: scaleY(0.5); }
          50% { transform: scaleY(1); }
        }
        .animate-audio-bar {
          animation: audio-bar 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default SubmitWordForm;