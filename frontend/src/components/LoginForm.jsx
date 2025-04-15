import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import { motion } from 'framer-motion'
import { FaEnvelope, FaLock, FaSun, FaMoon } from 'react-icons/fa'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
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

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { email, password })
      const token = response.data.token
      const userType = response.data.userType

      if (token) {
        const decoded = jwtDecode(token)
        localStorage.setItem('authToken', token)
        localStorage.setItem('userType', userType)
        console.log('Token decoded:', decoded)
        console.log('User type:', userType)

        if (decoded.userType === 'admin') {
          navigate('/admin-dashboard')
        } else {
          navigate('/user-dashboard')
        }
      } else {
        setError('Invalid credentials')
      }
    } catch (err) {
      console.log("Login error:", err.response?.data);
      console.error('Login error:', err)
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    }
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-pink-50 via-rose-100 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-black transition-colors duration-500 p-6">
      
      {/* Dark Mode Toggle */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={toggleDarkMode}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-full shadow hover:scale-105 transition"
        >
          {darkMode ? <FaSun /> : <FaMoon />} {darkMode ? 'Light' : 'Dark'} Mode
        </button>
      </div>

      {/* Login Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white dark:bg-gray-900 shadow-lg rounded-2xl p-8 space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-pink-600 dark:text-pink-300 underline underline-offset-4">AutiLearn</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              <FaEnvelope className="inline mr-2" /> Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-pink-400 focus:outline-none transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              <FaLock className="inline mr-2" /> Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-pink-400 focus:outline-none transition"
            />
          </div>

          {/* Error message */}
          {error && <p className="text-sm text-red-500">{error}</p>}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-pink-200 hover:bg-pink-300 text-pink-900 font-semibold px-6 py-3 rounded-xl shadow transition"
          >
            Log In
          </button>
        </form>

        {/* Links */}
        <div className="text-center space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <Link
            to="/forgot-password"
            className="text-pink-500 hover:underline"
          >
            Forgot password?
          </Link>
          <p>
            Don't have an account?{" "}
            <Link to="/user-type" className="text-pink-500 hover:underline">
              Create one
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default LoginForm
