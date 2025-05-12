import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminContactList = ({ adminId, onUserSelect }) => {
  const [usersWithMessages, setUsersWithMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsersWithMessages = async () => {
      try {
        console.log('Fetching all users...');
        const usersRes = await axios.get('/api/users/');
        const users = usersRes.data;
        console.log('Users fetched:', users);

        console.log('Fetching messaged users...');
        const messagedUsersRes = await axios.get(`/api/messages/admin/${adminId}/users`);
        const messagedUsers = messagedUsersRes.data;
        console.log('Messaged users fetched:', messagedUsers);

        const userMap = new Map(users.map(user => [user._id, user]));

        const filteredUsers = messagedUsers
          .map(mu => userMap.get(mu._id))
          .filter(Boolean);

        const usersWithLastMessage = await Promise.all(
          filteredUsers.map(async (user) => {
            const messagesRes = await axios.get(`/api/messages/${user._id}/${adminId}`);
            const messages = messagesRes.data;
            const lastMessage = messages.length > 0 ? messages[messages.length - 1].message : '';
            return { ...user, lastMessage };
          })
        );

        console.log('Users with last message:', usersWithLastMessage);
        setUsersWithMessages(usersWithLastMessage);
      } catch (err) {
        console.error('Failed to fetch users and messages:', err);
        setError('Failed to fetch users and messages');
      } finally {
        setLoading(false);
      }
    };

    if (adminId) {
      fetchUsersWithMessages();
    } else {
      console.warn('adminId is not provided');
      setLoading(false);
    }
  }, [adminId]);

  if (loading) {
    return <div className="text-center mt-10 text-pink-500">Loading users and messages...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  if (usersWithMessages.length === 0) {
    return <div className="text-center mt-10 text-gray-500 italic">No users with messages found.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-pink-600">Users with Messages</h2>
      <ul className="space-y-4">
        {usersWithMessages.map(user => (
          <li
            key={user._id}
            className="border border-pink-200 dark:border-gray-700 rounded-lg p-4 hover:bg-pink-50 dark:hover:bg-gray-800 cursor-pointer"
            onClick={() => onUserSelect && onUserSelect(user)}
          >
            <div className="flex justify-between items-center">
              <div>
                <div className="text-lg font-semibold text-pink-600">{user.firstName || user.email}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{user.userType}</div>
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300 italic max-w-xl truncate">{user.lastMessage || 'No messages yet'}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminContactList;
