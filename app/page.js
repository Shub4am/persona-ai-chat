"use client"
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import PersonaDetails from './components/PersonaDetails';
import SessionInfo from './components/SessionInfo';

export default function Home() {
  const [persona, setPersona] = useState("hitesh");
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const clearChat = () => {
    setMessages([]);
    setInput("")
  };

  const handlePersonaChange = (newPersona) => {
    setPersona(newPersona);
    setMessages([]);
    setInput("")
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const newUserMsg = {
      role: "user",
      content: input,
      timestamp: Date.now(),
    };
    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          persona,
          messages: updatedMessages,
        }),
      });
      const data = await res.json();
      const aiReply = {
        role: "model",
        content: data.reply || "Sorry, I couldn't generate a reply.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, aiReply]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          content: "Sorry, something went wrong. Please try again.",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-gray-400 via-black to-gray-700 p-4 md:p-6 overflow-hidden">
      <div className="max-w-7xl mx-auto h-full flex flex-col">
        {/* Header */}
        <div className=" flex bg-gradient-to-r from-orange-400 via-orange-600 to-amber-400 backdrop-blur-xl rounded-xl p-3 mb-4 shadow-2xl justify-center items-center gap-6">
          <Image
            src={'/icon.jpg'}
            alt={"icon logo"}
            width={100}
            height={100}
            unoptimized
            className="w-10 h-10 rounded-full object-cover ring-2 ring-white/20"
          />
          <h1 className="text-white text-xl md:text-2xl font-bold text-center tracking-wide drop-shadow-lg">Chat with Tech Mentors AI Personas</h1>
        </div>

        {/* Main Content */}
        <div className="flex-1 grid grid-cols-12 gap-4 md:gap-6 min-h-0">
          {/* Left Sidebar */}
          <div className="col-span-12 lg:col-span-3 space-y-4 md:space-y-6 overflow-y-auto max-h-full">
            <PersonaDetails persona={persona} setPersona={handlePersonaChange} />
            <div className="hidden lg:block">
              <SessionInfo onClearChat={clearChat} />
            </div>
          </div>

          {/* Main Chat Window */}
          <div className="col-span-12 lg:col-span-9 bg-white/5 backdrop-blur-xl rounded-xl border border-white/20 flex flex-col min-h-0">
            {/* Chat Header */}
            <div className="p-3 md:p-4 border-b border-white/20 flex-shrink-0">
              <div className="flex items-center gap-3">
                <Image
                  src={persona === "hitesh" ? "/hitesh.png" : "/piyush.png"}
                  alt="Current persona"
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                  <h2 className="text-white font-bold text-sm md:text-base">
                    {persona === "hitesh" ? "Hitesh Choudhary" : "Piyush Garg"}
                  </h2>
                  <p className="text-gray-400 text-xs md:text-sm">Available to help</p>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 md:p-6 overflow-y-auto min-h-0">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-white/60">
                  <div className="text-center ">
                    <h2 className="text-4xl md:text-6xl font-light mb-4 tracking-wider">chat window</h2>
                    <p className="text-base md:text-lg ">Ask {persona === "hitesh" ? "Hitesh" : "Piyush"} about anything!</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] sm:max-w-xs lg:max-md px-3 md:px-4 py-2 md:py-3 rounded-lg ${msg.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gradient-to-br from-slate-800/60 to-slate-900/60 rounded-2xl text-white backdrop-blur-xl border border-white/20'
                        }`}>
                        <p className="text-sm md:text-base leading-relaxed">{msg.content}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white backdrop-blur-xl px-3 md:px-4 py-2 md:py-3 rounded-lg">
                        <div className="flex items-center gap-2 ">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
                            <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                          </div>
                          <span className="text-sm text-white">Typing...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  {/* Invisible div to scroll to */}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Chat Input - Fixed at bottom */}
            <div className="p-3 md:p-4 border-t border-white/20 flex-shrink-0">
              <div className="flex gap-2 md:gap-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder={`Ask ${persona === "hitesh" ? "Hitesh" : "Piyush"}...`}
                  className="flex-1 bg-white/10 backdrop-blur-xl rounded-lg px-3 md:px-4 py-2 md:py-3 text-white placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base bg-gradient-to-br from-grey-500 via-zinc-500 to-grey-800 p-2"
                  disabled={loading}
                />
                <button
                  onClick={sendMessage}
                  disabled={loading || !input.trim()}
                  className="px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200 hover:shadow-lg text-sm md:text-base whitespace-nowrap"
                >
                  {loading ? 'Sending...' : 'Send'}
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}