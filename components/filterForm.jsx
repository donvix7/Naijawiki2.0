"use client";
import React, { useState, useEffect, useRef } from "react";
import feather from "feather-icons";
import Cookies from "js-cookie";

const FilterForm = ({ words = [], onSearch, onResetSearch, loading = false }) => {
  const [search, setSearch] = useState("");
  const [filteredWords, setFilteredWords] = useState(words);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [playingAudioId, setPlayingAudioId] = useState(null);
  const [audioError, setAudioError] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const token = Cookies.get("token");

  useEffect(() => {
    feather.replace();
  }, [search, filteredWords]);

  // Update filtered words when words prop changes (only after initial load)
  useEffect(() => {
    if (isInitialLoad) {
      setFilteredWords(words);
      setIsInitialLoad(false);
    } else {
      setFilteredWords(words);
    }
  }, [words, isInitialLoad]);

  // Handle search with debounce - only trigger when search actually changes
  useEffect(() => {
    if (!onSearch) return;

    // Don't search on initial render or when search is empty
    if (isInitialLoad && !search) return;

    const delayDebounce = setTimeout(() => {
      onSearch(search);
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [search, onSearch, isInitialLoad]);

  /* ------------------------------
     Audio Play Handler
  -------------------------------*/
  const handlePlayAudio = async (word) => {
    // Stop current audio if playing
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
      setPlayingAudioId(null);
    }

    // Check for audio availability
    const audioUrl = word.audio_url || word.audioUrl || word.audio;
    console.log("Attempting to play audio:", audioUrl);
    
    if (!audioUrl) {
      setAudioError(`No audio available for "${word.word}"`);
      return;
    }

    try {
      setAudioError(null);
      setPlayingAudioId(word.id);

      // Create audio element
      const audio = new Audio(audioUrl);
      setCurrentAudio(audio);

      // Set up event listeners
      audio.addEventListener('loadeddata', () => {
        console.log("Audio loaded successfully");
      });

      audio.addEventListener('canplaythrough', () => {
        console.log("Audio can play through");
      });

      audio.addEventListener('error', (e) => {
        console.error("Audio error:", e);
        setAudioError(`Couldn't play audio for "${word.word}". The file may be missing or corrupted.`);
        setPlayingAudioId(null);
        setCurrentAudio(null);
      });

      audio.addEventListener('ended', () => {
        setPlayingAudioId(null);
        setCurrentAudio(null);
      });

      audio.addEventListener('pause', () => {
        setPlayingAudioId(null);
      });

      // Attempt to play
      await audio.play();
      
    } catch (error) {
      console.error("Audio play failed:", error);
      setAudioError(`Couldn't play audio for "${word.word}". Please try again.`);
      setPlayingAudioId(null);
      setCurrentAudio(null);
    }
  };

  /* ------------------------------
     Stop Audio
  -------------------------------*/
  const handleStopAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      setCurrentAudio(null);
      setPlayingAudioId(null);
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearch("");
    if (onResetSearch) {
      onResetSearch();
    }
  };

  // Handle manual search (when user clicks search button or presses enter)
  const handleManualSearch = () => {
    if (onSearch) {
      onSearch(search);
    }
  };

  // Handle enter key press in search input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleManualSearch();
    }
  };

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (currentAudio) {
        currentAudio.pause();
        setCurrentAudio(null);
      }
    };
  }, [currentAudio]);

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
            className="inline-flex items-center bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-full transition-colors"
          >
            <i data-feather="plus" className="mr-2"></i> Add New Word
          </a>
        </div>
      </div>

      {/* Audio Error Display */}
      {audioError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
          {audioError}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white p-6 rounded-xl shadow-md mb-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Words
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search words..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                disabled={loading}
              />
              <i
                data-feather="search"
                className="absolute left-3 top-3.5 text-gray-400"
              ></i>
              {loading && (
                <div className="absolute right-3 top-3.5">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                </div>
              )}
            </div>
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <button
              onClick={handleManualSearch}
              disabled={loading}
              className="w-full p-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i data-feather="search" className="w-4 h-4"></i>
              Search
            </button>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={clearFilters}
              disabled={loading}
              className="w-full p-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <i data-feather="refresh-cw" className="w-4 h-4"></i>
              Clear
            </button>
          </div>
        </div>

        {/* Active Filters Indicator */}
        {(search) && (
          <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
            <span>Active filters:</span>
            {search && (
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                Search: "{search}"
              </span>
            )}
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {filteredWords.length} word{filteredWords.length !== 1 ? 's' : ''}
          {search ? ' matching your filters' : ''}
          {loading && " (loading...)"}
        </p>
      </div>

      {/* Filtered Words Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {loading ? (
          <div className="col-span-full text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500 text-lg">Loading words...</p>
          </div>
        ) : filteredWords.length > 0 ? (
          filteredWords.map((word) => {
            // Check if audio is available for this word
            const hasAudio = word.audio_url || word.audioUrl || word.audio;
            
            return (
              <div
                key={word.id}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-2xl font-bold text-secondary">
                      {word.word}
                    </h3>
                    <span className="bg-primary text-white px-2 py-1 rounded-full text-xs font-semibold">
                      {word.language}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4">{word.meaning}</p>

                  <div className="flex items-center justify-between">
                    <button 
                      onClick={() => 
                        playingAudioId === word.id 
                          ? handleStopAudio() 
                          : handlePlayAudio(word)
                      }
                      disabled={!hasAudio}
                      className={`flex items-center transition-colors ${
                        playingAudioId === word.id 
                          ? "text-red-600 hover:text-red-700" 
                          : "text-primary hover:text-primary-dark"
                      } ${!hasAudio ? "opacity-50 cursor-not-allowed" : ""}`}
                    >
                      <i 
                        data-feather={playingAudioId === word.id ? "square" : "play-circle"} 
                        className="mr-2"
                      ></i> 
                      {playingAudioId === word.id ? "Stop" : "Listen"}
                    </button>

                    {/* Audio availability indicator */}
                    {hasAudio && (
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                        Audio
                      </span>
                    )}

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
            );
          })
        ) : (
          <div className="col-span-full text-center py-12">
            <i data-feather="search" className="w-16 h-16 text-gray-400 mx-auto mb-4"></i>
            <p className="text-gray-500 text-lg mb-2">No words found</p>
            <p className="text-gray-400 mb-4">
              {search  
                ? "Try adjusting your search terms to see more results." 
                : "No words available yet."
              }
            </p>
            {search && (
              <button
                onClick={clearFilters}
                className="bg-primary text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-dark transition-colors"
              >
                Clear Search
              </button>
            )}
          </div>
        )}
      </div>

      {/* Pagination - Only show if not loading and there are results */}
      {!loading && filteredWords.length > 0 && (
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