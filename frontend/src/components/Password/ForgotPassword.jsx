import React, { useState } from 'react'
import axios from 'axios'
import { FaEnvelope, FaLock, FaSun, FaMoon, FaKey } from 'react-icons/fa'

function ForgotPassword() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark', !darkMode)
  }

  const handleEmailSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:5000/api/reset/forgot-password', { email })
      setMessage('Verification code sent to your email.')
      setError('')
      setStep(2)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send code')
    }
  }

  const handleCodeVerify = async (e) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:5000/api/reset/verify-code', { email, code })
      setMessage('Code verified. Please enter your new password.')
      setError('')
      setStep(3)
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid or expired code')
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    if (newPassword.length < 6) return setError('Password must be at least 6 characters')
    if (newPassword !== confirmPassword) return setError('Passwords do not match')

    try {
      await axios.post('http://localhost:5000/api/reset/reset-password', {
        email,
        newPassword
      })
      setMessage('✅ Password updated successfully!')
      setError('')
      setStep(4) // final step
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-rose-50 to-indigo-100 dark:from-gray-900 dark:to-black p-6">
      <div className="absolute top-4 right-4">
        <button onClick={toggleDarkMode} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-full shadow">
          {darkMode ? <FaSun /> : <FaMoon />} Mode
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-pink-600 dark:text-pink-300">Forgot Password</h2>

        {error && <p className="text-red-500 text-center">{error}</p>}
        {message && <p className="text-green-600 text-center">{message}</p>}

        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <label className="block text-sm font-medium">
              <FaEnvelope className="inline mr-2" /> Enter your email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            />
            <button type="submit" className="w-full bg-pink-200 hover:bg-pink-300 px-6 py-3 font-semibold rounded-xl">
              Send Code
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleCodeVerify} className="space-y-4">
            <label className="block text-sm font-medium">
              <FaKey className="inline mr-2" /> Enter verification code
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            />
            <button type="submit" className="w-full bg-pink-200 hover:bg-pink-300 px-6 py-3 font-semibold rounded-xl">
              Verify Code
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <label className="block text-sm font-medium">
              <FaLock className="inline mr-2" /> New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            />
            <label className="block text-sm font-medium">
              <FaLock className="inline mr-2" /> Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
            />
            <button type="submit" className="w-full bg-pink-200 hover:bg-pink-300 px-6 py-3 font-semibold rounded-xl">
              Reset Password
            </button>
          </form>
        )}

        {step === 4 && (
          <div className="text-center">
            <p className="text-green-600 font-semibold">🎉 Your password has been reset!</p>
            <button onClick={() => window.location.href = '/Login-Form'} className="mt-4 bg-pink-200 px-4 py-2 rounded-xl hover:bg-pink-300">
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ForgotPassword
