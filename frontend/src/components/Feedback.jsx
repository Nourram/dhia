import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Feedback = () => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [category, setCategory] = useState('suggestion');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState(null); // success | error

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setUserName(decoded.name || decoded.email || '');
        setUserEmail(decoded.email || '');
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      setStatus({ type: 'error', msg: 'Please enter a message.' });
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      await axios.post('/api/feedback', {
        userName,
        userEmail,
        message,
        category,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStatus({ type: 'success', msg: '✅ Thank you for your feedback!' });
      setMessage('');
      setCategory('suggestion');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setStatus({ type: 'error', msg: '❌ Failed to submit. Please try again.' });
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
        Feedback & Suggestions
      </h2>

      {status && (
        <div
          className={`mb-4 px-4 py-2 rounded text-sm font-medium ${
            status.type === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {status.msg}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Name</label>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full p-2 rounded border bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
            required
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Email</label>
          <input
            type="email"
            value={userEmail}
            readOnly
            className="w-full p-2 rounded border bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
          />
        </div>

        {/* Category */}
        <div className="mb-4">
          <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 rounded border bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
          >
            <option value="suggestion">💡 Suggestion</option>
            <option value="bug">🐞 Bug</option>
            <option value="question">❓ Question</option>
            <option value="appreciation">❤️ Appreciation</option>
          </select>
        </div>

        {/* Message */}
        <div className="mb-6">
          <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Your Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="5"
            placeholder="Write your message here..."
            className="w-full p-2 rounded border bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-6 rounded transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Feedback;
