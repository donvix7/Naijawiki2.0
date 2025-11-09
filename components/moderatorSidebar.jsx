import React from 'react'

const ModeratorSidebar = () => {
  return (
    <div>
        <aside>
        <div className="sidebar-header">
          <h2 className="sidebar-title">
            <i data-feather="shield"></i> Moderator Panel
          </h2>
        </div>
        
        <div className="sidebar-menu">
          <div className="menu-group">
            <div className="menu-title">Main</div>
            <a href="/moderator/" className="menu-item">
<i data-feather="home"></i> Dashboard
            </a>
          </div>
          
          <div className="menu-group">
            <div className="menu-title">Content Review</div>
            <a href="/moderator/review " className="menu-item">
              <i data-feather="check-circle"></i> Pending Review
              <span className="badge">24</span>
            </a>
            <a href="/moderator/approved " className="menu-item">
              <i data-feather="thumbs-up"></i> Approved Words
            </a>
            <a href="/moderator/rejected " className="menu-item">
              <i data-feather="thumbs-down"></i> Rejected Words
            </a>
            <a href="/moderator/flagged " className="menu-item">
              <i data-feather="flag"></i> Flagged Content
              <span className="badge">5</span>
            </a>
          </div>
          
          <div className="menu-group">
            <div className="menu-title">Community</div>
            <a href="/moderator/users " className="menu-item">
              <i data-feather="users"></i> User Management
            </a>
            <a href="/moderator/reports " className="menu-item">
              <i data-feather="alert-circle"></i> Reports
            </a>
          </div>
        </div>
      </aside>
    </div>
  )
}

export default ModeratorSidebar