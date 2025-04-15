import React from 'react';

const ExerciseCard = ({ exercise, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer rounded-2xl p-4 bg-white dark:bg-gray-800 shadow-lg transition-transform hover:scale-105 duration-200 flex flex-col items-center text-center hover:shadow-xl"
    >
      {/* Optional image */}
      {exercise.media?.image && (
        <img
          src={exercise.media.image}
          alt={exercise.title}
          className="w-24 h-24 object-cover rounded-full mb-4 shadow"
        />
      )}

      {/* Title */}
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
        {exercise.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-500 dark:text-gray-300">
        {exercise.description}
      </p>
    </div>
  );
};

export default ExerciseCard;
