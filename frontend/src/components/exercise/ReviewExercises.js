import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCheck, FaTimes, FaFilter, FaInfoCircle } from 'react-icons/fa';

const ReviewExercises = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejectionReason, setRejectionReason] = useState('');
  const [toast, setToast] = useState(null);
  const [filter, setFilter] = useState('pending');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState('');

  useEffect(() => {
    fetchExercises();
  }, [filter]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchExercises = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) return showToast('No auth token found', 'error');

    try {
      
    } catch (err) {
      console.error("❌ Error fetching exercises:", err.response?.data || err.message);
      showToast('Failed to fetch exercises', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = (id, action) => {
    setSelectedExercise(id);
    setActionType(action);
    setShowConfirmModal(true);
  };

  const confirmAction = async () => {
    const token = localStorage.getItem('authToken');
    if (!selectedExercise) return;

    try {
      const url = `http://localhost:5000/api/exercises/${selectedExercise}/status`;

      if (actionType === 'approve') {
        await axios.patch(url, {
          status: 'accepted'
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showToast('✅ Exercise approved');
      } else {
        if (!rejectionReason.trim()) {
          showToast('Please provide a reason for rejection', 'error');
          return;
        }

        await axios.patch(url, {
          status: 'rejected',
          rejectionReason
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        showToast('🚫 Exercise rejected');
      }

      setExercises(prev => prev.filter(ex => ex._id !== selectedExercise));
    } catch (err) {
      console.error("❌ Error confirming action:", err.response?.data || err.message);
      showToast(`Failed to ${actionType} exercise`, 'error');
    } finally {
      setShowConfirmModal(false);
      setSelectedExercise(null);
      setRejectionReason('');
      setActionType('');
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-emerald-600 dark:text-emerald-300">
          Exercise Review Dashboard
        </h2>
        <div className="flex items-center gap-2">
          <FaFilter className="text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
          >
            <option value="pending">Pending Review</option>
            <option value="accepted">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {toast && (
        <div className={`mb-4 px-4 py-2 rounded text-white shadow-md ${toast.type === 'error' ? 'bg-red-500' : 'bg-emerald-500'}`}>
          {toast.message}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      ) : exercises.length === 0 ? (
        <div className="text-center py-10">
          <FaInfoCircle className="mx-auto text-4xl text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No exercises found for this status.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {exercises.map((ex) => (
            <div key={ex._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{ex.title}</h3>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  ex.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  ex.status === 'accepted' ? 'bg-emerald-100 text-emerald-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {ex.status}
                </span>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-medium capitalize">{ex.type}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Level</p>
                  <p className="font-medium">{ex.difficulty || ex.level || 'N/A'}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Instructions</p>
                  <p>{ex.instruction}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Expected Outcome</p>
                  <p className="italic">{ex.expectedOutcome}</p>
                </div>

                {ex.media?.image && (
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Visual Reference</p>
                    <img src={ex.media.image} alt="visual" className="rounded-lg" />
                  </div>
                )}
              </div>

              {filter === 'pending' && (
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => handleAction(ex._id, 'approve')}
                    className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                  >
                    <FaCheck /> Approve
                  </button>
                  <button
                    onClick={() => handleAction(ex._id, 'reject')}
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg flex items-center justify-center gap-2"
                  >
                    <FaTimes /> Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">
              {actionType === 'approve' ? 'Approve Exercise' : 'Reject Exercise'}
            </h3>

            {actionType === 'reject' && (
              <div className="mb-4">
                <label className="text-sm text-gray-600 dark:text-gray-400 block mb-2">
                  Reason for rejection
                </label>
                <textarea
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border rounded"
                />
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setSelectedExercise(null);
                  setActionType('');
                  setRejectionReason('');
                }}
                className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className={`px-4 py-2 text-white rounded-lg ${
                  actionType === 'approve'
                    ? 'bg-emerald-500 hover:bg-emerald-600'
                    : 'bg-red-500 hover:bg-red-600'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewExercises;
