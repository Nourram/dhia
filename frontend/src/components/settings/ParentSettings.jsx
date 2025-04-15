import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'

const ParentSettings = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    country: '',
    phoneNumber: '',
    childSchool: '',
    medications:''
  })

  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  // Fetch data on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken')
        const res = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        })

        setFormData({
          name: res.data.nom || '',
          email: res.data.email || '',
          address: res.data.adresse || '',
          country: res.data.pays || '',
          phoneNumber: res.data.numeroTel || '',
          childSchool: res.data.nomEcole || '',
          medications: res.data.medications || ''
        })
      } catch (err) {
        setError('❌ Error loading user data.')
      }
    }

    fetchData()
  }, [])

  // Handle field change
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Submit profile update
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('authToken')
      await axios.put('http://localhost:5000/api/users/profile', formData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setSuccess('✅ Profile updated successfully!')
      setError('')
    } catch (err) {
      setError('❌ Failed to update profile.')
      setSuccess('')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-black px-6 py-12 transition-all duration-500">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white dark:bg-gray-900 shadow-xl rounded-3xl p-8 sm:p-10 space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-pink-600 dark:text-pink-300 underline underline-offset-4">
          Edit Your Profile
        </h2>

        {success && <p className="text-green-600 text-center">{success}</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {renderInput('👤 Name', 'name', formData, handleChange)}
          {renderInput('📧 Email', 'email', formData, handleChange)}
          {renderInput('📍 Address', 'address', formData, handleChange)}
          {renderInput('🌍 Country', 'country', formData, handleChange)}
          {renderInput('📞 Phone Number', 'phoneNumber', formData, handleChange)}
          {renderInput("🏫 Child's School", 'childSchool', formData, handleChange)}
          {renderInput("   Medications", 'medications', formData, handleChange)}

          <div className="pt-4">
            <button
              type="submit"
              className="w-full bg-pink-300 hover:bg-pink-400 text-white font-semibold py-3 rounded-xl shadow transition duration-300"
            >
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

const renderInput = (label, name, state, onChange) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <div className="relative">
      <input
        type={name === 'email' ? 'email' : 'text'}
        name={name}
        value={state[name]}
        onChange={onChange}
        className="w-full p-3 pl-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
      />
    </div>
  </div>
)

export default ParentSettings
