import { useState } from "react"
import { Link, Outlet, useNavigate } from "react-router-dom"
import { FaSignOutAlt, FaMoon, FaSun, FaHome } from "react-icons/fa"

const AdminDashboard = () => {
  const [showMenu, setShowMenu] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    navigate("/Login-form")
  }

  const toggleTheme = () => {
    setDarkMode(!darkMode)
    document.body.classList.toggle("dark")
  }

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="h-screen w-full flex bg-gradient-to-br from-rose-100 via-pink-100 to-violet-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 overflow-hidden">
        
        {/* Sidebar */}
        <aside className="w-64 bg-white/80 dark:bg-gray-800 p-6 shadow-xl backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-pink-500 dark:text-pink-300">Admin Panel</h2>
            </div>
            <nav>
              <ul className="space-y-6 text-lg font-medium">
                <li><Link to="users" className="flex items-center gap-3 hover:text-pink-500">👥 Users</Link></li>
                <li><a href="#" className="flex items-center gap-3 hover:text-pink-500">📊 Statistics</a></li>
                <li><a href="#" className="flex items-center gap-3 hover:text-pink-500">⚙️ Settings</a></li>
                <li><a href="#" className="flex items-center gap-3 hover:text-pink-500">📝 Reports</a></li>
              </ul>
            </nav>
          </div>

          {/* Dark Mode Toggle */}
          <div className="mt-10 border-t pt-4">
            <button
              onClick={toggleTheme}
              className="flex items-center justify-between w-full bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded-lg hover:bg-pink-100 dark:hover:bg-gray-600 transition"
            >
              <span className="text-sm font-medium">Dark Mode</span>
              {darkMode ? <FaSun className="text-yellow-400" /> : <FaMoon className="text-gray-600" />}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          {/* Header */}
          <header className="flex items-center justify-between p-4 bg-white/80 dark:bg-gray-800 shadow-md">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Dashboard</h1>

            <div className="flex items-center gap-6">
               {/* HOME button à droite */}
               <Link
                   to="/admin-dashboard"
                   className="flex items-center gap-2 text-pink-600 dark:text-pink-300 font-medium hover:underline hover:translate-x-1 transition duration-300 mr-2"
               >
                 <FaHome /> Home
                </Link>

            {/* Admin avatar + menu */}
              <div className="relative">
                <div
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-md hover:bg-pink-100 dark:hover:bg-gray-700 transition"
                >
                  <span className="font-medium">Admin</span>
                  <span className="text-2xl">👤</span>
                </div>

                {showMenu && (
                  <div className="absolute right-0 mt-2 bg-white dark:bg-gray-800 shadow-lg rounded-md p-2 z-10">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 text-red-500 hover:text-red-600 px-2 py-1"
                    >
                      <FaSignOutAlt /> Log Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>


          {/* Main Area */}
          <main className="flex-1 overflow-y-auto p-6 bg-white/70 dark:bg-gray-900 backdrop-blur-md rounded-tl-3xl shadow-inner">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
