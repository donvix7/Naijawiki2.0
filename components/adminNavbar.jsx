"use client";
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react'

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
      <nav className="bg-white shadow-sm justify-between">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 justify-between">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center ">
              <a href="/admin/" className="flex items-center space-x-3 text-gray-900 hover:text-gray-700 transition-colors">
                <i data-feather="book-open" className="w-6 h-6"></i>
                <span className="text-lg font-bold">NaijaLingo {user && `(${user.role})`}</span>
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
                    {user?.email?.charAt(0).toUpperCase() || 'A'}
                  </div>
                  <span className="hidden sm:block text-sm font-medium">
                    {user?.email || 'Admin'}
                  </span>
                  <i 
                    data-feather="chevron-down" 
                    className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                  ></i>
                </button>

                {/* Dropdown menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                    <a 
                      href="/admin/profile" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    >
                      <i data-feather="user" className="w-4 h-4 mr-3"></i>
                      Profile
                    </a>
                    <a 
                      href="/admin/settings" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <i data-feather="settings" className="w-4 h-4 mr-3"></i>
                      Settings
                    </a>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <i data-feather="log-out" className="w-4 h-4 mr-3"></i>
                      Logout
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