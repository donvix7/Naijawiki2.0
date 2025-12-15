"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CustomNavbar from "@/components/navBar";
import CustomFooter from "@/components/customFooter";
import feather from "feather-icons";
import getBaseUrl from "@/app/api/baseUrl";

export default function WordDetails() {
  const { id } = useParams();
  const [word, setWord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contributing, setContributing] = useState(false);
  const [allWords, setAllWords] = useState([]);
  const [filteredRelatedWords, setFilteredRelatedWords] = useState([]);

  // Filter states for related words
  const [searchTerm, setSearchTerm] = useState("");
  const [languageFilter, setLanguageFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const [alternativeMeaning, setAlternativeMeaning] = useState("");
  const [example, setExample] = useState("");
  const [contributorName, setContributorName] = useState("");
  const base_url = getBaseUrl();

  // Fetch word data and all words for filtering
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        // Fetch current word
        const wordRes = await fetch(`${base_url}/word/${id}`, { cache: "no-store" });
        if (!wordRes.ok) throw new Error("Failed to fetch word data");
        const wordData = await wordRes.json();
        setWord(wordData);

        // Fetch all words for related words filtering
        const allWordsRes = await fetch(`${base_url}/words`, { cache: "no-store" });
        if (allWordsRes.ok) {
          const allWordsData = await allWordsRes.json();
          const wordsList = Array.isArray(allWordsData) ? allWordsData : allWordsData.words || [];
          setAllWords(wordsList.filter(w => w.id !== id && w.status === "approved")); // Exclude current word and only approved
        }
      } catch (err) {
        console.error(err);
        setError("Unable to load word details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Filter related words based on filters
  useEffect(() => {
    if (!allWords.length) return;

    const filtered = allWords.filter(relatedWord => {
      // Search filter
      const matchesSearch = searchTerm === "" || 
        relatedWord.word?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        relatedWord.meaning?.toLowerCase().includes(searchTerm.toLowerCase());

      // Language filter
      const matchesLanguage = languageFilter === "all" || relatedWord.language === languageFilter;

      // Category filter
      const matchesCategory = categoryFilter === "all" || relatedWord.category === categoryFilter;

      return matchesSearch && matchesLanguage && matchesCategory;
    });

    setFilteredRelatedWords(filtered.slice(0, 12)); // Limit to 12 words
  }, [searchTerm, languageFilter, categoryFilter, allWords]);

  // Replace feather icons whenever data changes
  useEffect(() => {
    feather.replace();
  }, [word, filteredRelatedWords, contributing]);

  const handleContribution = async (e) => {
    e.preventDefault();
    setContributing(true);

    // Simulate API call
    setTimeout(() => {
      alert("Thank you for your contribution! It will be reviewed by our team.");
      setAlternativeMeaning("");
      setExample("");
      setContributorName("");
      setContributing(false);
    }, 1000);
  };

  const clearRelatedFilters = () => {
    setSearchTerm("");
    setLanguageFilter("all");
    setCategoryFilter("all");
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <CustomNavbar />
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading word details...</p>
        </div>
      </div>
      <CustomFooter />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gray-50">
      <CustomNavbar />
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <i data-feather="alert-circle" className="w-16 h-16 text-red-500 mx-auto mb-4"></i>
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <a href="/explore" className="bg-yellow-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-yellow-500-dark transition-colors">
            Back to Explore
          </a>
        </div>
      </div>
      <CustomFooter />
    </div>
  );

  if (!word) return (
    <div className="min-h-screen bg-gray-50">
      <CustomNavbar />
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <i data-feather="search" className="w-16 h-16 text-gray-400 mx-auto mb-4"></i>
          <p className="text-gray-600 text-lg mb-4">Word not found.</p>
          <a href="/explore" className="bg-yellow-500 text-white font-bold py-2 px-6 rounded-lg hover:bg-yellow-500-dark transition-colors">
            Back to Explore
          </a>
        </div>
      </div>
      <CustomFooter />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <CustomNavbar />
      <main className="container mx-auto px-4 sm:px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button + Language */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <a href="/explore" className="inline-flex items-center gap-2 text-yellow-500 hover:text-yellow-500-dark font-semibold transition-colors">
              <i data-feather="arrow-left" className="w-4 h-4"></i> 
              Back to Explore
            </a>
            <div className="flex items-center gap-3">
              {word.category && (
                <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm capitalize">
                  {word.category}
                </span>
              )}
              <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-sm capitalize">
                {word.language || "Pidgin"}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Word Card */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
                <div className="p-6 md:p-8">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h1 className="text-3xl md:text-4xl font-bold text-blue-900">{word.word || "Unknown Word"}</h1>
                    <div className="flex items-center gap-3">
                      <button className="flex items-center gap-2 text-gray-500 hover:text-yellow-500 transition-colors p-2 rounded-lg hover:bg-gray-50">
                        <i data-feather="share-2" className="w-4 h-4"></i>
                        <span className="text-sm">Share</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-500 hover:text-yellow-500 transition-colors p-2 rounded-lg hover:bg-gray-50">
                        <i data-feather="bookmark" className="w-4 h-4"></i>
                        <span className="text-sm">Save</span>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-8">
                    {/* Meaning Section */}
                    <section>
                      <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <i data-feather="book" className="w-5 h-5 text-yellow-500"></i>
                        Meaning
                      </h2>
                      <p className="text-gray-700 text-lg leading-relaxed">{word.meaning || "—"}</p>
                    </section>

                    {/* Pronunciation Section */}
                    <section>
                      <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <i data-feather="volume-2" className="w-5 h-5 text-yellow-500"></i>
                        Pronunciation
                      </h2>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <span className="text-gray-700 text-lg font-mono bg-gray-50 px-3 py-2 rounded-lg">
                          {word.prononciation || "N/A"}
                        </span>
                        <button className="inline-flex items-center gap-2 bg-yellow-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-yellow-500-dark transition-colors w-fit">
                          <i data-feather="play-circle" className="w-4 h-4"></i> 
                          Listen to Pronunciation
                        </button>
                      </div>
                    </section>

                    {/* Example Usage Section */}
                    <section>
                      <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <i data-feather="message-square" className="w-5 h-5 text-yellow-500"></i>
                        Example Usage
                      </h2>
                      <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                        <p className="text-gray-700 text-lg mb-2 italic">"{word.example || "No example available."}"</p>
                        {word.translation && (
                          <p className="text-gray-600 text-sm">
                            <span className="font-semibold">Translation:</span> "{word.translation}"
                          </p>
                        )}
                      </div>
                    </section>

                    {/* Cultural Context Section */}
                    <section>
                      <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <i data-feather="info" className="w-5 h-5 text-yellow-500"></i>
                        Cultural Context
                      </h2>
                      <p className="text-gray-700 leading-relaxed">
                        {word.information || "No additional cultural information available."}
                      </p>
                    </section>
                  </div>
                </div>

                {/* Footer with Contributor Info and Actions */}
                <div className="bg-gray-50 p-6 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="font-medium text-gray-700 text-sm mb-1">Submitted by:</h3>
                      <p className="text-gray-900 font-semibold">{word.created_by || "Anonymous Contributor"}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-2 text-gray-500 hover:text-green-600 transition-colors p-2 rounded-lg hover:bg-green-50">
                        <i data-feather="thumbs-up" className="w-4 h-4"></i> 
                        <span>{word.likes || 0}</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50">
                        <i data-feather="thumbs-down" className="w-4 h-4"></i> 
                        <span>{word.dislikes || 0}</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors p-2 rounded-lg hover:bg-blue-50">
                        <i data-feather="flag" className="w-4 h-4"></i>
                        <span className="text-sm">Report</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contribution Form */}
              <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <i data-feather="edit-3" className="w-6 h-6 text-yellow-500"></i>
                  Add Your Contribution
                </h2>
                <p className="text-gray-600 mb-6">Help improve this word entry by adding your knowledge.</p>
                
                <form className="space-y-6" onSubmit={handleContribution}>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alternative Meaning
                    </label>
                    <textarea 
                      value={alternativeMeaning} 
                      onChange={(e) => setAlternativeMeaning(e.target.value)} 
                      placeholder="Provide an alternative meaning or additional context..."
                      rows="3"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Example Usage
                    </label>
                    <textarea 
                      value={example} 
                      onChange={(e) => setExample(e.target.value)} 
                      placeholder="Share an example sentence showing how this word is used..."
                      rows="3"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Name (Optional)
                    </label>
                    <input 
                      type="text" 
                      value={contributorName} 
                      onChange={(e) => setContributorName(e.target.value)} 
                      placeholder="How would you like to be credited?"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-colors" 
                    />
                  </div>

                  <button 
                    type="submit" 
                    disabled={contributing}
                    className={`bg-yellow-500 text-white font-bold py-3 px-6 rounded-lg transition-colors ${
                      contributing ? 'opacity-70 cursor-not-allowed' : 'hover:bg-yellow-500-dark'
                    }`}
                  >
                    {contributing ? (
                      <span className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Submitting...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <i data-feather="send" className="w-4 h-4"></i>
                        Submit Contribution
                      </span>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Sidebar with Related Words and Filters */}
            <div className="space-y-6">
              {/* Related Words Section with Filters */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <i data-feather="link" className="w-5 h-5 text-yellow-500"></i>
                  Explore Related Words
                </h2>

                {/* Filters for Related Words */}
                <div className="space-y-4 mb-4">
                  {/* Search */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search Words
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search related words..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                      />
                      <i
                        data-feather="search"
                        className="absolute left-3 top-3 text-gray-400 w-4 h-4"
                      ></i>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Language Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Language
                      </label>
                      <select
                        value={languageFilter}
                        onChange={(e) => setLanguageFilter(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm"
                      >
                        <option value="all">All</option>
                        <option value="yoruba">Yoruba</option>
                        <option value="igbo">Igbo</option>
                        <option value="hausa">Hausa</option>
                        <option value="pidgin">Pidgin</option>
                        <option value="english">English</option>
                      </select>
                    </div>

                    {/* Category Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-sm"
                      >
                        <option value="all">All</option>
                        <option value="greeting">Greeting</option>
                        <option value="food">Food</option>
                        <option value="family">Family</option>
                        <option value="numbers">Numbers</option>
                        <option value="verbs">Verbs</option>
                        <option value="nouns">Nouns</option>
                        <option value="adjectives">Adjectives</option>
                        <option value="phrases">Phrases</option>
                      </select>
                    </div>
                  </div>

                  {/* Active Filters and Clear Button */}
                  {(searchTerm || languageFilter !== "all" || categoryFilter !== "all") && (
                    <div className="flex flex-col gap-2">
                      <div className="flex flex-wrap gap-1">
                        {searchTerm && (
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                            Search: "{searchTerm}"
                          </span>
                        )}
                        {languageFilter !== "all" && (
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs capitalize">
                            {languageFilter}
                          </span>
                        )}
                        {categoryFilter !== "all" && (
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs capitalize">
                            {categoryFilter}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={clearRelatedFilters}
                        className="flex items-center gap-1 text-yellow-500 hover:text-yellow-500-dark text-sm font-semibold w-fit"
                      >
                        <i data-feather="x" className="w-3 h-3"></i>
                        Clear Filters
                      </button>
                    </div>
                  )}
                </div>

                {/* Related Words List */}
                <div className="space-y-3">
                  {filteredRelatedWords.length === 0 ? (
                    <div className="text-center py-4">
                      <i data-feather="search" className="w-8 h-8 text-gray-400 mx-auto mb-2"></i>
                      <p className="text-gray-500 text-sm">No related words found</p>
                    </div>
                  ) : (
                    filteredRelatedWords.map((relatedWord) => (
                      <a
                        key={relatedWord.id}
                        href={`/word/${relatedWord.id}`}
                        className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors group"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-semibold text-gray-900 group-hover:text-yellow-500 transition-colors">
                            {relatedWord.word}
                          </h3>
                          <span className="bg-yellow-500 text-white px-2 py-1 rounded-full text-xs capitalize">
                            {relatedWord.language}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm line-clamp-2">
                          {relatedWord.meaning}
                        </p>
                        {relatedWord.category && (
                          <span className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs mt-2 capitalize">
                            {relatedWord.category}
                          </span>
                        )}
                      </a>
                    ))
                  )}
                </div>

                {filteredRelatedWords.length > 0 && (
                  <div className="mt-4 text-center">
                    <a
                      href="/explore"
                      className="inline-flex items-center gap-2 text-yellow-500 hover:text-yellow-500-dark font-semibold text-sm"
                    >
                      Explore More Words
                      <i data-feather="arrow-right" className="w-4 h-4"></i>
                    </a>
                  </div>
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