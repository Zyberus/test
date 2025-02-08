'use client';

import { useCallback } from 'react';
import Particles from '@tsparticles/react';
import type { Container, Engine } from '@tsparticles/engine';
import { loadSlim } from 'tsparticles-slim';

interface ParticleBackgroundProps {
  color?: string;
  linkColor?: string;
  particleCount?: number;
  speed?: number;
  opacity?: number;
  linkOpacity?: number;
}

export default function ParticleBackground({
  color = '#6366f1',
  linkColor = '#6366f1',
  particleCount = 80,
  speed = 1,
  opacity = 0.2,
  linkOpacity = 0.2
}: ParticleBackgroundProps = {}) {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    // Optional: Add any initialization after particles are loaded
  }, []);

  return (
    <Particles
      className="absolute inset-0"
      id="tsparticles"
      init={particlesInit}
      loaded={particlesLoaded}
      options={{
        background: {
          color: {
            value: 'transparent',
          },
        },
        fpsLimit: 120,
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: 'repulse',
            },
            resize: true,
          },
          modes: {
            repulse: {
              distance: 100,
              duration: 0.4,
            },
          },
        },
        particles: {
          color: {
            value: color,
          },
          links: {
            color: linkColor,
            distance: 150,
            enable: true,
            opacity: linkOpacity,
            width: 1,
          },
          move: {
            direction: 'none',
            enable: true,
            outModes: {
              default: 'bounce',
            },
            random: false,
            speed: speed,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 800,
            },
            value: particleCount,
          },
          opacity: {
            value: opacity,
          },
          shape: {
            type: 'circle',
          },
          size: {
            value: { min: 1, max: 3 },
          },
        },
        detectRetina: true,
      }}
    />
  );
} 