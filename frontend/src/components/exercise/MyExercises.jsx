import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCheck, FaTimes, FaSearch, FaFilter, FaUserGraduate, FaUserMd, FaPlus, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const MyExercises = () => {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [error, setError] = useState(null);

  const token = localStorage.getItem('authToken');

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = { search };
        if (filterType) params.type = filterType;
        if (filterDifficulty) params.difficulty = filterDifficulty;
        // Fetch all exercises created by pedagogue, including approved and rejected
        // No status filter to get all
        const res = await axios.get('http://localhost:5000/api/exercises', {
          headers: { Authorization: `Bearer ${token}` },
          params,
        });
        setExercises(res.data);
      } catch (error) {
        setError(error.response?.data?.message || 'Failed to fetch exercises');
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, [search, filterType, filterDifficulty, token]);

  const handleDeleteExercise = async (exerciseId) => {
    if (!window.confirm('Are you sure you want to delete this exercise? This action cannot be undone.')) {
      return;
    }
    try {
      setActionLoading(true);
      setError(null);
      await axios.delete(`http://localhost:5000/api/exercises/${exerciseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setExercises(exercises.filter((ex) => ex._id !== exerciseId));
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to delete exercise');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-pink-600">My Exercises</h1>
        <button
          onClick={() => navigate('/user-dashboard/create-exercise')}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg shadow-lg hover:from-pink-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 ease-in-out"
        >
          <FaPlus className="text-lg" />
          <span className="font-semibold">New Exercise</span>
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search exercises..."
            className="w-full px-4 py-2 rounded-lg border border-gray-300 pl-10 focus:outline-none focus:ring-2 focus:ring-pink-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        <div className="flex gap-2">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 appearance-none pr-8"
          >
            <option value="">All Types</option>
            <option value="cognitive">Cognitive</option>
            <option value="motor">Motor</option>
            <option value="social">Social</option>
          </select>
          <select
            value={filterDifficulty}
            onChange={(e) => setFilterDifficulty(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 appearance-none pr-8"
          >
            <option value="">All Difficulties</option>
            <option value="1">Level 1</option>
            <option value="2">Level 2</option>
            <option value="3">Level 3</option>
            <option value="4">Level 4</option>
            <option value="5">Level 5</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500"></div>
          <p className="mt-2 text-gray-600">Loading exercises...</p>
        </div>
      ) : exercises.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-4xl mb-2">😴</p>
          <p className="text-gray-600">No exercises found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.map((exercise) => (
            <div
              key={exercise._id}
              className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow flex flex-col"
            >
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold text-gray-800">{exercise.title}</h3>
                    <span
                      className={
                        "px-2 py-1 rounded-full text-xs font-medium " +
                        (exercise.status === 'accepted'
                          ? 'bg-green-100 text-green-800'
                          : exercise.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800')
                      }
                    >
                      {exercise.status === 'accepted'
                        ? 'Approved'
                        : exercise.status === 'rejected'
                        ? 'Rejected'
                        : 'Pending'}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-600 text-sm line-clamp-3">{exercise.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {exercise.type === 'cognitive'
                        ? 'Cognitive'
                        : exercise.type === 'motor'
                        ? 'Motor'
                        : exercise.type === 'social'
                        ? 'Social'
                        : exercise.type}
                    </span>
                    <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                      Difficulty: {exercise.difficulty}/5
                    </span>
                  </div>
                </div>
                <div className="mt-3 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <FaUserGraduate className="text-blue-500" />
                    <span>Created by: {exercise.createdBy?.name || 'Unknown'}</span>
                  </div>
                  {exercise.approvedBy && (
                    <div className="flex items-center gap-2 mt-1">
                      <FaUserMd className="text-green-500" />
                      <span>Approved by: {exercise.approvedBy?.name || 'Unknown'}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="p-4 flex justify-between items-center border-t border-gray-200">
                <button
                  onClick={() => handleDeleteExercise(exercise._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyExercises;
