"use client";
import React, { useState, useEffect, useRef } from "react";
import feather from "feather-icons";

const ModeratorNavbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Initialize feather icons whenever dropdown changes
  useEffect(() => {
    feather.replace();
  }, [dropdownOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Toggle dropdown visibility
  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  return (
    <header className="moderator w-full bg-gray-900 text-white shadow-md">
      <nav className="flex justify-between items-center px-6 py-3">
        {/* Logo */}
        <a
          href="/moderator"
          className="logo flex items-center gap-2 text-lg font-semibold hover:text-blue-400 transition-colors"
        >
          <i data-feather="book-open" className="logo-icon"></i>
          NaijaLingo Moderator
        </a>

        {/* Mobile menu button (placeholder for future sidebar toggle) */}
        <button
          className="mobile-menu-btn md:hidden p-2 rounded-md hover:bg-gray-800 focus:outline-none"
          aria-label="Toggle menu"
        >
          <i data-feather="menu"></i>
        </button>

        {/* User Dropdown */}
        <div className="user-menu relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="user-avatar bg-blue-700 text-white font-semibold rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-600 transition"
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
            aria-label="User menu"
          >
            MO
          </button>

          {/* Dropdown content */}
          {dropdownOpen && (
            <div className="dropdown-content absolute right-0 mt-2 w-48 bg-gray-800 text-gray-200 rounded-lg shadow-lg overflow-hidden animate-fade-in z-50">
              <a
                href="/moderator/profile"
                className="dropdown-item flex items-center gap-2 px-4 py-2 hover:bg-gray-700 transition"
              >
                <i data-feather="user"></i> Profile
              </a>
              <a
                href="/moderator/settings"
                className="dropdown-item flex items-center gap-2 px-4 py-2 hover:bg-gray-700 transition"
              >
                <i data-feather="settings"></i> Settings
              </a>
              <a
                href="/logout"
                className="dropdown-item flex items-center gap-2 px-4 py-2 hover:bg-gray-700 transition text-red-400 hover:text-red-300"
              >
                <i data-feather="log-out"></i> Logout
              </a>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};

export default ModeratorNavbar;
