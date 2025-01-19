'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';

const ParticleBackground = dynamic(() => import('@/components/ParticleBackground'), {
  ssr: false
});

export default function ChatPage() {
  const [messages, setMessages] = useState<Array<{text: string, isUser: boolean}>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
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
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get response from AI');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.response) {
        throw new Error('Invalid response format from server');
      }

      setMessages(prev => [...prev, { text: data.response, isUser: false }]);
    } catch (error) {
      console.error('Chat Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      setError(errorMessage);
      setMessages(prev => [...prev, {
        text: `Error: ${errorMessage}. Please try again.`,
        isUser: false,
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black relative">
      <ParticleBackground />
      
      <div className="relative z-10 pt-28 pb-10">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-zinc-950 rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-zinc-800/20 to-zinc-900/20" />
              <div className="relative bg-gradient-to-r from-zinc-900 to-black p-6 border-b border-zinc-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                      className="w-10 h-10"
                    >
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" 
                              stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3.3 7L12 12.2 20.7 7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 22.1V12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </motion.div>
                    <div>
                      <h1 className="text-2xl font-bold text-white">Zyberus</h1>
                      <p className="text-zinc-400 text-sm">AI Assistant</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="h-[600px] overflow-y-auto p-6 bg-black/50">
              <div className="space-y-6">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center"
                >
                  <h2 className="text-4xl font-bold text-white mb-3">
                    Welcome to <span className="text-zinc-400">Zyberus</span>
                  </h2>
                  <p className="text-zinc-500">
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
                            ? 'bg-zinc-900 border border-zinc-800'
                            : 'bg-zinc-950 border border-zinc-800'
                        }`}
                      >
                        <div className={`whitespace-pre-wrap ${message.isUser ? 'text-zinc-200' : 'text-zinc-300'}`}>
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
                          className="w-2 h-2 rounded-full bg-zinc-700"
                        />
                      ))}
                    </div>
                  </motion.div>
                )}

                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center"
                  >
                    <div className="max-w-[85%] p-4 rounded-xl bg-red-950/30 border border-red-900/30">
                      <div className="text-red-400 text-sm">{error}</div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Area */}
            <div className="p-6 bg-zinc-950 border-t border-zinc-800">
              <form onSubmit={handleSubmit} className="flex space-x-4">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-black text-white border border-zinc-800 rounded-xl px-4 py-3
                           placeholder:text-zinc-600 focus:outline-none focus:border-zinc-700
                           focus:ring-1 focus:ring-zinc-700 transition-all duration-300"
                />
                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-zinc-900 hover:bg-zinc-800 text-white px-8 py-3 rounded-xl font-medium
                           border border-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed 
                           transition-all duration-300"
                >
                  Send
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
