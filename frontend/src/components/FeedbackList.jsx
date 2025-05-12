import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUserCircle, FaSearch } from 'react-icons/fa';

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch feedbacks
  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const res = await axios.get('/api/feedback', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFeedbacks(res.data);
        setFilteredFeedbacks(res.data);
      } catch (err) {
        console.error('Failed to fetch feedbacks:', err);
        setError('❌ Unable to load feedbacks.');
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  // Filter logic
  useEffect(() => {
    const filtered = feedbacks.filter((fb) => {
      const matchSearch = fb.message.toLowerCase().includes(search.toLowerCase()) ||
        fb.userName?.toLowerCase().includes(search.toLowerCase());
      const matchCategory = categoryFilter ? fb.category === categoryFilter : true;
      return matchSearch && matchCategory;
    });
    setFilteredFeedbacks(filtered);
  }, [search, categoryFilter, feedbacks]);

  const categoryColors = {
    suggestion: 'bg-blue-100 text-blue-800',
    bug: 'bg-red-100 text-red-800',
    question: 'bg-yellow-100 text-yellow-800',
    appreciation: 'bg-green-100 text-green-800',
  };

  return (
    <section className="max-w-5xl mx-auto px-4 py-10">
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
        <header className="flex items-center mb-6">
          <FaUserCircle size={36} className="text-pink-500 mr-3" />
          <h2 className="text-2xl font-bold text-pink-600 dark:text-pink-300">
            User Feedbacks ({filteredFeedbacks.length})
          </h2>
        </header>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <FaSearch className="absolute top-3 left-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or message..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 dark:text-gray-400">Category:</label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
            >
              <option value="">All</option>
              <option value="suggestion">Suggestion</option>
              <option value="bug">Bug</option>
              <option value="question">Question</option>
              <option value="appreciation">Appreciation</option>
            </select>
          </div>
        </div>

        {/* State handling */}
        {loading && (
          <p className="text-center text-pink-600 dark:text-pink-300">Loading feedbacks...</p>
        )}
        {error && (
          <p className="text-center text-red-600">{error}</p>
        )}
        {!loading && filteredFeedbacks.length === 0 && (
          <p className="text-center italic text-gray-500 dark:text-gray-400">No feedbacks found.</p>
        )}

        {/* Feedbacks list */}
        <ul className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
          {filteredFeedbacks.map((fb) => (
            <li
              key={fb._id}
              className="bg-white dark:bg-gray-800 border border-pink-100 dark:border-gray-700 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <FaUserCircle className="text-pink-400 dark:text-pink-600 mt-1" size={40} />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="font-semibold text-pink-700 dark:text-pink-400">
                      {fb.userName || 'Anonymous'}
                      {fb.userEmail && (
                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">({fb.userEmail})</span>
                      )}
                    </p>
                    {fb.category && (
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        categoryColors[fb.category] || 'bg-gray-100 text-gray-800'
                      }`}>
                        {fb.category.charAt(0).toUpperCase() + fb.category.slice(1)}
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-gray-800 dark:text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">
                    {fb.message}
                  </p>
                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-500">
                    {new Date(fb.createdAt).toLocaleString(undefined, {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default FeedbackList;
