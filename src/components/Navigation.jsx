'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
var Navigation = function () {
    var pathname = usePathname();
    var _a = useState(false), scrolled = _a[0], setScrolled = _a[1];
    useEffect(function () {
        var handleScroll = function () {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return function () { return window.removeEventListener('scroll', handleScroll); };
    }, []);
    var links = [
        { href: '/', label: 'Home' },
        { href: '/about', label: 'About' },
        { href: '/features', label: 'Features' },
        { href: '/contact', label: 'Contact' }
    ];
    return (<motion.nav initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.6 }} className={"fixed top-0 left-0 right-0 z-50 transition-all duration-300 ".concat(scrolled ? 'glass-effect py-4' : 'bg-transparent py-6')}>
      <div className="container-width px-[var(--space-m)] md:px-[var(--space-l)]">
        <div className="flex items-center justify-between">
          <Link href="/" className="relative group">
            <span className="text-2xl font-bold text-gradient">App-Nest</span>
            <span className="absolute -inset-x-4 -inset-y-2 rounded-lg group-hover:bg-accent/5 transition-all duration-300"/>
          </Link>

          <div className="hidden md:flex items-center gap-[var(--space-m)]">
            <div className="flex items-center gap-[var(--space-s)]">
              {links.map(function (_a) {
            var href = _a.href, label = _a.label;
            var isActive = pathname === href;
            return (<Link key={href} href={href} className="relative group px-3 py-2">
                    <span className={"relative z-10 text-sm font-medium transition-colors duration-300 ".concat(isActive ? 'text-accent' : 'text-gray-300 group-hover:text-white')}>
                      {label}
                    </span>
                    {isActive && (<motion.div layoutId="navUnderline" className="absolute left-0 right-0 bottom-0 h-px bg-accent"/>)}
                    <span className="absolute inset-0 rounded-lg group-hover:bg-white/5 transition-all duration-300"/>
                  </Link>);
        })}
            </div>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="btn-premium">
              <span>Get Started</span>
            </motion.button>
          </div>

          <button className="p-2 md:hidden">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
        </div>
      </div>
    </motion.nav>);
};
export default Navigation;
