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
      ? "bg-primary/20 text-primary font-semibold"
      : "hover:bg-gray-800/50 hover:text-primary transition-colors";

  return (
    <div className="relative">
      {/* Mobile Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-[60] bg-primary text-white p-2 rounded-md shadow-lg hover:scale-105 transition-transform"
      >
        <i data-feather={isOpen ? "x" : "menu"}></i>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-gray-200 border-r border-gray-800 shadow-2xl 
          transition-transform duration-300 ease-in-out z-[50]
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static`}
      >
        {/* Sidebar Header */}
        <div className="px-5 py-4 border-b border-gray-700 bg-secondary text-white flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <i data-feather="settings"></i> Admin Panel
          </h2>
          <button
            onClick={toggleSidebar}
            className="md:hidden hover:text-primary transition-colors"
          >
            <i data-feather="x"></i>
          </button>
        </div>

        {/* Sidebar Scrollable Content */}
        <div className="px-4 py-5 space-y-8 overflow-y-auto h-[calc(100%-4rem)]">
          {/* MAIN */}
          <div>
            <p className="text-gray-400 uppercase text-xs mb-3 tracking-wider">
              Main
            </p>
            <a
              href="/admin/dashboard"
              className={`flex items-center gap-3 px-3 py-2 rounded-lg ${getActiveClass(
                "/admin/dashboard"
              )}`}
            >
              <i data-feather="home"></i> Dashboard
            </a>
          </div>

          {/* CONTENT */}
          <div>
            <p className="text-gray-400 uppercase text-xs mb-3 tracking-wider">
              Content
            </p>
            {[
              { href: "/admin/word", icon: "book", label: "Words" },
              { href: "/admin/categories", icon: "tag", label: "Categories" },
              { href: "/admin/languages", icon: "globe", label: "Languages" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg ${getActiveClass(
                  link.href
                )}`}
              >
                <i data-feather={link.icon}></i> {link.label}
              </a>
            ))}
          </div>

          {/* USERS */}
          <div>
            <p className="text-gray-400 uppercase text-xs mb-3 tracking-wider">
              Users
            </p>
            {[
              { href: "/admin/users", icon: "users", label: "Manage Users" },
              { href: "/admin/roles", icon: "shield", label: "Roles & Permissions" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg ${getActiveClass(
                  link.href
                )}`}
              >
                <i data-feather={link.icon}></i> {link.label}
              </a>
            ))}
          </div>

          {/* SYSTEM */}
          <div>
            <p className="text-gray-400 uppercase text-xs mb-3 tracking-wider">
              System
            </p>
            {[
              { href: "/admin/settings", icon: "sliders", label: "Settings" },
              { href: "/admin/activity", icon: "activity", label: "Activity Log" },
            ].map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg ${getActiveClass(
                  link.href
                )}`}
              >
                <i data-feather={link.icon}></i> {link.label}
              </a>
            ))}
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[40] md:hidden transition-opacity"
        ></div>
      )}
    </div>
  );
};

export default AdminSidebar;
