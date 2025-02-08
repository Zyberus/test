// imports
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
import Dropzone from '@/components/dropzone';

const ParticleBackground = dynamic(() => import('@/components/particle-background'), {
  ssr: false
});

export default function Home() {
  return (
    <main className="min-h-screen bg-[var(--primary)] relative overflow-hidden">
      <ParticleBackground />
      
      <div className="container mx-auto px-4 py-16 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-16 pb-8"
        >
          {/* Title + Desc */}
          <div className="space-y-6">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary"
            >
              Free Unlimited File Converter
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-muted-foreground text-lg md:text-xl text-center md:px-24 xl:px-44 2xl:px-52"
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
          >
            <Dropzone />
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
