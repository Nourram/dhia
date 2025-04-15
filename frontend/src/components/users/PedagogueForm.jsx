import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaUserAlt, FaEnvelope, FaPhoneAlt,
  FaMapMarkedAlt, FaRegCalendarAlt, FaGlobeEurope,
  FaSun, FaMoon, FaGraduationCap
} from 'react-icons/fa'
import axios from 'axios'
import { motion } from 'framer-motion'

function PedagogueForm() {
  const [darkMode, setDarkMode] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const [PedagogueInfo, setPedagogueInfo] = useState({
    PedagogueName: '',
    PedagogueLastName: '',
    PedagogueEmail: '',
    PedagoguePassword: '',
    PedagogueConfirmPassword: '',
    PedagogueAddress: '',
    PedagoguePhoneNumber: '',
    PedagogueCountry: '',
    PedagogueCity: '',
    PedagogueExperience: '',
    PedagogueDegreeObtained:''
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    setDarkMode(prefersDark)
    document.documentElement.classList.toggle('dark', prefersDark)
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark', !darkMode)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setPedagogueInfo((prev) => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    const e = {}
    const p = PedagogueInfo

    if (!p.PedagogueName) e.PedagogueName = 'Name is required'
    if (!p.PedagogueLastName) e.PedagogueLastName = 'Last name is required'
    if (!p.PedagogueEmail) e.PedagogueEmail = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.PedagogueEmail)) e.PedagogueEmail = 'Invalid email'
    if (!p.PedagoguePassword || p.PedagoguePassword.length < 6) e.PedagoguePassword = 'Min 6 characters'
    if (p.PedagoguePassword !== p.PedagogueConfirmPassword) e.PedagogueConfirmPassword = 'Passwords do not match'
    if (!p.PedagogueCountry) e.PedagogueCountry = 'Country required'
    if (!p.PedagogueCity) e.PedagogueCity = 'City required'
    if (p.PedagoguePhoneNumber && !/^\d{8}$/.test(p.PedagoguePhoneNumber)) e.PedagoguePhoneNumber = 'Phone must be 8 digits'
    if (!p.PedagogueExperience) e.PedagogueExperience = 'Experience is required'
    if (!p.PedagogueDegreeObtained) e.PedagogueDegreeObtained = 'Degree obtained is required'

    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    try {
      await axios.post('http://localhost:5000/api/auth/signup/pedagogue', {
        nom: PedagogueInfo.PedagogueName,
        prenom: PedagogueInfo.PedagogueLastName,
        email: PedagogueInfo.PedagogueEmail,
        password: PedagogueInfo.PedagoguePassword,
        confirmPassword: PedagogueInfo.PedagogueConfirmPassword,
        adresse: `${PedagogueInfo.PedagogueCountry}, ${PedagogueInfo.PedagogueCity}`,
        numeroTel: PedagogueInfo.PedagoguePhoneNumber,
        nombreAnneeExperience: PedagogueInfo.PedagogueExperience,
        diplomeObtenu: PedagogueInfo.PedagogueDegreeObtained,
      })

      setSuccess('Account created successfully!')
      setError(null)
      setTimeout(() => navigate('/Login-form'), 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Signup error')
      setSuccess(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start p-6 bg-gradient-to-br from-indigo-100 via-pink-50 to-rose-100 dark:from-gray-900 dark:via-gray-800 dark:to-black transition-colors duration-500">
      
      {/* Toggle Dark Mode */}
      <div className="self-end mb-4">
        <button
          onClick={toggleDarkMode}
          className="flex items-center gap-2 px-4 py-2 text-sm bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-full shadow hover:scale-105 transition"
        >
          {darkMode ? <FaSun /> : <FaMoon />} {darkMode ? 'Light' : 'Dark'} Mode
        </button>
      </div>

      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-pink-600 dark:text-pink-300 underline underline-offset-4 mb-6 text-center"
      >
        Register as Pedagogue
      </motion.h2>

      {success && <p className="text-green-600 text-center mb-4">{success}</p>}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-6 space-y-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderInput("Pedagogue Name", "PedagogueName", PedagogueInfo, handleChange, errors, FaUserAlt)}
          {renderInput("Last Name", "PedagogueLastName", PedagogueInfo, handleChange, errors, FaUserAlt)}
          {renderInput("Email", "PedagogueEmail", PedagogueInfo, handleChange, errors, FaEnvelope, "email")}
          {renderInput("Password", "PedagoguePassword", PedagogueInfo, handleChange, errors, null, "password")}
          {renderInput("Confirm Password", "PedagogueConfirmPassword", PedagogueInfo, handleChange, errors, null, "password")}
          {renderInput("Phone Number", "PedagoguePhoneNumber", PedagogueInfo, handleChange, errors, FaPhoneAlt)}
          {renderInput("Country", "PedagogueCountry", PedagogueInfo, handleChange, errors, FaGlobeEurope)}
          {renderInput("City", "PedagogueCity", PedagogueInfo, handleChange, errors, FaMapMarkedAlt)}
          {renderInput("Years of Experience", "PedagogueExperience", PedagogueInfo, handleChange, errors, FaRegCalendarAlt, "number")}
          {renderInput("Degree Obtained", "PedagogueDegreeObtained", PedagogueInfo, handleChange, errors, FaGraduationCap)}

        </div>

        <div className="flex justify-end gap-4 mt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-pink-200 hover:bg-pink-300 text-pink-900 font-semibold px-6 py-2 rounded-lg shadow transition disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Sign Up'}
          </button>

          <button
            type="button"
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white font-semibold px-6 py-2 rounded-lg shadow transition"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
        </div>
      </motion.form>
    </div>
  )
}

// Reusable input renderer
const renderInput = (label, name, state, onChange, errors, Icon = null, type = "text") => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
      {Icon && <Icon className="inline mr-2" />} {label}
    </label>
    <input
      type={type}
      name={name}
      value={state[name]}
      onChange={onChange}
      className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-pink-400 focus:outline-none transition"
    />
    {errors[name] && <p className="text-sm text-red-500 mt-1">{errors[name]}</p>}
  </div>
)

export default PedagogueForm
