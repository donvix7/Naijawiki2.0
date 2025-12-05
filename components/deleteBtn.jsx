"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import feather from "feather-icons";

const DeleteBtn = ({ id, base_url, token }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Initialize feather icons
  useEffect(() => {
    if (typeof window !== "undefined") {
      feather.replace();
    }
  }, [loading]);

  const deleteWord = async () => {
    if (loading) return;

    const confirmed = confirm("Are you sure you want to delete this word?");
    if (!confirmed) return;

    setLoading(true);

    try {
      const res = await fetch(`${base_url}/word/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        const errorMessage = errorData.message || errorData.error || "Delete failed";
        alert(`Delete failed: ${errorMessage}`);
        setLoading(false);
        return;
      }

      alert("Deleted successfully");
      router.refresh(); // Refresh the page to update the list
      
    } catch (error) {
      console.error("Delete error:", error);
      alert("Network or server error while deleting");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={deleteWord}
      disabled={loading}
      className="w-full bg-red-500 text-white font-semibold py-2.5 px-4 rounded-lg text-center text-sm hover:bg-red-200 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      title="Delete word"
    >
      <i data-feather={loading ? "loader" : "trash-2"} className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}></i>
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
};

export default DeleteBtn;