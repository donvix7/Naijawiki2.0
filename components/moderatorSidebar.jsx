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
      ? "bg-yellow text-white font-semibold shadow-sm border-l-4 border-white"
      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-200";

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
        className="md:hidden fixed top-4 left-4 z-50 bg-yellow-500 text-white p-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        aria-expanded={isOpen}
      >
        <i data-feather={isOpen ? "x" : "menu"} className="w-4 h-4"></i>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 shadow-sm transform transition-transform duration-300 ease-in-out z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:w-60`}
        aria-hidden={!isOpen && isMobile}
      >
        {/* Sidebar Header */}
        <div className="sidebar-header px-6 py-5 border-b border-gray-200 bg-white flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-3">
            <i data-feather="shield" className="w-5 h-5 text-yellow-500"></i> 
            <span className="text-base">Moderator Panel</span>
          </h2>
          <button 
            onClick={toggleSidebar} 
            className="md:hidden text-gray-500 hover:text-gray-700 p-1 rounded transition-colors duration-200"
            aria-label="Close sidebar"
          >
            <i data-feather="x" className="w-4 h-4"></i>
          </button>
        </div>

        {/* Sidebar Menu */}
        <div className="sidebar-menu px-4 py-6 space-y-6 overflow-y-auto h-[calc(100%-5rem)]">
          {/* Main Section */}
          <div className="menu-group">
            <div className="menu-title text-gray-500 uppercase text-xs font-semibold mb-3 px-2 tracking-wider border-b border-gray-100 pb-2">
              Main
            </div>
            <a 
              href="/moderator" 
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${getActiveClass("/moderator")}`}
              onClick={handleLinkClick}
            >
              <i data-feather="home" className="w-4 h-4"></i> 
              <span>Dashboard</span>
            </a>
          </div>

          {/* Community Section */}
          <div className="menu-group">
            <div className="menu-title text-gray-500 uppercase text-xs font-semibold mb-3 px-2 tracking-wider border-b border-gray-100 pb-2">
              Community
            </div>
            <a 
              href="/moderator/users" 
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${getActiveClass("/moderator/users")}`}
              onClick={handleLinkClick}
            >
              <i data-feather="users" className="w-4 h-4"></i> 
              <span>User Management</span>
            </a>
            <a 
              href="/moderator/reports" 
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${getActiveClass("/moderator/reports")}`}
              onClick={handleLinkClick}
            >
              <i data-feather="alert-circle" className="w-4 h-4"></i> 
              <span>Reports</span>
            </a>
          </div>

          {/* Tools Section */}
          <div className="menu-group">
            <div className="menu-title text-gray-500 uppercase text-xs font-semibold mb-3 px-2 tracking-wider border-b border-gray-100 pb-2">
              Tools
            </div>
            <a 
              href="/moderator/analytics" 
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${getActiveClass("/moderator/analytics")}`}
              onClick={handleLinkClick}
            >
              <i data-feather="bar-chart" className="w-4 h-4"></i> 
              <span>Analytics</span>
            </a>
            <a 
              href="/moderator/settings" 
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${getActiveClass("/moderator/settings")}`}
              onClick={handleLinkClick}
            >
              <i data-feather="settings" className="w-4 h-4"></i> 
              <span>Settings</span>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-50 border-t border-gray-200">
          <div className="text-center text-xs text-gray-500 font-medium">
            Moderator Access
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && isMobile && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden transition-opacity duration-300"
          aria-hidden="true"
        ></div>
      )}
    </div>
  );
};

export default ModeratorSidebar;