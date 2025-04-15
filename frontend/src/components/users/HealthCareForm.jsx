import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaUserAlt, FaEnvelope, FaPhoneAlt,
  FaMapMarkedAlt, FaStethoscope, FaMoon, FaSun
} from 'react-icons/fa'
import axios from 'axios'
import { motion } from 'framer-motion'

function HealthCareForm() {
  const navigate = useNavigate()
  const [darkMode, setDarkMode] = useState(false)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [healthcareInfo, setHealthcareInfo] = useState({
    healthcareName: '',
    healthcareLastName: '',
    healthcareEmail: '',
    healthcarePassword: '',
    healthcareConfirmPassword: '',
    healthcarePhoneNumber: '',
    healthcareCountry: '',
    healthcareCity: '',
    healthcareSpeciality: '',
    institution:'',
    Degree:'',

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
    setHealthcareInfo((prev) => ({ ...prev, [name]: value }))
  }

  const validate = () => {
    const e = {}
    const h = healthcareInfo

    if (!h.healthcareName) e.healthcareName = "Name is required"
    if (!h.healthcareLastName) e.healthcareLastName = "Last name is required"
    if (!h.healthcareEmail) e.healthcareEmail = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(h.healthcareEmail)) e.healthcareEmail = "Invalid email"
    if (!h.healthcarePassword || h.healthcarePassword.length < 6) e.healthcarePassword = "Min 6 characters"
    if (h.healthcarePassword !== h.healthcareConfirmPassword) e.healthcareConfirmPassword = "Passwords don't match"
    if (!h.healthcareCountry) e.healthcareCountry = "Country required"
    if (!h.healthcareCity) e.healthcareCity = "City required"
    if (!h.healthcareSpeciality) e.healthcareSpeciality = "Speciality is required"
    if (h.healthcarePhoneNumber && !/^\d{10}$/.test(h.healthcarePhoneNumber)) e.healthcarePhoneNumber = "Must be 10 digits"
    if (!h.healthcareInstitution) e.healthcareInstitution = "Institution is required"
    if (!h.healthcareDegree) e.healthcareDegree = "Degree is required"

    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setIsSubmitting(true)
    try {
      await axios.post('http://localhost:5000/api/healthcare/register', {
        nom: healthcareInfo.healthcareName,
        prenom: healthcareInfo.healthcareLastName,
        email: healthcareInfo.healthcareEmail,
        password: healthcareInfo.healthcarePassword,
        confirmPassword: healthcareInfo.healthcareConfirmPassword,
        adresse: `${healthcareInfo.healthcareCountry}, ${healthcareInfo.healthcareCity}`,
        numeroTel: healthcareInfo.healthcarePhoneNumber,
        specialite: healthcareInfo.healthcareSpeciality,
        institution:healthcareInfo.healthcareInstitution,
        
      })

      setSuccess('Account created successfully!')
      setError(null)
      setTimeout(() => navigate('/'), 2000)
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.')
      setSuccess(null)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start p-6 bg-gradient-to-br from-rose-100 via-pink-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-black transition-colors duration-500">

      {/* Dark mode toggle */}
      <div className="self-end mb-4">
        <button
          onClick={toggleDarkMode}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-700 text-sm text-gray-800 dark:text-gray-200 rounded-full shadow hover:scale-105 transition"
        >
          {darkMode ? <FaSun /> : <FaMoon />} {darkMode ? 'Light' : 'Dark'} Mode
        </button>
      </div>

      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-pink-600 dark:text-pink-300 underline underline-offset-4 mb-6 text-center"
      >
        Register as Healthcare Professional
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
          {renderInput("Name", "healthcareName", healthcareInfo, handleChange, errors, FaUserAlt)}
          {renderInput("Last Name", "healthcareLastName", healthcareInfo, handleChange, errors, FaUserAlt)}
          {renderInput("Email", "healthcareEmail", healthcareInfo, handleChange, errors, FaEnvelope, "email")}
          {renderInput("Password", "healthcarePassword", healthcareInfo, handleChange, errors, null, "password")}
          {renderInput("Confirm Password", "healthcareConfirmPassword", healthcareInfo, handleChange, errors, null, "password")}
          {renderInput("Phone Number", "healthcarePhoneNumber", healthcareInfo, handleChange, errors, FaPhoneAlt)}
          {renderInput("Country", "healthcareCountry", healthcareInfo, handleChange, errors, FaMapMarkedAlt)}
          {renderInput("City", "healthcareCity", healthcareInfo, handleChange, errors, FaMapMarkedAlt)}

          {/* Speciality (select) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              <FaStethoscope className="inline mr-2" /> Speciality
            </label>
            <select
              name="healthcareSpeciality"
              value={healthcareInfo.healthcareSpeciality}
              onChange={handleChange}
              className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-pink-400 focus:outline-none transition"
            >
              <option value="">-- Select --</option>
              <option value="Child Psychiatrist">Child Psychiatrist</option>
              <option value="Speech Therapist">Speech Therapist</option>
            </select>
            {errors.healthcareSpeciality && <p className="text-sm text-red-500 mt-1">{errors.healthcareSpeciality}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-4 mt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-pink-200 hover:bg-pink-300 text-pink-900 font-semibold px-6 py-2 rounded-lg shadow transition disabled:opacity-50"
          >
            {isSubmitting ? 'Registering...' : 'Register'}
          </button>

          <button
            type="button"
            onClick={() => navigate(-1)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white font-semibold px-6 py-2 rounded-lg shadow transition"
          >
            Cancel
          </button>
        </div>
      </motion.form>
    </div>
  )
}

// Helper function to render input fields
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

export default HealthCareForm
