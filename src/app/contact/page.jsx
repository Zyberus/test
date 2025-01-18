'use client';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';

var ParticleBackground = dynamic(function () { return import('@/components/ParticleBackground'); }, {
    ssr: false
});

export default function Contact() {
    useEffect(() => {
        const form = document.querySelector('form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };

            console.log('Submitting form with data:', formData);
            
            try {
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (data.success) {
                    alert('Thank you for your message! We will get back to you soon.');
                    form.reset();
                } else {
                    alert('There was an error sending your message. Please try again.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('There was an error sending your message. Please try again.');
            }
        });
    }, []);

    return (<main className="min-h-screen relative">
      <ParticleBackground />
      
      <div className="content px-4 py-20 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold gradient-text text-center mb-12">
            Get in Touch
          </h1>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-secondary/30 backdrop-blur-lg rounded-2xl p-8">
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <input type="text" id="name" className="w-full px-4 py-3 rounded-lg bg-primary/50 border border-gray-700 text-white focus:ring-2 focus:ring-accent focus:border-transparent outline-none" placeholder="Your name"/>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input type="email" id="email" className="w-full px-4 py-3 rounded-lg bg-primary/50 border border-gray-700 text-white focus:ring-2 focus:ring-accent focus:border-transparent outline-none" placeholder="your@email.com"/>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <textarea id="message" rows={6} className="w-full px-4 py-3 rounded-lg bg-primary/50 border border-gray-700 text-white focus:ring-2 focus:ring-accent focus:border-transparent outline-none resize-none" placeholder="Your message..."></textarea>
              </div>

              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="w-full bg-accent text-primary px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-all">
                Send Message
              </motion.button>
            </form>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="mt-12 text-center text-gray-300">
            <p>Or reach us at</p>
            <a href="mailto:contact@app-nest.com" className="text-accent hover:underline">
              contact@app-nest.com
            </a>
          </motion.div>
        </motion.div>
      </div>
    </main>);
}
