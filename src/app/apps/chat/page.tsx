'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

const ParticleBackground = dynamic(() => import('@/components/ParticleBackground'), {
  ssr: false
});

export default function ChatPage() {
  const [messages, setMessages] = useState<Array<{text: string, isUser: boolean, isError?: boolean}>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setMessages(prev => [...prev, { text: userMessage, isUser: true }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const responseText = await response.text();
      console.log('Raw response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse response:', e);
        throw new Error('Invalid response format from server');
      }

      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response');
      }

      if (!data.response) {
        throw new Error('Invalid response format');
      }

      setMessages(prev => [...prev, { text: data.response, isUser: false }]);
    } catch (error) {
      console.error('Chat Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setMessages(prev => [...prev, {
        text: errorMessage,
        isUser: false,
        isError: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-900 to-black relative">
      <ParticleBackground />
      
      <div className="relative z-10 container mx-auto px-4 py-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto bg-zinc-900/50 backdrop-blur-lg rounded-2xl shadow-2xl border border-zinc-800/50 overflow-hidden"
        >
          {/* Header */}
          <div className="p-6 border-b border-zinc-800/50">
            <div className="flex items-center space-x-4">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10"
              >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" 
                        stroke="currentColor" className="text-blue-400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3.3 7L12 12.2 20.7 7" stroke="currentColor" className="text-blue-400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 22.1V12" stroke="currentColor" className="text-blue-400" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Zyberus
                </h1>
                <p className="text-zinc-400 text-sm">AI Assistant</p>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="h-[600px] overflow-y-auto p-6">
            <div className="space-y-6">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
              >
                <h2 className="text-4xl font-bold mb-3">
                  Welcome to <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Zyberus</span>
                </h2>
                <p className="text-zinc-400">
                  Your personal AI assistant. How may I help you today?
                </p>
              </motion.div>
              
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: message.isUser ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: message.isUser ? 20 : -20 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-4 rounded-xl ${
                        message.isUser
                          ? 'bg-blue-500/20 border border-blue-500/30'
                          : message.isError
                            ? 'bg-red-500/20 border border-red-500/30'
                            : 'bg-zinc-800/50 border border-zinc-700/30'
                      }`}
                    >
                      <div className={`whitespace-pre-wrap ${
                        message.isUser 
                          ? 'text-blue-100' 
                          : message.isError 
                            ? 'text-red-300' 
                            : 'text-zinc-100'
                      }`}>
                        {message.text}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex space-x-2 p-4">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.3, 1, 0.3]
                        }}
                        transition={{ 
                          duration: 1, 
                          repeat: Infinity, 
                          delay: i * 0.2,
                          ease: "easeInOut"
                        }}
                        className="w-2 h-2 rounded-full bg-blue-400"
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-zinc-800/50 bg-zinc-900/50">
            <form onSubmit={handleSubmit} className="flex space-x-4">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-zinc-800/50 text-white border border-zinc-700/50 rounded-xl px-4 py-3
                         placeholder:text-zinc-500 focus:outline-none focus:border-blue-500/50
                         focus:ring-1 focus:ring-blue-500/50 transition-all duration-300"
              />
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-xl font-medium
                         hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed 
                         transition-all duration-300 shadow-lg shadow-blue-500/20"
              >
                Send
              </motion.button>
            </form>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
