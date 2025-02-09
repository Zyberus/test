'use client';

import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Dropzone from '@/components/apps/image-converter/dropzone';

const ParticleBackground = dynamic(() => import('@/components/particle-background'), {
  ssr: false
});

export default function ImageConverterClient() {
  return (
    <div className="container mx-auto px-4 relative min-h-screen">
      <ParticleBackground />
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="space-y-16 pb-8 pt-12"
      >
        {/* Title + Desc */}
        <div className="space-y-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400"
          >
            Free Unlimited File Converter
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-gray-400 text-lg md:text-xl text-center md:px-24 xl:px-44 2xl:px-52"
          >
            Unleash your creativity with App - Nest the ultimate online tool for unlimited and free multimedia
            conversion. Transform images, audio, and videos effortlessly, without restrictions. Start converting
            now and elevate your content like never before!
          </motion.p>
        </div>

        {/* Upload Box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="max-w-3xl mx-auto"
        >
          <Dropzone />
        </motion.div>
      </motion.div>
    </div>
  );
}
