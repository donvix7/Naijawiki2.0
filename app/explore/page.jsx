"use client";

import React, { useEffect, useState } from "react";
import CustomNavbar from "@/components/navBar";
import CustomFooter from "@/components/customFooter";
import FilterForm from "@/components/filterForm";
import Cookies from "js-cookie";
import getBaseUrl from "@/utils/baseUrl";

export default function Page() {
  const [words, setWords] = useState([]);
  const base_url = getBaseUrl();

  useEffect(() => {
    async function getWords() {
      const token = Cookies.get("token");

      if (!token) {
        console.warn("No token found — user may not be logged in");
        return;
      }

      try {
        const res = await fetch(`${base_url}/user/word/list`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error(`Failed to fetch words: ${res.statusText}`);
        }

        const data = await res.json();
        const list = Array.isArray(data) ? data : data.words || [];
        setWords(list);
      } catch (error) {
        console.error("Error fetching words:", error);
        setWords([]); // fallback to empty
      }
    }

    getWords();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <CustomNavbar />

      <main className="flex-grow">
        {/* Defensive rendering — only show FilterForm if words exist */}
        <FilterForm words={words} />
      </main>

      <CustomFooter />
    </div>
  );
}
