"use client";
import React, { useState, useEffect } from "react";
import feather from "feather-icons";

const FilterForm = ({ words = [] }) => {
  const [language, setLanguage] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    feather.replace();
  }, [language, category, status, search]);

  const filteredWords = words.filter((word) => {
    const matchesLanguage = language ? word.language === language : true;
    const matchesCategory = category ? word.category === category : true;
    const matchesStatus = status ? word.status === status : true;
    const matchesSearch = search
      ? word.word.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchesLanguage && matchesCategory && matchesStatus && matchesSearch;
  });

  return (
    <main className="container mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 className="text-4xl font-bold text-secondary mb-2">
            Explore Nigerian Words
          </h1>
          <p className="text-gray-600">
            Discover and learn words from various Nigerian languages
          </p>
        </div>
        <div>
          <a
            href="/submit-word"
            className="inline-flex items-center bg-primary hover:bg-yellow-600 text-white font-bold py-3 px-6 rounded-full transition-colors"
          >
            <i data-feather="plus" className="mr-2"></i> Add New Word
          </a>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Language Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            >
              <option value="">All Languages</option>
              <option value="pidgin">Pidgin English</option>
              <option value="yoruba">Yoruba</option>
              <option value="igbo">Igbo</option>
              <option value="hausa">Hausa</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
            >
              <option value="">All Categories</option>
              <option value="slang">Slang</option>
              <option value="proverb">Proverb</option>
              <option value="phrase">Common Phrase</option>
              <option value="greeting">Greeting</option>
            </select>
          </div>


          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search words..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
              />
              <i
                data-feather="search"
                className="absolute left-3 top-3.5 text-gray-400"
              ></i>
            </div>
          </div>
        </div>
      </div>

      {/* Filtered Words */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredWords.length > 0 ? (
          filteredWords.map((word) => (
            <div
              key={word.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-2xl font-bold text-secondary">
                       <a href={`/word-details/${word.id}`}>
                    
                    {word.word}
                    </a>
                  </h3>
                  <span className="bg-primary text-white px-3 py-1 rounded-full text-sm capitalize">
                    {word.language}
                  </span>
                </div>
                <p className="mt-2 text-gray-600">{word.meaning}</p>
                <div className="mt-4 flex items-center justify-between">
                  <button className="flex items-center text-primary">
                    <i data-feather="play-circle" className="mr-2"></i> Listen
                  </button>
                  <a
                    href={`/word-detail/${word.id}`}
                    className="text-accent hover:underline"
                  >
                    View details
                  </a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No words match your filters.
          </p>
        )}
      </div>

      {/* Pagination (static demo) */}
      <div className="mt-12 flex justify-center">
        <nav
          className="inline-flex rounded-md shadow-sm -space-x-px"
          aria-label="Pagination"
        >
          <a
            href="#"
            className="inline-flex items-center px-4 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <i data-feather="chevron-left" className="h-4 w-4"></i>
          </a>
          <a
            href="#"
            className="inline-flex items-center px-4 py-2 border border-gray-300 bg-gray-100 text-sm font-medium text-primary"
          >
            1
          </a>
          <a
            href="#"
            className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            2
          </a>
          <a
            href="#"
            className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            3
          </a>
          <span className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
            ...
          </span>
          <a
            href="#"
            className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            8
          </a>
          <a
            href="#"
            className="inline-flex items-center px-4 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <i data-feather="chevron-right" className="h-4 w-4"></i>
          </a>
        </nav>
      </div>
    </main>
  );
};

export default FilterForm;
