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
      ? "bg-primary text-white rounded-lg"
      : "text-gray-700 hover:bg-gray-100 rounded-lg";

  return (
    <div className="relative">
      {/* Mobile toggle button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 bg-white text-gray-700 p-2 rounded-lg shadow-sm"
      >
        <i data-feather={isOpen ? "x" : "menu"}></i>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-sm transform transition-transform duration-300 ease-in-out z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="sidebar-header px-6 py-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <i data-feather="shield" className="w-5 h-5"></i> Moderator Panel
          </h2>
          <button onClick={toggleSidebar} className="md:hidden text-gray-500 hover:text-gray-700">
            <i data-feather="x" className="w-5 h-5"></i>
          </button>
        </div>

        {/* Sidebar Menu */}
        <div className="sidebar-menu px-4 py-4 space-y-6 overflow-y-auto h-[calc(100%-5rem)]">
          {/* Main */}
          <div className="menu-group">
            <div className="menu-title text-gray-500 uppercase text-xs font-semibold mb-3 px-2">
              Main
            </div>
            <a href="/moderator" className={`flex items-center gap-3 px-3 py-3 text-sm font-medium transition-colors ${getActiveClass("/moderator")}`}>
              <i data-feather="home" className="w-4 h-4"></i> Dashboard
            </a>
          </div>

          {/* Community */}
          <div className="menu-group">
            <div className="menu-title text-gray-500 uppercase text-xs font-semibold mb-3 px-2">
              Community
            </div>
            <a href="/moderator/users" className={`flex items-center gap-3 px-3 py-3 text-sm font-medium transition-colors ${getActiveClass("/moderator/users")}`}>
              <i data-feather="users" className="w-4 h-4"></i> User Management
            </a>
            <a href="/moderator/reports" className={`flex items-center gap-3 px-3 py-3 text-sm font-medium transition-colors ${getActiveClass("/moderator/reports")}`}>
              <i data-feather="alert-circle" className="w-4 h-4"></i> Reports
            </a>
          </div>

          {/* Tools */}
          <div className="menu-group">
            <div className="menu-title text-gray-500 uppercase text-xs font-semibold mb-3 px-2">
              Tools
            </div>
            <a href="/moderator/analytics" className={`flex items-center gap-3 px-3 py-3 text-sm font-medium transition-colors ${getActiveClass("/moderator/analytics")}`}>
              <i data-feather="bar-chart" className="w-4 h-4"></i> Analytics
            </a>
            <a href="/moderator/settings" className={`flex items-center gap-3 px-3 py-3 text-sm font-medium transition-colors ${getActiveClass("/moderator/settings")}`}>
              <i data-feather="settings" className="w-4 h-4"></i> Settings
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-50">
          <div className="text-center text-xs text-gray-500">
            Moderator Access
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