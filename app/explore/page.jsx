import React from "react";
import CustomNavbar from "@/components/navBar";
import CustomFooter from "@/components/customFooter";
import FilterForm from "@/components/filterForm";

async function getWords() {
  try {
    const res = await fetch("http://wiki-server.giguild.com/api/user/word/list", {
      next: { revalidate: 60 }, // ✅ enables ISR caching every 60s (optional)
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch words: ${res.statusText}`);
    }

    // ✅ Fixed the typo: 'josn()' → 'json()'
    const data = await res.json();

    // Optional: handle API structure if response is wrapped
    return Array.isArray(data) ? data : data.words || [];
  } catch (error) {
    console.error("Error fetching words:", error);
    return []; // ✅ Prevent crash if API fails
  }
}

export default async function Page() {
  const words = await getWords();

  return (
    <div className="min-h-screen flex flex-col">
      <CustomNavbar />

      {/* ✅ Defensive rendering: only show if words array exists */}
      <main className="flex-grow">
        <FilterForm words={words} />
      </main>

      <CustomFooter />
    </div>
  );
}
