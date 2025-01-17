'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'

interface Particle {
  position: THREE.Vector3
  velocity: THREE.Vector3
  originalPosition: THREE.Vector3
  targetPosition: THREE.Vector3
  color: THREE.Color
  size: number
  phase: number
}

const ParticleBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Handle mounting state
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!mounted || !canvasRef.current || !containerRef.current) return;

    // Scene setup with enhanced atmosphere
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x000000, 0.02)

    const camera = new THREE.PerspectiveCamera(
      60, // Reduced FOV
      window.innerWidth / window.innerHeight,
      0.1,
      100 // Reduced far plane
    )
    camera.position.z = 25

    // Optimized renderer settings
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: false, // Disabled for performance
      alpha: true,
      powerPreference: 'high-performance',
      precision: 'lowp' // Lower precision for better performance
    })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(1) // Fixed pixel ratio
    renderer.shadowMap.enabled = false // Disabled unnecessary features
    rendererRef.current = renderer;

    // Create particles with enhanced visuals
    const geometry = new THREE.BufferGeometry()
    const particleCount = 300 // Reduced particle count for better performance
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    const sizes = new Float32Array(particleCount)
    const phases = new Float32Array(particleCount)

    const particles: Particle[] = []
    const baseRadius = 20
    const colorPalette = [
      new THREE.Color('#3b82f6'),
      new THREE.Color('#60a5fa'),
      new THREE.Color('#93c5fd'),
      new THREE.Color('#2563eb'),
    ]

    for (let i = 0; i < particleCount; i++) {
      // Create particles in a complex double helix pattern
      const t = (i / particleCount) * Math.PI * 8
      const strand = i % 2 === 0 ? 1 : -1
      const radiusVariation = Math.random() * 8
      const radius = baseRadius + radiusVariation
      const heightVariation = Math.cos(t * 3) * 2

      const position = new THREE.Vector3(
        Math.cos(t) * radius * strand,
        heightVariation * 5,
        Math.sin(t) * radius
      )

      positions[i * 3] = position.x
      positions[i * 3 + 1] = position.y
      positions[i * 3 + 2] = position.z

      // Random color from palette with smooth transitions
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)]
      colors[i * 3] = color.r
      colors[i * 3 + 1] = color.g
      colors[i * 3 + 2] = color.b

      // Dynamic size variation
      const size = Math.random() * 0.5 + 0.1
      sizes[i] = size

      // Random phase for animation variation
      phases[i] = Math.random() * Math.PI * 2

      particles.push({
        position: position.clone(),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        ),
        originalPosition: position.clone(),
        targetPosition: position.clone(),
        color: color.clone(),
        size,
        phase: phases[i]
      })
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1))

    // Enhanced material with custom shader for better particle rendering
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        mousePosition: { value: new THREE.Vector2(0, 0) },
        isHovering: { value: 0 },
      },
      vertexShader: `
        attribute vec3 color;
        attribute float size;
        attribute float phase;
        varying vec3 vColor;
        uniform float time;
        uniform vec2 mousePosition;
        uniform float isHovering;
        
        void main() {
          vColor = color;
          vec3 pos = position;
          
          // Simplified wave motion
          float wave = sin(time * 0.3 + phase) * 0.1;
          pos.y += wave;
          
          // Optimized mouse interaction
          if (isHovering > 0.0) {
            vec2 mouseEffect = mousePosition - pos.xz;
            float mouseDistance = length(mouseEffect);
            if (mouseDistance < 2.0) {
              pos.xz += normalize(mouseEffect) * 0.05;
            }
          }
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = size * (100.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          // Simple circle shape
          if (length(gl_PointCoord - 0.5) > 0.5) discard;
          gl_FragColor = vec4(vColor, 0.7);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })

    const points = new THREE.Points(geometry, material)
    scene.add(points)

    // Enhanced mouse interaction
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1
      const y = -(event.clientY / window.innerHeight) * 2 + 1
      setMousePosition({ x, y })

      gsap.to(material.uniforms.mousePosition.value, {
        x: x * 20,
        y: y * 20,
        duration: 1,
        ease: 'power2.out'
      })
    }

    const handleMouseEnter = () => {
      setIsHovering(true)
      gsap.to(material.uniforms.isHovering, {
        value: 1,
        duration: 0.5,
        ease: 'power2.out'
      })
    }

    const handleMouseLeave = () => {
      setIsHovering(false)
      gsap.to(material.uniforms.isHovering, {
        value: 0,
        duration: 0.5,
        ease: 'power2.out'
      })
    }

    containerRef.current.addEventListener('mousemove', handleMouseMove)
    containerRef.current.addEventListener('mouseenter', handleMouseEnter)
    containerRef.current.addEventListener('mouseleave', handleMouseLeave)

    // Enhanced animation with smooth transitions
    const clock = new THREE.Clock()
    const animate = () => {
      const elapsedTime = clock.getElapsedTime()
      material.uniforms.time.value = elapsedTime

      // Rotate the entire particle system
      points.rotation.y = elapsedTime * 0.05
      points.rotation.z = elapsedTime * 0.02

      renderer.render(scene, camera)
      requestAnimationFrame(animate)
    }

    animate()

    // Enhanced camera movement on scroll
    const handleScroll = () => {
      const scrollY = window.scrollY
      gsap.to(camera.position, {
        y: -(scrollY * 0.01),
        duration: 1,
        ease: 'power2.out',
      })
    }

    window.addEventListener('scroll', handleScroll)

    // Handle resize
    let resizeTimeout: NodeJS.Timeout
    const handleResize = () => {
      // Debounce resize events
      if (resizeTimeout) clearTimeout(resizeTimeout)
      resizeTimeout = setTimeout(() => {
        if (!renderer || !camera) return
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight, false) // false prevents setting style.width/height
      }, 250)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
      containerRef.current?.removeEventListener('mousemove', handleMouseMove)
      containerRef.current?.removeEventListener('mouseenter', handleMouseEnter)
      containerRef.current?.removeEventListener('mouseleave', handleMouseLeave)
      
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 -z-10 bg-gradient-to-b from-gray-900 to-black overflow-hidden"
    >
      {mounted && (
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          style={{ background: 'transparent' }}
        />
      )}
    </div>
  )
}

export default ParticleBackground
