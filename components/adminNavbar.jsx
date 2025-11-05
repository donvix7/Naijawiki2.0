import React from 'react'

const AdminNavbar = () => {
  return (
    <div>
        <nav>
        <a href="/admin/" className="logo">
<i data-feather="book-open" className="logo-icon"></i>
          NaijaLingo Admin
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
              <a href="/logout" className="dropdown-item">
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