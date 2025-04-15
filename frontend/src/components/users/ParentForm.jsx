import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  FaUser, FaPhone, FaEnvelope, FaLock, FaCalendarAlt, FaMoon, FaSun
} from 'react-icons/fa'
import axios from 'axios'
import { motion } from 'framer-motion'

function ParentForm() {
  const [parentInfo, setParentInfo] = useState({
    parentName: '', parentLastName: '', parentEmail: '', parentPassword: '', parentConfirmPassword: '',
    parentCountry: '', parentCity: '', parentPhoneNumber: '', relationWithChild: ''
  })

  const [numberOfChildren, setNumberOfChildren] = useState(1)
  const [childrenInfo, setChildrenInfo] = useState([createEmptyChild()])
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(null)
  const [error, setError] = useState(null)
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

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setParentInfo((prev) => ({ ...prev, [name]: value }))
  }

  const handleNumberChange = (e) => {
    const count = parseInt(e.target.value)
    setNumberOfChildren(count)
    setChildrenInfo(Array.from({ length: count }, (_, i) => childrenInfo[i] || createEmptyChild()))
  }

  const handleChildChange = (index, e) => {
    const { name, value } = e.target
    const updatedChildren = [...childrenInfo]
    updatedChildren[index][name] = value
    setChildrenInfo(updatedChildren)
  }

  const validate = () => {
    let validationErrors = {}
    const p = parentInfo
  
    // Parent info
    if (!p.parentName) validationErrors.parentName = 'First name is required'
    if (!p.parentLastName) validationErrors.parentLastName = 'Last name is required'
  
    if (!p.parentEmail) {
      validationErrors.parentEmail = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(p.parentEmail)) {
      validationErrors.parentEmail = 'Please enter a valid email address'
    }
  
    if (!p.parentPhoneNumber) {
      validationErrors.parentPhoneNumber = 'Phone number is required'
    } else if (!/^\d{8}$/.test(p.parentPhoneNumber)) {
      validationErrors.parentPhoneNumber = 'Phone number must be exactly 8 digits'
    }
  
    if (!p.parentCountry) validationErrors.parentCountry = 'Country is required'
    if (!p.parentCity) validationErrors.parentCity = 'City is required'
  
    if (!p.parentPassword) {
      validationErrors.parentPassword = 'Password is required'
    } else if (p.parentPassword.length < 6) {
      validationErrors.parentPassword = 'Password must be at least 6 characters'
    }
  
    if (p.parentPassword !== p.parentConfirmPassword) {
      validationErrors.password = 'Passwords do not match'
    }
  
    if (!p.relationWithChild) {
      validationErrors.relationWithChild = 'Please specify your relationship with the child'
    }
  
    // Children info
    childrenInfo.forEach((child, i) => {
      if (!child.childName) validationErrors[`childName${i}`] = `Child ${i + 1}: First name is required`
      if (!child.childLastName) validationErrors[`childLastName${i}`] = `Child ${i + 1}: Last name is required`
      if (!child.childDateOfBirth){ validationErrors[`childDateOfBirth${i}`] = `Child ${i + 1}: Birthdate is required`
    }else {
      const birthDate = new Date(child.childDateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const isTooYoung = age < 6 || (age === 6 && monthDiff < 0);
      const isTooOld = age > 11 || (age === 11 && monthDiff > 0);
      if (isTooYoung || isTooOld) {
        validationErrors[`childDateOfBirth${i}`] = `Child ${i + 1} must be between 6 and 11 years old`;
      }
    }
      if (!child.childGender) validationErrors[`childGender${i}`] = `Child ${i + 1}: Gender is required`
      if (!child.childLevel) validationErrors[`childLevel${i}`] = `Child ${i + 1}: Level is required`
      if (!child.behavior) validationErrors[`behavior${i}`] = `Child ${i + 1}: Behavior is required`
      if (child.behavior === 'Other' && !child.behaviorDescription) {
        validationErrors[`behaviorDescription${i}`] = `Child ${i + 1}: Please describe the behavior`
      }
    });
  
    setErrors(validationErrors)
    return Object.keys(validationErrors).length === 0
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validate()) {
      setIsSubmitting(true)
      try {
        console.log("🧒 Données enfants envoyées :", childrenInfo)

        await axios.post('http://localhost:5000/api/auth/parent/signup', {
          name: parentInfo.parentName,
          lastName: parentInfo.parentLastName,
          email: parentInfo.parentEmail,
          password: parentInfo.parentPassword,
          address: `${parentInfo.parentCountry}, ${parentInfo.parentCity}`,
          phoneNumber: parentInfo.parentPhoneNumber,
          relationWithChild: parentInfo.relationWithChild,
          child: childrenInfo
        })

        setSuccess('Account created! Redirecting...')
        setError(null)
        setTimeout(() => navigate('/'), 2000)
      } catch (err) {
        console.log(err.response?.data)
        setError('Signup failed. Try again.')
        setSuccess(null)
      }
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start p-6 bg-gradient-to-br from-rose-100 via-pink-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-black transition-colors duration-500">
      <div className="self-end mb-4">
        <button onClick={toggleDarkMode} className="flex items-center gap-2 text-sm px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full shadow hover:scale-105 transition">
          {darkMode ? <FaSun /> : <FaMoon />} {darkMode ? 'Light' : 'Dark'} Mode
        </button>
      </div>

      <motion.h1
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-pink-600 dark:text-pink-400 underline underline-offset-4 mb-6 text-center"
      >
        Register As A Parent
      </motion.h1>

      {success && <p className="text-green-600 text-center mb-4">{success}</p>}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl bg-white dark:bg-gray-900 shadow-xl rounded-2xl p-6 space-y-6 transition"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {renderInput("First Name", "parentName", parentInfo, handleInputChange, errors, FaUser)}
          {renderInput("Last Name", "parentLastName", parentInfo, handleInputChange, errors, FaUser)}
          {renderInput("Country", "parentCountry", parentInfo, handleInputChange, errors)}
          {renderInput("City", "parentCity", parentInfo, handleInputChange, errors)}
          {renderInput("Email", "parentEmail", parentInfo, handleInputChange, errors, FaEnvelope, "email")}
          {renderInput("Phone", "parentPhoneNumber", parentInfo, handleInputChange, errors, FaPhone, "tel")}
          {renderInput("Password", "parentPassword", parentInfo, handleInputChange, errors, FaLock, "password")}
          {renderInput("Confirm Password", "parentConfirmPassword", parentInfo, handleInputChange, errors, FaLock, "password")}
        </div>

        {renderInput("NumberOfAutisticChildren", "numberOfChildren", { numberOfChildren }, (e) => handleNumberChange(e), {}, null, "number")}

        {childrenInfo.map((child, index) => (
          <div key={index} className="mt-6 border-t border-pink-200 dark:border-gray-700 pt-4">
            <h4 className="text-lg font-bold text-pink-500 dark:text-pink-300 mb-2">Child {index + 1}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderInput("ChildName", "childName", child, (e) => handleChildChange(index, e), errors, FaUser)}
              {renderInput("ChildLastName", "childLastName", child, (e) => handleChildChange(index, e), errors)}
              {renderInput("ChildDateOfBirth", "childDateOfBirth", child, (e) => handleChildChange(index, e), errors, FaCalendarAlt, "date")}
              {renderSelect("Gender", "childGender", child, (e) => handleChildChange(index, e), errors, ["Male", "Female"])}
              {renderSelect("ChildLevel", "childLevel", child, (e) => handleChildChange(index, e), errors, ['1 - Very Easy', '2 - Easy', '3 - Medium', '4 - Hard', '5 - Very Hard'])}
              {renderSelect("Behavior", "behavior", child, (e) => handleChildChange(index, e), errors, ['Calm', 'Aggressive', 'Hyperactive', 'Shy', 'Anxious', 'Sociable', 'Other'])}
              {child.behavior === 'Other' && renderInput("Describe The Behavior", "behaviorDescription", child, (e) => handleChildChange(index, e), errors, null, "textarea")}
              {renderInput("ChildSchool", "childSchool", child, (e) => handleChildChange(index, e), errors)}
              {renderInput("Medications", "medications", child, (e) => handleChildChange(index, e), errors, null, "textarea")}
            </div>
          </div>
        ))}

        {renderSelect("RelationWithChild", "relationWithChild", parentInfo, handleInputChange, errors, ['Mother', 'Father'])}

        <div className="flex justify-end gap-4 mt-4">
          <button type="submit" disabled={isSubmitting}
            className="bg-pink-200 hover:bg-pink-300 text-pink-900 font-semibold px-6 py-2 rounded-lg shadow transition disabled:opacity-50">
            {isSubmitting ? "Submitting..." : "Sign Up"}
          </button>
          <button type="button" onClick={() => navigate('/')}
            className="bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white font-semibold px-6 py-2 rounded-lg shadow transition">
            Cancel
          </button>
        </div>
      </motion.form>
    </div>
  )
}

