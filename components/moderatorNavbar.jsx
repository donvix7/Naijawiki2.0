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
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <a href="/moderator" className="flex items-center space-x-3 text-gray-900 hover:text-gray-700 transition-colors">
                <i data-feather="book-open" className="w-6 h-6"></i>
                <span className="text-lg font-bold">NaijaLingo Moderator</span>
              </a>
            </div>

            {/* User Menu */}
            <div className="flex items-center">
              {/* User dropdown */}
              <div className="relative dropdown">
                <button 
                  onClick={toggleDropdown}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition-colors p-2 rounded-md"
                >
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center font-semibold text-sm">
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
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                    <a 
                      href="/moderator/profile" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <i data-feather="user" className="w-4 h-4 mr-3"></i>
                      Profile
                    </a>
                    <a 
                      href="/moderator/settings" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <i data-feather="settings" className="w-4 h-4 mr-3"></i>
                      Settings
                    </a>
                    <a
                      href="/logout"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <i data-feather="log-out" className="w-4 h-4 mr-3"></i>
                      Logout
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