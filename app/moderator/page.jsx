"use client";

import React, { useEffect, useState } from "react";
import ModeratorNavbar from "@/components/moderatorNavbar";
import ModeratorSidebar from "@/components/moderatorSidebar";
import Cookies from "js-cookie";
import feather from "feather-icons";
import RoleGuard from "@/utils/RoleGuard";

const fetchModeratorStats = async () => {
  const token = Cookies.get("token");
  try {
    const res = await fetch("http://wiki-server.giguild.com/api/user/word/list", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch stats");
    return res.json();
  } catch (err) {
    console.error(err);
    return {
      pending: 0,
      reviewed: 0,
      flagged: 0,
      wordsNeedingReview: [],
    };
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

  return (
          <RoleGuard allowedRoles={["admin", "super_admin", "moderator"]}>
    
    <div>
      <ModeratorNavbar />
      <div className="flex">
        <ModeratorSidebar />
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold text-secondary mb-6">Moderator Dashboard</h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { label: "Pending Words", value: stats.pending, icon: "clock", color: "primary" },
              { label: "Words Reviewed", value: stats.reviewed, icon: "check-circle", color: "secondary" },
              { label: "Flagged Words", value: stats.flagged, icon: "flag", color: "accent" },
            ].map((card, idx) => (
              <div key={idx} className={`bg-white p-6 rounded-xl shadow-sm border-l-4 border-${card.color}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-gray-500">{card.label}</p>
                    <h3 className="text-3xl font-bold">{card.value}</h3>
                  </div>
                  <i data-feather={card.icon} className={`text-${card.color} text-2xl`}></i>
                </div>
              </div>
            ))}
          </div>

          {/* Words Needing Review */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Words Needing Review</h2>
              <a href="/moderator/review" className="text-primary hover:underline">View All</a>
            </div>

            <div className="space-y-4">
              {stats.wordsNeedingReview.length === 0 ? (
                <p className="text-gray-500">No words to review.</p>
              ) : (
                stats.wordsNeedingReview.map((word) => (
                  <div key={word.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium">{word.word}</h3>
                      <p className="text-gray-500 text-sm">{word.language} - "{word.meaning}"</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="bg-green-100 text-green-800 px-3 py-1 rounded-md text-sm flex items-center gap-1">
                        <i data-feather="check" className="w-4 h-4"></i> Approve
                      </button>
                      <button className="bg-red-100 text-red-800 px-3 py-1 rounded-md text-sm flex items-center gap-1">
                        <i data-feather="x" className="w-4 h-4"></i> Reject
                      </button>
                      <a href={`/moderator/review-detail/${word.id}`} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md text-sm flex items-center gap-1">
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
