import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { motion } from 'framer-motion'
import { jwtDecode } from 'jwt-decode'
import SecurityQuiz from './SecurityQuiz'
import SecurityQuizSetup from './SecurityQuizSetup'

const ChangePassword = () => {
  const [userId, setUserId] = useState(null)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const [showQuizSetup, setShowQuizSetup] = useState(false)
  const [showQuizVerify, setShowQuizVerify] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()

  // ✅ Get user ID from token or location
  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const decoded = token ? jwtDecode(token) : null
    const fromQuiz = location.state?.userId

    if (fromQuiz) {
      setUserId(fromQuiz)
      setCurrentPassword('[verified]')
    } else if (decoded?.userId) {
      setUserId(decoded.userId)
    }
  }, [location])

  // ✅ Force show quiz setup first time
  useEffect(() => {
    setShowQuizSetup(true)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    try {
      await axios.post('/api/change-password', {
        userId,
        currentPassword,
        newPassword,
      })

      setMessage('✅ Password successfully updated!')
      setError('')
      setTimeout(() => navigate('/user-dashboard'), 1500)
    } catch (err) {
      setError('❌ Failed to change password. Please try again.')
      setMessage('')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-black px-6 py-12 transition-all duration-500">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-3xl shadow-xl p-8 space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-pink-600 dark:text-pink-300 underline underline-offset-4">
          Change Password
        </h2>

        {message && <p className="text-green-600 dark:text-green-400 text-center">{message}</p>}
        {error && <p className="text-red-500 dark:text-red-400 text-center">{error}</p>}

        {/* 🔐 Setup Security Quiz */}
        {showQuizSetup && !showQuizVerify && (
          <SecurityQuizSetup
            userId={userId}
            onCompleted={() => setShowQuizSetup(false)}
          />
        )}

        {/* 🔐 Quiz Recovery */}
        {showQuizVerify && !showQuizSetup && (
          <SecurityQuiz
            userId={userId}
            onSuccess={() => {
              setShowQuizVerify(false)
              setCurrentPassword('[verified]')
            }}
          />
        )}

        {/* ✨ Main Form */}
        {!showQuizSetup && !showQuizVerify && (
          <form onSubmit={handleSubmit} className="space-y-5">
            {currentPassword !== '[verified]' && (
              <InputField
                label="Current Password"
                value={currentPassword}
                onChange={setCurrentPassword}
              />
            )}

            <InputField
              label="New Password"
              value={newPassword}
              onChange={setNewPassword}
            />

            <InputField
              label="Confirm New Password"
              value={confirmPassword}
              onChange={setConfirmPassword}
            />

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
              <button
                type="submit"
                className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-4 rounded-xl transition"
              >
                Update Password
              </button>

              <button
                type="button"
                onClick={() => setShowQuizVerify(true)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                🔐 Forgot your password?
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  )
}
const toggleDarkMode = () => {
  document.documentElement.classList.toggle('dark')
}


const InputField = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label}
    </label>
    <input
      type="password"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
      className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-pink-400 focus:outline-none transition"
    />
  </div>
)

export default ChangePassword
