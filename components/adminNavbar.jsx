"use client";
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react'
import feather from 'feather-icons';

const AdminNavbar = () => {
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    // Check for token and email in cookies
    const token = Cookies.get("token");
    const email = Cookies.get("email");
    const role = Cookies.get("role");

    if (token && email && role === "admin") {
      setUser({ role, email });
    } else {
      setUser(null);
    }

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Initialize feather icons
  useEffect(() => {
    feather.replace();
  }, [isDropdownOpen]);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("email");
    Cookies.remove("role");
    setUser(null);
    window.location.href = "/";
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="admin">
      <nav className="bg-gray-800 shadow-sm border-b border-gray-700">
        <div className="w-full mx-auto px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand - Left side */}
            <a href="/admin/" className="flex items-center gap-3 text-white hover:text-gray-300 transition-colors">
              <i data-feather="book-open" className="w-5 h-5"></i>
              <span className="text-base font-semibold">NaijaLingo {user && `(${user.role})`}</span>
            </a>

            {/* User Menu - Right side */}
            <div className="flex items-center">
              {/* User dropdown */}
              <div className="relative dropdown">
                <button 
                  onClick={toggleDropdown}
                  className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors p-2 rounded-md"
                  aria-label="User menu"
                  aria-expanded={isDropdownOpen}
                >
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center font-semibold text-sm text-white">
                    {user?.email?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-white">
                    {user?.email || user?.role || "Admin"}
                  </span>
                  <i 
                    data-feather="chevron-down" 
                    className={`w-4 h-4 transition-transform text-white ${isDropdownOpen ? 'rotate-180' : ''}`}
                  ></i>
                </button>

                {/* Dropdown menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
                    <a 
                      href="/profile" 
                      className="dropdown-item flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <i data-feather="user" className="w-4 h-4 text-gray-500"></i>
                      <span className="font-medium">Profile</span>
                    </a>
                    <a 
                      href="/admin/settings" 
                      className="dropdown-item flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <i data-feather="settings" className="w-4 h-4 text-gray-500"></i>
                      <span className="font-medium">Settings</span>
                    </a>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="dropdown-item flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors duration-200"
                    >
                      <i data-feather="log-out" className="w-4 h-4"></i>
                      <span className="font-medium">Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default AdminNavbar