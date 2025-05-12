import React, { useEffect, useState } from 'react';
import ChatBot from './ChatBotWrapper';
import { jwtDecode } from 'jwt-decode';

const ChatBotWrapper = () => {
  const [userId, setUserId] = useState(null);
  const [adminId, setAdminId] = useState(null);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No authToken found in localStorage');
      setUserId(null);
      setAdminId(null);
      setUserType(null);
      return;
    }
    try {
      const decoded = jwtDecode(token);
      console.log('Decoded token in ChatBotWrapper:', decoded);
      const userId = decoded.id;
      const userType = decoded.userType;
      setUserId(userId);
      setUserType(userType);
      if (userType === 'admin' || userType === 'healthcareprofessional') {
        // Admin user: set adminId to userId
        setAdminId(userId);
      } else {
        // Non-admin user: set adminId to fixed admin or fetch dynamically
        setAdminId('67ed9a5f1234567890abcdef'); // Replace with actual adminId or logic
      }
    } catch (error) {
      console.error('Failed to decode token:', error);
      setUserId(null);
      setAdminId(null);
      setUserType(null);
    }
  }, []);


  if (!userId || !adminId) {
    return <div>Loading...</div>;
  }

  return <ChatBot userId={userId} adminId={adminId} userType={userType} />;

};

export default ChatBotWrapper;
