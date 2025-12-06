"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import Cookies from "js-cookie";
import getBaseUrl from "@/app/api/baseUrl";

/* ======================= UTILITIES ======================= */
const debounce = (fn, delay = 700) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/* ======================= MAIN COMPONENT ======================= */
export default function SubmitWordForm() {
  const base_url = useMemo(() => getBaseUrl(), []);
  const formRef = useRef(null);
  const audioRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const existingWordAlertedRef = useRef(new Set()); // Track words we've already alerted

  const [loading, setLoading] = useState(false);
  const [word, setWord] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [audioURL, setAudioURL] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [notification, setNotification] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const [checkingExistingWord, setCheckingExistingWord] = useState(false);
  const [existingWordInfo, setExistingWordInfo] = useState(null); // Store info about existing word

  // Show notification with proper styling
  const showNotification = (msg, type = "error") => {
    setNotification({ msg, type });
    const timer = setTimeout(() => setNotification(null), 4000);
    return () => clearTimeout(timer);
  };

  // Show alert for existing word
  const showExistingWordAlert = (word, existingWord) => {
    if (existingWordAlertedRef.current.has(word.toLowerCase())) {
      return; // Don't alert for the same word multiple times
    }
    
    existingWordAlertedRef.current.add(word.toLowerCase());
    
    const alertMessage = `"${word}" already exists in the dictionary!\n\n` +
      `Status: ${existingWord.status || 'Unknown'}\n` +
      `Submitted: ${existingWord.created_at ? new Date(existingWord.created_at).toLocaleDateString() : 'Unknown'}\n\n` +
      `You can still submit it if you want to add an alternative definition.`;
    
    alert(alertMessage);
  };

  /* ======================= VALIDATION ======================= */
  const validate = () => {
    const errors = {};
    
    // Word validation
    if (!word || word.trim().length === 0) {
      errors.word = "Word is required";
    } else if (word.trim().length < 2) {
      errors.word = "Word must be at least 2 characters";
    }
    
    return errors;
  };

  /* ======================= WORD CHECK ======================= */
  const checkExistingWord = async (w) => {
    if (!w || w.trim().length < 2) {
      setExistingWordInfo(null);
      return;
    }

    try {
      setCheckingExistingWord(true);
      const token = Cookies.get("token");
      const res = await fetch(
        `${base_url}/word/words?search=${encodeURIComponent(w.trim())}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      if (res.ok) {
        const data = await res.json();
        const existingWord = data?.words?.find(
          (x) => x.word?.toLowerCase() === w.trim().toLowerCase()
        );

        if (existingWord) {
          // Update existing word info
          setExistingWordInfo({
            word: existingWord.word,
            status: existingWord.status,
            created_at: existingWord.created_at,
            meaning: existingWord.meaning
          });
          
          // Set error in field
          setFieldErrors((p) => ({ 
            ...p, 
            word: `"${existingWord.word}" already exists in the dictionary` 
          }));
          
          // Show alert if this is the first time we're detecting this word
          if (!existingWordAlertedRef.current.has(w.trim().toLowerCase())) {
            showExistingWordAlert(w.trim(), existingWord);
          }
        } else {
          // Clear existing word info and error
          setExistingWordInfo(null);
          setFieldErrors((p) => {
            const n = { ...p };
            delete n.word;
            return n;
          });
          
          // Remove from alerted set if user changed the word
          existingWordAlertedRef.current.delete(w.trim().toLowerCase());
        }
      }
    } catch {
      // silent fail for UX - don't show error for check
    } finally {
      setCheckingExistingWord(false);
    }
  };

  const debouncedCheck = useMemo(
    () => debounce(checkExistingWord, 700),
    []
  );

  /* ======================= WORD INPUT ======================= */
  const handleWordChange = (e) => {
    const value = e.target.value;
    setWord(value);
    
    // Clear word error when user starts typing
    if (fieldErrors.word) {
      setFieldErrors((p) => {
        const n = { ...p };
        delete n.word;
        return n;
      });
      setExistingWordInfo(null);
    }
    
    debouncedCheck(value);
  };

  /* ======================= AUDIO HANDLING ======================= */
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (file.size > 10 * 1024 * 1024) {
      showNotification("Audio file too large (max 10MB)", "error");
      e.target.value = "";
      return;
    }

    if (!file.type.startsWith('audio/')) {
      showNotification("Please select an audio file", "error");
      e.target.value = "";
      return;
    }

    setAudioFile(file);
    const url = URL.createObjectURL(file);
    setAudioURL(url);
    
    // Load audio metadata
    const audio = new Audio();
    audio.src = url;
    audio.addEventListener('loadedmetadata', () => {
      setDuration(audio.duration);
    });
  };

  const handleRecord = async () => {
    if (isRecording) {
      // Stop recording
      try {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      } catch (err) {
        console.error("Error stopping recording:", err);
        showNotification("Error stopping recording", "error");
      }
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;
      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = () => {
        if (audioChunksRef.current.length === 0) {
          showNotification("No audio recorded", "warning");
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const file = new File([blob], `recording_${Date.now()}.webm`, { type: "audio/webm" });
        setAudioFile(file);
        const url = URL.createObjectURL(blob);
        setAudioURL(url);
        
        // Load duration
        const audio = new Audio(url);
        audio.addEventListener('loadedmetadata', () => {
          setDuration(audio.duration);
        });
        
        stream.getTracks().forEach((t) => t.stop());
      };

      recorder.onerror = (e) => {
        console.error("Recording error:", e);
        showNotification("Recording error occurred", "error");
        stream.getTracks().forEach((t) => t.stop());
        setIsRecording(false);
      };

      recorder.start();
      setIsRecording(true);
      
      // Auto-stop after 60 seconds
      setTimeout(() => {
        if (recorder.state === 'recording') {
          recorder.stop();
          showNotification("Recording stopped after 60 seconds", "info");
        }
      }, 60000);
      
    } catch (err) {
      console.error("Error accessing microphone:", err);
      if (err.name === 'NotAllowedError') {
        showNotification("Microphone access denied. Please allow microphone access in your browser settings.", "error");
      } else if (err.name === 'NotFoundError') {
        showNotification("No microphone found. Please connect a microphone.", "error");
      } else {
        showNotification("Failed to access microphone", "error");
      }
    }
  };

  const handlePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => {
        console.error("Play error:", err);
        showNotification("Error playing audio", "error");
      });
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleAudioLoaded = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  /* ======================= SUBMIT ======================= */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get("token");
    if (!token) return showNotification("Please log in to submit a word", "error");

    // Check for existing word one more time before submission
    if (existingWordInfo) {
      const confirmed = confirm(
        `The word "${word}" already exists in the dictionary.\n\n` +
        `Do you still want to submit it as an alternative definition?`
      );
      
      if (!confirmed) {
        return; // Don't submit if user cancels
      }
    }

    const errors = validate();
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      if (errors.word) {
        showNotification("Please fix the word field", "error");
      }
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData(formRef.current);
      if (audioFile) formData.append("audio", audioFile);

      const res = await fetch(`${base_url}/word/submit-word`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || "Submission failed: Word already exists or something went wrong.");
      }

      showNotification("Word submitted successfully!", "success");
      
      // Reset form
      formRef.current.reset();
      setWord("");
      setAudioFile(null);
      setAudioURL(null);
      setFieldErrors({});
      setExistingWordInfo(null);
      setIsPlaying(false);
      setCurrentTime(0);
      setDuration(0);
      existingWordAlertedRef.current.clear(); // Clear alerted words
      
    } catch (err) {
      showNotification(err.message || "Submission failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  /* ======================= CLEANUP ======================= */
  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current)
        mediaRecorderRef.current.stop();
      if (audioURL) URL.revokeObjectURL(audioURL);
    };
  }, [audioURL]);

  /* ======================= UI ======================= */
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Submit New Word</h1>
        <p className="text-gray-600">Contribute to the dictionary by submitting new words</p>
      </div>

      
      <form onSubmit={handleSubmit} ref={formRef} className="space-y-6">
        {/* Word Field */}
        <div>
          <label htmlFor="word" className="block text-sm font-medium text-gray-700 mb-2">
            Word/Phrase *
          </label>
          <div className="relative">
            <input
              id="word"
              name="word"
              value={word}
              onChange={handleWordChange}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 ${
                fieldErrors.word 
                  ? 'border-red-300 bg-red-50' 
                  : existingWordInfo
                  ? 'border-yellow-300 bg-yellow-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              placeholder="Enter the word or phrase"
              aria-invalid={!!fieldErrors.word}
              aria-describedby={fieldErrors.word ? "word-error" : undefined}
            />
            {checkingExistingWord && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-500"></div>
              </div>
            )}
          </div>
          
          {fieldErrors.word ? (
            <div id="word-error" className="mt-2">
              <p className="text-sm text-red-600 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                {fieldErrors.word}
              </p>
              {existingWordInfo && (
                <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                  <p className="text-xs text-yellow-800">
                    <span className="font-medium">Status:</span> {existingWordInfo.status || 'Unknown'} • 
                    <span className="font-medium ml-2">Added:</span> {existingWordInfo.created_at ? new Date(existingWordInfo.created_at).toLocaleDateString() : 'Unknown'}
                  </p>
                  <p className="text-xs text-yellow-600 mt-1">
                    You can still submit to provide an alternative definition or pronunciation.
                  </p>
                </div>
              )}
            </div>
          ) : existingWordInfo ? (
            <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
              <p className="text-xs text-yellow-800 flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Word exists. You can submit an alternative definition.
              </p>
            </div>
          ) : (
            <p className="mt-2 text-xs text-gray-500">Enter the word or phrase you want to submit (minimum 2 characters)</p>
          )}
        </div>

        {/* Meaning Field */}
        <div>
          <label htmlFor="meaning" className="block text-sm font-medium text-gray-700 mb-2">
            Meaning/Definition *
          </label>
          <textarea
            id="meaning"
            name="meaning"
            rows={3}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 hover:border-gray-400 transition-all duration-200"
            placeholder="Enter the meaning or definition"
          />
          <p className="mt-2 text-xs text-gray-500">Provide a clear definition of the word</p>
        </div>

        {/* Example Usage Field */}
        <div>
          <label htmlFor="use_case" className="block text-sm font-medium text-gray-700 mb-2">
            Example Usage *
          </label>
          <textarea
            id="use_case"
            name="use_case"
            rows={2}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 hover:border-gray-400 transition-all duration-200"
            placeholder="E.g., 'No wahala, I go do am'"
          />
          <p className="mt-2 text-xs text-gray-500">Show how the word is used in a sentence or phrase</p>
        </div>

        {/* Pronunciation Field */}
        <div>
          <label htmlFor="pronunciation" className="block text-sm font-medium text-gray-700 mb-2">
            Pronunciation *
          </label>
          <input
            id="pronunciation"
            name="pronunciation"
            type="text"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 hover:border-gray-400 transition-all duration-200"
            placeholder="Phonetic spelling (e.g., 'wah-lah')"
          />
          <p className="mt-2 text-xs text-gray-500">How the word is pronounced</p>
        </div>

        {/* Audio Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Audio Pronunciation (Optional)
            </label>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              {/* File Upload */}
              <div className="flex-1">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Upload Audio File
                </label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={handleFile}
                  className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 transition-all duration-200"
                />
                <p className="mt-1 text-xs text-gray-500">MP3, WAV, WebM, OGG • Max 10MB</p>
              </div>
              
              {/* Record Button with Transition */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Record Audio
                </label>
                <button
                  type="button"
                  onClick={handleRecord}
                  className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 ${
                    isRecording
                      ? "bg-red-500 hover:bg-red-600 text-white animate-pulse"
                      : "bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white shadow-md hover:shadow-lg"
                  }`}
                  disabled={loading}
                >
                  <div className="flex items-center gap-2">
                    {isRecording ? (
                      <>
                        <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                        <span>Recording... Click to Stop</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                        <span>Record Audio</span>
                      </>
                    )}
                  </div>
                </button>
                <p className="mt-1 text-xs text-gray-500">Auto-stops after 60 seconds</p>
              </div>
            </div>
          </div>

          {/* Audio Preview */}
          {audioURL && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
              <p className="text-sm font-medium text-gray-700">Audio Preview</p>
              
              <div className="flex items-center justify-between p-3 bg-white rounded border">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handlePlayPause}
                    className={`p-3 rounded-full transition-all duration-200 ${
                      isPlaying
                        ? "bg-red-100 text-red-600 hover:bg-red-200"
                        : "bg-green-100 text-green-600 hover:bg-green-200"
                    }`}
                  >
                    {isPlaying ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                  
                  <div>
                    <p className="font-medium text-sm">
                      {audioFile?.name || "Recording"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatTime(currentTime)} / {formatTime(duration)}
                    </p>
                  </div>
                </div>
                
                {audioFile && (
                  <p className="text-xs text-gray-500">
                    {(audioFile.size / 1024).toFixed(1)} KB
                  </p>
                )}
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-yellow-500 h-2 rounded-full transition-all duration-200"
                  style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                />
              </div>
              
              <audio
                ref={audioRef}
                src={audioURL}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={handleAudioEnded}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleAudioLoaded}
                className="hidden"
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-black text-white font-semibold py-3.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none disabled:hover:shadow-md"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                <span>Submitting...</span>
              </div>
            ) : existingWordInfo ? (
              "Submit Alternative Definition"
            ) : (
              "Submit New Word"
            )}
          </button>
          {/* Notification */}
      {notification && (
        <div className={`mb-6 p-4 rounded-lg border animate-fadeIn ${
          notification.type === "success" 
            ? "bg-green-50 border-green-200 text-green-800" 
            : notification.type === "warning"
            ? "bg-yellow-50 border-yellow-200 text-yellow-800"
            : "bg-red-50 border-red-200 text-red-800"
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-1.5 rounded-full ${
              notification.type === "success" 
                ? "bg-green-100 text-green-600" 
                : notification.type === "warning"
                ? "bg-yellow-100 text-yellow-600"
                : "bg-red-100 text-red-600"
            }`}>
              {notification.type === "success" ? "✓" : "!"}
            </div>
            <span className="font-medium">{notification.msg}</span>
          </div>
        </div>
      )}

      {/* Existing Word Warning */}
      {existingWordInfo && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg animate-fadeIn">
          <div className="flex items-start gap-3">
            <div className="p-1.5 bg-yellow-100 text-yellow-600 rounded-full mt-0.5">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-800 mb-1">Word Already Exists</h3>
              <p className="text-sm text-yellow-700 mb-2">
                This word is already in the dictionary. You can still submit it to add an alternative definition.
              </p>
              {existingWordInfo.meaning && (
                <div className="text-xs text-yellow-600 bg-yellow-100 p-2 rounded">
                  <span className="font-medium">Current definition:</span> {existingWordInfo.meaning}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

          
          <p className="mt-4 text-xs text-gray-500 text-center">
            {existingWordInfo ? (
              "This will submit an alternative definition for the existing word."
            ) : (
              "All fields marked with * are required. Your submission will be reviewed before being added to the dictionary."
            )}
          </p>
        </div>
      </form>

      {/* Animations CSS */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}