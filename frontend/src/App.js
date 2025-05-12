import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard';
import FeedbackList from './components/FeedbackList';
import UserList from './components/users/UserList';
import AdminHome from './components/admin/AdminHome';
import AdminContact from './components/admin/AdminContact';
import { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import LoginForm from './components/LoginForm';
import UserDashboard from './components/UserDashboard';
import UserTypeSelection from './components/Usertype/UserTypeSelection';
import ForgotPassword from './components/Password/ForgotPassword';
import ParentForm from './components/users/ParentForm';
import PedagogueForm from './components/users/PedagogueForm';
import HealthCareForm from './components/users/HealthCareForm';
import ProfileSection from './components/ProfileSection';
import ChildrenList from './components/ChildrenList';
import ChildMedicalRecord from './components/ChildMedicalRecord';
import ChatBotWrapper from './components/ChatBotWrapper';
import { Toaster } from 'react-hot-toast';
import axios from 'axios';

function App() {
  const [adminId, setAdminId] = useState(null);
  const [loadingAdminId, setLoadingAdminId] = useState(true);

  useEffect(() => {
    const fetchAdminId = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          setLoadingAdminId(false);
          return;
        }
        const res = await axios.get('/api/admin/admin-id', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (res.data && res.data.adminId) {
          localStorage.setItem('adminId', res.data.adminId);
          setAdminId(res.data.adminId);
        }
      } catch (error) {
        console.error('Failed to fetch adminId:', error);
      } finally {
        setLoadingAdminId(false);
      }
    };
    fetchAdminId();
  }, []);

  if (loadingAdminId) {
    return (
      <div className="flex justify-center items-center h-screen text-pink-600 dark:text-pink-300">
        Loading admin data...
      </div>
    );
  }

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>

        {/* Pages publiques */}
        <Route path="/" element={<HomePage />} />
        <Route path="/Login-form" element={<LoginForm />} />
        <Route path="/user-type" element={<UserTypeSelection />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/parent-form" element={<ParentForm />} />
        <Route path="/pédagogue-form" element={<PedagogueForm />} />
        <Route path="/health-professional-form" element={<HealthCareForm />} />
        <Route path="/profileselection" element={<ProfileSection />} />
        <Route path="/children" element={<ChildrenList />} />
        <Route path="/children/:parentId/:childIndex" element={<ChildMedicalRecord />} />

        {/* Dashboard utilisateur */}
        <Route path="/user-dashboard/*" element={<UserDashboard />} />

        {/* Dashboard Admin avec sous-routes */}
        {adminId && (
          <Route path="/admin-dashboard/*" element={<AdminDashboard />}>
            <Route index element={<AdminHome />} />
            <Route path="users" element={<UserList />} />
            <Route
              path="contact"
              element={<AdminContact adminId={adminId} />}
            />
            {/* <Route path="feedbacks" element={<FeedbackList />} /> */}
          </Route>
        )}
        <Route path="/chatbot" element={<ChatBotWrapper />} />

      </Routes>
    </Router>
  );
}

export default App;
