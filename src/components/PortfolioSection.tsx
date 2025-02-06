'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import * as THREE from 'three';
import { gsap } from 'gsap';
import Link from 'next/link';

interface Project {
  title: string;
  description: string;
  link: string;
  tech: string[];
  color: string;
  model: 'cube' | 'sphere' | 'torus';
  mesh?: THREE.Mesh;
}

const projects: Project[] = [
  {
    title: 'E-Commerce Platform',
    description: 'Modern e-commerce solution with Next.js and Stripe',
    link: '/portfolio/ecommerce',
    tech: ['Next.js', 'Stripe', 'Tailwind CSS'],
    color: '#3b82f6',
    model: 'cube'
  },
  {
    title: '3D Product Viewer',
    description: 'Interactive 3D product visualization using Three.js',
    link: '/portfolio/3d-viewer',
    tech: ['Three.js', 'React', 'WebGL'],
    color: '#60a5fa',
    model: 'sphere'
  },
  {
    title: 'AI Dashboard',
    description: 'Real-time analytics dashboard with AI insights',
    link: '/portfolio/dashboard',
    tech: ['React', 'D3.js', 'TensorFlow.js'],
    color: '#93c5fd',
    model: 'torus'
  }
];

const ProjectCard = ({ project, index }: { project: Project; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"]
  });

  const y = useSpring(
    useTransform(scrollYProgress, [0, 1], [100, -100]),
    { stiffness: 300, damping: 30 }
  );
  
  const rotate = useSpring(
    useTransform(scrollYProgress, [0, 0.5, 1], [10, 0, -10]),
    { stiffness: 300, damping: 30 }
  );

  const scale = useSpring(
    useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]),
    { stiffness: 300, damping: 30 }
  );

  return (
    <motion.div
      ref={cardRef}
      style={{ y, rotate, scale }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group"
    >
      <Link href={project.link} className="block">
        <motion.div 
          className="premium-card overflow-hidden backdrop-blur-sm bg-white/5"
          whileHover={{ y: -5 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <motion.div 
            className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl"
            initial={{ opacity: 0.1 }}
            animate={{
              opacity: [0.1, 0.3, 0.1],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{ backgroundColor: project.color }}
          />
          
          <motion.h3 
            className="text-3xl font-bold mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            {project.title}
          </motion.h3>
          
          <motion.p 
            className="text-[var(--text-secondary)] mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.1 }}
          >
            {project.description}
          </motion.p>
          
          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <span 
                key={tech}
                className="px-3 py-1 text-sm rounded-full bg-white/10 text-white/70"
              >
                {tech}
              </span>
            ))}
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

const PortfolioSection = () => {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameIdRef = useRef<number>();

  // Set mounted state
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Initialize Three.js scene
  useEffect(() => {
    if (!mounted || !canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    rendererRef.current = renderer;

    // Create meshes for each project
    projects.forEach((project, index) => {
      let geometry;
      
      switch (project.model) {
        case 'cube':
          geometry = new THREE.BoxGeometry(1, 1, 1);
          break;
        case 'sphere':
          geometry = new THREE.SphereGeometry(0.5, 32, 32);
          break;
        case 'torus':
          geometry = new THREE.TorusGeometry(0.5, 0.2, 16, 100);
          break;
        default:
          geometry = new THREE.BoxGeometry(1, 1, 1);
      }
      
      const material = new THREE.MeshStandardMaterial({
        color: project.color,
        roughness: 0.5,
        metalness: 0.5
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.x = (index - 1) * 2;
      scene.add(mesh);
      project.mesh = mesh;
    });
    
    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0xffffff, 1);
    pointLight.position.set(2, 3, 4);
    scene.add(pointLight);

    // Mouse move handler
    const handleMouseMove = (event: MouseEvent) => {
      const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      
      projects.forEach((project) => {
        if (project.mesh) {
          gsap.to(project.mesh.rotation, {
            x: mouseY * 0.5,
            y: mouseX * 0.5,
            duration: 0.5
          });
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation setup
    const clock = new THREE.Clock();
    
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      
      projects.forEach((project) => {
        if (project.mesh) {
          project.mesh.rotation.x = elapsedTime * 0.2;
          project.mesh.rotation.y = elapsedTime * 0.3;
        }
      });
      
      renderer.render(scene, camera);
      frameIdRef.current = requestAnimationFrame(animate);
    };

    // Handle resize
    const handleResize = () => {
      if (!canvasRef.current) return;
      
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);
    
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current.forceContextLoss();
      }
      
      projects.forEach((project) => {
        if (project.mesh) {
          project.mesh.geometry.dispose();
          if (project.mesh.material instanceof THREE.Material) {
            project.mesh.material.dispose();
          }
        }
      });
    };
  }, []);

  return (
    <section className="section-padding relative overflow-hidden" ref={containerRef}>
      {mounted && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full -z-10"
        />
      )}
      
      <div className="container mx-auto">
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PortfolioSection;
