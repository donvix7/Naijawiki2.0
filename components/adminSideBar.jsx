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

  // REMOVED: Auto-close sidebar on route change - this was causing the issue
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
      ? "bg-[var(--primary)] text-[var(--neutral)] font-bold shadow-lg border-l-4 border-white"
      : "text-[var(--text-light)] hover:bg-[var(--neutral-light)] hover:text-white transition-all duration-200";

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
        className="admin-sidebar-toggle md:hidden fixed top-4 left-4 z-[60] bg-[var(--primary)] text-[var(--neutral)] p-3 rounded-xl shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200 font-bold"
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        aria-expanded={isOpen}
        style={{ zIndex: 9999 }}
      >
        <i data-feather={isOpen ? "x" : "menu"} className="w-5 h-5"></i>
      </button>

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        className={`admin-sidebar-panel fixed top-0 left-0 h-full w-80 bg-[var(--neutral)] text-[var(--text-light)] border-r border-[var(--neutral-light)] shadow-2xl 
          transition-transform duration-300 ease-in-out z-50
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static md:w-72`}
        aria-hidden={!isOpen && isMobile}
        style={{ zIndex: 9998 }}
      >
        {/* Sidebar Header */}
        <div className="admin-sidebar-header px-6 py-5 border-b border-[var(--neutral-light)] bg-[var(--neutral)] text-[var(--text-light)] flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-3">
            <i data-feather="settings" className="w-6 h-6"></i> 
            <span className="bg-clip-text text-lg text-white ">
              Admin Panel
            </span>
          </h2>
          <button
            onClick={toggleSidebar}
            className="admin-sidebar-close md:hidden hover:bg-white/20 p-2 rounded-lg transition-colors duration-200"
            aria-label="Close sidebar"
          >
            <i data-feather="x" className="w-5 h-5"></i>
          </button>
        </div>

        {/* Sidebar Scrollable Content */}
        <div className="admin-sidebar-content px-5 py-6 space-y-8 overflow-y-auto h-[calc(100%-5rem)] ">
          {/* MAIN */}
          <div className="admin-sidebar-section text-[var(--neutral)]">
            <p className="text-[var(--gray)] uppercase text-sm font-bold mb-4 tracking-wider border-b border-[var(--neutral-light)] pb-2 admin-sidebar-section-title">
              Main
            </p>
            <a
              href="/admin/dashboard"
              className={`admin-sidebar-link flex items-center gap-4 px-4 py-3 rounded-xl text-lg font-semibold  text-[var(--neutral)]${getActiveClass(
                "/admin/dashboard"
              )}`}
              onClick={handleLinkClick}
            >
              <i data-feather="home" className="w-5 h-5"></i> 
              <span className="">Dashboard</span>
            </a>
          </div>

          {/* CONTENT */}
          <div className="admin-sidebar-section text-[var(--neutral)]">
            <p className="text-[var(--gray-medium)] uppercase text-sm font-bold mb-4 tracking-wider border-b border-[var(--neutral-light)] pb-2 admin-sidebar-section-title">
              Content Management
            </p>
            <a
              href="/admin/word"
              className={`admin-sidebar-link flex items-center gap-4 px-4 py-3 rounded-xl text-lg font-semibold  text-[var(--neutral)]${getActiveClass(
                "/admin/word"
              )}`}
              onClick={handleLinkClick}
            >
              <i data-feather="book" className="w-5 h-5"></i> 
              <span className="">Words</span>
            </a>
          </div>

          {/* USERS */}
          <div className="admin-sidebar-section text-[var(--neutral)]">
            <p className="text-[var(--gray-medium)] uppercase text-sm font-bold mb-4 tracking-wider border-b border-[var(--neutral-light)] pb-2 admin-sidebar-section-title">
              User Management
            </p>
            <div className="space-y-3">
            <a
              href="/admin/users"
              className={`admin-sidebar-link flex items-center gap-4 px-4 py-3 rounded-xl text-lg font-semibold  text-[var(--neutral)]${getActiveClass(
                "/admin/users"
              )}`}
              onClick={handleLinkClick}
            >
              <i data-feather="users" className="w-5 h-5"></i> 
              <span className="">Manage Users</span>
            </a>
            <a
              href="/admin/roles"
              className={`admin-sidebar-link flex items-center gap-4 px-4 py-3 rounded-xl text-lg font-semibold  text-[var(--neutral)]${getActiveClass(
                "/admin/roles"
              )}`}
              onClick={handleLinkClick}
            >
              <i data-feather="shield" className="w-5 h-5"></i> 
              <span className="">Roles & permissions</span>
            </a>
            </div>
            
          </div>

          {/* SYSTEM */}
          <div className="admin-sidebar-section text-[var(--neutral)]">
            <p className="text-[var(--gray-medium)] uppercase text-sm font-bold mb-4 tracking-wider border-b border-[var(--neutral-light)] pb-2 admin-sidebar-section-title">
              System
            </p>
            <a
              href="/admin/settings"
              className={`admin-sidebar-link flex items-center gap-4 px-4 py-3 rounded-xl text-lg font-semibold  text-[var(--neutral)]${getActiveClass(
                "/admin/settings"
              )}`}
              onClick={handleLinkClick}
            >
              <i data-feather="sliders" className="w-5 h-5"></i> 
              <span className="">Settings</span>
            </a>
            <a
              href="/admin/activity"
              className={`admin-sidebar-link flex items-center gap-4 px-4 py-3 rounded-xl text-lg font-semibold  text-[var(--neutral)]${getActiveClass(
                "/admin/activity"
              )}`}
              onClick={handleLinkClick}
            >
              <i data-feather="activity" className="w-5 h-5"></i> 
              <span className="">Activity</span>
            </a>
          </div>

          {/* QUICK ACTIONS */}
          <div className="admin-sidebar-section pt-4 border-t border-[var(--neutral-light)]">
            <p className="text-[var(--gray-medium)] uppercase text-sm font-bold mb-4 tracking-wider admin-sidebar-section-title">
              Quick Actions
            </p>
            <div className="space-y-3">
              <a
                href="/"
                className="admin-sidebar-link flex items-center gap-4 px-4 py-3 rounded-xl text-lg font-semibold bg-[var(--neutral-light)] text-[var(--text-light)] hover:bg-[var(--gray-dark)] transition-all duration-200"
                onClick={handleLinkClick}
              >
                <i data-feather="globe" className="w-5 h-5"></i>
                <span>View Site</span>
              </a>
              <a
                href="/profile"
                className="admin-sidebar-link flex items-center gap-4 px-4 py-3 rounded-xl text-lg font-semibold bg-[var(--neutral-light)] text-[var(--text-light)] hover:bg-[var(--gray-dark)] transition-all duration-200"
                onClick={handleLinkClick}
              >
                <i data-feather="user" className="w-5 h-5"></i>
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