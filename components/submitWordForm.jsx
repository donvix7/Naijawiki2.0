"use client";

import React, { useState, useRef } from "react";
import Cookies from "js-cookie";
import getBaseUrl from "@/app/api/baseUrl";

const SubmitWordForm = () => {
  const [status, setStatus] = useState({ loading: false, message: "" });
  const base_url = getBaseUrl();
  const [audioFile, setAudioFile] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const formRef = useRef(null);

  const handleFileChange = (e) => {
    setAudioFile(e.target.files[0]);
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
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        console.error("Error accessing microphone:", err);
        alert("Microphone access denied.");
      }
    } else {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleReset = () => {
    if (formRef.current) {
      formRef.current.reset();
    }
    setAudioFile(null);
    setAudioURL(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get("token");

    if (!token) {
      alert("You must be logged in to submit a word.");
      return;
    }

    setStatus({ loading: true, message: "Submitting word..." });

    try {
      const formData = new FormData(formRef.current);

      // Add audio file if exists
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
    } catch (error) {
      console.error("Submission failed:", error);
      setStatus({ loading: false, message: "Failed to submit word. Please try again." });
    }
  };

  return (
    <div>
      {status.message && (
        <div className={`p-4 mb-6 rounded-lg ${
          status.message.includes("success") 
            ? "bg-green-100 text-green-800 border border-green-200" 
            : "bg-red-100 text-red-800 border border-red-200"
        }`}>
          {status.message}
        </div>
      )}

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
              {isRecording ? "Stop" : "Record"}
            </button>
            <input type="file" accept="audio/*" onChange={handleFileChange} className="text-sm" />
          </div>
          {audioURL && <audio controls src={audioURL} className="mt-3 w-full rounded-md border border-gray-300" />}
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
            disabled={status.loading}
            className="btn-outline g-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status.loading ? "Submitting..." : "Submit Word"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubmitWordForm;