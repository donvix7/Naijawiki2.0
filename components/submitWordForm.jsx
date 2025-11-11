"use client";
import React, { useState, useRef } from "react";
import Cookies from "js-cookie";

const SubmitWordForm = () => {
  const [formData, setFormData] = useState({
    word: "",
    meaning: "",
    language: "",
    example: "",
    category: "",
    tags: "",
    information: "",
    pronunciation: "",
    creatorName: "",
    creatorEmail: "",
    creatorOrigin: "",
  });

  const [audioFile, setAudioFile] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Handle audio file upload
  const handleFileChange = (e) => {
    setAudioFile(e.target.files[0]);
  };

  // Handle recording start/stop
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
    setFormData({
      word: "",
      meaning: "",
      language: "",
      example: "",
      category: "",
      tags: "",
      information: "",
      pronunciation: "",
      creatorName: "",
      creatorEmail: "",
      creatorOrigin: "",
    });
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

    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }
      if (audioFile) formDataToSend.append("audio", audioFile);

      const res = await fetch("http://wiki-server.giguild.com/api/word/submit-word", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formDataToSend,
      });

      if (!res.ok) throw new Error("Error submitting word");
      const data = await res.json();

      console.log("Submitted:", data);
      alert("Word submitted successfully!");
      handleReset();
    } catch (error) {
      console.error("Submission failed:", error);
      alert("Failed to submit word. Please try again.");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} id="wordForm" className="space-y-6">
        {/* Word & Language */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="word" className="block text-sm font-medium text-gray-700 mb-1">
              Word/Phrase*
            </label>
            <input
              type="text"
              id="word"
              required
              value={formData.word}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
              Language*
            </label>
            <select
              id="language"
              required
              value={formData.language}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            >
              <option value="">Select Language</option>
              <option value="pidgin">Pidgin English</option>
              <option value="yoruba">Yoruba</option>
              <option value="igbo">Igbo</option>
              <option value="hausa">Hausa</option>
              <option value="other">Other Nigerian Language</option>
            </select>
          </div>
        </div>

        {/* Meaning */}
        <div>
          <label htmlFor="meaning" className="block text-sm font-medium text-gray-700 mb-1">
            Meaning/Definition*
          </label>
          <textarea
            id="meaning"
            rows="3"
            required
            value={formData.meaning}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
          ></textarea>
        </div>

        {/* Example */}
        <div>
          <label htmlFor="example" className="block text-sm font-medium text-gray-700 mb-1">
            Example Usage
          </label>
          <textarea
            id="example"
            rows="2"
            value={formData.example}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            placeholder="E.g., 'No wahala, I go do am'"
          ></textarea>
        </div>

        {/* Category & Tags */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            >
              <option value="">Select Category</option>
              <option value="slang">Slang</option>
              <option value="proverb">Proverb</option>
              <option value="greeting">Greeting</option>
              <option value="insult">Insult/Joke</option>
              <option value="food">Food Related</option>
              <option value="religious">Religious</option>
            </select>
          </div>
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              id="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              placeholder="E.g., youth,urban,music"
            />
          </div>
        </div>

        {/* Pronunciation & Recording */}
        <div>
          <label htmlFor="pronunciation" className="block text-sm font-medium text-gray-700 mb-1">
            Pronunciation / Audio
          </label>
          <div className="flex items-center gap-4 flex-wrap">
            <input
              type="text"
              id="pronunciation"
              value={formData.pronunciation}
              onChange={handleChange}
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
              <i data-feather="mic"></i> {isRecording ? "Stop" : "Record"}
            </button>
            <input type="file" accept="audio/*" onChange={handleFileChange} className="text-sm" />
          </div>
          {audioURL && (
            <audio controls src={audioURL} className="mt-3 w-full rounded-md border border-gray-300" />
          )}
        </div>

        {/* Additional Info */}
        <div>
          <label htmlFor="information" className="block text-sm font-medium text-gray-700 mb-1">
            Additional Information
          </label>
          <textarea
            id="information"
            rows="3"
            value={formData.information}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            placeholder="Cultural context, variations, etc."
          ></textarea>
        </div>

        {/* Contributor Info */}
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">About You (Optional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="creatorName" className="block text-sm font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                id="creatorName"
                value={formData.creatorName}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              />
            </div>
            <div>
              <label htmlFor="creatorEmail" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="creatorEmail"
                value={formData.creatorEmail}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              />
            </div>
          </div>
          <div className="mt-6">
            <label htmlFor="creatorOrigin" className="block text-sm font-medium text-gray-700 mb-1">
              Your Connection to This Word
            </label>
            <textarea
              id="creatorOrigin"
              rows="2"
              value={formData.creatorOrigin}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              placeholder="How do you know this word? Where did you learn it?"
            ></textarea>
          </div>
        </div>

        {/* Submission */}
        <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
          <button
            type="reset"
            onClick={handleReset}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold py-3 px-6 rounded-lg transition-colors"
          >
            Reset Form
          </button>
          <button
            type="submit"
            className="bg-primary hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
          >
            <i data-feather="send"></i> Submit Word
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubmitWordForm;
