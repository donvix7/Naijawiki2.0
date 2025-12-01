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
    <div className="admin">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="w-full mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <a href="/moderator" className="flex items-center gap-3 text-gray-400 hover:text-gray-700 transition-colors">
                <i data-feather="book-open" className="w-5 h-5"></i>
                <span className="text-base font-semibold">NaijaLingo Moderator</span>
              </a>
            </div>

            {/* User Menu */}
            <div className="flex items-center">
              {/* User dropdown */}
              <div className="relative dropdown" ref={dropdownRef}>
                <button 
                  onClick={toggleDropdown}
                  className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors p-2 rounded-md"
                  aria-label="User menu"
                  aria-expanded={dropdownOpen}
                >
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center font-semibold text-sm text-white">
                    MO
                  </div>
                  <span className="hidden sm:block text-sm font-medium">
                    Moderator
                  </span>
                  <i 
                    data-feather="chevron-down" 
                    className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                  ></i>
                </button>

                {/* Dropdown menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
                    <a 
                      href="/moderator/profile" 
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <i data-feather="user" className="w-4 h-4 text-gray-500"></i>
                      <span className="font-medium">Profile</span>
                    </a>
                    <a 
                      href="/moderator/settings" 
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <i data-feather="settings" className="w-4 h-4 text-gray-500"></i>
                      <span className="font-medium">Settings</span>
                    </a>
                    <div className="border-t border-gray-200 my-1"></div>
                    <a
                      href="/logout"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <i data-feather="log-out" className="w-4 h-4"></i>
                      <span className="font-medium">Logout</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default ModeratorNavbar;