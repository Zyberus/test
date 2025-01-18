'use client'

import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'

const ParticleBackground = dynamic(() => import('@/components/ParticleBackground'), {
  ssr: false
})

export default function About() {
  return (
    <main className="min-h-screen relative pt-16">
      <ParticleBackground />
      
      <div className="content px-4 py-10 md:py-20 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8 md:space-y-12"
        >
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold gradient-text text-center mb-8">
            About App-Nest
          </h1>
          
          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-secondary/30 backdrop-blur-lg rounded-2xl p-6 md:p-8"
            >
              <h2 className="text-xl md:text-2xl font-bold text-accent mb-4">Our Vision</h2>
              <p className="text-gray-300 text-sm md:text-base">
                App-Nest is pioneering the future of digital innovation, creating a space where creativity meets technology.
                Our platform empowers developers and creators to build the next generation of applications.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-secondary/30 backdrop-blur-lg rounded-2xl p-6 md:p-8"
            >
              <h2 className="text-xl md:text-2xl font-bold text-accent mb-4">Our Mission</h2>
              <p className="text-gray-300 text-sm md:text-base">
                We're on a mission to democratize app development by providing cutting-edge tools and resources
                that make innovation accessible to everyone, regardless of their technical background.
              </p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-secondary/30 backdrop-blur-lg rounded-2xl p-6 md:p-8"
          >
            <h2 className="text-xl md:text-2xl font-bold text-accent mb-4">Core Values</h2>
            <div className="grid md:grid-cols-3 gap-4 md:gap-6">
              <div className="text-center">
                <h3 className="text-lg md:text-xl font-semibold mb-2">Innovation</h3>
                <p className="text-gray-300 text-sm md:text-base">Pushing boundaries and exploring new possibilities</p>
              </div>
              <div className="text-center">
                <h3 className="text-lg md:text-xl font-semibold mb-2">Quality</h3>
                <p className="text-gray-300 text-sm md:text-base">Delivering excellence in every line of code</p>
              </div>
              <div className="text-center">
                <h3 className="text-lg md:text-xl font-semibold mb-2">Community</h3>
                <p className="text-gray-300 text-sm md:text-base">Building together for a better future</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  )
}
