import React, { useState, useEffect, useRef } from "react";
import "../../assets/css/chatbot.css";

export default function ChatBot({ onClose }) {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! Ask me anything about crypto 🚀" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const popularCoins = [
    "bitcoin",
    "ethereum",
    "tether",
    "binancecoin",
    "usd-coin",
    "ripple",
    "cardano",
    "dogecoin",
    "polygon",
    "solana",
    "polkadot",
    "litecoin",
    "tron",
    "avalanche",
    "chainlink",
    "stellar",
    "uniswap",
    "vechain",
    "filecoin",
    "internet-computer",
    "algorand",
    "theta",
    "decentraland",
    "axie-infinity",
    "monero",
    "crypto-com-chain",
    "fantom",
    "hedera-hashgraph",
    "tezos",
    "osmosis",
  ];

  useEffect(() => {
    Promise.all(
      popularCoins.map((coin) =>
        fetch(`http://localhost:8000/api/v1/coins/${coin}/`).catch((err) => {
          console.error(`Failed to fetch ${coin}`, err);
        })
      )
    );
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { from: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/v1/chatbot/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await res.json();
      const botResponse = data.response || data.reply;

      if (botResponse) {
        setMessages((prev) => [...prev, { from: "bot", text: botResponse }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { from: "bot", text: "⚠️ Sorry, I couldn't fetch a response." },
        ]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: "❌ Error connecting to chatbot." },
      ]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="chatbot-overlay" onClick={onClose}>
      <div
        className="chatbot-popup"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside the chatbot
      >
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
          {loading && <div className="chatbot-message bot">🤖 Thinking…</div>}
          <div ref={messagesEndRef} />
        </div>

        <div className="chatbot-input">
          <input
            type="text"
            placeholder="Ask me about crypto..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={loading}
          />
          <button onClick={handleSend} disabled={loading}>
            {loading ? "..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
