import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

// Connect to your backend server
const socket = io('http://localhost:5000'); // 🔁 Update this to your server URL if needed

const ChatBot = ({ userId, adminId }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  // Join the user's own room on socket connection
  useEffect(() => {
    socket.emit('join_room', userId);

    socket.on('receive_message', (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
    });

    return () => {
      socket.off('receive_message');
    };
  }, [userId]);

  // Load previous messages from backend
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/api/messages/${userId}/${adminId}`);
        setMessages(res.data);
      } catch (error) {
        console.error('Failed to load messages:', error);
      }
    };

    fetchMessages();
  }, [userId, adminId]);

  // Handle send
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
    <div style={{ maxWidth: '400px', margin: 'auto', border: '1px solid #ccc', padding: '10px' }}>
      <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '10px' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.senderId === userId ? 'right' : 'left' }}>
            <p style={{ background: msg.senderId === userId ? '#dcf8c6' : '#eee', display: 'inline-block', padding: '5px 10px', borderRadius: '10px' }}>
              {msg.message}
            </p>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{ flexGrow: 1, padding: '5px' }}
        />
        <button onClick={sendMessage} style={{ padding: '5px 10px' }}>Send</button>
      </div>
    </div>
  );
};

export default ChatBot;
