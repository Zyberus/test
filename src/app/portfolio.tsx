import { useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import dynamic from 'next/dynamic';

const ThreeScene = dynamic(() => import('@/components/ThreeScene'), { ssr: false });

export default function Portfolio() {
  return (
    <div className="portfolio-page">
      <h1>Portfolio</h1>
      <Canvas className="w-full h-screen">
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 10, 5]} intensity={1} />
        <ThreeScene />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
