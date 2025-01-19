'use client'

import { motion } from 'framer-motion'
import dynamic from 'next/dynamic'
import { useRef } from 'react'

const ParticleBackground = dynamic(() => import('../../../components/ParticleBackground.tsx'), {
  ssr: false
})

const features = [
  {
    title: "AI-Powered Development",
    description: "Harness the power of artificial intelligence to accelerate your development process",
    icon: "🤖"
  },
  {
    title: "Real-time Collaboration",
    description: "Work seamlessly with your team in real-time, anywhere in the world",
    icon: "👥"
  },
  {
    title: "Advanced Analytics",
    description: "Gain deep insights into your application's performance and user behavior",
    icon: "📊"
  },
  {
    title: "Automated Testing",
    description: "Ensure quality with our automated testing and deployment pipeline",
    icon: "✅"
  },
  {
    title: "Security First",
    description: "Enterprise-grade security features built into every aspect of your application",
    icon: "🔒"
  },
  {
    title: "Scalable Infrastructure",
    description: "Build applications that scale automatically with your user base",
    icon: "🚀"
  }
]

export default function Features() {
  const containerRef = useRef<HTMLDivElement>(null)

  return (
    <main className="min-h-screen relative pt-16">
      <ParticleBackground />
      
      <div className="content px-4 py-10 md:py-20 max-w-7xl mx-auto" ref={containerRef}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold gradient-text mb-6">
            Powerful Features
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Discover the tools that will revolutionize your development workflow
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-secondary/30 backdrop-blur-lg rounded-2xl p-6 md:p-8 hover:bg-secondary/40 transition-all"
            >
              <div className="text-3xl md:text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl md:text-2xl font-bold text-accent mb-3">{feature.title}</h3>
              <p className="text-gray-300 text-sm md:text-base">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-accent text-primary px-8 py-4 rounded-full text-lg font-semibold hover:shadow-lg transition-all"
          >
            Start Building Now
          </motion.button>
        </motion.div>
      </div>
    </main>
  )
}
