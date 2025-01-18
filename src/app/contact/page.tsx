'use client'

import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { useState, FormEvent } from 'react'

const ParticleBackground = dynamic(() => import('@/components/ParticleBackground'), {
  ssr: false
})

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  [key: string]: string;
}

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setStatus('submitting');
    setErrorMessage('');

    try {
      console.log('Submitting form data:', formData);
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      console.log('Response status:', response.status);
      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit form');
      }
      
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      console.error('Form submission error:', error);
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to send message. Please try again.');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  return (
    <main className="min-h-screen relative pt-16">
      <ParticleBackground />
      
      <div className="content px-4 py-10 md:py-20 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto"
        >
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold gradient-text text-center mb-8">
            Get in Touch
          </h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-secondary/30 backdrop-blur-lg rounded-2xl p-6 md:p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full px-4 py-2 md:py-3 rounded-lg bg-primary/50 border ${errors.name ? 'border-red-500' : 'border-gray-700'} text-white focus:ring-2 focus:ring-accent focus:border-transparent outline-none`}
                  placeholder="Your name"
                />
                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className={`w-full px-4 py-2 md:py-3 rounded-lg bg-primary/50 border ${errors.email ? 'border-red-500' : 'border-gray-700'} text-white focus:ring-2 focus:ring-accent focus:border-transparent outline-none`}
                  placeholder="your.email@example.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                  className={`w-full px-4 py-2 md:py-3 rounded-lg bg-primary/50 border ${errors.subject ? 'border-red-500' : 'border-gray-700'} text-white focus:ring-2 focus:ring-accent focus:border-transparent outline-none`}
                  placeholder="What's this about?"
                />
                {errors.subject && <p className="mt-1 text-sm text-red-500">{errors.subject}</p>}
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                  rows={4}
                  className={`w-full px-4 py-2 md:py-3 rounded-lg bg-primary/50 border ${errors.message ? 'border-red-500' : 'border-gray-700'} text-white focus:ring-2 focus:ring-accent focus:border-transparent outline-none resize-none`}
                  placeholder="Your message here..."
                />
                {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                  status === 'submitting'
                    ? 'bg-gray-500 cursor-not-allowed'
                    : 'bg-accent hover:bg-accent/80'
                }`}
              >
                {status === 'submitting' ? 'Sending...' : 'Send Message'}
              </button>

              {status === 'success' && (
                <div className="mt-4 p-4 bg-green-500/20 border border-green-500 rounded-lg text-green-500 text-center">
                  Message sent successfully!
                </div>
              )}

              {status === 'error' && (
                <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-500 text-center">
                  {errorMessage}
                </div>
              )}
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-12 text-center text-gray-300"
          >
            <p>Or reach us at</p>
            <a href="mailto:contact@app-nest.com" className="text-accent hover:underline">
              contact@app-nest.com
            </a>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
