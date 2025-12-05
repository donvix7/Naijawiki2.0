"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

const UserDelBtn = ({ id, base_url, token }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const deleteUser = async () => {
    if (loading) return;

    const confirmed = confirm("Are you sure you want to delete this word?");
    if (!confirmed) return;

    setLoading(true);

    try {
      const res = await fetch(`${base_url}/users/${id}`, {
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
      onClick={deleteUser}
      disabled={loading}
      className={`flex-1 bg-red-500 text-white font-semibold py-2 px-3 rounded text-center text-sm hover:bg-red-800 transition-colors flex items-center justify-center gap-1 : ""}`}
    >
     
        <i data-feather="trash" className="w-3 h-3"></i>
      {loading ? "Deleting..." : "Delete"}
    </button>
  );
};

export default UserDelBtn;
