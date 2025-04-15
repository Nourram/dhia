import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaMoon, FaSun } from 'react-icons/fa'
import { motion } from 'framer-motion'

function HomePage() {
  const navigate = useNavigate()
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setDarkMode(prefersDark)
    document.documentElement.classList.toggle('dark', prefersDark)
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark', !darkMode)
  }

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-6 bg-gradient-to-br from-pink-50 via-rose-100 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-black transition-colors duration-500">

      {/* 🌙 Dark Mode + Login Button */}
      <div className="absolute top-4 right-4 flex items-center gap-4">
        <button
          onClick={toggleDarkMode}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-full shadow hover:scale-105 transition"
        >
          {darkMode ? <FaSun /> : <FaMoon />} {darkMode ? 'Light' : 'Dark'}
        </button>

        <button
          onClick={() => navigate('/Login-form')}
          className="px-4 py-2 text-sm bg-pink-200 hover:bg-pink-300 text-pink-900 font-medium rounded-full shadow transition"
        >
          Login
        </button>
      </div>

      {/* 🧠 Title + Description + CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl"
      >
        <h1 className="text-5xl md:text-6xl font-extrabold text-pink-600 dark:text-pink-400 mb-6 font-[cursive] tracking-wide">
          AutiLearn
        </h1>

        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed">
          AutiLearn is an inclusive platform designed to support the learning and development of children with autism spectrum disorders through tailored educational paths and interactive tools.
        </p>

        <button
          onClick={() => navigate('/user-type')}
          className="px-8 py-3 bg-pink-300 hover:bg-pink-400 text-pink-900 font-semibold text-lg rounded-full shadow-lg transition"
        >
          Get Started
        </button>
      </motion.div>
    </div>
  )
}

export default HomePage
