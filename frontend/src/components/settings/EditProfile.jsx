import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { jwtDecode } from 'jwt-decode'; // Ajouté ici

const EditProfile = () => {
  const [formData, setFormData] = useState({
    address: '',
    phoneNumber: '',
    childSchool: '',
    medications: '',
    name: '',
  });

  const [userType, setUserType] = useState('');
  const [userId, setUserId] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token){
      navigate('/Login-form');
      return;
    }
       

    const decoded = jwtDecode(token);
    console.log("✅ DECODED TOKEN:", decoded);
    const id = decoded.id;
    const type = decoded.userType;

    setUserId(id);
    setUserType(type);

    const fetchUserData = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/profile", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        const {
          adresse,
          numeroTel,
          childSchool,
          medications,
          nom,
        } = res.data;

        setFormData({
          address: adresse || '',
          phoneNumber: numeroTel || '',
          childSchool: childSchool || '',
          medications: medications || '',
          name: nom || '',
        });
      } catch (err) {
        console.error('❌ Error fetching user data', err);
        setError('Failed to load user info.');
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');

      await axios.put(`http://localhost:5000/${userType}s/edit`, {
        userId,
        userType,
        ...formData,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess('✅ Profile updated successfully!');
      setError('');
      setTimeout(() => navigate('/user-dashboard'), 1500);
    } catch (err) {
      setError('❌ Error updating profile.');
      setSuccess('');
      console.error(err);
    }
  };

  const handleCancel = () => navigate('/user-dashboard');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-100 via-purple-50 to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-black px-6 py-12 transition-all duration-500">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white dark:bg-gray-900 shadow-xl rounded-3xl p-8 sm:p-10 space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-pink-600 dark:text-pink-300 underline underline-offset-4">
          Edit Profile
        </h2>

        {success && <p className="text-green-600 text-center">{success}</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {renderInput('👤 Name', 'name', formData, handleChange)}
          {renderInput('📍 Address', 'address', formData, handleChange)}
          {renderInput('📞 Phone Number', 'phoneNumber', formData, handleChange)}

          {userType === 'parent' && (
            <>
              {renderInput("🏫 Child's School", 'childSchool', formData, handleChange)}
              {renderTextarea('💊 Medications', 'medications', formData, handleChange)}
            </>
          )}

          {userType === 'healthcareprofessional' && (
            <>
              {renderInput('🏥 Healthcare Facility', 'childSchool', formData, handleChange)}
            </>
          )}

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              type="submit"
              className="w-full bg-pink-300 hover:bg-pink-400 text-white font-semibold py-3 rounded-xl shadow transition duration-300"
            >
              Save Changes
            </button>

            <button
              type="button"
              onClick={handleCancel}
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white font-semibold py-3 rounded-xl shadow transition duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

const renderInput = (label, name, state, onChange) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <input
      type="text"
      name={name}
      value={state[name]}
      onChange={onChange}
      className="w-full p-3 pl-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
    />
  </div>
);

const renderTextarea = (label, name, state, onChange) => (
  <div className="space-y-1">
    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
    <textarea
      name={name}
      rows="3"
      value={state[name]}
      onChange={onChange}
      className="w-full p-3 pl-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
    />
  </div>
);

export default EditProfile;
