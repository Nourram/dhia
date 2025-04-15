"use client"

import { useState } from "react"
import "./admin.css"
import { Users, Home, Settings, BarChart, LogOut } from "lucide-react"

const Sidebar = ({ activeItem = "users" }) => {
  const [collapsed, setCollapsed] = useState(false)

  const toggleSidebar = () => {
    setCollapsed(!collapsed)
  }

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <h2 className={collapsed ? "hidden" : ""}>Admin Panel</h2>
        <button className="toggle-btn" onClick={toggleSidebar}>
          {collapsed ? "→" : "←"}
        </button>
      </div>

      <div className="sidebar-content">
        <ul className="sidebar-menu">
          <li className={activeItem === "dashboard" ? "active" : ""}>
            <a href="/admin/dashboard">
              <Home className="menu-icon" />
              <span className={collapsed ? "hidden" : ""}>Tableau de bord</span>
            </a>
          </li>
          <li className={activeItem === "users" ? "active" : ""}>
            <a href="/admin/users">
              <Users className="menu-icon" />
              <span className={collapsed ? "hidden" : ""}>Utilisateurs</span>
            </a>
          </li>
          <li className={activeItem === "statistics" ? "active" : ""}>
            <a href="/admin/statistics">
              <BarChart className="menu-icon" />
              <span className={collapsed ? "hidden" : ""}>Statistiques</span>
            </a>
          </li>
          <li className={activeItem === "settings" ? "active" : ""}>
            <a href="/admin/settings">
              <Settings className="menu-icon" />
              <span className={collapsed ? "hidden" : ""}>Paramètres</span>
            </a>
          </li>
        </ul>
      </div>

      <div className="sidebar-footer">
        <a href="/logout">
          <LogOut className="menu-icon" />
          <span className={collapsed ? "hidden" : ""}>Déconnexion</span>
        </a>
      </div>
    </div>
  )
}

export default Sidebar

