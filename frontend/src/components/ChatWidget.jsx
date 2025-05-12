// components/ChatWidget.jsx
import React, { useState } from 'react';
import { FaComments, FaTimes } from 'react-icons/fa';
import AdminContactForm from './AdminContactForm'; // new admin contact form component

const ChatWidget = ({ userId, adminId, userType }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-pink-500 hover:bg-pink-600 text-white p-4 rounded-full shadow-lg focus:outline-none"
          aria-label="Open contact admin form"
        >
          <FaComments size={24} />
        </button>
      )}

      {/* Contact Admin Form Window */}
      {isOpen && (
        <div className="relative w-[350px] h-[500px] bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between bg-pink-500 text-white p-3">
            <span className="font-semibold">Contact Admin</span>
            <button onClick={() => setIsOpen(false)} aria-label="Close contact admin form">
              <FaTimes />
            </button>
          </div>

          {/* AdminContactForm Component */}
          <div className="flex-1">
            <AdminContactForm userId={userId} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatWidget;
