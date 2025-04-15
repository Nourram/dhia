import React, { useState } from 'react'
import EditProfile from './EditProfile'
import ChangePassword from './ChangePassword'
import DeleteAccount from './DeleteAccount'
import { FaEdit, FaLock, FaTrash } from 'react-icons/fa'
import { AnimatePresence, motion } from 'framer-motion'

const SettingsRouter = ({ userId, onLogout }) => {
  const [activeTab, setActiveTab] = useState('edit')

  if (!userId) {
    return (
      <div className="text-center text-red-500 mt-20 text-lg">
        User not authenticated.
      </div>
    )
  }

  const renderContent = () => {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'edit' && <EditProfile userId={userId} />}
          {activeTab === 'password' && <ChangePassword userId={userId} />}
          {activeTab === 'delete' && <DeleteAccount userId={userId} onLogout={onLogout} />}
        </motion.div>
      </AnimatePresence>
    )
  }

  const getTitle = () => {
    switch (activeTab) {
      case 'edit':
        return 'Edit Profile'
      case 'password':
        return 'Change Password'
      case 'delete':
        return 'Delete Account'
      default:
        return ''
    }
  }

  return (
    <div className="flex flex-col sm:flex-row bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden min-h-screen">
      {/* Sidebar */}
      <aside className="w-full sm:w-64 bg-gray-100 dark:bg-gray-900 p-6 space-y-4 border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-100 mb-4">
          ⚙️ Settings
        </h3>
        <ul className="space-y-2">
          <li>
            <button
              onClick={() => setActiveTab('edit')}
              className={`flex items-center gap-2 w-full text-left p-2 rounded-md ${
                activeTab === 'edit'
                  ? 'bg-pink-200 dark:bg-pink-500 text-white'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <FaEdit /> Edit Profile
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('password')}
              className={`flex items-center gap-2 w-full text-left p-2 rounded-md ${
                activeTab === 'password'
                  ? 'bg-yellow-200 dark:bg-yellow-500 text-white'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <FaLock /> Change Password
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveTab('delete')}
              className={`flex items-center gap-2 w-full text-left p-2 rounded-md ${
                activeTab === 'delete'
                  ? 'bg-red-200 dark:bg-red-500 text-white'
                  : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              <FaTrash /> Delete Account
            </button>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">{getTitle()}</h2>
        {renderContent()}
      </div>
    </div>
  )
}

export default SettingsRouter
