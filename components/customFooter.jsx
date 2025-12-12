"use client";

import React, { useState, useEffect } from "react";
import feather from "feather-icons";

const CustomFooter = () => {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    feather.replace();
  }, [subscribed]);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setSubscribed(true);
      setLoading(false);
      setEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }, 1000);
  };

  const socialLinks = [
    { icon: "twitter", href: "https://twitter.com/naijawiki", label: "Twitter" },
    { icon: "facebook", href: "https://facebook.com/naijawiki", label: "Facebook" },
    { icon: "instagram", href: "https://instagram.com/naijawiki", label: "Instagram" },
    { icon: "youtube", href: "https://youtube.com/naijawiki", label: "YouTube" },
    { icon: "linkedin", href: "https://linkedin.com/company/naijawiki", label: "LinkedIn" }
  ];

  const exploreLinks = [
    { name: "All Words", href: "/explore" },
      ];

  const communityLinks = [
    { name: "Contribute a Word", href: "/submit-word" },
      ];

  const learnLinks = [
    { name: "Educational Resources", href: "/resources" },
  ];

  const supportLinks = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Use", href: "/terms" },
    { name: "Donate", href: "/donate" }
  ];

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white mt-24">
      {/* Top decorative border */}
      <div className="h-2 bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500"></div>
      
      <div className="container mx-auto px-4 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 lg:mb-16">
          {/* Brand Section */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg">
                <i data-feather="book-open" className="w-6 h-6 text-white"></i>
              </div>
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  NaijaWiki
                </h2>
                <p className="text-sm text-gray-400 font-medium">
                  Cultural Heritage Dictionary
                </p>
              </div>
            </div>
            
            <p className="text-gray-300 leading-relaxed max-w-lg text-base">
              A community-driven platform dedicated to preserving and celebrating 
              Nigeria's rich linguistic diversity and cultural heritage through 
              education, collaboration, and innovation.
            </p>
            
            
          </div>
          
          {/* Quick Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <i data-feather="compass" className="w-4 h-4 text-yellow-500"></i>
                Explore
              </h3>
              <ul className="space-y-2">
                {exploreLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-yellow-400 transition-colors duration-200 text-sm flex items-center gap-2 group"
                    >
                      <i data-feather="chevron-right" className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <i data-feather="users" className="w-4 h-4 text-yellow-500"></i>
                Community
              </h3>
              <ul className="space-y-2">
                {communityLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-yellow-400 transition-colors duration-200 text-sm flex items-center gap-2 group"
                    >
                      <i data-feather="chevron-right" className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <i data-feather="book" className="w-4 h-4 text-yellow-500"></i>
                Learn
              </h3>
              <ul className="space-y-2">
                {learnLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-gray-400 hover:text-yellow-400 transition-colors duration-200 text-sm flex items-center gap-2 group"
                    >
                      <i data-feather="chevron-right" className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Social & Support Links */}
        <div className="border-t border-gray-800 pt-8 lg:pt-12">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            {/* Social Links */}
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm mr-4">Follow us:</span>
              <div className="flex gap-2">
                {socialLinks.map((social) => (
                  <a
                    key={social.icon}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="w-10 h-10 rounded-lg bg-gray-800/50 flex items-center justify-center text-gray-400 hover:text-white hover:bg-yellow-500/20 hover:border-yellow-500/30 border border-transparent transition-all duration-200 group"
                  >
                    <i data-feather={social.icon} className="w-4 h-4 group-hover:scale-110 transition-transform"></i>
                  </a>
                ))}
              </div>
            </div>
            
            {/* Support Links */}
            <div className="flex flex-wrap gap-4 justify-center">
              {supportLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-gray-400 hover:text-yellow-400 transition-colors duration-200 text-sm"
                >
                  {link.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-gray-900/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                &copy; {year} NaijaWiki. Preserving cultural heritage through language.
              </p>
              
            </div>
            
            <div className="flex items-center gap-4">
              
              <div className="text-gray-500 text-sm flex items-center gap-2">
                Made with passion for Nigeria
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default CustomFooter;