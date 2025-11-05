import React from 'react'

const AdminSideBar = () => {
  return (
    <div>
        <aside>
        <div className="sidebar-header">
          <h2 className="sidebar-title">
            <i data-feather="settings"></i> Admin Panel
          </h2>
        </div>
        
        <div className="sidebar-menu">
          <div className="menu-group">
            <div className="menu-title">Main</div>
            <a href="/admin/dashboard." className="menu-item">
<i data-feather="home"></i> Dashboard
            </a>
          </div>
          
          <div className="menu-group">
            <div className="menu-title">Content</div>
            <a href="/admin/words" className="menu-item">
              <i data-feather="book"></i> Words
            </a>
            <a href="/admin/categories" className="menu-item">
              <i data-feather="tag"></i> Categories
            </a>
            <a href="/admin/languages" className="menu-item">
              <i data-feather="globe"></i> Languages
            </a>
          </div>
          
          <div className="menu-group">
            <div className="menu-title">Users</div>
            <a href="/admin/users" className="menu-item">
              <i data-feather="users"></i> Manage Users
            </a>
            <a href="/admin/roles" className="menu-item">
              <i data-feather="shield"></i> Roles & Permissions
            </a>
          </div>
          
          <div className="menu-group">
            <div className="menu-title">System</div>
            <a href="/admin/settings" className="menu-item">
              <i data-feather="settings"></i> Settings
            </a>
            <a href="/admin/activity-log" className="menu-item">
              <i data-feather="activity"></i> Activity Log
            </a>
          </div>
        </div>
      </aside>
    </div>
  )
}

export default AdminSideBar