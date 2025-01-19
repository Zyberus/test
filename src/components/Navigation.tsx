'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const Navigation = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);

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

  const toggleSubmenu = (label: string) => {
    setActiveSubmenu(activeSubmenu === label ? null : label);
  };

  return (
    <div className="flex items-center">
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center justify-end space-x-8">
        {links.map((link) => (
          <div key={link.label} className="relative group">
            {link.submenu ? (
              <>
                <button
                  onClick={() => toggleSubmenu(link.label)}
                  className="relative group px-3 py-2 text-zinc-400 hover:text-white transition-colors"
                >
                  <span className="relative z-10 text-sm font-medium">{link.label}</span>
                  <span className="absolute inset-0 rounded-lg group-hover:bg-white/5 transition-all duration-300"></span>
                </button>
                <div
                  className={`absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-zinc-900/95 backdrop-blur-sm ring-1 ring-black ring-opacity-5 transition-all duration-200 ${
                    activeSubmenu === link.label
                      ? 'opacity-100 visible translate-y-0'
                      : 'opacity-0 invisible -translate-y-2'
                  }`}
                >
                  <div className="py-1">
                    {link.submenu.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className="block px-4 py-2 text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/50"
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
                <span className="absolute inset-0 rounded-lg group-hover:bg-white/5 transition-all duration-300"></span>
              </Link>
            )}
          </div>
        ))}
      </div>

      {/* Mobile Navigation Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden text-white ml-4"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
          />
        </svg>
      </button>

      {/* Mobile Navigation Menu */}
      <div
        className={`fixed inset-0 z-50 bg-zinc-900/95 backdrop-blur-sm transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        } md:hidden`}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-8">
          {links.map((link) => (
            <div key={link.label} className="relative">
              {link.submenu ? (
                <>
                  <button
                    onClick={() => toggleSubmenu(link.label)}
                    className="text-xl font-medium text-zinc-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </button>
                  <div
                    className={`mt-4 space-y-4 ${
                      activeSubmenu === link.label ? 'block' : 'hidden'
                    }`}
                  >
                    {link.submenu.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        onClick={() => setIsOpen(false)}
                        className="block text-lg text-zinc-400 hover:text-white"
                      >
                        {subItem.label}
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-xl font-medium transition-colors ${
                    pathname === link.href ? 'text-white' : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {link.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Navigation;
