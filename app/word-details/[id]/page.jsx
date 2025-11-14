"use client";

import React, { useEffect, useState } from "react";
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
  const base_url = getBaseUrl();

  // Controlled form fields
  const [alternativeMeaning, setAlternativeMeaning] = useState("");
  const [example, setExample] = useState("");
  const [contributorName, setContributorName] = useState("");

  useEffect(() => {
    const fetchWord = async () => {
      try {
        const res = await fetch(`${base_url}/word/${id}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error("Failed to fetch word data");
        const data = await res.json();
        setWord(data.word);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Loading word details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600">
        {error}
      </div>
    );
  }

  if (!word) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-600">
        Word not found.
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
                <button className="flex items-center gap-2 text-gray-500 hover:text-primary">
                  <i data-feather="bookmark"></i>
                  <span className="text-sm">Save</span>
                </button>
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
                  <div className="flex items-center gap-4">
                    <span className="text-gray-700">
                      {word.prononciation || "N/A"}
                    </span>
                    <button className="flex items-center gap-2 text-primary">
                      <i data-feather="play-circle"></i>
                      <span>Listen</span>
                    </button>
                  </div>
                </section>

                {/* Example Usage */}
                <section>
                  <h2 className="text-xl font-bold text-secondary mb-2">
                    Example Usage
                  </h2>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700 mb-2">{word.example || "—"}</p>
                    {word.translation && (
                      <p className="text-gray-500 text-sm">
                        (Meaning: “{word.translation}”)
                      </p>
                    )}
                  </div>
                </section>

                {/* Cultural Context */}
                <section>
                  <h2 className="text-xl font-bold text-secondary mb-2">
                    Cultural Context
                  </h2>
                  <p className="text-gray-700">
                    {word.information ||
                      "No additional cultural information available."}
                  </p>
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

            {/* Submitted By */}
            <div className="bg-gray-50 p-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-gray-700">Submitted by:</h3>
                  <p className="text-gray-600">{word.submittedBy || "Anonymous"}</p>
                </div>
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-2 text-gray-500 hover:text-green-600">
                    <i data-feather="thumbs-up"></i>
                    <span>{word.likes || 0}</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-500 hover:text-red-600">
                    <i data-feather="thumbs-down"></i>
                    <span>{word.dislikes || 0}</span>
                  </button>
                  <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600">
                    <i data-feather="flag"></i>
                    <span>Report</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Contribution Form */}
          <div className="bg-white rounded-xl shadow-md p-8">
            <h2 className="text-2xl font-bold text-secondary mb-6">
              Add Your Contribution
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alternative Meaning
                </label>
                <textarea
                  value={alternativeMeaning}
                  onChange={(e) => setAlternativeMeaning(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Example Usage
                </label>
                <textarea
                  value={example}
                  onChange={(e) => setExample(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  value={contributorName}
                  onChange={(e) => setContributorName(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                />
              </div>

              <button
                type="submit"
                className="bg-primary hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              >
                Submit Contribution
              </button>
            </form>
          </div>
        </div>
      </main>

      <CustomFooter />
    </div>
  );
}
