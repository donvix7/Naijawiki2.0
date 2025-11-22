"use client";
import React, { useState, useEffect } from "react";
import feather from "feather-icons";
import Cookies from "js-cookie";

const FilterForm = ({ words = [], base_url }) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [filteredWords, setFilteredWords] = useState(words);

  const token = Cookies.get("token");

  useEffect(() => {
    feather.replace();
  }, [search, filteredWords, category]);

  console.log(base_url);

  // Fetch filtered words when filters change
  useEffect(() => {
    const fetchFiltered = async () => {
      try {
        // Build query parameters
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (category) params.append('category', category);

        const res = await fetch(`${base_url}/words?${params.toString()}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error(`Failed fetch: ${res.statusText}`);
        }

        const data = await res.json();
        const list = Array.isArray(data) ? data : data.words || [];

        // Apply approved filter
        const filtered = list.filter((word) => word.status === "approved");

        setFilteredWords(filtered);
      } catch (error) {
        console.error("Failed fetching filtered words:", error);

        // fallback to local list
        const fallback = words.filter((word) => {
          const isApproved = word.status === "approved";

          const matchesSearch = search
            ? word.word.toLowerCase().includes(search.toLowerCase())
            : true;

          const matchesCategory = category
            ? word.category === category
            : true;

          return isApproved && matchesSearch && matchesCategory;
        });

        setFilteredWords(fallback);
      }
    };

    fetchFiltered();
  }, [search, category, base_url, token, words]);

  // Clear all filters
  const clearFilters = () => {
    setSearch("");
    setCategory("");
  };

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Words
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
              <option value="greeting">Greeting</option>
              <option value="food">Food</option>
              <option value="family">Family</option>
              <option value="numbers">Numbers</option>
              <option value="verbs">Verbs</option>
              <option value="nouns">Nouns</option>
              <option value="adjectives">Adjectives</option>
              <option value="phrases">Common Phrases</option>
            </select>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              className="w-full p-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <i data-feather="refresh-cw" className="w-4 h-4"></i>
              Clear Filters
            </button>
          </div>
        </div>

        {/* Active Filters Indicator */}
        {(search || category) && (
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
            <span>Active filters:</span>
            {search && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Search: "{search}"
              </span>
            )}
            {category && (
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full capitalize">
                Category: {category}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredWords.length} word{filteredWords.length !== 1 ? 's' : ''}
          {search || category ? ' matching your filters' : ''}
        </p>
      </div>

      {/* Filtered Words Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredWords.length > 0 ? (
          filteredWords.map((word) => (
            <div
              key={word.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-2xl font-bold text-secondary">
                    {word.word}
                  </h3>

                  <span className="bg-primary text-white px-3 py-1 rounded-full text-sm capitalize">
                    {word.language}
                  </span>
                </div>

                <p className="text-gray-600 mb-4">{word.meaning}</p>

                {word.category && (
                  <div className="mb-3">
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs capitalize">
                      {word.category}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <button className="flex items-center text-primary hover:text-primary-dark transition-colors">
                    <i data-feather="play-circle" className="mr-2"></i> Listen
                  </button>

                  <a
                    href={`/word-details/${word.id}`}
                    className="text-accent hover:underline flex items-center gap-1"
                  >
                    View details
                    <i data-feather="arrow-right" className="w-4 h-4"></i>
                  </a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <i data-feather="search" className="w-16 h-16 text-gray-400 mx-auto mb-4"></i>
            <p className="text-gray-500 text-lg mb-2">No words found</p>
            <p className="text-gray-400 mb-4">
              {search || category 
                ? "Try adjusting your filters to see more results." 
                : "No words available yet."
              }
            </p>
            {(search || category) && (
              <button
                onClick={clearFilters}
                className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-dark transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pagination */}
      {filteredWords.length > 0 && (
        <div className="mt-12 flex justify-center">
          <nav className="flex items-center gap-1 flex-wrap" aria-label="Pagination">
            <button className="px-3 py-2 border rounded-md bg-white text-sm text-gray-700 hover:bg-gray-100 flex items-center">
              <i data-feather="chevron-left" className="h-4 w-4"></i>
              <span className="ml-1 hidden sm:inline">Previous</span>
            </button>

            <div className="flex items-center gap-1 flex-wrap justify-center">
              <button className="px-3 py-2 border rounded-md bg-primary text-white text-sm">
                1
              </button>

              <button className="px-3 py-2 border rounded-md bg-white text-sm text-gray-700 hover:bg-gray-100">
                2
              </button>

              <button className="px-3 py-2 border rounded-md bg-white text-sm text-gray-700 hover:bg-gray-100">
                3
              </button>

              <span className="px-3 py-2 text-gray-500 text-sm">…</span>

              <button className="px-3 py-2 border rounded-md bg-white text-sm text-gray-700 hover:bg-gray-100">
                8
              </button>
            </div>

            <button className="px-3 py-2 border rounded-md bg-white text-sm text-gray-700 hover:bg-gray-100 flex items-center">
              <span className="mr-1 hidden sm:inline">Next</span>
              <i data-feather="chevron-right" className="h-4 w-4"></i>
            </button>
          </nav>
        </div>
      )}
    </main>
  );
};

export default FilterForm;