
import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import UserList from './UserList';

const socket = io('http://localhost:5000');

const Messages = ({ adminId }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
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

  // Fetch messages for selected user
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser || !adminId) return;
      setLoadingMessages(true);
      try {
        const res = await fetch(`/api/messages/${selectedUser._id}/${adminId}`);
        const data = await res.json();
        setMessages(data);
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
        <UserList onUserSelect={setSelectedUser} />
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
