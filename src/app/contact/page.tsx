'use client'

import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'

const ParticleBackground = dynamic(() => import('@/components/ParticleBackground'), {
  ssr: false
})

export default function Contact() {
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
            <form className="space-y-4 md:space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 md:py-3 rounded-lg bg-primary/50 border border-gray-700 text-white focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 md:py-3 rounded-lg bg-primary/50 border border-gray-700 text-white focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-2 md:py-3 rounded-lg bg-primary/50 border border-gray-700 text-white focus:ring-2 focus:ring-accent focus:border-transparent outline-none resize-none"
                  placeholder="Your message"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full md:w-auto px-8 py-3 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 transition-colors duration-200"
              >
                Send Message
              </button>
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
  )
}
