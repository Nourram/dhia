import React, { useEffect, useState } from 'react';

const Feedback = () => {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = JSON.parse(atob(token.split('.')[1]));
        setUserName(decoded.name || '');
        setUserEmail(decoded.email || '');
      } catch (error) {
        console.error('Invalid token:', error);
      }
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message.trim()) {
      alert('Please enter your message.');
      return;
    }

    // Here you can connect to your backend or database
    alert('✅ Thank you for your feedback!');
    setMessage('');
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">Feedback & Suggestions</h2>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Name</label>
          <input
            type="text"
            value={userName}
            readOnly
            className="w-full p-2 rounded border bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Email</label>
          <input
            type="email"
            value={userEmail}
            readOnly
            className="w-full p-2 rounded border bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm mb-1 text-gray-700 dark:text-gray-300">Your Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="5"
            placeholder="Write your message here..."
            className="w-full p-2 rounded border bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600"
          />
        </div>

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
