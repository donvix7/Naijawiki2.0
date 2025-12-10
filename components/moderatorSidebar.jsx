"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Shield,
  Home,
  Book,
  BarChart2,
  Settings,
  HelpCircle,
  FileText,
  Menu,
  X,
  ChevronRight,
  CheckCircle,
  AlertCircle,
  Users,
  Filter,
  TrendingUp,
  Eye
} from "lucide-react";

const ModeratorSidebar = ({ onToggle }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024; // Using lg breakpoint (1024px)
      setIsMobile(mobile);
      if (!mobile) {
        setIsOpen(true); // Always open on desktop
      } else {
        setIsOpen(false); // Closed by default on mobile
      }
    };

    // Check on mount
    checkMobile();
    
    // Add resize listener
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    if (onToggle) onToggle(newState);
  };

  const getActiveClass = (path) => {
    // Check if current path starts with the given path for nested routes
    const isActive = pathname === path || pathname.startsWith(`${path}/`);
    return isActive
      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-lg border-l-4 border-white"
      : "text-gray-800 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 hover:text-gray-900 hover:shadow-sm transition-all duration-200";
  };

  // Close sidebar when clicking on a link (mobile only)
  const handleLinkClick = () => {
    if (isMobile) {
      setIsOpen(false);
      if (onToggle) onToggle(false);
    }
  };

  // Close sidebar when clicking outside (mobile only)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && isOpen) {
        const sidebar = document.querySelector('.moderator-sidebar');
        const toggleBtn = document.querySelector('.sidebar-toggle');
        
        if (sidebar && 
            !sidebar.contains(event.target) && 
            toggleBtn && 
            !toggleBtn.contains(event.target)) {
          setIsOpen(false);
          if (onToggle) onToggle(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isMobile, isOpen, onToggle]);

  const menuItems = {
    main: [
      { href: "/moderator", label: "Dashboard", icon: Home, active: pathname === "/moderator" }
    ],
    content: [
      { href: "/moderator/word", label: "Word Reviews", icon: Book, badge: "12" },
    ],
    tools: [
      { href: "/moderator/analytics", label: "Analytics", icon: BarChart2 },
      { href: "/moderator/settings", label: "Settings", icon: Settings }
    ],
    support: [
      { href: "/help", label: "Help Center", icon: HelpCircle },
      { href: "/documentation", label: "Documentation", icon: FileText }
    ]
  };

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={toggleSidebar}
        className="sidebar-toggle lg:hidden fixed top-4 left-4 z-50 bg-gradient-to-r from-amber-600 to-orange-600 text-white p-3 rounded-xl shadow-lg hover:shadow-xl hover:from-amber-700 hover:to-orange-700 transition-all duration-200"
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && isMobile && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`moderator-sidebar fixed lg:static top-0 left-0 h-full w-72 bg-white border-r border-gray-200 shadow-2xl lg:shadow-lg transform transition-transform duration-300 ease-in-out z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0 lg:w-72`}
        aria-hidden={!isOpen && isMobile}
      >
        {/* Sidebar Header */}
        <div className="sidebar-header px-6 py-5 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-orange-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center shadow-md">
              <Shield size={22} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Moderator</h2>
              <p className="text-xs text-amber-700 font-medium">Content Panel</p>
            </div>
          </div>
          <button 
            onClick={toggleSidebar} 
            className="lg:hidden text-gray-600 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Sidebar Menu */}
        <div className="sidebar-menu px-4 py-6 space-y-6 overflow-y-auto h-[calc(100vh-180px)]">
          {/* Main Section */}
          <div className="menu-group">
            <div className="menu-title text-gray-700 uppercase text-xs font-bold mb-3 px-2 tracking-wider border-b border-gray-200 pb-3">
              MAIN NAVIGATION
            </div>
            {menuItems.main.map((item) => (
              <a 
                key={item.href}
                href={item.href} 
                className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${getActiveClass(item.href)}`}
                onClick={handleLinkClick}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} className={pathname === item.href ? "text-white" : "text-amber-600"} />
                  <span className="font-medium">{item.label}</span>
                </div>
                {pathname === item.href && (
                  <ChevronRight size={16} className="text-white" />
                )}
              </a>
            ))}
          </div>

          {/* Content Section */}
          <div className="menu-group">
            <div className="menu-title text-gray-700 uppercase text-xs font-bold mb-3 px-2 tracking-wider border-b border-gray-200 pb-3">
              CONTENT MANAGEMENT
            </div>
            {menuItems.content.map((item) => (
              <a 
                key={item.href}
                href={item.href} 
                className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${getActiveClass(item.href)}`}
                onClick={handleLinkClick}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} className={pathname === item.href ? "text-white" : "text-blue-600"} />
                  <span className="font-medium">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    pathname === item.href 
                      ? "bg-white/20 text-white" 
                      : "bg-red-100 text-red-800"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </a>
            ))}
          </div>

          {/* Tools Section */}
          <div className="menu-group">
            <div className="menu-title text-gray-700 uppercase text-xs font-bold mb-3 px-2 tracking-wider border-b border-gray-200 pb-3">
              TOOLS & ANALYTICS
            </div>
            {menuItems.tools.map((item) => (
              <a 
                key={item.href}
                href={item.href} 
                className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${getActiveClass(item.href)}`}
                onClick={handleLinkClick}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} className={pathname === item.href ? "text-white" : "text-purple-600"} />
                  <span className="font-medium">{item.label}</span>
                </div>
              </a>
            ))}
          </div>

          {/* Support Section */}
          <div className="menu-group">
            <div className="menu-title text-gray-700 uppercase text-xs font-bold mb-3 px-2 tracking-wider border-b border-gray-200 pb-3">
              SUPPORT
            </div>
            {menuItems.support.map((item) => (
              <a 
                key={item.href}
                href={item.href} 
                className={`flex items-center justify-between gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${getActiveClass(item.href)}`}
                onClick={handleLinkClick}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} className={pathname === item.href ? "text-white" : "text-green-600"} />
                  <span className="font-medium">{item.label}</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-r from-gray-50 to-white border-t border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-green-700">Online</span>
          </div>
          <div className="text-center text-xs text-gray-700 font-semibold mb-1">
            MODERATOR ACCESS LEVEL
          </div>
          <div className="text-center text-xs text-gray-600">
            Version 2.1.0 • Secure Session
          </div>
        </div>
      </aside>

      {/* Add padding to main content when sidebar is open on mobile */}
      <style jsx>{`
        @media (max-width: 1023px) {
          body {
            padding-left: ${isOpen ? '288px' : '0'};
            transition: padding-left 300ms ease-in-out;
          }
        }
      `}</style>
    </>
  );
};

export default ModeratorSidebar;