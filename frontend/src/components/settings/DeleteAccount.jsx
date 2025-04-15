import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

const DeleteAccount = ({ userId, onLogout }) => {
  const [confirmation, setConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleDeleteAccount = async (e) => {
    e.preventDefault();

    if (confirmation.trim().toUpperCase() !== 'DELETE') {
      setError('❌ Please type DELETE in all caps to confirm.');
      setMessage('');
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      await axios.post(
        'http://localhost:5000/api/delete-account',
        { userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage('✅ Your account has been deleted.');
      setError('');
      setTimeout(() => {
        onLogout();
      }, 2000);
    } catch (err) {
      console.error(err);
      setError('❌ Error deleting account. Please try again.');
      setMessage('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/user-dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-indigo-100 dark:from-gray-900 dark:via-gray-800 dark:to-black px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-3xl shadow-xl p-8 space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-red-500 dark:text-red-400 underline underline-offset-4">
          Delete Your Account
        </h2>

        <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
          This action is <strong>permanent</strong>. Please type <span className="text-red-500 font-semibold">DELETE</span> to confirm.
        </p>

        {message && <p className="text-green-600 dark:text-green-400 text-center text-sm">{message}</p>}
        {error && <p className="text-red-500 dark:text-red-400 text-center text-sm">{error}</p>}

        <form onSubmit={handleDeleteAccount} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Confirmation
            </label>
            <input
              type="text"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              placeholder='Type "DELETE"'
              className="w-full p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-400 focus:outline-none"
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Deleting...' : '🔥  Delete Account'}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              disabled={isLoading}
              className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-semibold py-3 rounded-xl transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default DeleteAccount;
