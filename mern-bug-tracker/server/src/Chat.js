// src/Chat.js
import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // ✅ Connect to your server

const Chat = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    // Listen for messages from server
    socket.on("chatMessage", (data) => {
      setChat((prev) => [...prev, data]);
    });

    // Cleanup when component unmounts
    return () => socket.off("chatMessage");
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() === "") return;
    const msgData = {
      user: "User-" + Math.floor(Math.random() * 1000), // temporary username
      text: message,
      time: new Date().toLocaleTimeString(),
    };
    socket.emit("chatMessage", msgData);
    setMessage("");
  };

  return (
    <div style={styles.container}>
      <h2>💬 Real-Time Chat</h2>

      <div style={styles.chatBox}>
        {chat.map((msg, index) => (
          <div key={index} style={styles.msg}>
            <strong>{msg.user}</strong>: {msg.text} <span style={styles.time}>({msg.time})</span>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} style={styles.form}>
        <input
          type="text"
          value={message}
          placeholder="Type a message..."
          onChange={(e) => setMessage(e.target.value)}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Send</button>
      </form>
    </div>
  );
};

const styles = {
  container: { maxWidth: 400, margin: "50px auto", textAlign: "center", fontFamily: "Arial" },
  chatBox: {
    border: "1px solid #ddd",
    borderRadius: 10,
    padding: 10,
    height: 300,
    overflowY: "auto",
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  msg: { textAlign: "left", marginBottom: 5 },
  time: { fontSize: "0.8em", color: "#999" },
  form: { display: "flex" },
  input: { flex: 1, padding: "10px", borderRadius: 8, border: "1px solid #ccc" },
  button: { marginLeft: 10, padding: "10px 15px", borderRadius: 8, border: "none", background: "#007bff", color: "white" },
};

export default Chat;
