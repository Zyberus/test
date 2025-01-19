'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const Navigation = () => {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
  ];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'glass-effect py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {/* Logo space */}
          </div>

          {/* Desktop Navigation - Now right-aligned */}
          <div className="hidden md:flex items-center justify-end space-x-8">
            {links.map((link, index) => (
              <div key={index} className="relative group">
                {link.submenu ? (
                  <>
                    <button 
                      className="relative group px-3 py-2 text-zinc-400 hover:text-white transition-colors"
                      onClick={() => setActiveSubmenu(activeSubmenu === link.label ? null : link.label)}
                    >
                      <span className="relative z-10 text-sm font-medium">
                        {link.label}
                      </span>
                      <span className="absolute inset-0 rounded-lg group-hover:bg-white/5 transition-all duration-300" />
                    </button>
                    <div className={`absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-zinc-900/95 backdrop-blur-sm ring-1 ring-black ring-opacity-5 transition-all duration-200 ${
                      activeSubmenu === link.label ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-2'
                    }`}>
                      <div className="py-1">
                        {link.submenu.map((subItem, subIndex) => (
                          <Link
                            key={subIndex}
                            href={subItem.href}
                            className="block px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                            onClick={() => setActiveSubmenu(null)}
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
                    className="relative group px-3 py-2"
                  >
                    <span className={`relative z-10 text-sm font-medium transition-colors duration-300 ${
                      pathname === link.href ? 'text-white' : 'text-zinc-400 group-hover:text-white'
                    }`}>
                      {link.label}
                    </span>
                    {pathname === link.href && (
                      <motion.div
                        layoutId="navUnderline"
                        className="absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-blue-500 to-purple-500"
                      />
                    )}
                    <span className="absolute inset-0 rounded-lg group-hover:bg-white/5 transition-all duration-300" />
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white ml-4"
            onClick={() => setIsOpen(!isOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              )}
            </svg>
          </button>

          {/* Mobile Menu */}
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 bg-zinc-900/95 backdrop-blur-sm md:hidden"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {links.map((link, index) => (
                  <div key={index}>
                    {link.submenu ? (
                      <>
                        <button
                          className="w-full text-left px-3 py-2 text-zinc-400 hover:text-white"
                          onClick={() => setActiveSubmenu(activeSubmenu === link.label ? null : link.label)}
                        >
                          {link.label}
                        </button>
                        {activeSubmenu === link.label && (
                          <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="pl-4"
                          >
                            {link.submenu.map((subItem, subIndex) => (
                              <Link
                                key={subIndex}
                                href={subItem.href}
                                className="block px-3 py-2 text-sm text-zinc-400 hover:text-white"
                                onClick={() => {
                                  setIsOpen(false);
                                  setActiveSubmenu(null);
                                }}
                              >
                                {subItem.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </>
                    ) : (
                      <Link
                        href={link.href}
                        className={`block px-3 py-2 text-sm ${
                          pathname === link.href ? 'text-white' : 'text-zinc-400 hover:text-white'
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {link.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navigation;
