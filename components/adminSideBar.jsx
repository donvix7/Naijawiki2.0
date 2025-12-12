"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import feather from "feather-icons";

const AdminSidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sidebarRef = useRef(null);
  const toggleButtonRef = useRef(null);

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

  // Update feather icons
  useEffect(() => {
    feather.replace();
  }, [pathname, isOpen]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && isOpen) {
        const sidebar = sidebarRef.current;
        const toggleButton = toggleButtonRef.current;
        
        if (sidebar && 
            !sidebar.contains(event.target) && 
            toggleButton && 
            !toggleButton.contains(event.target)) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMobile, isOpen]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isMobile) {
      if (isOpen) {
        document.body.style.overflow = "hidden";
        document.body.style.touchAction = "none";
      } else {
        document.body.style.overflow = "unset";
        document.body.style.touchAction = "unset";
      }
    }

    return () => {
      document.body.style.overflow = "unset";
      document.body.style.touchAction = "unset";
    };
  }, [isOpen, isMobile]);

  const toggleSidebar = () => {
    setIsOpen((prev) => !prev);
  };

  const getActiveClass = (path) =>
    pathname === path
      ? "bg-yellow-600 text-white font-semibold shadow-sm border-l-4 border-white"
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
        ref={toggleButtonRef}
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 bg-yellow-600 text-white p-3 rounded-lg shadow-lg hover:shadow-xl hover:bg-yellow-700 transition-all duration-200"
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        aria-expanded={isOpen}
      >
        <i data-feather={isOpen ? "x" : "menu"} className="w-5 h-5"></i>
      </button>

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 md:static md:w-64`}
        aria-hidden={!isOpen && isMobile}
      >
        {/* Sidebar Header */}
        <div className="sidebar-header px-6 py-5 border-b border-gray-300 bg-white flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-3">
            <i data-feather="settings" className="w-6 h-6 text-yellow-600"></i> 
            <span className="text-lg font-bold">Admin Panel</span>
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
              href="/admin/dashboard" 
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${getActiveClass("/admin/dashboard")}`}
              onClick={handleLinkClick}
            >
              <i data-feather="home" className="w-5 h-5"></i> 
              <span className="font-medium">Dashboard</span>
            </a>
          </div>

          {/* Content Management Section */}
          <div className="menu-group">
            <div className="menu-title text-gray-700 uppercase text-xs font-bold mb-3 px-2 tracking-wider border-b border-gray-200 pb-3">
              CONTENT MANAGEMENT
            </div>
            <a 
              href="/admin/word" 
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${getActiveClass("/admin/words")}`}
              onClick={handleLinkClick}
            >
              <i data-feather="book" className="w-5 h-5 text-blue-500"></i> 
              <span className="font-medium">Word Management</span>
            </a>
            
          </div>

          {/* User Management Section */}
          <div className="menu-group">
            <div className="menu-title text-gray-700 uppercase text-xs font-bold mb-3 px-2 tracking-wider border-b border-gray-200 pb-3">
              USER MANAGEMENT
            </div>
            <a 
              href="/admin/users" 
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${getActiveClass("/admin/users")}`}
              onClick={handleLinkClick}
            >
              <i data-feather="users" className="w-5 h-5 text-blue-500"></i> 
              <span className="font-medium">Manage Users</span>
            </a>
            
          </div>

          {/* System Management Section */}
          <div className="menu-group">
            <div className="menu-title text-gray-700 uppercase text-xs font-bold mb-3 px-2 tracking-wider border-b border-gray-200 pb-3">
              SYSTEM MANAGEMENT
            </div>
            
            
            <a 
              href="/admin/activity" 
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 ${getActiveClass("/admin/activity")}`}
              onClick={handleLinkClick}
            >
              <i data-feather="activity" className="w-5 h-5 text-red-500"></i> 
              <span className="font-medium">Activity Logs</span>
            </a>
          </div>

          

          {/* Quick Actions */}
          <div className="menu-group pt-4 border-t border-gray-200">
            <div className="menu-title text-gray-700 uppercase text-xs font-bold mb-3 px-2 tracking-wider border-b border-gray-200 pb-3">
              QUICK ACTIONS
            </div>
            <a 
              href="/" 
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-all duration-200"
              onClick={handleLinkClick}
            >
              <i data-feather="globe" className="w-5 h-5 text-blue-500"></i> 
              <span className="font-medium">View Live Site</span>
            </a>
            
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-5 bg-gray-50 border-t border-gray-300">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-green-700">System Online</span>
          </div>
          <div className="text-center text-xs text-gray-700 font-semibold">
            ADMINISTRATOR ACCESS LEVEL
          </div>
          <div className="text-center text-xs text-gray-600 mt-1">
            Super Admin • v2.1.0
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

export default AdminSidebar;