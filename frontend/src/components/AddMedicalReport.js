import React, { useState } from 'react';
import axios from 'axios';
import { FaCheckCircle, FaTimesCircle, FaTrashAlt, FaPlusCircle } from 'react-icons/fa'; // ✅❌🗑️➕

function AddMedicalReport({ parentId, childIndex, onReportAdded }) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');
    try {
      const token = localStorage.getItem('authToken');

      await axios.post(
        `http://localhost:5000/api/medical-reports/report/${parentId}/${childIndex}`,
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage('Report added successfully!');
      setTitle('');
      setDescription('');
      setShowForm(false);
      onReportAdded();
    } catch (error) {
      console.error('Failed to add report:', error);
      setErrorMessage('Failed to add report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ✨ NEW: Delete a report
  const handleDeleteReport = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this report?')) return;
    try {
      const token = localStorage.getItem('authToken');
      await axios.delete(`http://localhost:5000/api/medical-reports/report/${reportId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Report deleted!');
      onReportAdded(); // Refresh
    } catch (error) {
      console.error('Failed to delete report:', error);
      alert('Failed to delete the report.');
    }
  };

  return (
    <div className="space-y-8 mt-10">
      {/* Toggle button to show/hide form */}
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg font-semibold"
        >
          <FaPlusCircle /> Create Medical Report
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 bg-pink-50 dark:bg-gray-800 p-6 rounded-xl mt-6">
          <h3 className="text-xl font-bold text-pink-600 mb-4">➕ New Medical Report</h3>

          {/* Success and Error Messages */}
          {successMessage && (
            <div className="flex items-center p-3 bg-green-100 text-green-700 rounded-md shadow-sm">
              <FaCheckCircle className="mr-2" /> {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="flex items-center p-3 bg-red-100 text-red-700 rounded-md shadow-sm">
              <FaTimesCircle className="mr-2" /> {errorMessage}
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              required
              disabled={loading}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-400 focus:outline-none bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              rows="4"
              required
              disabled={loading}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="flex-1 bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg font-semibold disabled:opacity-50 transition"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit'}
            </button>
            <button
              type="button"
              className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg font-semibold transition"
              onClick={() => {
                setShowForm(false);
                setTitle('');
                setDescription('');
                setSuccessMessage('');
                setErrorMessage('');
              }}
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Delete Report Example Usage */}
      {/* ❗Note: Call `handleDeleteReport(reportId)` where you display reports in ChildMedicalRecord.jsx */}
    </div>
  );
}

export default AddMedicalReport;
