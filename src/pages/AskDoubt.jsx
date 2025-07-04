import React, { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { Menu } from "lucide-react";
import StudentNavbar from "../components/StudentNavbar";

const API_URL = `${import.meta.env.VITE_BASE_URL}/api/gemini`;

const AskDoubt = () => {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hi! Ask me any study-related question." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input })
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.reply || "Sorry, I couldn't answer that." }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "Error connecting to the server." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 relative">
      {/* Hamburger icon is included in Sidebar itself */}
      <StudentNavbar />

      {/* Main content */}
      <div className="flex-1 md:ml-64 w-full mt-16 md:mt-0">
        <div className="max-w-3xl mx-auto py-8 px-4">
          <div className="bg-white rounded-2xl shadow-xl flex flex-col h-[80vh]">
            <div className="px-6 py-4 border-b flex items-center gap-3">
              <span className="text-2xl font-bold text-gray-800">Ask Doubt</span>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 bg-gradient-to-b from-white to-blue-50">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`rounded-xl px-4 py-2 max-w-[80%] shadow ${
                      msg.sender === "user"
                        ? "bg-blue-200 text-blue-900 rounded-br-none"
                        : "bg-green-100 text-green-900 rounded-bl-none border border-green-200"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <form
              onSubmit={handleSend}
              className="flex items-center gap-2 px-6 py-4 border-t bg-white"
            >
              <input
                type="text"
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-400"
                placeholder="Type your question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                autoFocus
              />
              <button
                type="submit"
                className={`px-5 py-2 rounded-lg font-semibold text-white bg-purple-600 hover:bg-purple-700 transition ${
                  loading ? "opacity-60 cursor-not-allowed" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Sending..." : "Send"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskDoubt;
