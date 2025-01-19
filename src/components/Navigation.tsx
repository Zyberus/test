'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

const Navigation = () => {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const links = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/features', label: 'Features' },
    { href: '/contact', label: 'Contact' },
    {
      href: '#',
      label: 'Apps',
      submenu: [
        { href: '/apps/chat', label: 'Zyberus Chat' }
      ]
    }
  ]

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-effect py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container-width px-[var(--space-m)] md:px-[var(--space-l)]">
        <div className="flex items-center justify-between">
          <Link href="/" className="relative group">
            <span className="text-2xl font-bold text-gradient">App-Nest</span>
            <span className="absolute -inset-x-4 -inset-y-2 rounded-lg group-hover:bg-accent/5 transition-all duration-300" />
          </Link>

          <div className="hidden md:flex items-center gap-[var(--space-m)]">
            <div className="flex items-center gap-[var(--space-s)]">
              {links.map((link, index) => (
                <div key={index} className="relative group">
                  {link.submenu ? (
                    <>
                      <button className="text-zinc-400 hover:text-white transition-colors">
                        {link.label}
                      </button>
                      <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-zinc-900 ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                        <div className="py-1">
                          {link.submenu.map((subItem, subIndex) => (
                            <Link
                              key={subIndex}
                              href={subItem.href}
                              className="block px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800"
                            >
                              {subItem.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      href={link.href}
                      className={`relative group px-3 py-2 ${
                        pathname === link.href ? 'text-accent' : 'text-gray-300 group-hover:text-white'
                      }`}
                    >
                      <span className={`relative z-10 text-sm font-medium transition-colors duration-300 ${
                        pathname === link.href ? 'text-accent' : 'text-gray-300 group-hover:text-white'
                      }`}>
                        {link.label}
                      </span>
                      {pathname === link.href && (
                        <motion.div
                          layoutId="navUnderline"
                          className="absolute left-0 right-0 bottom-0 h-px bg-accent"
                        />
                      )}
                      <span className="absolute inset-0 rounded-lg group-hover:bg-white/5 transition-all duration-300" />
                    </Link>
                  )}
                </div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-premium"
            >
              <span>Get Started</span>
            </motion.button>
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-white focus:outline-none">
              <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                <path d="M4 5h16M4 12h16m-7 7h7" />
              </svg>
            </button>
          </div>

          <div className={`w-full ${isOpen ? 'block' : 'hidden'} md:flex md:items-center md:w-auto`}>
            <div className="text-sm md:flex-grow">
              {links.map((link, index) => (
                <div key={index}>
                  {link.submenu ? (
                    <button className="block mt-4 md:inline-block md:mt-0 text-white hover:text-gray-400 mr-4">
                      {link.label}
                    </button>
                  ) : (
                    <Link key={index} href={link.href} className="block mt-4 md:inline-block md:mt-0 text-white hover:text-gray-400 mr-4">
                      {link.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>

          <button className="p-2 md:hidden">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navigation
