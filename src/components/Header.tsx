'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import Navigation from './Navigation'

const Header = () => {
  const { scrollY } = useScroll()
  const headerBackground = useTransform(
    scrollY,
    [0, 100],
    ['rgba(15, 23, 42, 0)', 'rgba(15, 23, 42, 0.9)']
  )

  return (
    <motion.header
      style={{ background: headerBackground }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm"
    >
      <div className="container-width py-4 px-6">
        <nav className="flex flex-wrap items-center justify-between">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <Link href="/" className="text-2xl font-bold text-gradient">
              App-Nest
            </Link>
          </motion.div>

          <Navigation />
        </nav>
      </div>
    </motion.header>
  )
}

export default Header
