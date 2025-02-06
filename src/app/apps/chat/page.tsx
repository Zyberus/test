'use client';

import { useState, useRef, useEffect } from 'react';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = { text: inputMessage, isUser: true };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const botMessage = { text: "This is a sample response from Zyberus Chat.", isUser: false };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { text: "Sorry, there was an error processing your request.", isUser: false, isError: true };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="h-[calc(100vh-80px)]">
      <div className="flex h-full overflow-hidden bg-[#0A0F1C] relative">
        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col h-full relative bg-gradient-to-b from-[#0A0F1C] to-[#0D1117]">
          {/* Chat Header */}
          <header className="flex items-center justify-between px-4 py-3 bg-[#0D1117]/90 backdrop-blur-lg border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 p-1.5">
                <svg className="w-full h-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">Zyberus Chat</h1>
                <p className="text-sm text-zinc-400">AI-powered chat assistant</p>
              </div>
            </div>
            <button
              onClick={() => setMessages([])}
              className="p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </button>
          </header>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center">
                <div className="w-16 h-16 mb-8 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 p-3">
                  <svg className="w-full h-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                          d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Welcome to Zyberus Chat
                </h2>
                <p className="text-zinc-400 max-w-md text-sm sm:text-base">
                  Your advanced AI assistant, ready to help with any task. Start a conversation by typing a message below.
                </p>
              </div>
            ) : (
              <div className="pb-32">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`px-4 py-6 ${message.isUser ? 'bg-transparent' : 'bg-[#0D1117]'}`}
                  >
                    <div className="max-w-3xl mx-auto flex space-x-4">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-lg ${
                        message.isUser 
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                          : 'bg-gradient-to-r from-blue-500 to-purple-500'
                      } p-1.5`}>
                        {message.isUser ? (
                          <svg className="w-full h-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        ) : (
                          <svg className="w-full h-full text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>
                      <div className={`flex-1 prose prose-invert max-w-none ${
                        message.isError ? 'text-red-400' : 'text-zinc-100'
                      }`}>
                        <p className="leading-relaxed whitespace-pre-wrap break-words text-[15px] mb-0">
                          {message.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="px-4 py-6 bg-[#0D1117]">
                    <div className="max-w-3xl mx-auto flex items-center space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 p-1.5">
                        <svg className="w-full h-full text-white animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" 
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      </div>
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <div className="w-2 h-2 rounded-full bg-blue-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="absolute bottom-0 left-0 right-0">
            <div className="bg-gradient-to-t from-[#0A0F1C] via-[#0A0F1C] to-transparent pt-20">
              <div className="bg-[#0D1117]/90 backdrop-blur-xl border-t border-white/10 px-4 py-4">
                <div className="max-w-3xl mx-auto">
                  <form onSubmit={handleSubmit} className="relative">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg opacity-20 group-hover:opacity-30 transition duration-300" />
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Message Zyberus..."
                        className="w-full bg-[#1A1F2C] text-white rounded-lg pl-4 pr-12 py-3
                                 border border-white/10 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20
                                 placeholder-zinc-500 text-[15px]"
                      />
                      <button
                        type="submit"
                        disabled={isLoading || !inputMessage.trim()}
                        className="absolute right-2 p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500
                                 text-white disabled:opacity-50 disabled:cursor-not-allowed
                                 hover:from-blue-600 hover:to-purple-600 transition-all duration-200"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
