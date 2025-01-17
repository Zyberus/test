'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Image from 'next/image'

const ParticleBackground = dynamic(() => import('@/components/ParticleBackground'), {
  ssr: false
})

const PortfolioSection = dynamic(() => import('@/components/PortfolioSection'), {
  ssr: false
})

const HeroCanvas = dynamic(() => import('@/components/HeroCanvas'), {
  ssr: false
})

const features = [
  {
    title: 'Modern Web Apps',
    description: 'Building cutting-edge applications with React, Next.js, and TypeScript',
    icon: <Image src="/icons/modern-web-apps.svg" alt="Modern Web Apps" width={40} height={40} />
  },
  {
    title: 'Responsive Design',
    description: 'Creating fluid layouts that work perfectly on any device',
    icon: <Image src="/icons/responsive-design.svg" alt="Responsive Design" width={40} height={40} />
  },
  {
    title: '3D Experiences',
    description: 'Crafting immersive 3D web experiences with Three.js',
    icon: <Image src="/icons/3d-experiences.svg" alt="3D Experiences" width={40} height={40} />
  }
]

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  return (
    <main className="min-h-screen bg-[var(--primary)]" ref={containerRef}>
      <div className="relative z-0">
        <ParticleBackground />
      </div>
      
      {/* Hero Section */}
      <section className="min-h-[90vh] flex items-center section-padding relative overflow-hidden">
        <motion.div 
          style={{ y, opacity }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute top-1/4 -left-20 w-40 h-40 bg-[var(--accent)] rounded-full blur-[100px] opacity-20" />
          <div className="absolute bottom-1/4 -right-20 w-40 h-40 bg-[var(--accent)] rounded-full blur-[100px] opacity-20" />
        </motion.div>

        <div className="container-width relative">
          <div className="grid lg:grid-cols-2 gap-[var(--space-m)] items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-[var(--space-s)]"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="text-[var(--accent)] font-medium mb-4">Web Development Excellence</h2>
                <h1 className="hero-text text-5xl sm:text-6xl md:text-7xl !leading-[1.1]">
                  Crafting Digital
                  <br />
                  Experiences
                </h1>
              </motion.div>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-[var(--text-secondary)] text-xl max-w-xl"
              >
                Transforming ideas into stunning web experiences. Specializing in modern web development, 3D animations, and responsive design.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap gap-[var(--space-xs)] pt-[var(--space-s)]"
              >
                <Link href="/portfolio">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-premium"
                  >
                    View Portfolio
                  </motion.button>
                </Link>

                <section id="portfolio" className="portfolio-section">
                  <h2>Portfolio</h2>
                  <p>Welcome to the portfolio section. Showcase your work here.</p>
                </section>
                
                <Link href="/contact" className="group">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="glass-effect px-8 py-4 rounded-full inline-flex items-center gap-2"
                  >
                    Let's Talk
                    <svg 
                      className="w-5 h-5 transition-transform group-hover:translate-x-1" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M9 5l7 7-7 7" 
                      />
                    </svg>
                  </motion.button>
                </Link>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block h-[500px]"
            >
              <HeroCanvas />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Work Section */}
      <section className="section-padding relative">
        <div className="container-width">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-[var(--space-s)] mb-[var(--space-xl)]"
          >
            <h2 className="hero-text text-4xl md:text-5xl">
              Expertise
            </h2>
            <p className="text-[var(--text-secondary)] text-xl max-w-2xl mx-auto">
              Bringing your web projects to life with modern technologies and creative solutions.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-[var(--space-m)]">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="premium-card group"
              >
                <div className="relative mb-[var(--space-xs)]">
                  {feature.icon}
                  <div className="absolute -inset-1 bg-[var(--accent)]/10 blur-lg rounded-full group-hover:bg-[var(--accent)]/20 transition-colors" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-[var(--text-secondary)]">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <PortfolioSection />

      {/* CTA Section */}
      <section className="section-padding">
        <div className="container-width">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="premium-card text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[var(--accent)]/5 to-transparent" />
            <div className="relative max-w-2xl mx-auto space-y-[var(--space-s)]">
              <h2 className="hero-text text-3xl md:text-4xl">
                Ready to Build Something Amazing?
              </h2>
              <p className="text-[var(--text-secondary)] text-lg">
                Let's create stunning web experiences together.
              </p>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-premium"
              >
                Start a Project
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
