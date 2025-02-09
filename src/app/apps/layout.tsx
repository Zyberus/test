'use client';

import { motion } from 'framer-motion';

export default function AppsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen bg-[#0A0F1C] pt-20"
    >
      {children}
    </motion.div>
  );
}
