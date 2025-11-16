"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

const DeleteBtn = ({ id, base_url, token }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
        const msg = await res.text();
        alert("Delete failed: " + msg);
        setLoading(false);
        return;
      }

      alert("Deleted successfully");
      router.refresh();

    } catch (error) {
      console.error(error);
      alert("Network or server error while deleting");
    }

    setLoading(false);
  };

  return (
    <button
      onClick={deleteWord}
      disabled={loading}
      className={`text-red-500 hover:underline ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
    >
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
};

export default DeleteBtn;
