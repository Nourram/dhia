import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaSave, FaUser, FaClipboard, FaHistory, FaExternalLinkAlt } from 'react-icons/fa';

const ParentChildFileForm = () => {
  const [formData, setFormData] = useState({
    childName: '',
    note: '',
    externalFollowUp: '',
    interventionHistory: '',
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.post('/api/child-files', formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStatus(res.data.message);
    } catch (error) {
      setStatus(error.response?.data?.message || 'Error saving file');
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-xl rounded-2xl border border-pink-100 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-pink-600 mb-6 flex items-center gap-2">
        <FaClipboard /> Manage Your Child's File
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
            <FaUser /> Child's Name
          </label>
          <input
            type="text"
            name="childName"
            value={formData.childName}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-pink-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
            <FaClipboard /> Notes
          </label>
          <textarea
            name="note"
            value={formData.note}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-pink-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
            <FaExternalLinkAlt /> External Follow-ups
          </label>
          <textarea
            name="externalFollowUp"
            value={formData.externalFollowUp}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-pink-400 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1">
            <FaHistory /> Intervention History
          </label>
          <textarea
            name="interventionHistory"
            value={formData.interventionHistory}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-pink-400 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          className="inline-flex items-center gap-2 px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-lg shadow transition"
        >
          <FaSave /> Save File
        </button>

        {status && (
          <p className="mt-4 text-sm text-green-600 dark:text-green-400 font-medium">
            ✅ {status}
          </p>
        )}
      </form>
    </div>
  );
};

export default ParentChildFileForm;
