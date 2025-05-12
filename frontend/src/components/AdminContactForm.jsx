import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:5000');

const AdminContactForm = ({ userId }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (userId) {
      socket.emit('join_room', userId);
    }
  }, [userId]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus(null);
    if (!formData.message.trim()) {
      setStatus('Please enter a message.');
      return;
    }
    try {
      const messageData = {
        senderId: userId,
        receiverId: 'admin', // Replace with actual admin ID or logic
        message: formData.message,
      };
      socket.emit('send_message', messageData);
      setStatus('Message sent successfully.');
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      setStatus('Failed to send message. Please try again later.');
      console.error('Contact admin form submission error:', error);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md p-4 flex flex-col h-[450px]">
      <h2 className="text-xl font-semibold mb-4 text-center text-pink-600">Contact Admin</h2>
      <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
        <label className="mb-2 font-medium" htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
          className="mb-4 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
        />

        <label className="mb-2 font-medium" htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="mb-4 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
        />

        <label className="mb-2 font-medium" htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={6}
          className="mb-4 px-3 py-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-pink-400"
        />

        <button
          type="submit"
          className="mt-auto bg-pink-500 hover:bg-pink-600 text-white py-2 rounded transition"
        >
          Send
        </button>
      </form>
      {status && <p className="mt-4 text-center text-sm">{status}</p>}
    </div>
  );
};

export default AdminContactForm;
