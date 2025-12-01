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
      ? "bg-yellow-500 text-white font-semibold shadow-sm border-l-4 border-white"
      : "text-gray-300 hover:bg-gray-700 hover:text-white transition-all duration-200";

  // Close sidebar when clicking on a link (mobile only)
  const handleLinkClick = () => {
    if (isMobile) {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative admin-sidebar">
      {/* Mobile Toggle Button */}
      <button
        ref={toggleButtonRef}
        onClick={toggleSidebar}
        className="admin-sidebar-toggle md:hidden fixed top-4 left-4 z-[60] bg-yellow-500 text-white p-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        aria-expanded={isOpen}
        style={{ zIndex: 9999 }}
      >
        <i data-feather={isOpen ? "x" : "menu"} className="w-4 h-4"></i>
      </button>

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`admin-sidebar-panel fixed top-0 left-0 h-full w-72 bg-gray-800 text-white border-r border-gray-700 shadow-lg 
          transition-transform duration-300 ease-in-out z-50
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static md:w-64`}
        aria-hidden={!isOpen && isMobile}
        style={{ zIndex: 9998 }}
      >
        {/* Sidebar Header */}
        <div className="admin-sidebar-header px-6 py-5 border-b border-gray-700 bg-gray-800 text-white flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-3">
            <i data-feather="settings" className="w-5 h-5"></i> 
            <span className="text-base">
              Admin Panel
            </span>
          </h2>
          <button
            onClick={toggleSidebar}
            className="admin-sidebar-close md:hidden hover:bg-gray-700 p-2 rounded transition-colors duration-200"
            aria-label="Close sidebar"
          >
            <i data-feather="x" className="w-4 h-4"></i>
          </button>
        </div>

        {/* Sidebar Scrollable Content */}
        <div className="admin-sidebar-content px-4 py-6 space-y-6 overflow-y-auto h-[calc(100%-5rem)]">
          {/* MAIN */}
          <div className="admin-sidebar-section">
            <p className="text-gray-400 uppercase text-xs font-semibold mb-3 tracking-wider border-b border-gray-700 pb-2 admin-sidebar-section-title">
              Main
            </p>
            <a
              href="/admin/dashboard"
              className={`admin-sidebar-link flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium ${getActiveClass(
                "/admin/dashboard"
              )}`}
              onClick={handleLinkClick}
            >
              <i data-feather="home" className="w-4 h-4"></i> 
              <span>Dashboard</span>
            </a>
          </div>

          {/* CONTENT */}
          <div className="admin-sidebar-section">
            <p className="text-gray-400 uppercase text-xs font-semibold mb-3 tracking-wider border-b border-gray-700 pb-2 admin-sidebar-section-title">
              Content Management
            </p>
            <a
              href="/admin/word"
              className={`admin-sidebar-link flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium ${getActiveClass(
                "/admin/word"
              )}`}
              onClick={handleLinkClick}
            >
              <i data-feather="book" className="w-4 h-4"></i> 
              <span>Words</span>
            </a>
          </div>

          {/* USERS */}
          <div className="admin-sidebar-section">
            <p className="text-gray-400 uppercase text-xs font-semibold mb-3 tracking-wider border-b border-gray-700 pb-2 admin-sidebar-section-title">
              User Management
            </p>
            <div className="space-y-2">
              <a
                href="/admin/users"
                className={`admin-sidebar-link flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium ${getActiveClass(
                  "/admin/users"
                )}`}
                onClick={handleLinkClick}
              >
                <i data-feather="users" className="w-4 h-4"></i> 
                <span>Manage Users</span>
              </a>
              <a
                href="/admin/roles"
                className={`admin-sidebar-link flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium ${getActiveClass(
                  "/admin/roles"
                )}`}
                onClick={handleLinkClick}
              >
                <i data-feather="shield" className="w-4 h-4"></i> 
                <span>Roles & Permissions</span>
              </a>
            </div>
          </div>

          {/* SYSTEM */}
          <div className="admin-sidebar-section">
            <p className="text-gray-400 uppercase text-xs font-semibold mb-3 tracking-wider border-b border-gray-700 pb-2 admin-sidebar-section-title">
              System
            </p>
            <a
              href="/admin/settings"
              className={`admin-sidebar-link flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium ${getActiveClass(
                "/admin/settings"
              )}`}
              onClick={handleLinkClick}
            >
              <i data-feather="sliders" className="w-4 h-4"></i> 
              <span>Settings</span>
            </a>
            <a
              href="/admin/activity"
              className={`admin-sidebar-link flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium ${getActiveClass(
                "/admin/activity"
              )}`}
              onClick={handleLinkClick}
            >
              <i data-feather="activity" className="w-4 h-4"></i> 
              <span>Activity</span>
            </a>
          </div>

          {/* QUICK ACTIONS */}
          <div className="admin-sidebar-section pt-4 border-t border-gray-700">
            <p className="text-gray-400 uppercase text-xs font-semibold mb-3 tracking-wider admin-sidebar-section-title">
              Quick Actions
            </p>
            <div className="space-y-2">
              <a
                href="/"
                className="admin-sidebar-link flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium bg-gray-700 text-white hover:bg-gray-600 transition-all duration-200"
                onClick={handleLinkClick}
              >
                <i data-feather="globe" className="w-4 h-4"></i>
                <span>View Site</span>
              </a>
              <a
                href="/profile"
                className="admin-sidebar-link flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium bg-gray-700 text-white hover:bg-gray-600 transition-all duration-200"
                onClick={handleLinkClick}
              >
                <i data-feather="user" className="w-4 h-4"></i>
                <span>My Profile</span>
              </a>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && isMobile && (
        <div
          onClick={toggleSidebar}
          className="admin-sidebar-overlay fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
          aria-hidden="true"
          style={{ zIndex: 9997 }}
        />
      )}
    </div>
  );
};

export default AdminSidebar;