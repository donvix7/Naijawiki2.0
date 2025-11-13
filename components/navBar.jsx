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

  useEffect(() => {
    feather.replace(); // Refresh feather icons whenever menu state changes
  }, [menuOpen]);

  useEffect(() => {
    // Check for token and email in cookies
    const token = Cookies.get("token");
    const email = Cookies.get("email");

    console.log(token,email);

    if (token && email) {
      setUser({ email });
    } else {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("email");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-6 py-3">
        {/* Logo */}
        <a href="/" className="flex text-3xl items-center gap-2 font-bold text-secondary">
        <i data-feather="book-open" className="logo-icon"></i>
          NaijaWiki
        </a>

        {/* Desktop Links */}
        <ul className="hidden md:flex gap-6 items-center">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`flex items-center gap-1 px-2 py-1 rounded hover:bg-primary/20 transition-colors ${
                  pathname === link.href ? "bg-primary/20 font-semibold" : ""
                }`}
              >
                <i data-feather={link.icon}></i>
                {link.name}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop Auth / User Buttons */}
        <div className="hidden md:flex gap-2 items-center">
          {user ? (
            <>
              <span className="text-gray-700">{user.email}</span>
              <button
                onClick={handleLogout}
                className="flex gap-2 align-center btn btn-outline border-red-600 text-red-600 hover:bg-red-50"
              >
              <i data-feather="log-out" className="w-4 h-4"></i>

                Logout
              </button>
            </>
          ) : (
            <>
              <a href="/login" className="btn btn-outline">
                Log In
              </a>
              <a href="/signup" className="btn btn-primary">
                Sign Up
              </a>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-secondary focus:outline-none"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <i data-feather={menuOpen ? "x" : "menu"}></i>
        </button>
      </div>

     {/* Mobile Menu */}
{menuOpen && (
  <div className="absolute top-16 right-4 w-64 md:hidden animate-slideDown">
    <div className="bg-neutral/95 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden border border-gray-100">
      <ul className="py-3">
        {links.map((link) => (
          <li key={link.href}>
            <a
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 transition-all duration-300 hover:bg-primary/10 hover:scale-[1.02] rounded-lg ${
                pathname === link.href
                  ? "bg-primary/10 font-semibold text-primary"
                  : "text-gray-700"
              }`}
              onClick={() => setMenuOpen(false)}
            >
              <i data-feather={link.icon} className="w-4 h-4 text-primary"></i>
              <span className="text-sm">{link.name}</span>
            </a>
          </li>
        ))}
      </ul>

      <div className="border-t border-gray-100 px-4 py-3 flex flex-col gap-3">
        {user ? (
          <>
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span className="truncate">{user.email}</span>
              <i data-feather="user" className="w-4 h-4 text-gray-400"></i>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium border border-red-500 text-red-600 rounded-lg hover:bg-red-50 transition-all duration-300"
            >
              <i data-feather="log-out" className="w-4 h-4"></i>
              Logout
            </button>
          </>
        ) : (
          <div className="flex flex-col gap-2">
            <a
              href="/login"
              className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-primary text-primary rounded-lg font-medium text-sm hover:bg-primary hover:text-white transition-all duration-300"
            >
              <i data-feather="log-in" className="w-4 h-4"></i>
              Log In
            </a>
            <a
              href="/signup"
              className="flex items-center justify-center gap-2 w-full px-4 py-2 bg-primary text-white rounded-lg font-medium text-sm hover:bg-primary/90 transition-all duration-300"
            >
              <i data-feather="user-plus" className="w-4 h-4"></i>
              Sign Up
            </a>
          </div>
        )}
      </div>
    </div>
  </div>
)}
    </nav>
  );
};

export default CustomNavbar;
