'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';
var Header = function () {
    var _a = useState(false), isOpen = _a[0], setIsOpen = _a[1];
    var scrollY = useScroll().scrollY;
    var headerBackground = useTransform(scrollY, [0, 100], ['rgba(15, 23, 42, 0)', 'rgba(15, 23, 42, 0.9)']);
    var navItems = [
        { href: '/', label: 'Home' },
        { href: '/about', label: 'About' },
        { href: '/features', label: 'Features' },
        { href: '/contact', label: 'Contact' },
    ];
    var menuVariants = {
        open: {
            opacity: 1,
            height: 'auto',
            transition: {
                type: 'spring',
                stiffness: 300,
                damping: 30,
            },
        },
        closed: {
            opacity: 0,
            height: 0,
            transition: {
                type: 'spring',
                stiffness: 300,
                damping: 30,
            },
        },
    };
    return (<motion.header style={{ background: headerBackground }} className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm">
      <div className="container-width py-4 px-6">
        <nav className="flex items-center justify-between">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <Link href="/" className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 text-transparent bg-clip-text">
              App-Nest
            </Link>
          </motion.div>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map(function (item, index) { return (<motion.div key={item.href} initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                <Link href={item.href} className="relative text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors group">
                  {item.label}
                  <motion.span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[var(--accent)] group-hover:w-full transition-all duration-300" whileHover={{ width: '100%' }}/>
                </Link>
              </motion.div>); })}
          </div>

          <div className="flex items-center gap-4">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-6 py-2 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300">
              Get Started
            </motion.button>

            <motion.button className="md:hidden text-[var(--text-primary)] p-2" onClick={function () { return setIsOpen(!isOpen); }} whileTap={{ scale: 0.9 }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/>) : (<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>)}
              </svg>
            </motion.button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <motion.div className="md:hidden overflow-hidden" initial="closed" animate={isOpen ? 'open' : 'closed'} variants={menuVariants}>
          <div className="py-4 space-y-4">
            {navItems.map(function (item) { return (<motion.div key={item.href} whileHover={{ x: 10 }} className="block">
                <Link href={item.href} className="text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors" onClick={function () { return setIsOpen(false); }}>
                  {item.label}
                </Link>
              </motion.div>); })}
          </div>
        </motion.div>
      </div>
    </motion.header>);
};
export default Header;
