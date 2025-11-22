"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import feather from "feather-icons";

const AdminSidebar = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    feather.replace();
  }, [pathname, isOpen]);

  const toggleSidebar = () => setIsOpen((prev) => !prev);

  const getActiveClass = (path) =>
    pathname === path
      ? "bg-primary text-white font-bold shadow-lg border-l-4 border-white"
      : "text-gray-100 hover:bg-gray-700 hover:text-white transition-all duration-200";

  // Close sidebar when clicking on a link (mobile only)
  const handleLinkClick = () => {
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      {/* Mobile Toggle Button - Only show on mobile */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-[60] bg-primary text-white p-3 rounded-xl shadow-2xl hover:scale-105 transition-all duration-200 font-bold"
        aria-label="Toggle sidebar"
      >
        <i data-feather={isOpen ? "x" : "menu"} className="w-5 h-5"></i>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-gray-800 text-white border-r border-gray-700 shadow-2xl 
          transition-transform duration-300 ease-in-out z-[50]
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static md:w-72`}
      >
        {/* Sidebar Header */}
        <div className="px-6 py-5 border-b border-gray-700 bg-gradient-to-r from-secondary to-primary text-white flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-3">
            <i data-feather="settings" className="w-6 h-6"></i> 
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200">
              Admin Panel
            </span>
          </h2>
          <button
            onClick={toggleSidebar}
            className="md:hidden hover:bg-white/20 p-2 rounded-lg transition-colors duration-200"
            aria-label="Close sidebar"
          >
            <i data-feather="x" className="w-5 h-5"></i>
          </button>
        </div>

        {/* Sidebar Scrollable Content */}
        <div className="px-5 py-6 space-y-8 overflow-y-auto h-[calc(100%-5rem)]">
          {/* MAIN */}
          <div>
            <p className="text-gray-300 uppercase text-sm font-bold mb-4 tracking-wider border-b border-gray-600 pb-2">
              Main
            </p>
            <a
              href="/admin/dashboard"
              className={`flex items-center gap-4 px-4 py-3 rounded-xl text-lg font-semibold ${getActiveClass(
                "/admin/dashboard"
              )}`}
              onClick={handleLinkClick}
            >
              <i data-feather="home" className="w-5 h-5"></i> 
              <span>Dashboard</span>
            </a>
          </div>

          {/* CONTENT */}
          <div>
            <p className="text-gray-300 uppercase text-sm font-bold mb-4 tracking-wider border-b border-gray-600 pb-2">
              Content Management
            </p>
            {[
              { href: "/admin/word", icon: "book", label: "Words" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl text-lg font-semibold ${getActiveClass(
                  link.href
                )}`}
                onClick={handleLinkClick}
              >
                <i data-feather={link.icon} className="w-5 h-5"></i> 
                <span>{link.label}</span>
              </a>
            ))}
          </div>

          {/* SYSTEM */}
          <div>
            <p className="text-gray-300 uppercase text-sm font-bold mb-4 tracking-wider border-b border-gray-600 pb-2">
              System
            </p>
            {[
              { href: "/admin/settings", icon: "sliders", label: "Settings" },
              { href: "/admin/activity", icon: "activity", label: "Activity Log" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl text-lg font-semibold ${getActiveClass(
                  link.href
                )}`}
                onClick={handleLinkClick}
              >
                <i data-feather={link.icon} className="w-5 h-5"></i> 
                <span>{link.label}</span>
              </a>
            ))}
          </div>

          {/* QUICK ACTIONS */}
          <div className="pt-4 border-t border-gray-700">
            <p className="text-gray-300 uppercase text-sm font-bold mb-4 tracking-wider">
              Quick Actions
            </p>
            <div className="space-y-3">
              <a
                href="/"
                className="flex items-center gap-4 px-4 py-3 rounded-xl text-lg font-semibold bg-gray-700 text-white hover:bg-gray-600 transition-all duration-200"
                onClick={handleLinkClick}
              >
                <i data-feather="globe" className="w-5 h-5"></i>
                <span>View Site</span>
              </a>
              <a
                href="/profile"
                className="flex items-center gap-4 px-4 py-3 rounded-xl text-lg font-semibold bg-gray-700 text-white hover:bg-gray-600 transition-all duration-200"
                onClick={handleLinkClick}
              >
                <i data-feather="user" className="w-5 h-5"></i>
                <span>My Profile</span>
              </a>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay - Only show on mobile when sidebar is open */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[40] md:hidden transition-opacity duration-300"
        ></div>
      )}
    </div>
  );
};

export default AdminSidebar;