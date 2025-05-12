
import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const Messages = ({ adminId }) => {
  const [usersWithMessages, setUsersWithMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    console.log('adminId in Messages:', adminId);
  }, [adminId]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch users with messages
  useEffect(() => {
    const fetchUsersWithMessages = async () => {
      setLoadingUsers(true);
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
        setLoadingUsers(false);
      }
    };

    if (adminId) {
      fetchUsersWithMessages();
    } else {
      console.warn('adminId is not provided');
      setLoadingUsers(false);
    }
  }, [adminId]);

  // Fetch messages for selected user
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser || !adminId) return;
      setLoadingMessages(true);
      try {
        const res = await axios.get(`/api/messages/${selectedUser._id}/${adminId}`);
        setMessages(res.data);
      } catch (err) {
        setError('Failed to fetch messages');
        console.error(err);
      } finally {
        setLoadingMessages(false);
      }
    };

    fetchMessages();
  }, [selectedUser, adminId]);

  // Socket.io for real-time messages
  useEffect(() => {
    if (!adminId) return;
    socket.emit('join_room', adminId);
    socket.on('receive_message', (newMsg) => {
      if (
        selectedUser &&
        ((newMsg.senderId === selectedUser._id && newMsg.receiverId === adminId) ||
        (newMsg.senderId === adminId && newMsg.receiverId === selectedUser._id))
      ) {
        setMessages(prev => [...prev, newMsg]);
      }
    });
    return () => socket.off('receive_message');
  }, [adminId, selectedUser]);

  const sendMessage = () => {
    if (!input.trim() || !selectedUser || !adminId) return;
    const messageData = {
      senderId: adminId,
      receiverId: selectedUser._id,
      message: input,
    };
    socket.emit('send_message', messageData);
    setMessages(prev => [...prev, { ...messageData, createdAt: new Date() }]);
    setInput('');
  };

  return (
    <div className="flex h-[600px] bg-white dark:bg-gray-900 rounded-lg shadow-md overflow-hidden">
      {/* User List */}
      <div className="w-1/3 border-r border-gray-300 dark:border-gray-700 overflow-y-auto">
        <h2 className="text-xl font-semibold p-4 border-b border-gray-300 dark:border-gray-700 text-pink-600">Users</h2>
        {loadingUsers ? (
          <p className="p-4 text-center text-pink-500">Loading users...</p>
        ) : error ? (
          <p className="p-4 text-center text-red-500">{error}</p>
        ) : usersWithMessages.length === 0 ? (
          <p className="p-4 text-center text-gray-500 italic">No users with messages found.</p>
        ) : (
          <ul>
            {usersWithMessages.map(user => (
              <li
                key={user._id}
                className={`p-3 cursor-pointer hover:bg-pink-100 dark:hover:bg-gray-800 ${
                  selectedUser?._id === user._id ? 'bg-pink-200 dark:bg-gray-700' : ''
                }`}
                onClick={() => setSelectedUser(user)}
              >
                <div className="font-semibold text-pink-600">{user.firstName || user.email}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{user.userType}</div>
                <div className="text-xs italic text-gray-500 dark:text-gray-400 truncate max-w-xs">{user.lastMessage || 'No messages yet'}</div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-300 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-pink-600">Users List</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800">
          {loadingUsers ? (
            <p className="text-center text-pink-500">Loading users...</p>
          ) : error ? (
            <p className="p-4 text-center text-red-500">{error}</p>
          ) : usersWithMessages.length === 0 ? (
            <p className="text-center text-gray-500 italic">No users with messages found.</p>
          ) : (
            <ul>
              {usersWithMessages.map(user => (
                <li
                  key={user._id}
                  className="p-3 cursor-pointer hover:bg-pink-100 dark:hover:bg-gray-800"
                >
                  <div className="font-semibold text-pink-600">{user.firstName || user.email}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{user.userType}</div>
                  <div className="text-xs italic text-gray-500 dark:text-gray-400 truncate max-w-xs">{user.lastMessage || 'No messages yet'}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