const createEmptyChild = () => ({
  childName: '', childLastName: '', childDateOfBirth: '', childGender: '', childLevel: '', behavior: '', behaviorDescription: '', childSchool: '', medications: ''
})

const renderInput = (label, name, state, onChange, errors, Icon = null, type = "text") => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
      {Icon && <span className="inline mr-2"><Icon /></span>}{label}
    </label>
    {type === "textarea" ? (
      <textarea
        name={name}
        value={state[name]}
        onChange={onChange}
        className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-pink-400 focus:outline-none transition"
      />
    ) : (
      <input
        type={type}
        name={name}
        value={state[name]}
        onChange={onChange}
        className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-pink-400 focus:outline-none transition"
      />
    )}
    {errors[name] && <p className="text-sm text-red-500 mt-1">{errors[name]}</p>}
  </div>
)

const renderSelect = (label, name, state, onChange, errors, options = []) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">{label}</label>
    <select
      name={name}
      value={state[name]}
      onChange={onChange}
      className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-pink-400 focus:outline-none transition"
    >
      <option value="">-- Select --</option>
      {options.map((opt, i) => (
        <option key={i} value={opt}>{opt}</option>
      ))}
    </select>
    {errors[name] && <p className="text-sm text-red-500 mt-1">{errors[name]}</p>}
  </div>
)

export default ParentForm
