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
  const [userRole, setUserRole] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Render Feather icons every render
  useEffect(() => {
    feather.replace();
  }, [menuOpen, pathname, user, userRole]);

  // Check user auth and role
  useEffect(() => {
    const token = Cookies.get("token");
    const email = Cookies.get("email");
    const role = Cookies.get("role");
    
    if (token && email) {
      setUser({ email });
      setUserRole(role || "user");
    } else {
      setUser(null);
      setUserRole(null);
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("email");
    Cookies.remove("role");
    setUser(null);
    setUserRole(null);
    window.location.href = "/";
  };

  // Get appropriate dashboard link based on role
  const getDashboardLink = () => {
    if (userRole === "admin" || userRole === "super_admin") {
      return "/admin/dashboard";
    } else if (userRole === "moderator") {
      return "/moderator/";
    }
    return null;
  };

  // Get dashboard name based on role
  const getDashboardName = () => {
    if (userRole === "admin" || userRole === "super_admin") {
      return "Admin Dashboard";
    } else if (userRole === "moderator") {
      return "Moderator Dashboard";
    }
    return null;
  };

  // Get role icon based on role
  const getRoleIcon = () => {
    if (userRole === "super_admin") return "award";
    if (userRole === "admin") return "shield";
    if (userRole === "moderator") return "check-circle";
    return "user";
  };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? "bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-lg" 
        : "bg-white border-b border-gray-100"
    }`}>
      <div className="container mx-auto px-4 py-3 lg:py-4">
        <div className="flex justify-between items-center">
          
          {/* Logo Section - Premium Design */}
          <a href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <i data-feather="book-open" className="w-5 h-5 text-white"></i>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-gray-400 to-gray-200 bg-clip-text text-transparent">
                NaijaWiki
              </span>
             
            </div>
          </a>

          {/* Desktop Navigation - Premium Design */}
          <div className="hidden lg:flex items-center space-x-1">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 group ${
                    isActive
                      ? "text-yellow-600"
                      : "text-white hover:text-yellow-500"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <div className="flex items-center gap-2">
                    <i 
                      data-feather={link.icon} 
                      className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                        isActive ? "text-yellow-500" : "text-gray-400"
                      }`}
                    ></i>
                    <span>{link.name}</span>
                  </div>
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-yellow-500 rounded-full"></div>
                  )}
                </a>
              );
            })}
            
            {/* Dashboard Link for Admins/Moderators */}
            {user && getDashboardLink() && (
              <a
                href={getDashboardLink()}
                className={`relative px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 group ${
                  pathname.startsWith(getDashboardLink().split('/')[1])
                    ? "text-purple-600"
                    : "text-purple-600 hover:text-purple-700"
                }`}
              >
                <div className="relative">
                  <i data-feather={getRoleIcon()} className="w-4 h-4"></i>
                  {userRole === "super_admin" && (
                    <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                  )}
                </div>
                <span>{getDashboardName()}</span>
                {pathname.startsWith(getDashboardLink().split('/')[1]) && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-purple-500 rounded-full"></div>
                )}
              </a>
            )}
          </div>

          {/* Desktop User Section - Premium Design */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-2">
                  <a 
                    href="/profile" 
                    className="flex items-center gap-3 px-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 text-gray-700 hover:bg-gray-50 group"
                  >
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                        <i data-feather="user" className="w-3.5 h-3.5 text-blue-600"></i>
                      </div>
                      {userRole && userRole !== "user" && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white flex items-center justify-center">
                          <i 
                            data-feather={getRoleIcon()} 
                            className={`w-2 h-2 ${
                              userRole === "super_admin" ? "text-red-500" :
                              userRole === "admin" ? "text-blue-500" :
                              "text-green-500"
                            }`}
                          ></i>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="font-medium text-gray-900 text-sm max-w-[120px] truncate">
                        {user.email.split('@')[0]}
                      </span>
                      <span className={`text-xs ${
                        userRole === "super_admin" ? "text-red-600" :
                        userRole === "admin" ? "text-blue-600" :
                        userRole === "moderator" ? "text-green-600" :
                        "text-gray-500"
                      }`}>
                        {userRole ? userRole.replace('_', ' ') : 'Member'}
                      </span>
                    </div>
                  </a>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2.5 text-gray-600 hover:text-red-600 font-medium rounded-lg hover:bg-red-50 transition-all duration-200 text-sm group"
                >
                  <i data-feather="log-out" className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"></i>
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <a
                  href="/login"
                  className="px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all duration-200 text-sm group"
                >
                  <div className="flex items-center gap-2">
                    <i data-feather="log-in" className="w-4 h-4 transition-transform group-hover:translate-x-0.5"></i>
                    <span>Log In</span>
                  </div>
                </a>
                <a
                  href="/signup"
                  className="px-4 py-2.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-medium rounded-lg hover:from-yellow-600 hover:to-yellow-700 shadow-lg hover:shadow-xl transition-all duration-200 text-sm group"
                >
                  <div className="flex items-center gap-2">
                    <i data-feather="user-plus" className="w-4 h-4 transition-transform group-hover:scale-110"></i>
                    <span>Sign Up</span>
                  </div>
                </a>
              </>
            )}
          </div>

          {/* Mobile Menu Button - Premium Design */}
          <button
            className="lg:hidden p-2.5 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 group"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <i data-feather={menuOpen ? "x" : "menu"} className="w-5 h-5 transition-transform group-hover:scale-110"></i>
          </button>
        </div>
      </div>

      {/* Mobile Menu - Premium Design */}
      {menuOpen && (
        <div className="fixed inset-0 top-16 lg:hidden z-40">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/30 backdrop-blur-sm animate-fadeIn"
            onClick={() => setMenuOpen(false)}
          />
          
          {/* Menu Panel */}
          <div className="absolute top-0 right-0 w-80 h-full bg-white shadow-2xl border-l border-gray-100 animate-slideInRight">
            <div className="p-6 h-full overflow-y-auto">
              
              {/* Mobile User Info - Premium */}
              {user && (
                <div className="mb-8 p-5 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center shadow-md">
                        <i data-feather="user" className="w-5 h-5 text-blue-600"></i>
                      </div>
                      {userRole && userRole !== "user" && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-white border-2 border-gray-100 flex items-center justify-center shadow-sm">
                          <i 
                            data-feather={getRoleIcon()} 
                            className={`w-3 h-3 ${
                              userRole === "super_admin" ? "text-red-500" :
                              userRole === "admin" ? "text-blue-500" :
                              "text-green-500"
                            }`}
                          ></i>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm truncate">
                        {user.email}
                      </h3>
                      <p className={`text-xs font-medium ${
                        userRole === "super_admin" ? "text-red-600" :
                        userRole === "admin" ? "text-blue-600" :
                        userRole === "moderator" ? "text-green-600" :
                        "text-gray-500"
                      }`}>
                        {userRole ? userRole.replace('_', ' ') : 'Community Member'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile Navigation Links - Premium */}
              <ul className="space-y-1 mb-8">
                {links.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-sm transition-all duration-200 group ${
                          isActive
                            ? "bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-700 border border-yellow-200"
                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                        onClick={() => setMenuOpen(false)}
                        aria-current={isActive ? "page" : undefined}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          isActive 
                            ? "bg-yellow-500 text-white" 
                            : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                        }`}>
                          <i 
                            data-feather={link.icon} 
                            className="w-4 h-4"
                          ></i>
                        </div>
                        <span>{link.name}</span>
                        {isActive && (
                          <i data-feather="chevron-right" className="w-4 h-4 ml-auto text-yellow-500"></i>
                        )}
                      </a>
                    </li>
                  );
                })}
                
                {/* Dashboard Link for Admins/Moderators */}
                {user && getDashboardLink() && (
                  <li>
                    <a
                      href={getDashboardLink()}
                      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium text-sm transition-all duration-200 group ${
                        pathname.startsWith(getDashboardLink().split('/')[1])
                          ? "bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 border border-purple-200"
                          : "text-purple-600 hover:bg-purple-50 hover:text-purple-800"
                      }`}
                      onClick={() => setMenuOpen(false)}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        pathname.startsWith(getDashboardLink().split('/')[1])
                          ? "bg-purple-500 text-white" 
                          : "bg-purple-100 text-purple-600 group-hover:bg-purple-200"
                      }`}>
                        <i data-feather={getRoleIcon()} className="w-4 h-4"></i>
                      </div>
                      <span>{getDashboardName()}</span>
                      {pathname.startsWith(getDashboardLink().split('/')[1]) && (
                        <i data-feather="chevron-right" className="w-4 h-4 ml-auto text-purple-500"></i>
                      )}
                    </a>
                  </li>
                )}
              </ul>

              {/* Mobile Auth Section - Premium */}
              <div className="border-t border-gray-100 pt-8">
                {user ? (
                  <div className="space-y-3">
                    <a
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200 text-sm group"
                      onClick={() => setMenuOpen(false)}
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-gray-200">
                        <i data-feather="user" className="w-4 h-4 text-gray-600"></i>
                      </div>
                      <span>My Profile</span>
                    </a>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMenuOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-4 py-3.5 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 text-sm group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-red-400/20 flex items-center justify-center">
                        <i data-feather="log-out" className="w-4 h-4"></i>
                      </div>
                      <span>Logout</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <a
                      href="/login"
                      className="flex items-center gap-3 px-4 py-3.5 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200 text-sm group"
                      onClick={() => setMenuOpen(false)}
                    >
                      <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center group-hover:bg-gray-200">
                        <i data-feather="log-in" className="w-4 h-4 text-gray-600"></i>
                      </div>
                      <span>Log In</span>
                    </a>
                    <a
                      href="/signup"
                      className="flex items-center gap-3 px-4 py-3.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-medium rounded-xl hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200 text-sm group"
                      onClick={() => setMenuOpen(false)}
                    >
                      <div className="w-8 h-8 rounded-lg bg-yellow-400/20 flex items-center justify-center">
                        <i data-feather="user-plus" className="w-4 h-4"></i>
                      </div>
                      <span>Sign Up</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Add CSS for animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </nav>
  );
};

export default CustomNavbar;