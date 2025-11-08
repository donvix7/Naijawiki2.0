'use client';
import { Feather, FeatherIcon, LucideFeather } from "lucide-react";
import { useState, useEffect } from "react";
import feather from "feather-icons"
const CustomNavbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
     console.log(menuOpen);
    feather.replace(); // Initialize Feather icons
  }, [menuOpen]);

  return (
    <nav className="">
      <a href="/" className="logo">
        <i data-feather="book-open" className="logo-icon"></i>
        NaijaWiki
      </a>

   

      {
        menuOpen ? (
      <ul className= "flex flex-col gap-3 md:gap-5 border:2px-solid-red">
        <li>
          <a href="/" className="active">
            <i data-feather="home"></i> Home
          </a>
        </li>
        <li>
          <a href="/explore">
            <i data-feather="compass"></i> Explore
          </a>
        </li>
        <li>
          <a href="/submit-word">
            <i data-feather="plus-circle"></i> Contribute
          </a>
        </li>
        <li>
          <a href="/about">
            <i data-feather="info"></i> About
          </a>
        </li>
      </ul>
        ):(
             <button
              className="mobile-menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <i data-feather={menuOpen ? "x" : "menu"}></i>
            </button>
        )
      }

      <ul className="sm:hidden">
        <li>
          <a href="/" className="active">
            <i data-feather="home"></i> Home
          </a>
        </li>
        <li>
          <a href="/explore">
            <i data-feather="compass"></i> Explore
          </a>
        </li>
        <li>
          <a href="/submit-word">
            <i data-feather="plus-circle"></i> Contribute
          </a>
        </li>
        <li>
          <a href="/about">
            <i data-feather="info"></i> About
          </a>
        </li>
      </ul>

      <div className="auth-buttons">
        <a href="/login" className="btn btn-outline">
          Log In
        </a>
        <a href="/signup" className="btn btn-primary">
          Sign Up
        </a>
      </div>
    </nav>
  );
};

export default CustomNavbar;
