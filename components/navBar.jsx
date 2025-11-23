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
    <nav className="hidden bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">

        {/* Logo */}
        <a href="/" className="flex items-center gap-3 font-bold text-2xl">
          <i data-feather="book-open" className="w-8 h-8 text-primary stroke-[2.5]"></i>
          <span className="bg-white from-primary to-secondary bg-clip-text text-transparent">
            NaijaWiki
          </span>
        </a>

        {/* Desktop Links */}
        <ul className="hidden hider lg:flex gap-8 items-center">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-primary text-white shadow-md"
                      : "text-white hover:bg-primary hover:text-white"
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
        <div className="hidden lg:flex gap-4 items-center">
          {user ? (
            <>
              <span className="text-white font-medium px-3 py-1 bg-gray-600 rounded-lg">
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 border border-red-500 text-white font-semibold rounded-lg hover:bg-red-500 transition-colors duration-200"
              >
                <i data-feather="log-out" className="w-4 h-4"></i>
                Logout
              </button>
            </>
          ) : (
            <>
              <a
                href="/login"
                className="px-6 py-2 border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-primary transition-all duration-200"
              >
                Log In
              </a>
              <a
                href="/signup"
                className="px-6 py-2 bg-white text-primary font-semibold rounded-lg hover:bg-gray-100 shadow-md transition-all duration-200"
              >
                Sign Up
              </a>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 text-white hover:bg-gray-100 rounded-lg transition-colors duration-200"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <i data-feather={menuOpen ? "x" : "menu"} className="w-6 h-6"></i>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 top-16 lg:hidden z-50 bg-black/20 backdrop-blur-sm">
          <div className="absolute top-0 right-0 w-80 h-full bg-white shadow-2xl border-l border-gray-200 animate-slideDown">
            <div className="p-6 h-full overflow-y-auto relative">

              {/* Close Button */}
              <button
                onClick={() => setMenuOpen(false)}
                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                aria-label="Close mobile menu"
              >
                <i data-feather="x" className="w-6 h-6"></i>
              </button>

              {/* Mobile Links */}
              <ul className="space-y-3 mb-8">
                {links.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className={`flex items-center gap-4 px-4 py-4 rounded-xl font-semibold text-lg transition-all duration-200 border-2 ${
                          isActive
                            ? " border-primary shadow-lg"
                            : "text-gray-800 border-transparent hover:bg-primary/10 hover:text-primary hover:border-primary/20"
                        }`}
                        onClick={() => setMenuOpen(false)}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <i
                          data-feather={link.icon}
                          className={`w-5 h-5 ${isActive ? "text-white" : "text-primary"}`}
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
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl border border-primary/20">
                      <i data-feather="user" className="w-5 h-5 text-primary"></i>
                      <span className="text-gray-800 font-semibold text-sm truncate flex-1">
                        {user.email}
                      </span>
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMenuOpen(false);
                      }}
                      className="flex items-center justify-center gap-3 w-full px-4 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-xl hover:shadow-lg transition-all duration-200 border-2 border-red-600"
                    >
                      <i data-feather="log-out" className="w-5 h-5"></i>
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <a
                      href="/login"
                      className="flex items-center justify-center gap-3 px-4 py-4 border-2 border-primary text-primary font-bold rounded-xl hover:bg-primary hover:text-white transition-all duration-200 text-center group"
                      onClick={() => setMenuOpen(false)}
                    >
                      <i data-feather="log-in" className="w-5 h-5 group-hover:text-white"></i>
                      Log In
                    </a>
                    <a
                      href="/signup"
                      className="flex items-center justify-center gap-3 px-4 py-4 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl hover:shadow-lg transition-all duration-200 text-center border-2 border-transparent hover:border-primary/30"
                      onClick={() => setMenuOpen(false)}
                    >
                      <i data-feather="user-plus" className="w-5 h-5"></i>
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