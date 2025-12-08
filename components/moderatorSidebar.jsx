"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import feather from "feather-icons";

const ModeratorSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    feather.replace();
  }, [pathname, isOpen]);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const getActiveClass = (path) =>
    pathname === path
      ? "bg-yellow-500 text-white font-semibold shadow-sm border-l-4 border-white"
      : "text-gray-800 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200";

  // Close sidebar when clicking on a link (mobile only)
  const handleLinkClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      {/* Mobile toggle button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 bg-yellow-600 text-white p-3 rounded-lg shadow-lg hover:shadow-xl hover:bg-yellow-700 transition-all duration-200"
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        aria-expanded={isOpen}
      >
        <i data-feather={isOpen ? "x" : "menu"} className="w-5 h-5"></i>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:w-64`}
        aria-hidden={!isOpen && isMobile}
      >
        {/* Sidebar Header */}
        <div className="sidebar-header px-6 py-5 border-b border-gray-300 bg-white flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3">
            <i data-feather="shield" className="w-6 h-6 text-yellow-600"></i> 
            <span className="text-lg font-bold">Moderator Panel</span>
          </h2>
          <button 
            onClick={toggleSidebar} 
            className="md:hidden text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200"
            aria-label="Close sidebar"
          >
            <i data-feather="x" className="w-5 h-5"></i>
          </button>
        </div>

        {/* Sidebar Menu */}
        <div className="sidebar-menu px-4 py-6 space-y-6 overflow-y-auto h-[calc(100%-5rem)]">
          {/* Main Section */}
          <div className="menu-group">
            <div className="menu-title text-gray-700 uppercase text-xs font-bold mb-3 px-2 tracking-wider border-b border-gray-200 pb-3">
              MAIN NAVIGATION
            </div>
            <a 
              href="/moderator" 
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${getActiveClass("/moderator")}`}
              onClick={handleLinkClick}
            >
              <i data-feather="home" className="w-5 h-5"></i> 
              <span className="font-medium">Dashboard</span>
            </a>
          </div>

          {/* Content Section */}
          <div className="menu-group">
            <div className="menu-title text-gray-700 uppercase text-xs font-bold mb-3 px-2 tracking-wider border-b border-gray-200 pb-3">
              CONTENT MANAGEMENT
            </div>
            <a 
              href="/moderator/word" 
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${getActiveClass("/moderator/words")}`}
              onClick={handleLinkClick}
            >
              <i data-feather="book" className="w-5 h-5"></i> 
              <span className="font-medium">Word Reviews</span>
            </a>
            
          </div>

          

          {/* Tools Section */}
          <div className="menu-group">
            <div className="menu-title text-gray-700 uppercase text-xs font-bold mb-3 px-2 tracking-wider border-b border-gray-200 pb-3">
              TOOLS & ANALYTICS
            </div>
            <a 
              href="/moderator/analytics" 
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${getActiveClass("/moderator/analytics")}`}
              onClick={handleLinkClick}
            >
              <i data-feather="bar-chart-2" className="w-5 h-5 text-purple-500"></i> 
              <span className="font-medium">Analytics Dashboard</span>
            </a>
            <a 
              href="/moderator/logs" 
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${getActiveClass("/moderator/logs")}`}
              onClick={handleLinkClick}
            >
              <i data-feather="file-text" className="w-5 h-5 text-gray-600"></i> 
              <span className="font-medium">Moderation Logs</span>
            </a>
            <a 
              href="/moderator/settings" 
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${getActiveClass("/moderator/settings")}`}
              onClick={handleLinkClick}
            >
              <i data-feather="settings" className="w-5 h-5 text-gray-600"></i> 
              <span className="font-medium">Moderator Settings</span>
            </a>
          </div>

          {/* Help Section */}
          <div className="menu-group">
            <div className="menu-title text-gray-700 uppercase text-xs font-bold mb-3 px-2 tracking-wider border-b border-gray-200 pb-3">
              SUPPORT
            </div>
            <a 
              href="/moderator/help" 
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${getActiveClass("/moderator/help")}`}
              onClick={handleLinkClick}
            >
              <i data-feather="help-circle" className="w-5 h-5 text-blue-600"></i> 
              <span className="font-medium">Help & Documentation</span>
            </a>
            <a 
              href="/moderator/guidelines" 
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${getActiveClass("/moderator/guidelines")}`}
              onClick={handleLinkClick}
            >
              <i data-feather="file" className="w-5 h-5 text-green-600"></i> 
              <span className="font-medium">Guidelines</span>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-5 bg-gray-50 border-t border-gray-300">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-green-700">Online</span>
          </div>
          <div className="text-center text-xs text-gray-700 font-semibold">
            MODERATOR ACCESS LEVEL
          </div>
          <div className="text-center text-xs text-gray-600 mt-1">
            Version 2.1.0
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && isMobile && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
          aria-hidden="true"
        ></div>
      )}
    </div>
  );
};

export default ModeratorSidebar;