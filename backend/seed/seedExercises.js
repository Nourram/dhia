import React, { useState, useEffect } from 'react';
import axios from 'axios';
import confetti from 'canvas-confetti';

const PlayExercise = () => {
  const [exercises, setExercises] = useState([]);
  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [audio] = useState(new Audio());

  useEffect(() => {
    const fetch = async () => {
      const token = localStorage.getItem('authToken');
      const res = await axios.get('/api/exercises?status=accepted', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExercises(res.data);
    };
    fetch();
  }, []);

  const current = exercises[index];

  const handleAnswer = (isCorrect) => {
    setAnswered(true);
    setSelected(isCorrect);
    const msg = isCorrect ? current.feedback?.correct : current.feedback?.incorrect;
    setFeedback(msg);

    // 🎉 Confetti if correct
    if (isCorrect) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    // 🔊 Audio feedback
    const soundUrl = isCorrect
      ? '/sounds/success.mp3'
      : '/sounds/try-again.mp3';

    audio.src = soundUrl;
    audio.play().catch(() => {});
  };

  const next = () => {
    setAnswered(false);
    setSelected(null);
    setFeedback('');
    setIndex((i) => i + 1);
  };

  if (!current) return (
    <div className="text-center mt-20">
      <p className="text-2xl text-emerald-600">🎉 All exercises completed! You did amazing!</p>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-6 bg-mint-50 dark:bg-gray-800 rounded-xl shadow-lg mt-10 text-center transition-all duration-300">
      <h2 className="text-3xl font-bold text-mint-700 mb-4">{current.title}</h2>
      <p className="text-lg mb-4 text-gray-700">{current.instruction}</p>

      {current.media?.image && (
        <img
          src={current.media.image}
          alt="Exercise visual"
          className="mx-auto mb-4 rounded-xl w-64 h-64 object-contain shadow"
        />
      )}

      <div className="flex flex-col items-center gap-4 mb-4">
        {current.choices?.map((choice, i) => (
          <button
            key={i}
            onClick={() => handleAnswer(choice.isCorrect)}
            disabled={answered}
            className={`w-full py-3 px-6 rounded-xl text-lg font-semibold shadow-md transition-all ${
              answered
                ? choice.isCorrect
                  ? 'bg-green-400 text-white'
                  : 'bg-red-300 text-white'
                : 'bg-white hover:bg-emerald-100'
            }`}
          >
            {choice.text}
          </button>
        ))}
      </div>

      {answered && (
        <div className="mt-6">
          <p className="text-xl font-bold text-mint-700">{feedback}</p>
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
