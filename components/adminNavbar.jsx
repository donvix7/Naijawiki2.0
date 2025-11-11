"use client";
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react'

const AdminNavbar = () => {

  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check for token and email in cookies
    const token = Cookies.get("token");
    const email = Cookies.get("email");
    const role = Cookies.get("role");


    console.log(token,email,role);

    if (token && email && role === "admin") {
      setUser({ role });
    } else {
      setUser(null);
    }
  }, []);
  
    const handleLogout = () => {
      Cookies.remove("token");
      Cookies.remove("email");
      Cookies.remove("role");

      setUser(null);
      window.location.href = "/";
    };
  
  return (
    <div className="admin">
        <nav >
        <a href="/admin/" className="logo">
<i data-feather="book-open" className="logo-icon"></i>
          NaijaLingo {user}
        </a>
        
        <button className="mobile-menu-btn">
          <i data-feather="menu"></i>
        </button>
        
        <div className="user-menu">
          <div className="dropdown">
            <div className="user-avatar">AD</div>
            <div className="dropdown-content">
              <a href="/admin/profile" className="dropdown-item">
                <i data-feather="user"></i> Profile
              </a>
              <a href="/admin/settings" className="dropdown-item">
                <i data-feather="settings"></i> Settings
              </a>
              <a href="/" onClick={handleLogout} className="dropdown-item">
                <i data-feather="log-out"></i> Logout
              </a>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default AdminNavbar