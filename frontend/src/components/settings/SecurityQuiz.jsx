import React, { useState } from 'react';
import axios from 'axios';

const SecurityQuiz = ({ userId, onSuccess }) => {
  const [quiz, setQuiz] = useState([]);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');
  const [step, setStep] = useState('load');
  const [setupQuiz, setSetupQuiz] = useState([{ question: '', answer: '' }]);

  // Load quiz from backend
  const loadQuiz = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.get("http://localhost:5000/api/users/" + userId + "/get-quiz", {
        headers: {
          Authorization: "Bearer " + token
        }
      });
      if (res.data.questions) {
        setQuiz(res.data.questions);
        setStep('quiz');
      } else {
        setStep('setup');
      }
    } catch (err) {
      if (err.response?.status === 404) {
        setStep('setup');
      } else {
        console.error("Axios error:", err.response?.data || err.message);
        setError(err.response?.data?.message || 'Failed to load quiz');
      }
    }
  };

  // Submit answers
  const submitAnswers = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      const res = await axios.post('http://localhost:5000/api/users/verify-quiz', {
        userId,
        answers: Object.values(answers),
      }, {
        headers: {
          Authorization: "Bearer " + token
        }
      });

      if (res.data.success) {
        onSuccess();
      } else {
        setError('Incorrect answers.');
      }
    } catch (err) {
      console.error(err);
      setError('Verification failed.');
    }
  };

  // Submit new quiz setup
  const submitSetupQuiz = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      const quizPayload = setupQuiz.filter(q => q.question.trim() && q.answer.trim());
      if (quizPayload.length === 0) {
        setError('Please add at least one question and answer.');
        return;
      }
      await axios.post("http://localhost:5000/api/users/" + userId + "/setup-quiz", { quiz: quizPayload }, {
        headers: {
          Authorization: "Bearer " + token
        }
      });
      setError('');
      setStep('load');
      loadQuiz();
    } catch (err) {
      console.error(err);
      setError('Failed to save quiz.');
    }
  };

  const handleAnswerChange = (index, value) => {
    setAnswers({ ...answers, [index]: value });
  };

  const handleSetupChange = (index, field, value) => {
    const newSetupQuiz = [...setupQuiz];
    newSetupQuiz[index][field] = value;
    setSetupQuiz(newSetupQuiz);
  };

  const addSetupQuestion = () => {
    setSetupQuiz([...setupQuiz, { question: '', answer: '' }]);
  };

  const removeSetupQuestion = (index) => {
    const newSetupQuiz = setupQuiz.filter((_, i) => i !== index);
    setSetupQuiz(newSetupQuiz);
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

      {step === 'setup' && (
        <form onSubmit={submitSetupQuiz} className="space-y-4">
          {setupQuiz.map((q, index) => (
            <div key={index} className="space-y-2">
              <input
                type="text"
                placeholder="Question"
                value={q.question}
                onChange={(e) => handleSetupChange(index, 'question', e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-300"
                required
              />
              <input
                type="text"
                placeholder="Answer"
                value={q.answer}
                onChange={(e) => handleSetupChange(index, 'answer', e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-300"
                required
              />
              {setupQuiz.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeSetupQuestion(index)}
                  className="text-red-500 underline"
                >
                  Remove Question
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addSetupQuestion}
            className="text-blue-500 underline"
          >
            Add Another Question
          </button>
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-xl"
          >
            Save Quiz
          </button>
        </form>
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
