import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateExerciseForm = () => {
  const navigate = useNavigate();

  const [exercise, setExercise] = useState({
    title: '',
    type: 'cognitive',
    level: 'easy',
    instruction: '',
    media: { image: '', audio: '' },
    choices: [{ text: '', isCorrect: false }],
    feedback: { correct: '', incorrect: '' },
    typeSpecificData: {},
    expectedOutcome: '',
    validationType: 'auto',
    scoreLogic: {
      total: 1,
      correctRequired: 1
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExercise(prev => ({ ...prev, [name]: value }));
  };

  const handleChoiceChange = (index, field, value) => {
    const updated = [...exercise.choices];
    updated[index][field] = field === "isCorrect" ? value === "true" : value;
    setExercise(prev => ({ ...prev, choices: updated }));
  };

  const addChoice = () => {
    setExercise(prev => ({
      ...prev,
      choices: [...prev.choices, { text: '', isCorrect: false }]
    }));
  };

  const handleTypeSpecific = (field, value) => {
    setExercise(prev => ({
      ...prev,
      typeSpecificData: {
        ...prev.typeSpecificData,
        [field]: value
      }
    }));
  };

  const resetForm = () => {
    setExercise({
      title: '',
      type: 'cognitive',
      level: 'easy',
      instruction: '',
      media: { image: '', audio: '' },
      choices: [{ text: '', isCorrect: false }],
      feedback: { correct: '', incorrect: '' },
      typeSpecificData: {},
      expectedOutcome: '',
      validationType: 'auto',
      scoreLogic: { total: 1, correctRequired: 1 }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('authToken');
    if (!token) return alert("⚠️ Not logged in.");

    try {
      const res = await axios.post("http://localhost:5000/api/exercises", {
        ...exercise,
        createdByModel: 'Pedagogue'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      alert("✅ Exercise successfully created!");
      console.log("📦 Saved:", res.data);
      resetForm();
      // navigate("/user-dashboard/exercises"); // Optional redirect
    } catch (err) {
      console.error("❌ Error creating exercise:", err.response?.data || err.message);
      alert("❌ Failed to create exercise: " + (err.response?.data?.message || "Unexpected error"));
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-800 shadow-lg rounded-xl mt-6">
      <h2 className="text-2xl font-bold text-emerald-600 dark:text-emerald-300 mb-4">Create a New Exercise</h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* Title */}
        <input
          name="title"
          value={exercise.title}
          onChange={handleChange}
          placeholder="Exercise Title"
          required
          className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700"
        />

        {/* Type */}
        <select
          name="type"
          value={exercise.type}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700"
        >
          <option value="cognitive">Cognitive</option>
          <option value="motor">Motor</option>
          <option value="social">Social</option>
        </select>

        {/* Level */}
        <select
          name="level"
          value={exercise.level}
          onChange={handleChange}
          className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>

        <select
            name="difficulty"
            value={exercise.difficulty || ''}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700"
          >
            <option value="">Select difficulty</option>
            <option value="1">1 - Very Easy</option>
            <option value="2">2 - Easy</option>
            <option value="3">3 - Medium</option>
            <option value="4">4 - Hard</option>
            <option value="5">5 - Very Hard</option>
        </select>


        {/* Instruction */}
        <textarea
          name="description"
          value={exercise.description || ''}
          onChange={handleChange}
          placeholder="Detailed description for the exercise"
          required
          className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700"
        />

        <textarea
          name="instruction"
          value={exercise.instruction}
          onChange={handleChange}
          placeholder="Instruction for the child"
          className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700"
        />

        {/* Media */}
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Image URL"
            value={exercise.media.image}
            onChange={(e) =>
              setExercise(prev => ({ ...prev, media: { ...prev.media, image: e.target.value } }))
            }
            className="flex-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700"
          />
          <input
            type="text"
            placeholder="Audio instruction URL"
            value={exercise.media.audio}
            onChange={(e) =>
              setExercise(prev => ({ ...prev, media: { ...prev.media, audio: e.target.value } }))
            }
            className="flex-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700"
          />
        </div>

        {/* Choices */}
        <div>
          <p className="font-medium text-emerald-600 mb-1">Answer Choices:</p>
          {exercise.choices.map((choice, i) => (
            <div key={i} className="flex items-center gap-3 mb-2">
              <input
                type="text"
                value={choice.text}
                onChange={(e) => handleChoiceChange(i, "text", e.target.value)}
                placeholder="Choice"
                className="flex-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700"
              />
              <select
                value={choice.isCorrect.toString()}
                onChange={(e) => handleChoiceChange(i, "isCorrect", e.target.value)}
                className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700"
              >
                <option value="false">Incorrect</option>
                <option value="true">Correct</option>
              </select>
            </div>
          ))}
          <button
            type="button"
            onClick={addChoice}
            className="text-sm text-blue-500 hover:underline"
          >
            + Add another choice
          </button>
        </div>

        {/* Feedback */}
        <input
          type="text"
          placeholder="Positive feedback"
          value={exercise.feedback.correct}
          onChange={(e) => setExercise(prev => ({ ...prev, feedback: { ...prev.feedback, correct: e.target.value } }))}
          className="w-full px-4 py-2 rounded-lg bg-green-100 dark:bg-green-700"
        />
        <input
          type="text"
          placeholder="Negative feedback"
          value={exercise.feedback.incorrect}
          onChange={(e) => setExercise(prev => ({ ...prev, feedback: { ...prev.feedback, incorrect: e.target.value } }))}
          className="w-full px-4 py-2 rounded-lg bg-red-100 dark:bg-red-700"
        />

        {/* Type-specific (Motor) */}
        {exercise.type === 'motor' && (
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Gesture to perform"
              value={exercise.typeSpecificData.gestureToDo || ''}
              onChange={(e) => handleTypeSpecific('gestureToDo', e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700"
            />
            <input
              type="number"
              placeholder="Duration (in seconds)"
              value={exercise.typeSpecificData.duration || ''}
              onChange={(e) => handleTypeSpecific('duration', parseInt(e.target.value))}
              className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700"
            />
          </div>
        )}

        {/* Expected Outcome / Scoring */}
        <div className="space-y-2">
          <input
            type="text"
            name="expectedOutcome"
            value={exercise.expectedOutcome}
            onChange={(e) => setExercise(prev => ({ ...prev, expectedOutcome: e.target.value }))}
            placeholder="Expected learning outcome"
            className="w-full px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700"
          />
          <div className="flex gap-4">
            <input
              type="number"
              placeholder="Total questions"
              value={exercise.scoreLogic.total}
              onChange={(e) => setExercise(prev => ({
                ...prev,
                scoreLogic: { ...prev.scoreLogic, total: parseInt(e.target.value) }
              }))}
              className="flex-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700"
            />
            <input
              type="number"
              placeholder="Correct answers needed"
              value={exercise.scoreLogic.correctRequired}
              onChange={(e) => setExercise(prev => ({
                ...prev,
                scoreLogic: { ...prev.scoreLogic, correctRequired: parseInt(e.target.value) }
              }))}
              className="flex-1 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            type="button"
            onClick={resetForm}
            className="px-6 py-2 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition shadow-sm"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-emerald-500 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-600 transition"
          >
            Create Exercise
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateExerciseForm;
