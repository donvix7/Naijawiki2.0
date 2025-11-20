"use client";

import React from "react";
import { BookOpen, Twitter, Facebook, Instagram, Youtube } from "lucide-react";

const CustomFooter = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[var(--neutral)] text-white py-12 px-8 mt-auto">
      <div className="container max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">

        {/* About Section */}
        <div>
          <div className="text-2xl font-bold flex items-center gap-2 mb-4">
            <BookOpen className="text-[var(--primary)]" /> 
            NaijaLingo
          </div>

          <p className="text-gray-300 leading-relaxed">
            Preserving Nigerian languages and culture through community
            contributions and education.
          </p>

          <div className="flex gap-4 mt-4">
            {[Twitter, Facebook, Instagram, Youtube].map((Icon, idx) => (
              <a
                key={idx}
                href="#"
                aria-label="Social Link"
                className="bg-white/10 w-10 h-10 rounded-full flex items-center justify-center 
                  hover:bg-[var(--primary)] hover:-translate-y-1 transition-all"
              >
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Explore Links */}
        <div className="flex flex-col">
          <h3 className="text-[var(--primary)] text-xl mb-4 font-semibold">
            Explore
          </h3>
          <ul className="space-y-2">
            <li>
              <a
                href="/explore"
                className="hover:text-[var(--primary)] text-gray-300 transition-colors"
              >
                All Words
              </a>
            </li>
          </ul>
        </div>

        {/* Community */}
        <div className="flex flex-col">
          <h3 className="text-[var(--primary)] text-xl mb-4 font-semibold">
            Community
          </h3>
          <ul className="space-y-2">
            <li>
              <a
                href="/submit-word"
                className="hover:text-[var(--primary)] text-gray-300 transition-colors"
              >
                Contribute a Word
              </a>
            </li>
            <li>
              <a
                href="/about"
                className="hover:text-[var(--primary)] text-gray-300 transition-colors"
              >
                About Us
              </a>
            </li>
           
          </ul>
        </div>

        {/* Support */}
        <div className="flex flex-col">
          <h3 className="text-[var(--primary)] text-xl mb-4 font-semibold">
            Support
          </h3>

          <ul className="space-y-2">
         

            <li>
              <a
                href="/contact"
                className="hover:text-[var(--primary)] text-gray-300 transition-colors"
              >
                Contact Us
              </a>
            </li>

            <li>
              <a
                href="/privacy"
                className="hover:text-[var(--primary)] text-gray-300 transition-colors"
              >
                Privacy Policy
              </a>
            </li>

            <li>
              <a
                href="/terms"
                className="hover:text-[var(--primary)] text-gray-300 transition-colors"
              >
                Terms of Use
              </a>
            </li>

            <li>
              <a
                href="/donate"
                className="hover:text-[var(--primary)] text-gray-300 transition-colors"
              >
                Donate
              </a>
            </li>
          </ul>
        </div>

      </div>

      {/* Copyright */}
      <div className="text-center mt-12 pt-8 border-t border-white/10 text-gray-400">
        &copy; {year} NaijaLingo. All rights reserved.
      </div>
    </footer>
  );
};

export default CustomFooter;
