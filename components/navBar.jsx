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
        <a href="/" className="flex items-center gap-2 font-bold text-secondary">
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
                className="btn btn-outline border-red-600 text-red-600 hover:bg-red-50"
              >
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
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <i data-feather={menuOpen ? "x" : "menu"}></i>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div>
          <div className=" dropdown md:hidden bg-neutral shadow-md ">
          <ul className="">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded hover:bg-primary/20 transition-colors ${
                    pathname === link.href ? "bg-primary/20 font-semibold" : ""
                  }`}
                  onClick={() => setMenuOpen(false)}
                >
                  <i data-feather={link.icon}></i>
                  {link.name}
                </a>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-2 px-6 pb-4">
            {user ? (
              <>
                <span className="text-gray-700">{user.email}</span>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline border-red-600 text-red-600 hover:bg-red-50"
                >
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
        </div>
        </div>
      )}
    </nav>
  );
};

export default CustomNavbar;
