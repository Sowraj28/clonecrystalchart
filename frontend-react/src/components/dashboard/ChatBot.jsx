import React, { useState } from "react";
import "../../assets/css/chatbot.css";

export default function ChatBot({ onClose }) {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! Ask me anything about your coins or crypto." },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg = { from: "user", text: input };
    const botReply = {
      from: "bot",
      text: `You asked: "${input}". Currently I cannot fetch live data, but soon I can!`,
    };

    setMessages((prev) => [...prev, userMsg, botReply]);
    setInput("");
  };

  return (
    <div className="chatbot-popup">
      <div className="chatbot-header">
        Crypto ChatBot
        <span className="chatbot-close" onClick={onClose}>
          ✖
        </span>
      </div>

      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chatbot-message ${
              msg.from === "user" ? "user" : "bot"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="chatbot-input">
        <input
          type="text"
          placeholder="Ask about any coin..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
