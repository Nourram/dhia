
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import confetti from 'canvas-confetti';

const PlayExercise = () => {
  const [exercises, setExercises] = useState([]);
  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [audio] = useState(new Audio());
  const [exerciseAudio] = useState(new Audio());
  const POINTS_PER_QUESTION = 5;

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const selectedType = query.get('type');
  const selectedLevel = query.get('level');
  const exerciseId = query.get('exerciseId');

  // Assuming childId is passed as a query parameter or can be obtained from user context
  const childId = query.get('childId') || null;

  useEffect(() => {
    const fetch = async () => {
      const token = localStorage.getItem('authToken');

      try {
        let res;
        if (exerciseId) {
          // Fetch specific exercise by ID
          res = await axios.get(`http://localhost:5000/api/exercises/${exerciseId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setExercises([res.data]);
          console.log('Fetched exercise data:', res.data);
        } else {
          const params = {};
          if (selectedType && selectedType !== 'all') params.type = selectedType;
          if (selectedLevel && selectedLevel !== 'all') {
            const levels = { easy: 1, medium: 3, hard: 5 };
            params.difficulty = levels[selectedLevel];
          }
          res = await axios.get('http://localhost:5000/api/exercises?status=accepted', {
            headers: { Authorization: `Bearer ${token}` },
            params
          });
          setExercises(res.data);
        }
      } catch (error) {
        console.error("❌ Failed to fetch exercises:", error);
      }
    };

    fetch();
  }, [selectedType, selectedLevel, exerciseId]);

  // Auto start exercise if exerciseId and childId are present
  useEffect(() => {
    if (exerciseId && childId) {
      // Optionally, you can add logic here to auto-start or focus on the first question
      // For now, we just log the auto-start event
      console.log(`Auto-starting exercise ${exerciseId} for child ${childId}`);
      // You could add more logic here if needed
    }
  }, [exerciseId, childId]);

  const current = exercises[index];
  console.log('Full current exercise object:', current);
  console.log('Current media:', current?.media);
  console.log('Current choices:', current?.choices);

      useEffect(() => {
        if (current?.media?.audio) {
          exerciseAudio.src = current.media.audio;
          exerciseAudio.play().catch(() => {});
        }
      }, [current, exerciseAudio]);

  const handleAnswer = async (isCorrect) => {
    setAnswered(true);
    setSelected(isCorrect);
    const msg = isCorrect ? current.feedback?.correct : current.feedback?.incorrect;
    setFeedback(msg);

    if (isCorrect) {
      setScore(prev => prev + POINTS_PER_QUESTION);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }

    const soundUrl = isCorrect ? '/sounds/SUCCESS.wav' : '/sounds/TRYAGAIN.ogg';
    audio.src = soundUrl;
    audio.play().catch(() => {});

    // Send participation data to backend
    try {
      const token = localStorage.getItem('authToken');
      if (!childId) {
        console.error('Child ID is missing for participation');
        return;
      }
      await axios.post('/api/participation', {
        childId,
        exerciseId: current._id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error('Failed to record participation:', error);
    }
  };

  const next = () => {
    setAnswered(false);
    setSelected(null);
    setFeedback('');
    setIndex(i => i + 1);
  };

  const restart = () => {
    setIndex(0);
    setScore(0);
    setAnswered(false);
    setSelected(null);
    setFeedback('');
  };

  if (!current) {
    const total = exercises.length * POINTS_PER_QUESTION;
    const stars = Math.floor(score / 5);

    return (
      <div className="text-center mt-20">
        <p className="text-2xl font-bold text-emerald-600">🎉 All exercises completed!</p>
        <p className="text-lg mt-2 text-gray-700">
          Final Score: <span className="font-bold text-emerald-700">{score} / {total}</span>
        </p>

        {/* ⭐ Star display */}
        <div className="flex justify-center gap-1 mt-4">
          {[...Array(9)].map((_, i) => (
            <span key={i} className={`text-3xl ${i < stars ? 'text-yellow-400' : 'text-gray-300'}`}>⭐</span>
          ))}
        </div>

        {/* 🔁 Restart button */}
        <button
          onClick={restart}
          className="mt-6 bg-pink-500 text-white px-6 py-2 rounded-lg hover:bg-pink-600 shadow transition"
        >
          🔁 Play Again
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg mt-10 text-center">
      <div className="flex justify-between text-sm text-gray-400 mb-2">
        <span>Exercise {index + 1} / {exercises.length}</span>
        <span>Score: {score}</span>
      </div>

      <h2 className="text-3xl font-bold text-mint-700 mb-3">{current.title}</h2>
      <p className="text-lg text-gray-700 mb-4">{current.description}</p>

      {current.media?.image && (
        <img
          src={current.media.image}
          alt="Visual"
          className="mx-auto mb-5 rounded-lg max-h-64 object-contain"
        />
      )}

      {console.log('Current choices:', current.choices)}
      <div className="flex flex-col gap-3 items-center mb-4">
        {current.choices && current.choices.length > 0 ? (
          current.choices.map((choice, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(choice.isCorrect)}
              disabled={answered}
              className={`w-full max-w-sm py-3 px-6 rounded-xl text-lg font-semibold transition-all shadow ${
                answered
                  ? choice.isCorrect
                    ? 'bg-green-400 text-white'
                    : 'bg-red-400 text-white'
                  : 'bg-white dark:bg-gray-700 hover:bg-emerald-100'
              }`}
            >
              {choice.text}
            </button>
          ))
        ) : (
          <p className="text-red-500 font-semibold">No answer choices available for this exercise.</p>
        )}
      </div>

      {answered && (
        <div className="mt-6">
          <p className="text-xl font-bold text-mint-700">{feedback}</p>
          <p className="text-sm mt-2 text-gray-600">+{selected ? POINTS_PER_QUESTION : 0} points</p>
          <p className="text-md mt-1 text-mint-600 font-semibold">Current score: {score}</p>

          <button
            onClick={next}
            className="mt-4 bg-mint-500 text-white px-6 py-2 rounded-lg shadow hover:bg-mint-600 transition"
          >
            Next ➡️
          </button>
        </div>
      )}
    </div>
  );
};

export default PlayExercise;
