"use client";

import AdminNavbar from "@/components/adminNavbar";
import AdminSidebar from "@/components/adminSideBar";
import getBaseUrl from "@/app/api/baseUrl";
import { useEffect, useState, useRef } from "react";
import Cookies from "js-cookie";
import feather from "feather-icons";
import { useParams, useRouter } from "next/navigation";
import RoleGuard from "@/utils/RoleGuard";

export default function ModeratorWordDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [word, setWord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [reason, setReason] = useState("");
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    word: "",
    meaning: "",
    pronunciation: "",
    use_case: ""
  });
  const [audioFile, setAudioFile] = useState(null);

  // Audio playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef(null);
  const previewAudioRef = useRef(null);

  // Audio recording state
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [recordingInterval, setRecordingInterval] = useState(null);
  const [newAudioPreview, setNewAudioPreview] = useState(null);

  const token = Cookies.get("token");
  const base_url = getBaseUrl();

  // Fetch only the single word
  useEffect(() => {
    const fetchWord = async () => {
      try {
        if (!token) {
          setError("Authentication required");
          setLoading(false);
          return;
        }

        const res = await fetch(`${base_url}/word/${id}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 404) {
            setError("Word not found");
          } else if (res.status === 401) {
            setError("Unauthorized access");
          } else {
            throw new Error("Failed to fetch word");
          }
          return;
        }

        const data = await res.json();
        const wordData = data.word || data;
        setWord(wordData);
        // Initialize form data with current data
        setFormData({
          word: wordData.word || "",
          meaning: wordData.meaning || "",
          pronunciation: wordData.pronunciation || "",
          use_case: wordData.use_case || ""
        });
        
        // Set audio URL if exists
        if (wordData.audio_url) {
          setNewAudioPreview(wordData.audio_url);
        }
      } 
      catch (err) {
        console.error("Failed to load word:", err);
        setError(err.message || "Failed to load word");
      } 
      finally {
        setLoading(false);
      }
    };

    fetchWord();
  }, [id, base_url, token]);

  // Initialize feather icons
  useEffect(() => {
    feather.replace();
  }, [editing, isPlaying, isRecording, newAudioPreview]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (recordingInterval) {
        clearInterval(recordingInterval);
      }
      if (mediaRecorder && isRecording) {
        mediaRecorder.stop();
      }
      // Clean up audio URLs
      if (newAudioPreview && newAudioPreview.startsWith('blob:')) {
        URL.revokeObjectURL(newAudioPreview);
      }
    };
  }, [recordingInterval, mediaRecorder, isRecording, newAudioPreview]);

  // Reset audio state when switching between previews
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
      setCurrentTime(0);
    }
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
    }
  }, [newAudioPreview]);

  // Audio playback functions
  const handlePlayPause = (isPreview = false) => {
    const audioElement = isPreview ? previewAudioRef.current : audioRef.current;
    const currentAudio = isPreview ? newAudioPreview : (word?.audio_url || newAudioPreview);
    
    if (!currentAudio) return;
    
    if (isPlaying) {
      audioElement?.pause();
    } else {
      audioElement?.play().catch(err => {
        console.error("Play error:", err);
      });
    }
  };

  const handleTimeUpdate = (isPreview = false) => {
    const audioElement = isPreview ? previewAudioRef.current : audioRef.current;
    if (audioElement) {
      setCurrentTime(audioElement.currentTime);
    }
  };

  const handleAudioEnded = (isPreview = false) => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleAudioLoaded = (isPreview = false) => {
    const audioElement = isPreview ? previewAudioRef.current : audioRef.current;
    if (audioElement) {
      setDuration(audioElement.duration);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    if (previewAudioRef.current) {
      previewAudioRef.current.volume = newVolume;
    }
  };

  const handleProgressClick = (e, isPreview = false) => {
    const audioElement = isPreview ? previewAudioRef.current : audioRef.current;
    if (!audioElement || !duration) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = (e.clientX - rect.left) / progressBar.offsetWidth;
    const newTime = Math.max(0, Math.min(duration, clickPosition * duration));
    
    audioElement.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Audio recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => {
        chunks.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        
        // Create a File object from the Blob
        const file = new File([blob], 'recording.webm', { type: 'audio/webm' });
        setAudioFile(file);
        setNewAudioPreview(url);
        setAudioChunks([]);
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingTime(0);

      // Start recording timer
      const interval = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      setRecordingInterval(interval);
    } catch (err) {
      console.error("Recording error:", err);
      alert("Error accessing microphone. Please check permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
      if (recordingInterval) {
        clearInterval(recordingInterval);
        setRecordingInterval(null);
      }
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('audio/')) {
      alert("Please upload an audio file");
      return;
    }

    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      alert("File size too large. Maximum size is 10MB.");
      return;
    }

    setAudioFile(file);
    const url = URL.createObjectURL(file);
    setNewAudioPreview(url);
  };

  const removeAudio = () => {
    setAudioFile(null);
    setNewAudioPreview(null);
    if (audioRef.current) {
      audioRef.current.pause();
    }
    if (previewAudioRef.current) {
      previewAudioRef.current.pause();
    }
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Start editing
  const startEditing = () => {
    setEditing(true);
    setNewAudioPreview(word?.audio_url || null);
    setAudioFile(null);
  };

  // Cancel editing
  const cancelEdit = () => {
    // Reset form to original values
    setFormData({
      word: word?.word || "",
      meaning: word?.meaning || "",
      pronunciation: word?.pronunciation || "",
      use_case: word?.use_case || ""
    });
    // Reset audio states
    setNewAudioPreview(word?.audio_url || null);
    setAudioFile(null);
    if (isRecording) {
      stopRecording();
    }
    setEditing(false);
  };

  // Submit edited word
  const submitEdit = async (e) => {
    e.preventDefault();
    if (!word || !id) return;
    
    // Validate required fields
    if (!formData.word.trim() || !formData.meaning.trim()) {
      alert("Word and meaning are required fields");
      return;
    }
    
    setActionLoading(true);
    try {
      console.log("Updating word with ID:", id);
      
      // Create FormData to handle file upload
      const submitFormData = new FormData();
      
      // Add text fields
      Object.keys(formData).forEach(key => {
        submitFormData.append(key, formData[key]);
      });
      
      // Add audio file if exists
      if (audioFile) {
        submitFormData.append('audio', audioFile);
      }
      
      const res = await fetch(`${base_url}/word/update-word/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: submitFormData
      });

      console.log("Update response status:", res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Update error response:", errorText);
        throw new Error(`Failed to update word: ${res.status} ${errorText}`);
      }

      const data = await res.json();
      console.log("Update success:", data);
      
      // Update local state with new data
      setWord(prev => ({ 
        ...prev, 
        ...formData,
        audio_url: data.audio_url || prev.audio_url
      }));
      
      // Update preview to new audio URL if it exists
      if (data.audio_url) {
        setNewAudioPreview(data.audio_url);
      }
      
      setEditing(false);
      setAudioFile(null);
      alert("Word updated successfully!");
    } 
    catch (err) {
      console.error("Update error:", err);
      alert("Error updating word: " + err.message);
    }
    finally {
      setActionLoading(false);
    }
  };

  // Approve word
  const approveWord = async () => {
    if (!word || !id) return;
    
    setActionLoading(true);
    try {
      console.log("Approving word with ID:", id);
      
      const res = await fetch(`${base_url}/word/approve-word/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        }
      });

      console.log("Approve response status:", res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Approve error response:", errorText);
        throw new Error(`Failed to approve word: ${res.status} ${errorText}`);
      }

      const data = await res.json();
      console.log("Approve success:", data);
      
      setWord(prev => ({ ...prev, status: "approved" }));
      alert("Word approved successfully!");
    } 
    catch (err) {
      console.error("Approve error:", err);
      alert("Error approving word: " + err.message);
    }
    finally {
      setActionLoading(false);
    }
  };

  // Open reject modal
  const openRejectModal = () => {
    setShowRejectModal(true);
    setReason("");
  };

  // Close reject modal
  const closeRejectModal = () => {
    setShowRejectModal(false);
    setReason("");
  };

  // Reject word with reason
  const rejectWord = async () => {
    if (!word || !id || !reason.trim()) {
      alert("Please provide a reason for rejection");
      return;
    }
    
    setActionLoading(true);
    try {
      console.log("Rejecting word with ID:", id, "Reason:", reason);
      
      const res = await fetch(`${base_url}/word/reject-word/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          reason: reason.trim()
        })
      });

      console.log("Reject response status:", res.status);
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Reject error response:", errorText);
        throw new Error(`Failed to reject word: ${res.status} ${errorText}`);
      }

      const data = await res.json();
      console.log("Reject success:", data);
      
      setWord(prev => ({ ...prev, status: "rejected" }));
      alert("Word rejected successfully!");
      closeRejectModal();
    } 
    catch (err) {
      console.error("Reject error:", err);
      alert("Error rejecting word: " + err.message);
    }
    finally {
      setActionLoading(false);
    }
  };

  // Handle back to words list
  const handleBack = () => {
    router.push('/moderator/word');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-700 text-lg font-semibold">Loading word details...</p>
        </div>
      </div>
    );
  }

  if (error || !word) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 text-red-500 mx-auto mb-4 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <p className="text-red-600 text-lg font-semibold mb-4">
            {error || "Word not found"}
          </p>
          <button 
            onClick={handleBack}
            className="px-6 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Back to Words
          </button>
        </div>
      </div>
    );
  }

  return (
    <RoleGuard allowedRoles={["moderator"]}>
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />

        <div className="flex">
          <AdminSidebar />

          <main className="flex-1 p-4 md:p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">
                  Word Details
                </h1>
                <p className="text-gray-600 text-base font-normal">
                  Review and manage this word submission
                </p>
              </div>

              <button
                onClick={handleBack}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                <i data-feather="arrow-left" className="w-4 h-4"></i>
                Back to Words
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Main Content - Left Column (2/3 width) */}
              <div className="lg:col-span-2 space-y-6">
                {/* Word Information Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Word Information
                    </h2>
                    {!editing && (
                      <button
                        onClick={startEditing}
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition-colors text-sm"
                      >
                        <i data-feather="edit" className="w-4 h-4"></i>
                        Edit Details
                      </button>
                    )}
                  </div>

                  {editing ? (
                    // Edit Form with Audio Recording/Upload
                    <form onSubmit={submitEdit} className="space-y-6" noValidate>
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-3 uppercase text-xs tracking-wide">
                          Word *
                        </label>
                        <input
                          type="text"
                          name="word"
                          value={formData.word}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 font-normal text-base placeholder-gray-500 transition-all duration-200"
                          placeholder="Enter the word"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-3 uppercase text-xs tracking-wide">
                          Meaning *
                        </label>
                        <textarea
                          name="meaning"
                          value={formData.meaning}
                          onChange={handleInputChange}
                          rows="3"
                          className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 font-normal text-base placeholder-gray-500 transition-all duration-200 resize-none"
                          placeholder="Enter word meaning"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-3 uppercase text-xs tracking-wide">
                          Text Pronunciation
                        </label>
                        <input
                          type="text"
                          name="pronunciation"
                          value={formData.pronunciation}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 font-normal text-base placeholder-gray-500 transition-all duration-200"
                          placeholder="Enter pronunciation guide"
                        />
                      </div>

                      {/* Audio Pronunciation Section */}
                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-3 uppercase text-xs tracking-wide">
                          Audio Pronunciation
                        </label>
                        
                        <div className="space-y-4">
                          {/* Audio Preview */}
                          {newAudioPreview && (
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <i data-feather="volume-2" className="w-5 h-5 text-blue-600"></i>
                                  <span className="font-medium text-sm text-blue-800">
                                    {audioFile || newAudioPreview.startsWith('blob:') ? "New Audio Preview" : "Current Audio"}
                                  </span>
                                </div>
                                {(audioFile || newAudioPreview.startsWith('blob:')) && (
                                  <button
                                    type="button"
                                    onClick={removeAudio}
                                    className="text-red-500 hover:text-red-700 p-1"
                                  >
                                    <i data-feather="trash-2" className="w-4 h-4"></i>
                                  </button>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-3 p-3 bg-white rounded border">
                                <button
                                  type="button"
                                  onClick={() => handlePlayPause(true)}
                                  className={`p-3 rounded-full transition-all duration-200 ${
                                    isPlaying
                                      ? "bg-red-100 text-red-600 hover:bg-red-200"
                                      : "bg-green-100 text-green-600 hover:bg-green-200"
                                  }`}
                                >
                                  <i data-feather={isPlaying ? "pause" : "play"} className="w-4 h-4"></i>
                                </button>
                                
                                <div className="flex-1">
                                  <p className="font-medium text-sm">
                                    {audioFile ? "New Audio" : "Current Audio"}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {formatTime(currentTime)} / {formatTime(duration)}
                                  </p>
                                  <div 
                                    className="w-full bg-gray-200 rounded-full h-1.5 mt-1 cursor-pointer"
                                    onClick={(e) => handleProgressClick(e, true)}
                                  >
                                    <div 
                                      className="bg-blue-500 h-1.5 rounded-full transition-all duration-200"
                                      style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Audio Controls */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Record Button */}
                            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                              <div className="flex items-center gap-2 mb-3">
                                <i data-feather="mic" className="w-5 h-5 text-red-600"></i>
                                <span className="font-medium text-sm text-red-800">Record Audio</span>
                              </div>
                              
                              <div className="space-y-3">
                                <button
                                  type="button"
                                  onClick={isRecording ? stopRecording : startRecording}
                                  className={`w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                                    isRecording
                                      ? "bg-red-600 text-white hover:bg-red-700"
                                      : "bg-red-100 text-red-700 hover:bg-red-200"
                                  }`}
                                >
                                  <i data-feather={isRecording ? "square" : "mic"} className="w-4 h-4"></i>
                                  {isRecording ? `Stop Recording (${recordingTime}s)` : "Start Recording"}
                                </button>
                                
                                {isRecording && (
                                  <div className="flex items-center gap-2">
                                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                    <span className="text-sm text-red-600">Recording in progress...</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Upload Button */}
                            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                              <div className="flex items-center gap-2 mb-3">
                                <i data-feather="upload" className="w-5 h-5 text-blue-600"></i>
                                <span className="font-medium text-sm text-blue-800">Upload Audio File</span>
                              </div>
                              
                              <div className="space-y-3">
                                <label className="block">
                                  <div className="w-full py-3 px-4 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer">
                                    <i data-feather="upload" className="w-4 h-4"></i>
                                    Choose Audio File
                                  </div>
                                  <input
                                    type="file"
                                    accept="audio/*"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                  />
                                </label>
                                
                                <p className="text-xs text-gray-500 text-center">
                                  Supports MP3, WAV, OGG (max 10MB)
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="text-sm text-gray-500">
                            <p className="flex items-center gap-2">
                              <i data-feather="info" className="w-4 h-4"></i>
                              Audio will be saved when you click "Save Changes"
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-3 uppercase text-xs tracking-wide">
                          Example Usage
                        </label>
                        <textarea
                          name="use_case"
                          value={formData.use_case}
                          onChange={handleInputChange}
                          rows="3"
                          className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-900 font-normal text-base placeholder-gray-500 transition-all duration-200 resize-none"
                          placeholder="Enter example usage"
                        />
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button
                          type="submit"
                          disabled={actionLoading}
                          className="bg-yellow-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-yellow-600 transition-colors text-sm disabled:opacity-50"
                        >
                          {actionLoading ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="bg-gray-100 text-gray-700 font-semibold py-3 px-6 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    // Display View (default view)
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-5">
                          <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-3 uppercase text-xs tracking-wide">
                              Word
                            </label>
                            <p className="text-base font-semibold text-gray-900">
                              {word.word || "N/A"}
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-3 uppercase text-xs tracking-wide">
                              Pronunciation
                            </label>
                            <p className="text-base font-normal text-gray-700">
                              {word.pronunciation || "N/A"}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-5">
                          <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-3 uppercase text-xs tracking-wide">
                              Status
                            </label>
                            <span className={`inline-block px-3 py-1.5 rounded-full text-xs font-semibold ${
                              word.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : word.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}>
                              {word.status ? word.status.charAt(0).toUpperCase() + word.status.slice(1) : "Pending"}
                            </span>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-3 uppercase text-xs tracking-wide">
                              Submitted By
                            </label>
                            <p className="text-base font-normal text-gray-700">
                              {word.creatorEmail || word.creator || word.created_by || "Unknown"}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-3 uppercase text-xs tracking-wide">
                          Meaning
                        </label>
                        <p className="text-base font-normal text-gray-700 leading-relaxed">
                          {word.meaning || "No meaning provided"}
                        </p>
                      </div>

                      {word.use_case && (
                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-3 uppercase text-xs tracking-wide">
                            Example Usage
                          </label>
                          <p className="text-base font-normal text-gray-700 leading-relaxed">
                            {word.use_case}
                          </p>
                        </div>
                      )}

                      {/* Audio Playback Section */}
                      {word.audio_url && (
                        <div className="pt-4 border-t border-gray-200">
                          <div className="flex items-center gap-2 mb-3">
                            <i data-feather="volume-2" className="w-5 h-5 text-blue-600"></i>
                            <label className="block text-sm font-semibold text-gray-800 uppercase text-xs tracking-wide">
                              Audio Pronunciation
                            </label>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                            <div className="flex items-center justify-between p-3 bg-white rounded border">
                              <div className="flex items-center gap-3">
                                <button
                                  type="button"
                                  onClick={() => handlePlayPause(false)}
                                  className={`p-3 rounded-full transition-all duration-200 ${
                                    isPlaying
                                      ? "bg-red-100 text-red-600 hover:bg-red-200"
                                      : "bg-green-100 text-green-600 hover:bg-green-200"
                                  }`}
                                  disabled={!word.audio_url}
                                >
                                  <i data-feather={isPlaying ? "pause" : "play"} className="w-4 h-4"></i>
                                </button>
                                
                                <div>
                                  <p className="font-medium text-sm">Pronunciation Audio</p>
                                  <p className="text-xs text-gray-500">
                                    {formatTime(currentTime)} / {formatTime(duration)}
                                  </p>
                                </div>
                              </div>
                            </div>
                            
                            {/* Progress Bar */}
                            <div 
                              className="w-full bg-gray-200 rounded-full h-2 cursor-pointer"
                              onClick={(e) => handleProgressClick(e, false)}
                            >
                              <div 
                                className="bg-blue-500 h-2 rounded-full transition-all duration-200"
                                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                              />
                            </div>
                            
                            {/* Volume Control */}
                            <div className="flex items-center gap-3">
                              <i data-feather="volume" className="w-4 h-4 text-gray-600"></i>
                              <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={volume}
                                onChange={handleVolumeChange}
                                className="flex-1 accent-blue-500"
                              />
                              <span className="text-xs text-gray-500 w-8">
                                {Math.round(volume * 100)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Sidebar Actions - Right Column (1/3 width) */}
              <div className="space-y-6">
                {/* Quick Actions Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Word Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={approveWord}
                      disabled={actionLoading || word.status === "approved" || editing}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <i data-feather="check-circle" className="w-4 h-4"></i>
                      {word.status === "approved" ? "Already Approved" : "Approve Word"}
                    </button>

                    <button
                      onClick={openRejectModal}
                      disabled={actionLoading || word.status === "rejected" || editing}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <i data-feather="x-circle" className="w-4 h-4"></i>
                      {word.status === "rejected" ? "Already Rejected" : "Reject Word"}
                    </button>
                  </div>
                </div>

                {/* Word Stats Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Word Information</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Word:</span>
                      <span className="font-semibold text-gray-900">{word.word || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Status:</span>
                      <span className={`font-semibold ${
                        word.status === "approved"
                          ? "text-green-600"
                          : word.status === "rejected"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}>
                        {word.status || "Pending"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Has Audio:</span>
                      <span className={`font-semibold ${word.audio_url ? "text-green-600" : "text-gray-500"}`}>
                        {word.audio_url ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Has Example:</span>
                      <span className={`font-semibold ${word.use_case ? "text-green-600" : "text-gray-500"}`}>
                        {word.use_case ? "Yes" : "No"}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 text-sm">Submitted By:</span>
                      <span className="font-semibold text-gray-900 text-sm">
                        {word.created_by || word.creator || "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Review Guidelines Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Guidelines</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <i data-feather="check" className="w-4 h-4 text-green-500 mt-0.5"></i>
                      <p className="text-sm text-gray-600">Check for cultural appropriateness</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <i data-feather="check" className="w-4 h-4 text-green-500 mt-0.5"></i>
                      <p className="text-sm text-gray-600">Verify meaning accuracy</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <i data-feather="check" className="w-4 h-4 text-green-500 mt-0.5"></i>
                      <p className="text-sm text-gray-600">Ensure proper formatting</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <i data-feather="check" className="w-4 h-4 text-green-500 mt-0.5"></i>
                      <p className="text-sm text-gray-600">Review audio quality (if present)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>

        {/* Rejection Modal */}
        {showRejectModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
              <div className="flex items-center gap-3 mb-4">
                <i data-feather="alert-triangle" className="w-6 h-6 text-red-500"></i>
                <h3 className="text-lg font-semibold text-gray-900">Reject Word</h3>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 text-sm mb-4 leading-relaxed">
                  You are about to reject the word: <strong>"{word.word}"</strong>
                </p>
                <label htmlFor="rejectionReason" className="block text-sm font-semibold text-gray-700 mb-2">
                  Reason for Rejection *
                </label>
                <textarea
                  id="rejectionReason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please provide a clear reason for rejecting this word..."
                  rows="4"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none text-sm"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  This reason will be recorded and may be shared with the submitter.
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={closeRejectModal}
                  disabled={actionLoading}
                  className="px-4 py-2 text-gray-700 hover:text-gray-900 font-semibold hover:bg-gray-100 rounded-lg transition-colors text-sm disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={rejectWord}
                  disabled={actionLoading || !reason.trim()}
                  className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 disabled:cursor-not-allowed text-sm"
                >
                  {actionLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <i data-feather="x" className="w-4 h-4"></i>
                  )}
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Audio Players (hidden but functional) */}
        <audio
          ref={audioRef}
          src={word?.audio_url}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => handleAudioEnded(false)}
          onTimeUpdate={() => handleTimeUpdate(false)}
          onLoadedMetadata={() => handleAudioLoaded(false)}
          className="hidden"
        />
        
        {newAudioPreview && (
          <audio
            ref={previewAudioRef}
            src={newAudioPreview}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => handleAudioEnded(true)}
            onTimeUpdate={() => handleTimeUpdate(true)}
            onLoadedMetadata={() => handleAudioLoaded(true)}
            className="hidden"
          />
        )}
      </div>
    </RoleGuard>
  );
}