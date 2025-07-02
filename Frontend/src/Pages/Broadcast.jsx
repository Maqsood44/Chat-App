import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); // replace with your backend URL

function Broadcast() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on('chat-message', (data) => {
      setChat((prev) => [...prev, { type: 'received', text: data }]);
    });

    return () => socket.off('chat-message');
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message) return;

    socket.emit('chat-message', message);
    setChat((prev) => [...prev, { type: 'sent', text: message }]);
    setMessage('');
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2>Real-Time Broadcast Chat</h2>
      <div style={{ border: '1px solid #ccc', padding: 10, height: 300, overflowY: 'scroll' }}>
        {chat.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.type === 'sent' ? 'right' : 'left' }}>
            <p><strong>{msg.type === 'sent' ? 'You' : 'Other'}:</strong> {msg.text}</p>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} style={{ marginTop: 10 }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message"
          style={{ width: '80%', padding: 10 }}
        />
        <button type="submit" style={{ padding: 10 }}>Send</button>
      </form>
    </div>
  );
}

export default Broadcast;
