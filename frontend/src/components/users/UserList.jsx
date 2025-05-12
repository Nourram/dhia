import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

const UserList = ({ adminId, onUserSelect }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      if (!adminId) {
        setError('Admin ID is required to fetch users.');
        setLoading(false);
        return;
      }
      try {
        const token = localStorage.getItem('authToken');
        const res = await axios.get(`/api/admin/${adminId}/users`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUsers(res.data);
      } catch (err) {
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [adminId]);

  if (loading) {
    return (
      <div className="text-center mt-10 text-pink-500 dark:text-pink-300">
        <span className="animate-pulse">Loading users...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center mt-10 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">User List</h2>
      <ul className="space-y-4">
        <AnimatePresence>
          {users.map((user) => (
            <motion.li
              key={user._id}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              whileHover={{ scale: 1.02 }}
              tabIndex="0"
              role="button"
              onClick={() => onUserSelect && onUserSelect(user)}
              onKeyDown={(e) => e.key === 'Enter' && onUserSelect && onUserSelect(user)}
              aria-label={`Select user ${user.firstName}`}
              className="bg-white dark:bg-gray-800 border border-pink-100 dark:border-gray-700 rounded-lg px-4 py-3 shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
            >
              <div className="text-lg font-semibold text-pink-600 dark:text-pink-400">{user.firstName}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">{user.userType} • {user.email}</div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      {users.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 text-center mt-8 italic">No users found.</p>
      )}
    </div>
  );
};

export default UserList;
