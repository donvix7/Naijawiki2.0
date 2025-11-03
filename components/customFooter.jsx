import React from 'react'
import { BookOpen, Twitter, Facebook, Instagram, Youtube } from "lucide-react";



const CustomFooter = () => {

  const year = new Date().getFullYear();
  return (
    <div>
      <footer className="bg-[var(--neutral)] text-white py-12 px-8 mt-auto">
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* About Section */}
        <div className="footer-about w-100vw md:w-auto">
          <div className="footer-logo text-2xl font-bold flex items-center gap-2 mb-4">
          <BookOpen className="text-[var(--primary)]" /> NaijaLingo
          </div>
          <p>
            Preserving Nigerian languages and culture through community
            contributions and education.
          </p>
          <div className="social-links flex gap-4 mt-4">
            <a
              href="#"
              className="bg-white/10 w-10 h-10 rounded-full flex items-center justify-center hover:bg-[var(--primary)] hover:-translate-y-1 transition"
            >
              <Twitter />
            </a>
            <a
              href="#"
              className="bg-white/10 w-10 h-10 rounded-full flex items-center justify-center hover:bg-[var(--primary)] hover:-translate-y-1 transition"
            >
              <Facebook />
            </a>
            <a
              href="#"
              className="bg-white/10 w-10 h-10 rounded-full flex items-center justify-center hover:bg-[var(--primary)] hover:-translate-y-1 transition"
            >
              <Instagram />
            </a>
            <a
              href="#"
              className="bg-white/10 w-10 h-10 rounded-full flex items-center justify-center hover:bg-[var(--primary)] hover:-translate-y-1 transition"
            >
              <Youtube />
            </a>
          </div>
        </div>

        {/* Explore Links */}
        <div className="footer-links">
          <h3 className="text-[var(--primary)] text-xl mb-4">Explore</h3>
          <ul className="space-y-2">
            <li><a href="/explore.html" className="hover:text-[var(--primary)] text-gray-300">All Words</a></li>
            <li><a href="/explore.html?language=pidgin" className="hover:text-[var(--primary)] text-gray-300">Pidgin English</a></li>
            <li><a href="/explore.html?language=yoruba" className="hover:text-[var(--primary)] text-gray-300">Yoruba</a></li>
            <li><a href="/explore.html?language=igbo" className="hover:text-[var(--primary)] text-gray-300">Igbo</a></li>
            <li><a href="/explore.html?language=hausa" className="hover:text-[var(--primary)] text-gray-300">Hausa</a></li>
          </ul>
        </div>

        {/* Community Links */}
        <div className="footer-links">
          <h3 className="text-[var(--primary)] text-xl mb-4">Community</h3>
          <ul className="space-y-2">
            <li><a href="/submit-word.html" className="hover:text-[var(--primary)] text-gray-300">Contribute a Word</a></li>
            <li><a href="/about.html" className="hover:text-[var(--primary)] text-gray-300">About Us</a></li>
            <li><a href="/blog.html" className="hover:text-[var(--primary)] text-gray-300">Blog</a></li>
            <li><a href="/events.html" className="hover:text-[var(--primary)] text-gray-300">Events</a></li>
            <li><a href="/volunteer.html" className="hover:text-[var(--primary)] text-gray-300">Volunteer</a></li>
          </ul>
        </div>

        {/* Support Links */}
        <div className="footer-links">
          <h3 className="text-[var(--primary)] text-xl mb-4">Support</h3>
          <ul className="space-y-2">
            <li><a href="/help.html" className="hover:text-[var(--primary)] text-gray-300">Help Center</a></li>
            <li><a href="/contact.html" className="hover:text-[var(--primary)] text-gray-300">Contact Us</a></li>
            <li><a href="/privacy.html" className="hover:text-[var(--primary)] text-gray-300">Privacy Policy</a></li>
            <li><a href="/terms.html" className="hover:text-[var(--primary)] text-gray-300">Terms of Use</a></li>
            <li><a href="/donate.html" className="hover:text-[var(--primary)] text-gray-300">Donate</a></li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="text-center mt-12 pt-8 border-t border-white/10 text-gray-400">
        &copy; {year} NaijaLingo. All rights reserved.
      </div>
    </footer>
    </div>
  )
}

export default CustomFooter