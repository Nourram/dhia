import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaCheck, FaTimes, FaSearch, FaFilter, FaUser, FaUserMd, FaUserGraduate, FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ExerciseList = () => {
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [children, setChildren] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [scoreResult, setScoreResult] = useState(null);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem('authToken');
  const userType = localStorage.getItem('userType')?.toLowerCase();

  // ✅ Fetch exercises
  useEffect(() => {
    const fetchExercises = async () => {
      try {
        setLoading(true);
        setError(null);
        const params = { search };
        
        if (filterType) params.type = filterType;
        if (filterDifficulty) params.difficulty = filterDifficulty;
        
        const res = await axios.get('http://localhost:5000/api/exercises', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params,
        });
        console.log("📚 Exercises fetched:", res.data);
        setExercises(res.data);
      } catch (error) {
        console.error('Error fetching exercises:', error);
        setError(error.response?.data?.message || 'Failed to fetch exercises');
      } finally {
        setLoading(false);
      }
    };
    fetchExercises();
  }, [search, filterType, filterDifficulty, token]);

  // ✅ Fetch children for the logged-in parent
  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/auth/parent/${localStorage.getItem('userId')}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("👶 Children fetched:", res.data.children);
        if (res.data.children?.length) {
          setChildren(res.data.children);
          setSelectedChildId(res.data.children[0]._id); // preselect first child
        }
      } catch (error) {
        console.error('Error fetching children:', error);
      }
    };

    if (userType === 'parent') {
      fetchChildren();
    }
  }, [token, userType]);

  // ✅ Participate in exercise
  const handleParticipate = async (exerciseId) => {
    try {
      const res = await axios.post('http://localhost:5000/api/participation', {
        childId: selectedChildId,
        exerciseId,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setScoreResult({
        score: res.data.score,
        title: exercises.find((e) => e._id === exerciseId)?.title || 'Exercise',
      });
    } catch (error) {
      console.error('Error participating:', error);
    }
  };

  // ✅ Approve exercise
  const handleApproveExercise = async (exerciseId) => {
    try {
      setActionLoading(true);
      setError(null);
      const res = await axios.patch(
        `http://localhost:5000/api/exercises/${exerciseId}/status`,
        { status: 'accepted' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Exercise approved:', res.data);
      
      // Update the exercises list with populated data
      setExercises(exercises.map(ex => 
        ex._id === exerciseId ? { 
          ...ex, 
          status: 'accepted', 
          approvedBy: res.data.exercise.approvedBy,
          approvedAt: res.data.exercise.approvedAt 
        } : ex
      ));
    } catch (error) {
      console.error('Error approving exercise:', error);
      setError(error.response?.data?.message || 'Failed to approve exercise');
    } finally {
      setActionLoading(false);
    }
  };

  // ✅ Reject exercise
  const handleRejectExercise = async (exerciseId) => {
    try {
      setActionLoading(true);
      setError(null);
      if (!rejectionReason.trim()) {
        setError('Please provide a reason for rejection');
        return;
      }

      const res = await axios.patch(
        `http://localhost:5000/api/exercises/${exerciseId}/status`,
        { 
          status: 'rejected',
          rejectionReason 
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('Exercise rejected:', res.data);
      
      // Update the exercises list with populated data
      setExercises(exercises.map(ex => 
        ex._id === exerciseId ? { 
          ...ex, 
          status: 'rejected', 
          approvedBy: res.data.exercise.approvedBy,
          approvedAt: res.data.exercise.approvedAt,
          rejectionReason: res.data.exercise.rejectionReason 
        } : ex
      ));
      
      // Reset modal state
      setShowRejectionModal(false);
      setRejectionReason('');
      setSelectedExercise(null);
    } catch (error) {
      console.error('Error rejecting exercise:', error);
      setError(error.response?.data?.message || 'Failed to reject exercise');
    } finally {
      setActionLoading(false);
    }
  };

  // ✅ Open rejection modal
  const openRejectionModal = (exercise) => {
    setSelectedExercise(exercise);
    setShowRejectionModal(true);
  };

  // ✅ Filter exercises by status
  const getFilteredExercises = () => {
    if (userType === 'parent') {
      return exercises.filter(ex => ex.status === 'accepted');
    } else if (userType === 'healthcare') {
      return exercises.filter(ex => ex.status === 'pending');
    } else if (userType === 'pedagogue') {
      return exercises;
    }
    return exercises;
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-pink-600">
          {userType === 'parent' ? 'Available Exercises' : 
           userType === 'healthcareprofessional' ? 'Pending Exercises' : 
           userType === 'Pedagogue' ? 'My Exercises' : 'Exercises'}
        </h1>
        
        {userType === 'Pedagogue' && (
          <button
            onClick={() => navigate('/create-exercise')}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg shadow-lg hover:from-pink-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 ease-in-out"
          >
            <FaPlus className="text-lg" />
            <span className="font-semibold">New Exercise</span>
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Search exercises..."
              className="px-4 py-2 rounded-lg border border-gray-300 w-full pl-10"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <FaSearch className="absolute left-3 top-3 text-gray-400" />
          </div>
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 appearance-none pr-8"
            >
              <option value="">All Types</option>
              <option value="cognitives">Cognitive</option>
              <option value="motor">Motor</option>
              <option value="social">Social</option>
            </select>
            <FaFilter className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
          </div>
          
          <div className="relative">
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
            <FaFilter className="absolute right-3 top-3 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {userType === 'parent' && children.length > 0 && (
        <div className="mb-4">
          <label className="block mb-1 font-medium">Select Child:</label>
          <select
            value={selectedChildId}
            onChange={(e) => setSelectedChildId(e.target.value)}
            className="w-full max-w-md p-2 border rounded"
          >
            {children.map((child) => (
              <option key={child._id} value={child._id}>
                {child.nom} {child.prenom}
              </option>
            ))}
          </select>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-pink-500"></div>
          <p className="mt-2 text-gray-600">Loading exercises...</p>
        </div>
      ) : getFilteredExercises().length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-4xl mb-2">😴</p>
          <p className="text-gray-600">No exercises found.</p>
        </div>

      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {getFilteredExercises().map((exercise) => (
            <div key={exercise._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold text-gray-800">{exercise.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    exercise.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    exercise.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {exercise.status === 'accepted' ? 'Approved' :
                     exercise.status === 'rejected' ? 'Rejected' :
                     'Pending'}
                  </span>
                </div>
                
                <p className="mt-2 text-gray-600 text-sm line-clamp-3">{exercise.description}</p>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                    {exercise.type === 'cognitive' ? 'Cognitive' :
                     exercise.type === 'motor' ? 'Motor' :
                     exercise.type === 'social' ? 'Social' : exercise.type}
                  </span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                    Difficulty: {exercise.difficulty}/5
                  </span>
                </div>

                {/* Creator and Approver Info */}
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
                
                {exercise.rejectionReason && (
                  <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                    <strong>Rejection reason:</strong> {exercise.rejectionReason}
                  </div>
                )}
                
                <div className="mt-4 flex justify-between">
                  {userType === 'parent' && (
                    <button
                      onClick={() => handleParticipate(exercise._id)}
                      className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg transition-colors"
                      disabled={actionLoading}
                    >
                      {actionLoading ? 'Loading...' : 'Start Exercise'}
                    </button>
                  )}
                  
                  {userType === 'healthcare' && exercise.status === 'pending' && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleApproveExercise(exercise._id)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-1"
                        disabled={actionLoading}
                      >
                        {actionLoading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                        ) : (
                          <>
                            <FaCheck /> Approve
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => openRejectionModal(exercise)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-1"
                        disabled={actionLoading}
                      >
                        <FaTimes /> Reject
                      </button>
                    </div>
                  )}
                  
                  {userType === 'pedagogue' && (
                    <div className="text-sm text-gray-500">
                      Created: {new Date(exercise.createdAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {scoreResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Exercise Result</h3>
            <p className="mb-4">You completed <strong>{scoreResult.title}</strong></p>
            <p className="text-2xl font-bold text-pink-500 mb-4">Score: {scoreResult.score}</p>
            <button
              onClick={() => setScoreResult(null)}
              className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {showRejectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Reject Exercise</h3>
            <p className="mb-4">Are you sure you want to reject <strong>{selectedExercise?.title}</strong>?</p>
            
            <div className="mb-4">
              <label className="block mb-1 font-medium">Rejection Reason:</label>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full p-2 border rounded"
                rows="3"
                placeholder="Please provide a reason for rejection..."
              />
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => handleRejectExercise(selectedExercise._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex-1"
                disabled={!rejectionReason.trim()}
              >
                Confirm Rejection
              </button>
              <button
                onClick={() => {
                  setShowRejectionModal(false);
                  setRejectionReason('');
                  setSelectedExercise(null);
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg flex-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseList;
