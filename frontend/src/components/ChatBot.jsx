import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:5000');

const ChatBot = ({ userId, adminId, userType }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [adminInfo, setAdminInfo] = useState(null);
  const messagesEndRef = useRef(null);

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Join room & listen
  useEffect(() => {
    if (!userId) return;

    socket.emit('join_room', userId);
    socket.on('receive_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off('receive_message');
    };
  }, [userId]);

  // Load previous messages and admin info
  useEffect(() => {
    const fetchMessages = async () => {
      if (!userId || !adminId) return;
      try {
        const res =
          userType === 'admin' || userType === 'healthcareprofessional'
            ? await axios.get(`/api/admin/${adminId}/messages`)
            : await axios.get(`/api/messages/${userId}/${adminId}`);
        setMessages(res.data);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    const fetchAdminInfo = async () => {
      try {
        const res = await axios.get(`/api/admin/${adminId}/profile`);
        setAdminInfo(res.data);
      } catch (error) {
        console.error('Failed to fetch admin info:', error);
      }
    };

    fetchMessages();
    fetchAdminInfo();
  }, [userId, adminId, userType]);

  // Helper to group messages by date
  const groupMessagesByDate = (msgs) => {
    return msgs.reduce((groups, msg) => {
      const date = new Date(msg.createdAt).toDateString();
      if (!groups[date]) groups[date] = [];
      groups[date].push(msg);
      return groups;
    }, {});
  };

  const groupedMessages = groupMessagesByDate(messages);

  const sendMessage = () => {
    if (!input.trim()) return;
    const messageData = {
      senderId: userId,
      receiverId: adminId,
      message: input,
    };
    socket.emit('send_message', messageData);
    setMessages((prev) => [...prev, { ...messageData, createdAt: new Date() }]);
    setInput('');
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl shadow-lg flex flex-col h-[550px]">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 p-4 border-b border-gray-300 dark:border-gray-700 bg-pink-50 dark:bg-pink-900 rounded-t-xl">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-pink-500 flex items-center justify-center text-white text-xl font-bold select-none">
            {adminInfo?.firstName ? adminInfo.firstName.charAt(0) : 'A'}
          </div>
          <div>
            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {adminInfo?.firstName || 'Admin'}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Online</div>
          </div>
        </div>
        <button
          onClick={async () => {
            if (!window.confirm('Are you sure you want to delete this conversation?')) return;
            try {
              await fetch(`http://localhost:5000/api/messages/conversation/${userId}/${adminId}`, {
                method: 'DELETE',
              });
              setMessages([]);
            } catch (error) {
              console.error('Failed to delete conversation:', error);
              alert('Failed to delete conversation. Please try again.');
            }
          }}
          className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-md transition text-sm"
          aria-label="Delete conversation"
          title="Delete Conversation"
        >
          Delete
        </button>
      </div>

      {/* Message List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-pink-400 scrollbar-track-gray-200 dark:scrollbar-thumb-pink-700 dark:scrollbar-track-gray-800">
        {Object.entries(groupedMessages).map(([date, msgs]) => (
          <div key={date}>
            <div className="text-center text-xs text-gray-500 dark:text-gray-400 mb-2">{date}</div>
            {msgs.map((msg, i) => (
              <div key={i} className={`flex items-end ${msg.senderId === userId ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`px-5 py-3 rounded-2xl max-w-xs break-words shadow-md ${
                    msg.senderId === userId
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.message}</div>
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 ml-2 mb-1 whitespace-nowrap">
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Field */}
      <div className="border-t border-gray-300 dark:border-gray-700 p-4 flex items-center gap-3 rounded-b-xl">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 px-5 py-3 rounded-2xl bg-gray-100 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
          onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
        />
        <button
          onClick={sendMessage}
          className="px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-2xl shadow-lg transition"
          aria-label="Send message"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
