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
      ? "bg-primary text-white font-semibold"
      : "hover:bg-gray-100 dark:hover:bg-gray-800";

  return (
    <div className="relative">
      {/* Mobile toggle button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 bg-primary text-white p-2 rounded-md shadow-lg"
      >
        <i data-feather={isOpen ? "x" : "menu"}></i>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-neutral text-gray-200 border-r border-gray-800 shadow-lg 
          transform transition-transform duration-300 ease-in-out z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0`}
      >
        {/* Sidebar Header */}
        <div className="px-4 py-4 border-b border-gray-700 flex items-center justify-between bg-secondary text-white">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <i data-feather="settings"></i> Admin Panel
          </h2>
          <button onClick={toggleSidebar} className="md:hidden">
            <i data-feather="x"></i>
          </button>
        </div>

        {/* Sidebar Menu */}
        <div className="px-4 py-4 space-y-6 overflow-y-auto h-[calc(100%-4rem)]">
          {/* Main */}
          <div>
            <div className="text-gray-400 uppercase text-sm mb-2">Main</div>
            <a
              href="/admin/dashboard"
              className={`flex items-center gap-2 px-3 py-2 rounded-md ${getActiveClass(
                "/admin/dashboard"
              )}`}
            >
              <i data-feather="home"></i> Dashboard
            </a>
          </div>

          {/* Content */}
          <div>
            <div className="text-gray-400 uppercase text-sm mb-2">Content</div>
            <a
              href="/admin/words"
              className={`flex items-center gap-2 px-3 py-2 rounded-md ${getActiveClass(
                "/admin/word"
              )}`}
            >
              <i data-feather="book"></i> Words
            </a>
            <a
              href="/admin/categories"
              className={`flex items-center gap-2 px-3 py-2 rounded-md ${getActiveClass(
                "/admin/categories"
              )}`}
            >
              <i data-feather="tag"></i> Categories
            </a>
            <a
              href="/admin/languages"
              className={`flex items-center gap-2 px-3 py-2 rounded-md ${getActiveClass(
                "/admin/languages"
              )}`}
            >
              <i data-feather="globe"></i> Languages
            </a>
          </div>

          {/* Users */}
          <div>
            <div className="text-gray-400 uppercase text-sm mb-2">Users</div>
            <a
              href="/admin/users"
              className={`flex items-center gap-2 px-3 py-2 rounded-md ${getActiveClass(
                "/admin/users"
              )}`}
            >
              <i data-feather="users"></i> Manage Users
            </a>
            <a
              href="/admin/roles"
              className={`flex items-center gap-2 px-3 py-2 rounded-md ${getActiveClass(
                "/admin/roles"
              )}`}
            >
              <i data-feather="shield"></i> Roles & Permissions
            </a>
          </div>

          {/* System */}
          <div>
            <div className="text-gray-400 uppercase text-sm mb-2">System</div>
            <a
              href="/admin/settings"
              className={`flex items-center gap-2 px-3 py-2 rounded-md ${getActiveClass(
                "/admin/settings"
              )}`}
            >
              <i data-feather="settings"></i> Settings
            </a>
            <a
              href="/admin/activity"
              className={`flex items-center gap-2 px-3 py-2 rounded-md ${getActiveClass(
                "/admin/activity"
              )}`}
            >
              <i data-feather="activity"></i> Activity Log
            </a>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        ></div>
      )}
    </div>
  );
};

export default AdminSidebar;
