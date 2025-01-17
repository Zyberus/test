'use client';
import { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import * as THREE from 'three';
import { gsap } from 'gsap';
import Link from 'next/link';
var projects = [
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
var ProjectCard = function (_a) {
    var project = _a.project, index = _a.index;
    var cardRef = useRef(null);
    var _b = useState(false), isHovered = _b[0], setIsHovered = _b[1];
    var scrollYProgress = useScroll({
        target: cardRef,
        offset: ["start end", "end start"]
    }).scrollYProgress;
    var y = useSpring(useTransform(scrollYProgress, [0, 1], [100, -100]), { stiffness: 300, damping: 30 });
    var rotate = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [10, 0, -10]), { stiffness: 300, damping: 30 });
    var scale = useSpring(useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]), { stiffness: 300, damping: 30 });
    return (<motion.div ref={cardRef} style={{ y: y, rotate: rotate, scale: scale }} onHoverStart={function () { return setIsHovered(true); }} onHoverEnd={function () { return setIsHovered(false); }} className="relative group">
      <Link href={project.link} className="block">
        <motion.div className="premium-card overflow-hidden backdrop-blur-sm bg-white/5" whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
          <motion.div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl" initial={{ opacity: 0.1 }} animate={{
            opacity: [0.1, 0.3, 0.1],
            scale: [1, 1.2, 1],
        }} transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
        }} style={{ backgroundColor: project.color }}/>
          
          <motion.h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
            {project.title}
          </motion.h3>
          
          <motion.p className="text-[var(--text-secondary)] mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.1 + 0.1 }}>
            {project.description}
          </motion.p>
          
          <div className="flex flex-wrap gap-2">
            {project.tech.map(function (tech) { return (<span key={tech} className="px-3 py-1 text-sm rounded-full bg-white/10 text-white/70">
                {tech}
              </span>); })}
          </div>
        </motion.div>
      </Link>
    </motion.div>);
};
var PortfolioSection = function () {
    var _a = useState(false), mounted = _a[0], setMounted = _a[1];
    var containerRef = useRef(null);
    var canvasRef = useRef(null);
    var rendererRef = useRef(null);
    var frameIdRef = useRef();
    // Set mounted state
    useEffect(function () {
        setMounted(true);
        return function () { return setMounted(false); };
    }, []);
    // Initialize Three.js scene
    useEffect(function () {
        if (!mounted || !canvasRef.current)
            return;
        // Scene setup
        var scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);
        // Camera setup
        var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;
        // Renderer setup
        var renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            antialias: true,
            alpha: true
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        rendererRef.current = renderer;
        // Create meshes for each project
        projects.forEach(function (project, index) {
            var geometry;
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
            var material = new THREE.MeshStandardMaterial({
                color: project.color,
                roughness: 0.5,
                metalness: 0.5
            });
            var mesh = new THREE.Mesh(geometry, material);
            mesh.position.x = (index - 1) * 2;
            scene.add(mesh);
            project.mesh = mesh;
        });
        // Add lights
        var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        var pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.set(2, 3, 4);
        scene.add(pointLight);
        // Mouse move handler
        var handleMouseMove = function (event) {
            var mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            var mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
            projects.forEach(function (project) {
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
        var clock = new THREE.Clock();
        var animate = function () {
            var elapsedTime = clock.getElapsedTime();
            projects.forEach(function (project) {
                if (project.mesh) {
                    project.mesh.rotation.x = elapsedTime * 0.2;
                    project.mesh.rotation.y = elapsedTime * 0.3;
                }
            });
            renderer.render(scene, camera);
            frameIdRef.current = requestAnimationFrame(animate);
        };
        // Handle resize
        var handleResize = function () {
            if (!canvasRef.current)
                return;
            var width = window.innerWidth;
            var height = window.innerHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        };
        window.addEventListener('resize', handleResize);
        animate();
        return function () {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            if (frameIdRef.current) {
                cancelAnimationFrame(frameIdRef.current);
            }
            if (rendererRef.current) {
                rendererRef.current.dispose();
                rendererRef.current.forceContextLoss();
            }
            projects.forEach(function (project) {
                if (project.mesh) {
                    project.mesh.geometry.dispose();
                    if (project.mesh.material instanceof THREE.Material) {
                        project.mesh.material.dispose();
                    }
                }
            });
        };
    }, []);
    return (<section className="section-padding relative overflow-hidden" ref={containerRef}>
      {mounted && (<canvas ref={canvasRef} className="absolute inset-0 w-full h-full -z-10"/>)}
      
      <div className="container mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: 'easeOut' }} className="text-center space-y-6 mb-20">
          <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Featured Work
          </h2>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">
            Explore our latest projects and creative solutions that push the boundaries of modern web development
          </p>
        </motion.div>

        <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}>
          {projects.map(function (project, index) { return (<ProjectCard key={project.title} project={project} index={index}/>); })}
        </motion.div>
      </div>
    </section>);
};
export default PortfolioSection;
