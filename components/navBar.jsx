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
    <nav>
        <a href="/" className="logo">
          <i data-feather="book-open" className="logo-icon"></i>
          NaijaWiki
        </a>
        
       
        <button className="mobile-menu-btn"
        onClick={() => setMenuOpen(!menuOpen)}>
          {
            menuOpen ? <i data-feather="x"></i> : <i data-feather="menu"></i>
          }
        </button>
        
        <ul className= "flex ">
          <li><a href="/" className="active"><i data-feather="home"></i> Home</a></li>
          <li><a href="/explore"><i data-feather="compass"></i> Explore</a></li>
          <li><a href="/submit-word"><i data-feather="plus-circle"></i> Contribute</a></li>
          <li><a href="/about"><i data-feather="info"></i> About</a></li>
         
        </ul>
        
        <div className="auth-buttons flex md:hidden">
          <a href="/login" className="btn btn-outline">Log In</a>
          <a href="/signup" className="btn btn-primary">Sign Up</a>
        </div>

        {menuOpen ? (
          <div>
          <ul className= " ">
          <li><a href="/" className="active"><i data-feather="home"></i> Home</a></li>
          <li><a href="/explore"><i data-feather="compass"></i> Explore</a></li>
          <li><a href="/submit-word"><i data-feather="plus-circle"></i> Contribute</a></li>
          <li><a href="/about"><i data-feather="info"></i> About</a></li>
         
        </ul>
        
        <div className="auth-buttons">
          <a href="/login" className="btn btn-outline">Log In</a>
          <a href="/signup" className="btn btn-primary">Sign Up</a>
        </div>
          </div>
        ):(
          
        <button className="mobile-menu-btn"
        onClick={() => setMenuOpen(!menuOpen)}>
        
          {
            menuOpen ? <i data-feather="x"></i> : <i data-feather="menu"></i>
          }
        </button>
        )}

      </nav>

  );
};

export default CustomNavbar;
