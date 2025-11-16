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
const [isDarkBackground, setIsDarkBackground] = useState(false);

useEffect(() => {
  // Read body background on mobile menu open
  if (menuOpen) {
    const bg = window.getComputedStyle(document.body).backgroundColor;

    // Convert rgb to brightness
    const rgb = bg.match(/\d+/g);
    if (rgb) {
      const brightness = (0.299 * rgb[0]) + (0.587 * rgb[1]) + (0.114 * rgb[2]);
      setIsDarkBackground(brightness < 150); // If low brightness → use white text
    }
  }
}, [menuOpen]);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-6 py-3">
        {/* Logo */}
       <a
  href="/"
  className="group flex items-center gap-2 font-extrabold text-2xl tracking-tight 
             bg-clip-text text-transparent 
             bg-gradient-to-r from-secondary via-primary to-secondary
             transition-transform duration-300 hover:scale-[1.04]"
>
  <span className="relative">
    <i
      data-feather="book-open"
      className="w-7 h-7 stroke-[2.6] 
                 text-secondary group-hover:text-primary
                 transition-all duration-300 drop-shadow-sm"
    ></i>

    {/* Glow effect */}
    <span className="absolute inset-0 blur-md opacity-40 bg-primary/40 rounded-full"></span>
  </span>

  <span className="font-extrabold drop-shadow-sm">NaijaWiki</span>
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
{/* Mobile Menu */}
{menuOpen && (
  <div className="absolute top-16 right-4 w-64 md:hidden animate-slideDown z-50">
    <div className={`shadow-2xl rounded-2xl overflow-hidden border 
      ${isDarkBackground ? "bg-neutral-900 text-white" : "bg-neutral/95 text-black"}
    `}>
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
              <i
                data-feather={link.icon}
                className={`w-4 h-4 ${isDarkBackground ? "text-white" : "text-primary"}`}
              />
              <span className={`text-sm ${isDarkBackground ? "text-white" : "text-gray-700"}`}>
                {link.name}
              </span>
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
