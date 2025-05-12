import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

const AdminContact = ({ adminId }) => {
  const [usersWithMessages, setUsersWithMessages] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [error, setError] = useState(null);
  const messagesEndRef = useRef(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Fetch users with messages
  useEffect(() => {
    const fetchUsersWithMessages = async () => {
      setLoadingUsers(true);
      try {
        const res = await axios.get(`/api/messages/admin/${adminId}/users-with-messages`);
        const usersWithMsgs = res.data;

        // Map to format users with lastMessage for display
        const formattedUsers = usersWithMsgs.map(({ user, messages }) => {
          const lastMessage = messages.length > 0 ? messages[messages.length - 1].message : '';
          return { ...user, lastMessage };
        });

        setUsersWithMessages(formattedUsers);
      } catch (err) {
        setError('Failed to fetch users and messages');
        console.error(err);
      } finally {
        setLoadingUsers(false);
      }
    };

    if (adminId) {
      fetchUsersWithMessages();
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
          <h2 className="text-xl font-semibold text-pink-600">
            {selectedUser ? 'Chat with ' + (selectedUser.firstName || selectedUser.email) : 'Select a user to chat'}
          </h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-800">
          {loadingMessages ? (
            <p className="text-center text-pink-500">Loading messages...</p>
          ) : messages.length === 0 ? (
            <p className="text-center text-gray-500">No messages yet.</p>
          ) : (
            messages.map((msg, idx) => (
              <div
                key={idx}
                className={"max-w-xs p-3 rounded-lg shadow " + (msg.senderId === adminId ? "bg-pink-500 text-white self-end" : "bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 self-start")}
              >
                <div>{msg.message}</div>
                <div className="text-xs text-gray-300 mt-1 text-right">
                  {new Date(msg.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
        <div className="p-4 border-t border-gray-300 dark:border-gray-700 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-400"
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminContact;
