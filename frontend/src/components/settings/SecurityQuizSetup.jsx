import React, { useState } from 'react';
import axios from 'axios';

const SecurityQuizSetup = ({ userId, onCompleted }) => {
  const [quiz, setQuiz] = useState([
    { question: 'What is your favorite color?', answer: '' },
    { question: 'What was the name of your first pet?', answer: '' },
    { question: 'What is your dream destination?', answer: '' },
  ]);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (index, value) => {
    const updated = [...quiz];
    updated[index].answer = value;
    setQuiz(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:5000/api/users/${userId}/setup-quiz`, { quiz });
      setMessage('✅ Quiz saved!');
      onCompleted?.();
    } catch (err) {
      setError('❌ Failed to save quiz.');
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl space-y-5 mb-6">
      <h3 className="text-xl font-bold text-pink-500 dark:text-pink-300 underline underline-offset-4">
        Setup Security Quiz 🛡️
      </h3>

      {error && <p className="text-red-500">{error}</p>}
      {message && <p className="text-green-500">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {quiz.map((q, index) => (
          <div key={index}>
            <label className="block mb-1 text-sm text-gray-700 dark:text-gray-200">{q.question}</label>
            <input
              type="text"
              value={q.answer}
              onChange={(e) => handleChange(index, e.target.value)}
              className="w-full p-3 rounded-xl border border-gray-300"
              required
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-pink-400 hover:bg-pink-500 text-white py-2 rounded-xl"
        >
          Save My Answers
        </button>
      </form>
    </div>
  );
};

export default SecurityQuizSetup;