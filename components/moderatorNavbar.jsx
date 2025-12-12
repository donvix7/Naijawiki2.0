"use client";
import React, { useState, useEffect, useRef } from "react";
import {
  BookOpen,
  User,
  Settings,
  LogOut,
  ChevronDown,
  Shield,
  Bell,
  Search,
  Menu,
  Filter,
  CheckCircle,
  AlertCircle
} from "lucide-react";

const ModeratorNavbar = ({ onMenuToggle }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [pendingReviews, setPendingReviews] = useState(5);
  const [notifications, setNotifications] = useState([]);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Handle scroll effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    // Mock notifications for moderator
    setNotifications([
      { id: 1, text: 'New word submission awaiting review', time: '2 min ago', unread: true, type: 'warning' },
      { id: 2, text: 'User report requires attention', time: '15 min ago', unread: true, type: 'alert' },
      { id: 3, text: '3 translations approved', time: '1 hour ago', unread: false, type: 'success' },
      { id: 4, text: 'System maintenance scheduled', time: '3 hours ago', unread: false, type: 'info' }
    ]);

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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

  const toggleDropdown = () => setDropdownOpen((prev) => !prev);

  const unreadNotifications = notifications.filter(n => n.unread).length;

  return (
    <div className="moderator">
      <nav className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isScrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50' 
          : 'bg-gradient-to-r from-gray-50 to-white border-b border-gray-100'
        }
      `}>
        <div className="w-full mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Left side - Logo and Menu Toggle */}
            <div className="flex items-center gap-6">
              

              {/* Logo and Brand */}
              <a 
                href="/moderator" 
                className="flex items-center gap-3 group"
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                    <BookOpen size={20} className="text-white" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-gray-900 tracking-tight">
                    NaijaLingo
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                      Moderator Panel
                    </span>
                  </div>
                </div>
              </a>
            </div>

        

            {/* Right side - User controls */}
            <div className="flex items-center gap-4">
            


              

              {/* User dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={toggleDropdown}
                  className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-gray-50 transition-colors group"
                  aria-label="Moderator menu"
                  aria-expanded={dropdownOpen}
                >
                  <div className="relative">
                    <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-sm group-hover:shadow transition-shadow">
                      <span className="text-white font-bold text-sm">
                        MO
                      </span>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  
                  <div className="hidden lg:block text-left">
                    <div className="font-semibold text-gray-900 text-sm leading-tight">
                      Moderator
                    </div>
                    <div className="text-xs text-amber-600 font-medium">
                      Content Management
                    </div>
                  </div>
                  
                  <ChevronDown 
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Dropdown menu */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl py-2 z-50 border border-gray-100 overflow-hidden">
                    {/* Moderator info header */}
                    <div className="px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-amber-50 to-orange-50">
                      <div className="font-bold text-gray-900 text-sm">
                        Content Moderator
                      </div>
                      <div className="text-xs text-amber-600 mt-0.5 font-medium">
                        {unreadNotifications} items pending review
                      </div>
                    </div>

                    {/* Menu items */}
                    <a 
                      href="/moderator" 
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 group/item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center group-hover/item:bg-blue-100 transition-colors">
                        <User size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">Dashboard</div>
                        <div className="text-xs text-gray-500">Overview & statistics</div>
                      </div>
                    </a>
                    <a href="/profile"
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 group/item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center group-hover/item:bg-green-100 transition-colors">
                        <Shield size={16} className="text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium">My Profile</div>
                        <div className="text-xs text-gray-500">View & edit profile</div>
                      </div>
                    </a>

                    
                    

                    {/* Divider */}
                    <div className="border-t border-gray-100 my-1"></div>

                    {/* Logout */}
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        window.location.href = "/logout";
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 group/item"
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center group-hover/item:bg-red-100 transition-colors">
                        <LogOut size={16} className="text-red-600" />
                      </div>
                      <div>
                        <div className="font-medium">Logout</div>
                        <div className="text-xs text-red-500">Sign out of moderator panel</div>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Spacer to prevent content from hiding under fixed navbar */}
      <div className="h-16 lg:h-20"></div>
    </div>
  );
};

export default ModeratorNavbar;