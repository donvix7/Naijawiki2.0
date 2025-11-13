"use client";

import React, { useEffect, useState } from "react";
import ModeratorNavbar from "@/components/moderatorNavbar";
import ModeratorSidebar from "@/components/moderatorSidebar";
import Cookies from "js-cookie";
import feather from "feather-icons";
import RoleGuard from "@/utils/RoleGuard";
import getBaseUrl from "../api/baseUrl";

//  Fetch Moderator Stats
const fetchModeratorStats = async () => {
  const token = Cookies.get("token");
  const base_url = getBaseUrl();

  try {
    const res = await fetch(`${base_url}/user/word/list`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch moderator stats");

    const data = await res.json();
    const words = Array.isArray(data) ? data : data.words || [];

    const pending = words.filter(w => w.status === "pending").length;
    const reviewed = words.filter(w => ["approved", "rejected"].includes(w.status)).length;
    const flagged = words.filter(w => w.flagged).length;
    const wordsNeedingReview = words.filter(w => w.status === "pending").slice(0, 5);

    return { pending, reviewed, flagged, wordsNeedingReview };
  } catch (err) {
    console.error("❌ Error fetching moderator stats:", err);
    return { pending: 0, reviewed: 0, flagged: 0, wordsNeedingReview: [] };
  }
};

// ✅ Update Word Status (Approve/Reject)
const updateWordStatus = async (wordId, status) => {
  const token = Cookies.get("token");
  const base_url = getBaseUrl();

  try {
    const res = await fetch(`${base_url}/user/word/update/${wordId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    if (!res.ok) throw new Error("Failed to update word status");

    return await res.json();
  } catch (err) {
    console.error("❌ Error updating word status:", err);
    throw err;
  }
};

const ModeratorDashboard = () => {
  const [stats, setStats] = useState({
    pending: 0,
    reviewed: 0,
    flagged: 0,
    wordsNeedingReview: [],
  });

  useEffect(() => {
    fetchModeratorStats().then(setStats);
  }, []);

  useEffect(() => {
    feather.replace();
  }, [stats]);

  // ✅ Handle Approve / Reject
  const handleStatusUpdate = async (wordId, status) => {
    try {
      await updateWordStatus(wordId, status);

      // Update UI immediately
      setStats((prev) => ({
        ...prev,
        wordsNeedingReview: prev.wordsNeedingReview.filter(w => w.id !== wordId),
        reviewed: prev.reviewed + 1,
        pending: Math.max(prev.pending - 1, 0),
      }));

      alert(`Word ${status === "approved" ? "approved" : "rejected"} successfully.`);
    } catch (err) {
      alert("Failed to update word status. Please try again.");
    }
  };

  return (
    <RoleGuard allowedRoles={["admin", "super_admin", "moderator"]}>
      <div>
        <ModeratorNavbar />
        <div className="flex">
          <ModeratorSidebar />
          <main className="flex-1 p-8">
            <h1 className="text-3xl font-bold text-secondary mb-6">
              Moderator Dashboard
            </h1>

            {/* ✅ Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[
                { label: "Pending Words", value: stats.pending, icon: "clock", color: "border-primary text-primary" },
                { label: "Words Reviewed", value: stats.reviewed, icon: "check-circle", color: "border-secondary text-secondary" },
                { label: "Flagged Words", value: stats.flagged, icon: "flag", color: "border-accent text-accent" },
              ].map((card, idx) => (
                <div
                  key={idx}
                  className={`bg-white p-6 rounded-xl shadow-sm border-l-4 ${card.color} hover:shadow-md transition-shadow duration-300 cursor-pointer`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-500">{card.label}</p>
                      <h3 className="text-3xl font-bold">{card.value}</h3>
                    </div>
                    <i data-feather={card.icon} className="w-6 h-6"></i>
                  </div>
                </div>
              ))}
            </div>

            {/* ✅ Words Needing Review */}
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Words Needing Review</h2>
                <a
                  href="/moderator/review"
                  className="text-primary hover:text-yellow-600 hover:underline transition-colors duration-200 cursor-pointer"
                >
                  View All
                </a>
              </div>

              <div className="space-y-4">
                {stats.wordsNeedingReview.length === 0 ? (
                  <p className="text-gray-500">No words to review.</p>
                ) : (
                  stats.wordsNeedingReview.map((word) => (
                    <div
                      key={word.id || word.word}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div>
                        <h3 className="font-medium">{word.word}</h3>
                        <p className="text-gray-500 text-sm">
                          {word.language || "Unknown"} – “{word.meaning || "No meaning"}”
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleStatusUpdate(word.id, "approved")}
                          className="bg-green-100 text-green-800 px-3 py-1 rounded-md text-sm flex items-center gap-1 
                            hover:bg-green-200 hover:text-green-900 transition-colors duration-200 cursor-pointer"
                        >
                          <i data-feather="check" className="w-4 h-4"></i> Approve
                        </button>
                        <button
                          onClick={() => handleStatusUpdate(word.id, "rejected")}
                          className="bg-red-100 text-red-800 px-3 py-1 rounded-md text-sm flex items-center gap-1 
                            hover:bg-red-200 hover:text-red-900 transition-colors duration-200 cursor-pointer"
                        >
                          <i data-feather="x" className="w-4 h-4"></i> Reject
                        </button>
                        <a
                          href={`/moderator/review-detail/${word.id}`}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-sm flex items-center gap-1 
                            hover:bg-blue-200 hover:text-blue-900 transition-colors duration-200 cursor-pointer"
                        >
                          <i data-feather="edit" className="w-4 h-4"></i> Edit
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </main>
        </div>
      </div>
    </RoleGuard>
  );
};

export default ModeratorDashboard;
