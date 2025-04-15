// src/components/DashboardHome.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const DashboardHome = ({ user, favorites }) => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Welcome to your dashboard, {user?.name}!</h1>
      <p className="mb-6 text-gray-600 dark:text-gray-300">Use the menu to navigate through your features.</p>

      {user?.userType === 'parent' && (
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4 text-pink-600">❤️ Favorite Exercises</h2>
          {favorites.length === 0 ? (
            <p className="text-gray-500 italic">No favorites yet. Start playing and add some!</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((ex) => (
                <div key={ex._id} className="bg-white dark:bg-gray-800 rounded-full p-6 shadow-md text-center hover:scale-105 transition duration-200 border border-pink-100">
                  <h3 className="text-lg font-semibold text-pink-600">{ex.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{ex.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="mt-20 text-center">
        <Link
          to="/user-dashboard/feedback"
          className="inline-block px-6 py-3 bg-pink-500 text-white rounded-lg shadow hover:bg-pink-600 transition"
        >
          Feedback & Suggestions
        </Link>
      </div>
    </div>
  );
};

export default DashboardHome;
