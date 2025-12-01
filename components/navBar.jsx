"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import feather from "feather-icons";
import Cookies from "js-cookie";

const links = [
  { name: "Home", href: "/", icon: "home" },
  { name: "Explore", href: "/explore", icon: "compass" },
  { name: "Contribute", href: "/submit-word", icon: "plus-circle" },
  { name: "About", href: "/about", icon: "info" },
];

const CustomNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const pathname = usePathname();

  // Render Feather icons every render
  useEffect(() => {
    feather.replace();
  }, [menuOpen, pathname]);

  // Check user auth
  useEffect(() => {
    const token = Cookies.get("token");
    const email = Cookies.get("email");
    if (token && email) setUser({ email });
    else setUser(null);
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("email");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">

        {/* Logo */}
        <a href="/" className="flex items-center gap-3 font-semibold text-2xl">
          <i data-feather="book-open" className="w-6 h-6 text-yellow-500 "></i>
          <span className="text-white text-md">
            NaijaWiki
          </span>
        </a>

        {/* Desktop Links */}
        <ul className="hidden lg:flex gap-6 items-center">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-yellow-500 text-white shadow-sm"
                      : "text-gray-400 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <i data-feather={link.icon} className="w-4 h-4"></i>
                  {link.name}
                </a>
              </li>
            );
          })}
        </ul>

        {/* Desktop Auth Buttons */}
        <div className="hidden lg:flex gap-3 items-center">
          {user ? (
            <>
              <a href={`/profile`} className="text-gray-500 font-medium text-sm hover:text-gray-900 transition-colors">
                {user.email}
              </a>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2.5 border border-red-500 text-red-600 font-medium rounded-lg hover:bg-red-50 transition-colors duration-200 text-sm"
              >
                <i data-feather="log-out" className="w-4 h-4"></i>
                Logout
              </button>
            </>
          ) : (
            <>
              <a
                href="/login"
                className="px-5 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-200 text-sm"
              >
                Log In
              </a>
              <a
                href="/signup"
                className="px-5 py-2.5 bg-yellow-500 text-white font-medium rounded-lg hover:bg-yellow-500-dark shadow-sm transition-all duration-200 text-sm"
              >
                Sign Up
              </a>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <i data-feather={menuOpen ? "x" : "menu"} className="w-5 h-5"></i>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 top-16 lg:hidden z-50 bg-black/20 backdrop-blur-sm">
          <div className="absolute top-0 right-0 w-80 h-full bg-white shadow-lg border-l border-gray-200">
            <div className="p-6 h-full overflow-y-auto relative">

              {/* Close Button */}
              <button
                onClick={() => setMenuOpen(false)}
                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors duration-200"
                aria-label="Close mobile menu"
              >
                <i data-feather="x" className="w-5 h-5"></i>
              </button>

              {/* Mobile Links */}
              <ul className="space-y-2 mb-8">
                {links.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-sm transition-all duration-200 ${
                          isActive
                            ? "bg-yellow-500 text-white"
                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                        onClick={() => setMenuOpen(false)}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <i
                          data-feather={link.icon}
                          className={`w-4 h-4 ${isActive ? "text-white" : "text-gray-500"}`}
                        ></i>
                        {link.name}
                      </a>
                    </li>
                  );
                })}
              </ul>

              {/* Mobile Auth Section */}
              <div className="border-t border-gray-200 pt-6">
                {user ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-lg border border-gray-200">
                      <i data-feather="user" className="w-4 h-4 text-gray-500"></i>
                      <span className="text-gray-700 font-medium text-sm truncate flex-1">
                        {user.email}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMenuOpen(false);
                      }}
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-all duration-200 text-sm"
                    >
                      <i data-feather="log-out" className="w-4 h-4"></i>
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <a
                      href="/login"
                      className="flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-200 text-sm"
                      onClick={() => setMenuOpen(false)}
                    >
                      <i data-feather="log-in" className="w-4 h-4"></i>
                      Log In
                    </a>
                    <a
                      href="/signup"
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-yellow-500 text-white font-medium rounded-lg hover:bg-yellow-500-dark transition-all duration-200 text-sm"
                      onClick={() => setMenuOpen(false)}
                    >
                      <i data-feather="user-plus" className="w-4 h-4"></i>
                      Sign Up
                    </a>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default CustomNavbar;