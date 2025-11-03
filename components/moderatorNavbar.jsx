import React from 'react'

const ModeratorNavbar = () => {
  return (
    <div>
        <nav>
        <a href="/moderator/" className="logo">
<i data-feather="book-open" className="logo-icon"></i>
          NaijaLingo Moderator
        </a>
        
        <button className="mobile-menu-btn">
          <i data-feather="menu"></i>
        </button>
        
        <div className="user-menu">
          <div className="dropdown">
            <div className="user-avatar">MO</div>
            <div className="dropdown-content">
              <a href="/moderator/profile.html" className="dropdown-item">
                <i data-feather="user"></i> Profile
              </a>
              <a href="/moderator/settings.html" className="dropdown-item">
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

export default ModeratorNavbar