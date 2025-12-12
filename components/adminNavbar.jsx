"use client";
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
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
  X
} from 'lucide-react';

const AdminNavbar = ({ onMenuToggle }) => {
  const [user, setUser] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [notifications, setNotifications] = useState([]);

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

    // Handle scroll effect
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (!event.target.closest('.user-dropdown')) {
        setIsDropdownOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    document.addEventListener('click', handleClickOutside);
    
    // Mock notifications
    setNotifications([
      { id: 1, text: 'New user registration', time: '5 min ago', unread: true },
      { id: 2, text: 'Dictionary update completed', time: '1 hour ago', unread: true },
      { id: 3, text: 'System backup successful', time: '2 hours ago', unread: false }
    ]);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('click', handleClickOutside);
    };
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

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="admin">
      <nav className={`
        fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${isScrolled 
          ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/50' 
          : 'bg-white border-b border-gray-100'
        }
      `}>
        <div className="w-full mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-20">
            {/* Left side - Logo and Menu Toggle */}
            <div className="flex items-center gap-6">
              

              {/* Logo and Brand */}
              <a 
                href="/admin/dashboard" 
                className="flex items-center gap-3 group"
              >
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                    <BookOpen size={20} className="text-white" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-gray-900 tracking-tight">
                    NaijaLingo
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                      Admin Panel
                    </span>
                  </div>
                </div>
              </a>
            </div>

            

            {/* Right side - User controls */}
            <div className="flex items-center gap-4">
           

              

              {/* User dropdown */}
              <div className="relative user-dropdown">
                <button 
                  onClick={toggleDropdown}
                  className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-gray-50 transition-colors group"
                  aria-label="User menu"
                  aria-expanded={isDropdownOpen}
                >
                  <div className="relative">
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-sm group-hover:shadow transition-shadow">
                      <span className="text-white font-semibold text-sm">
                        {user?.email?.charAt(0).toUpperCase() || 'A'}
                      </span>
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  
                  <div className="hidden lg:block text-left">
                    <div className="font-semibold text-gray-900 text-sm leading-tight">
                      {user?.email?.split('@')[0] || 'Admin'}
                    </div>
                    <div className="text-xs text-gray-500 font-medium">
                      {user?.role || 'Administrator'}
                    </div>
                  </div>
                  
                  <ChevronDown 
                    className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* Dropdown menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl py-2 z-50 border border-gray-100 overflow-hidden">
                    {/* User info header */}
                    <div className="px-4 py-3 border-b border-gray-100">
                      <div className="font-semibold text-gray-900 text-sm">
                        {user?.email || 'admin@naijalingo.com'}
                      </div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        Super Administrator
                      </div>
                    </div>

                    {/* Menu items */}
                    <a 
                      href="/profile" 
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 group/item"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center group-hover/item:bg-blue-100 transition-colors">
                        <User size={16} className="text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">My Profile</div>
                        <div className="text-xs text-gray-500">View and edit profile</div>
                      </div>
                    </a>
                    
                    <a 
                      href="/settings" 
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200 group/item"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      
                    </a>

                    {/* Divider */}
                    <div className="border-t border-gray-100 my-1"></div>

                    {/* Logout */}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200 group/item"
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center group-hover/item:bg-red-100 transition-colors">
                        <LogOut size={16} className="text-red-600" />
                      </div>
                      <div>
                        <div className="font-medium">Logout</div>
                        <div className="text-xs text-red-500">Sign out of admin panel</div>
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

export default AdminNavbar;