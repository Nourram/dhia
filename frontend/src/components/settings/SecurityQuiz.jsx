import React, { useState } from 'react';
import axios from 'axios';

const SecurityQuiz = ({ userId, onSuccess }) => {
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');
  const [step, setStep] = useState('load');

  // Load quiz from backend
  const loadQuiz = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/users/${userId}/get-quiz`);
      if (res.data.questions) {
        setQuiz(res.data.questions);
        setStep('quiz');
      } else {
        setError('⚠️ No quiz found.');
      }
    } catch (err) {
      console.error(err);
      setError('❌ Failed to load quiz.');
    }
  };

  // Submit answers
  const submitAnswers = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`http://localhost:5000/api/users/verify-quiz`, {
        userId,
        answers: Object.values(answers), // Convert to array for backend
      });

      if (res.data.success) {
        onSuccess();
      } else {
        setError('❌ Incorrect answers.');
      }
    } catch (err) {
      console.error(err);
      setError('⚠️ Verification failed.');
    }
  };

  const handleAnswerChange = (index, value) => {
    setAnswers({ ...answers, [index]: value });
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-xl space-y-5">
      <h3 className="text-xl font-bold text-pink-500 dark:text-pink-300 underline underline-offset-4">
        Verify Your Identity 🔐
      </h3>

      {error && <p className="text-red-500">{error}</p>}

      {step === 'load' && (
        <button
          onClick={loadQuiz}
          className="w-full bg-pink-400 hover:bg-pink-500 text-white py-2 rounded-xl"
        >
          Load My Questions
        </button>
      )}

      {step === 'quiz' && (
        <form onSubmit={submitAnswers} className="space-y-4">
          {quiz.map((q, index) => (
            <div key={index}>
              <label className="block mb-1 text-sm text-gray-700 dark:text-gray-200">
                {q.question}
              </label>
              <input
                type="text"
                value={answers[index] || ''}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-300"
                required
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl"
          >
            Verify Answers
          </button>
        </form>
      )}
    </div>
  );
};

export default SecurityQuiz;