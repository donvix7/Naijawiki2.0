"use client";

import React, { useEffect, useState } from "react";
import CustomNavbar from "@/components/navBar";
import CustomFooter from "@/components/customFooter";
import FilterForm from "@/components/filterForm";
import Cookies from "js-cookie";
import getBaseUrl from "../api/baseUrl";

export default function Page() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const base_url = getBaseUrl();

  // Check if user is logged in
  useEffect(() => {
    const token = Cookies.get("token");
    setIsLoggedIn(!!token);
  }, []);

  // Fetch all words on component mount - no authentication required
  useEffect(() => {
    async function getWords() {
      try {
        const res = await fetch(`${base_url}/words`);

        if (!res.ok) {
          throw new Error(`Failed to fetch words: ${res.statusText}`);
        }

        const data = await res.json();
        const list = Array.isArray(data) ? data : data.words || [];
        setWords(list);
      } catch (error) {
        console.error("Error fetching words:", error);
        setError("Failed to load words");
        setWords([]); // fallback to empty
      } finally {
        setLoading(false);
      }
    }

    getWords();
  }, [base_url]);

  // Search words function - no authentication required
  const searchWords = async (searchTerm) => {
    setLoading(true);
    try {
      // If search term is empty, fetch all words
      if (!searchTerm.trim()) {
        const res = await fetch(`${base_url}/words`);

        if (!res.ok) {
          throw new Error(`Failed to fetch words: ${res.statusText}`);
        }

        const data = await res.json();
        const list = Array.isArray(data) ? data : data.words || [];
        setWords(list);
        setError("");
        return;
      }

      // Search with the provided term
      const res = await fetch(`${base_url}/words?search=${encodeURIComponent(searchTerm)}`);

      if (!res.ok) {
        throw new Error(`Failed to search words: ${res.statusText}`);
      }

      const data = await res.json();
      const filteredList = Array.isArray(data) ? data : data.words || [];
      setWords(filteredList);
      setError("");
      
    } catch (error) {
      console.error("Error searching words:", error);
      setError("Failed to search words");
      setWords([]);
    } finally {
      setLoading(false);
    }
  };

  // Reset to show all words - no authentication required
  const resetSearch = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${base_url}/words`);

      if (!res.ok) {
        throw new Error(`Failed to fetch words: ${res.statusText}`);
      }

      const data = await res.json();
      const list = Array.isArray(data) ? data : data.words || [];
      setWords(list);
      setError("");
    } catch (error) {
      console.error("Error resetting search:", error);
      setError("Failed to load words");
      setWords([]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <CustomNavbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-700">Loading words...</p>
          </div>
        </main>
        <CustomFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <CustomNavbar />

      <main className="flex-grow">
        {/* Show error message if any */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mx-4 mt-4">
            {error}
          </div>
        )}
        
        {/* Pass search function and login status to FilterForm */}
        <FilterForm 
          words={words} 
          onSearch={searchWords}
          onResetSearch={resetSearch}
          loading={loading}
          isLoggedIn={isLoggedIn}
        />
      </main>

      <CustomFooter />
    </div>
  );
}