import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import {
  FaUserCircle, FaCog, FaHome, FaDumbbell, FaEnvelope,
  FaSignOutAlt, FaEdit, FaLock, FaTrash, FaMoon, FaSun,
  FaPlus, FaClipboardCheck, FaClipboardList, FaPlay
} from 'react-icons/fa';

import { motion } from 'framer-motion';
import axios from 'axios';

import EditProfile from './settings/EditProfile';
import ChangePassword from './settings/ChangePassword';
import DeleteAccount from './settings/DeleteAccount';
import ExerciseList from './exercise/ExerciseList';
import CreateExerciseForm from './exercise/CreateExerciseForm';
import MyExercises from './exercise/MyExercises';
import ReviewExercises from './exercise/ReviewExercises';
import PlayExercise from './exercise/PlayExercise';
import PlayMenu from './exercise/PlayMenu';
import Feedback from './Feedback';
import SettingsLayout from './settings/SettingsLayout';
import ChildrenList from './ChildrenList';
import ChildMedicalRecord from './ChildMedicalRecord';
import EditChildInfoForm from './EditChildInfoForm';
import ChatBot from './ChatBot';
import ChatWidget from './ChatWidget';

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [adminId, setAdminId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminId = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/admin/admin-id');
        setAdminId(res.data.adminId);
      } catch (err) {
        console.error('Failed to fetch admin ID:', err);
      }
    };
    fetchAdminId();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/Login-form');
    } else {
      const decoded = jwtDecode(token);
      setUser(decoded);
      localStorage.setItem('userType', decoded.userType);
    }
  }, [navigate]);

  useEffect(() => {
      const fetchFavorites = async () => {
        try {
          const res = await axios.get('http://localhost:5000/api/favorites/0', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            }
          });
          setFavorites(res.data);
        } catch (err) {
          console.error('Error fetching favorites:', err);
          if (err.response && err.response.status === 401) {
            // Redirect to login on unauthorized
            localStorage.clear();
            navigate('/Login-form');
          }
          setFavorites([]);
        }
      };

    if (user?.userType === 'parent') {
      fetchFavorites();
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark');
  };

  const toggleFavorite = async (exerciseId, childIndex) => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.post(
        `http://localhost:5000/api/favorites/${exerciseId}`,
        { childIndex },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFavorites(res.data);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  const onStartExercise = (exerciseId) => {
    navigate(`/user-dashboard/play?exerciseId=${exerciseId}`);
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="h-screen w-full flex bg-gradient-to-br from-rose-100 via-pink-100 to-violet-100 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 overflow-hidden">

        {/* Sidebar */}
        <aside className="w-64 bg-white/70 dark:bg-gray-800 p-6 shadow-lg backdrop-blur-md flex flex-col justify-between">
          <div>
            <div className="flex flex-col items-center mt-4 gap-2">
              <FaUserCircle size={72} className="text-pink-400 dark:text-pink-300" />
              <p className="text-sm text-gray-500 dark:text-gray-400">Welcome</p>
              <h3 className="text-lg font-semibold">{user?.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Type: {user?.userType}</p>
            </div>

            <nav className="mt-10 flex flex-col gap-4">
              <Link to="/user-dashboard" className="flex items-center gap-2 hover:text-pink-500">
                <FaHome /> Home
              </Link>

              {user?.userType === 'parent' && (
                <>
                  <Link to="/user-dashboard/exercises" className="flex items-center gap-2 hover:text-pink-500">
                    <FaDumbbell /> Exercises
                  </Link>
                  {/* Removed Play Mode from sidebar for parent as per user feedback */}
                  <Link to="/user-dashboard/children" className="flex items-center gap-2 hover:text-pink-500">
                    <FaClipboardList /> My Children
                  </Link>
                </>
              )}

              {user?.userType === 'Pedagogue' && (
                <>
                  <Link to="/user-dashboard/create-exercise" className="flex items-center gap-2 hover:text-pink-500">
                    <FaDumbbell /> Create Exercise
                  </Link>
                  <Link to="/user-dashboard/my-exercises" className="flex items-center gap-2 hover:text-pink-500">
                    <FaDumbbell /> My Exercises
                  </Link>
                </>
              )}

              {user?.userType === 'healthcareprofessional' && (
                <>
                  <Link to="/user-dashboard/review-exercises" className="flex items-center gap-2 bg-emerald-600 text-white rounded-lg px-4 py-2 shadow hover:bg-emerald-700 transition">
                    <FaClipboardCheck /> Validate Exercises
                  </Link>
                  <Link to="/user-dashboard/children" className="flex items-center gap-2 hover:text-pink-500">
                    <FaClipboardList /> Children Folders
                  </Link>
                </>
              )}

              <Link to="/user-dashboard/contact" className="flex items-center gap-2 hover:text-pink-500">
                <FaEnvelope /> Contact
              </Link>
            </nav>

            <div className="mt-10">
              <div className="flex items-center gap-2 cursor-pointer hover:text-pink-500">
                <FaCog /> <span>Settings</span>
              </div>
              <motion.ul initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mt-2 ml-4 space-y-2 text-sm">
                <li><Link to="/user-dashboard/settings/edit-profile" className="flex items-center gap-2 hover:text-purple-400"><FaEdit /> Edit Profile</Link></li>
                <li><Link to="/user-dashboard/settings/change-password" className="flex items-center gap-2 hover:text-yellow-500"><FaLock /> Change Password</Link></li>
                <li><Link to="/user-dashboard/settings/delete-account" className="flex items-center gap-2 hover:text-red-600"><FaTrash /> Delete Account</Link></li>
              </motion.ul>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col h-full overflow-auto">
          <header className="flex items-center justify-between p-4 bg-white/80 dark:bg-gray-800 shadow-md">
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-400"
              />
              {user?.userType === 'Pedagogue' && (
                <Link
                  to="/user-dashboard/create-exercise"
                  className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg shadow hover:bg-pink-600 transition"
                >
                  <FaPlus /> New Exercise
                </Link>
              )}
            </div>
            <div className="flex items-center gap-4">
              <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
                {darkMode ? <FaSun /> : <FaMoon />}
              </button>
              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600">
                <FaSignOutAlt /> Logout
              </button>
            </div>
          </header>

          {/* Routes & Chat */}
          <main className="flex-1 p-6 overflow-auto relative">
            <Routes>
              <Route
                index
                element={
                  <div>
                    <h1 className="text-2xl font-bold mb-4">Welcome to your dashboard, {user?.name}!</h1>
                    <p className="mb-6 text-gray-600 dark:text-gray-300">Use the menu to navigate through your features.</p>

                    {user?.userType === 'parent' && (
                      <div className="mt-10">
                        <h2 className="text-xl font-semibold mb-4 text-pink-600">❤️ Favorite Exercises</h2>
                        {(!Array.isArray(favorites) || favorites.length === 0) ? (
                          <p className="text-gray-500 italic">No favorites yet. Start playing and add some!</p>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {favorites.map((ex) => (
                              <div key={ex._id} className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:scale-105 transition duration-200 border border-pink-200">
                                <h3 className="text-lg font-semibold text-pink-700">{ex.title}</h3>
                                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{ex.description}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    <div className="mt-20 text-center">
                      <Link
                        to="/user-dashboard/feedback"
                        className="inline-block px-6 py-3 bg-pink-500 text-white rounded-lg shadow hover:bg-pink-600 transition"
                      >
                        Feedback & Suggestions
                      </Link>
                    </div>
                  </div>
                }
              />
              <Route path="settings" element={<SettingsLayout />}>
                <Route path="edit-profile" element={<EditProfile />} />
                <Route path="change-password" element={<ChangePassword />} />
                <Route path="delete-account" element={<DeleteAccount />} />
              </Route>
              <Route path="exercises" element={<ExerciseList favorites={favorites} toggleFavorite={toggleFavorite} authToken={localStorage.getItem('authToken')} onStartExercise={onStartExercise} />} />
              <Route path="create-exercise" element={<CreateExerciseForm authToken={localStorage.getItem('authToken')} />} />
              <Route path="my-exercises" element={<MyExercises authToken={localStorage.getItem('authToken')} />} />
              <Route path="review-exercises" element={<ReviewExercises authToken={localStorage.getItem('authToken')} />} />
              <Route path="feedback" element={<Feedback />} />
              <Route path="play" element={<PlayExercise userId={user?.id || user?.userId} />} />
              <Route path="play-menu/*" element={<PlayMenu userId={user?.id || user?.userId} />} />
              <Route path="children" element={<ChildrenList />} />
              <Route path="children/:parentId/:childIndex" element={<ChildMedicalRecord />} />
              <Route path="children/:parentId/:childIndex/edit" element={<EditChildInfoForm />} />
              <Route path="contact" element={adminId ? <ChatBot userId={user?.id || user?.userId} adminId={adminId} /> : <div>Loading chat...</div>} />
            </Routes>

            {/* Floating Chat Widget */}
            <ChatWidget userId={user?.id || user?.userId} adminId={adminId} userType={user?.userType} />
          </main>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
