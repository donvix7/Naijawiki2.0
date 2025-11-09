"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import feather from "feather-icons";

const ModeratorSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    feather.replace();
  }, [pathname, isOpen]);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const getActiveClass = (path) =>
    pathname === path
      ? "menu-item bg-blue-700 text-white rounded-md"
      : "menu-item hover:bg-gray-200 dark:hover:bg-gray-800 rounded-md";

  return (
    <div className="relative">
      {/* Mobile toggle button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-900 text-white p-2 rounded-md"
      >
        <i data-feather={isOpen ? "x" : "menu"}></i>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-gray-200 transform transition-transform duration-300 ease-in-out z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="sidebar-header px-4 py-4 border-b border-gray-700 flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <i data-feather="shield"></i> Moderator Panel
          </h2>
          <button onClick={toggleSidebar} className="md:hidden">
            <i data-feather="x"></i>
          </button>
        </div>

        {/* Sidebar Menu */}
        <div className="sidebar-menu px-4 py-4 space-y-6 overflow-y-auto h-[calc(100%-4rem)]">
          {/* Main */}
          <div className="menu-group">
            <div className="menu-title text-gray-400 uppercase text-sm mb-2">
              Main
            </div>
            <a href="/moderator" className={`flex items-center gap-2 px-3 py-2 ${getActiveClass("/moderator")}`}>
              <i data-feather="home"></i> Dashboard
            </a>
          </div>

          {/* Content Review */}
          <div className="menu-group">
            <div className="menu-title text-gray-400 uppercase text-sm mb-2">
              Content Review
            </div>
            <a href="/moderator/review" className={`flex items-center justify-between px-3 py-2 ${getActiveClass("/moderator/review")}`}>
              <span className="flex items-center gap-2">
                <i data-feather="check-circle"></i> Pending Review
              </span>
              <span className="badge bg-blue-600 text-white text-xs px-2 py-1 rounded-full">24</span>
            </a>
            <a href="/moderator/approved" className={`flex items-center gap-2 px-3 py-2 ${getActiveClass("/moderator/approved")}`}>
              <i data-feather="thumbs-up"></i> Approved Words
            </a>
            <a href="/moderator/rejected" className={`flex items-center gap-2 px-3 py-2 ${getActiveClass("/moderator/rejected")}`}>
              <i data-feather="thumbs-down"></i> Rejected Words
            </a>
            <a href="/moderator/flagged" className={`flex items-center justify-between px-3 py-2 ${getActiveClass("/moderator/flagged")}`}>
              <span className="flex items-center gap-2">
                <i data-feather="flag"></i> Flagged Content
              </span>
              <span className="badge bg-red-600 text-white text-xs px-2 py-1 rounded-full">5</span>
            </a>
          </div>

          {/* Community */}
          <div className="menu-group">
            <div className="menu-title text-gray-400 uppercase text-sm mb-2">
              Community
            </div>
            <a href="/moderator/users" className={`flex items-center gap-2 px-3 py-2 ${getActiveClass("/moderator/users")}`}>
              <i data-feather="users"></i> User Management
            </a>
            <a href="/moderator/reports" className={`flex items-center gap-2 px-3 py-2 ${getActiveClass("/moderator/reports")}`}>
              <i data-feather="alert-circle"></i> Reports
            </a>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        ></div>
      )}
    </div>
  );
};

export default ModeratorSidebar;
