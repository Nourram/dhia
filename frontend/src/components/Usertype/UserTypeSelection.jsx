import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaUserAlt, FaMoon, FaSun } from 'react-icons/fa'
import { motion } from 'framer-motion'

function UserTypeSelection() {
  const [userType, setUserType] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setDarkMode(prefersDark)
    document.documentElement.classList.toggle('dark', prefersDark)
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark', !darkMode)
  }

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value)
  }

  const handleBackToLogin = () => {
    navigate('/Login-form')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (userType === 'parent') navigate('/parent-form')
    else if (userType === 'educator') navigate('/pédagogue-form')
    else if (userType === 'health-professional') navigate('/health-professional-form')
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-pink-50 via-rose-100 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-black transition-colors duration-500">
      
      {/* 🔘 Dark Mode Toggle */}
    <div className="absolute top-4 right-4 z-50">
      <button
        onClick={toggleDarkMode}
        className="flex items-center gap-2 px-4 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-full shadow hover:scale-105 transition"
      >
        {darkMode ? <FaSun /> : <FaMoon />} {darkMode ? 'Light' : 'Dark'} Mode
      </button>
    </div>

      {/* 🧾 Form Container */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-8 space-y-6"
      >
        <h1 className="text-3xl font-bold text-center text-pink-600 dark:text-pink-300 underline underline-offset-4">Welcome!</h1>
        <p className="text-center text-gray-600 dark:text-gray-300">Please select your user type:</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Select Field */}
          <div className="flex items-center gap-3">
            <FaUserAlt className="text-pink-500 dark:text-pink-300" />
            <select
              id="user-type"
              value={userType}
              onChange={handleUserTypeChange}
              required
              className="w-full p-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white focus:ring-2 focus:ring-pink-400 focus:outline-none transition"
            >
              <option value="">-- Select --</option>
              <option value="parent">Parent</option>
              <option value="educator">Pedagogue</option>
              <option value="health-professional">HealthCare Professional</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <button
              type="submit"
              className="bg-pink-200 hover:bg-pink-300 text-pink-900 font-semibold px-6 py-2 rounded-lg shadow transition disabled:opacity-50"
              disabled={!userType}
            >
              Continue
            </button>
            <button
              type="button"
              onClick={handleBackToLogin}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white font-semibold px-6 py-2 rounded-lg shadow transition"
            >
              Back to Login
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default UserTypeSelection
