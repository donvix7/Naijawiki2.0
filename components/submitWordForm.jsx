"use client";

import React, { useState, useRef, useEffect } from "react";
import Cookies from "js-cookie";
import getBaseUrl from "@/app/api/baseUrl";

const SubmitWordForm = () => {
  const [status, setStatus] = useState({ loading: false, message: "" });
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
  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Fetch existing words with pagination
  const fetchExistingWords = async (page = 1, search = "") => {
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
  };

  // Load existing words on component mount
  useEffect(() => {
    fetchExistingWords(1);
  }, []);

  // Handle audio time updates
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  // Handle progress bar click
  const handleProgressClick = (e) => {
    if (!audioRef.current || !progressRef.current) return;
    
    const progressBar = progressRef.current;
    const clickPosition = (e.clientX - progressBar.getBoundingClientRect().left) / progressBar.offsetWidth;
    const newTime = clickPosition * duration;
    
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleFileChange = (e) => {
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
  };

  const handleRecord = async () => {
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
  };

  const handlePlayPause = () => {
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
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleAudioLoaded = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleReset = () => {
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
  };

  const handleSubmit = async (e) => {
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
  };

  // Pagination handlers
  const handlePageChange = (page) => {
    fetchExistingWords(page, searchTerm);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchExistingWords(1, searchTerm);
  };

  const clearSearch = () => {
    setSearchTerm("");
    fetchExistingWords(1);
  };

  // Calculate progress percentage
  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  // Generate page numbers for pagination
  const generatePageNumbers = () => {
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
  };

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
      {status.message && (
        <div className={`p-4 mb-6 rounded-lg ${
          status.message.includes("success") 
            ? "bg-green-100 text-green-800 border border-green-200" 
            : "bg-red-100 text-red-800 border border-red-200"
        }`}>
          {status.message}
          <button 
            onClick={() => setStatus({ loading: false, message: "" })}
            className="float-right text-lg font-bold hover:text-gray-700"
          >
            ×
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Submission Form */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-secondary mb-6">Submit New Word</h2>
          
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
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
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
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
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
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
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
                    className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
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
                            className="h-full bg-primary rounded-full transition-all duration-100"
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
                          className="flex-1 accent-primary"
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
                className="bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

        {/* Existing Words with Pagination */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-secondary mb-6">
            Existing Words ({totalWords.toLocaleString()})
          </h2>

          {/* Search */}
          <form onSubmit={handleSearch} className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search existing words..."
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              />
              <button
                type="submit"
                disabled={wordsLoading}
                className="bg-primary text-white px-4 rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
              >
                Search
              </button>
              {searchTerm && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="bg-gray-100 text-gray-700 px-4 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </form>

          {/* Words List */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {wordsLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-gray-500">Loading words...</p>
              </div>
            ) : existingWords.length > 0 ? (
              existingWords.map((word) => (
                <div key={word.id} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{word.word}</h3>
                      <p className="text-sm text-gray-600">{word.meaning}</p>
                      {word.use_case && (
                        <p className="text-xs text-gray-500 mt-1">e.g., {word.use_case}</p>
                      )}
                    </div>
                    <span className="bg-primary text-white px-2 py-1 rounded text-xs font-medium ml-2">
                      {word.language}
                    </span>
                  </div>
                  
                  {/* Audio Indicator */}
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      {(word.audio_url || word.audio) ? (
                        <span className="text-xs text-green-600 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                          </svg>
                          Audio available
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          No Audio
                        </span>
                      )}
                    </div>
                    
                    <div className="text-xs text-gray-500">
                      {new Date(word.createdAt || word.date_created).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No words found. Be the first to submit one!
              </div>
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  
                  {generatePageNumbers().map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 border rounded ${
                        currentPage === page
                          ? "bg-primary text-white border-primary"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 border border-gray-300 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
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