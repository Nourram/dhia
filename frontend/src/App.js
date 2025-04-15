import React from 'react'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


import UserTypeSelection from './components/Usertype/UserTypeSelection';
import ForgotPassword from './components/Password/ForgotPassword';
import ParentForm from './components/users/ParentForm';
import PedagogueForm from './components/users/PedagogueForm';
import HealthCareForm from './components/users/HealthCareForm';
import AdminDashboard from './components/AdminDashboard';
import UserList from './components/users/UserList';
import UserDashboard from './components/UserDashboard';
import ProfileSection from './components/ProfileSection';
import LoginForm from './components/LoginForm';
import HomePage from './components/HomePage';
import EditProfile from './components/settings/EditProfile';
import ChangePassword from './components/settings/ChangePassword';
import DeleteAccount from './components/settings/DeleteAccount';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Login-form" element={<LoginForm/>} />
        <Route path="/user-type" element={<UserTypeSelection />} />
        <Route path="/parent-form" element={<ParentForm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/pédagogue-form" element={<PedagogueForm />} />
        <Route path="/health-professional-form" element={<HealthCareForm />} />
        
        {/* Admin Dashboard with nested routes */}
        <Route path="/admin-dashboard" element={<AdminDashboard />}>
          <Route path="users" element={<UserList />} />
        </Route>

        <Route path="/user-dashboard/*" element={<UserDashboard />} />
        <Route path="/profileselection" element={<ProfileSection />} />
         {/* Routes enfants pour la gestion du profil utilisateur */}
         
      </Routes>
    </Router>
  );
}

export default App;
