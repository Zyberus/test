'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { gsap } from 'gsap'
import { motion } from 'framer-motion'

const HeroCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mousePosition = useRef({ x: 0, y: 0 })
  const controlsRef = useRef<OrbitControls | null>(null)
  const animationFrameRef = useRef<number>()
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (!canvasRef.current || typeof window === 'undefined') return

    let mounted = true
    let scene: THREE.Scene | null = null
    let camera: THREE.PerspectiveCamera | null = null
    let renderer: THREE.WebGLRenderer | null = null
    let geometry: THREE.TorusGeometry | null = null
    let material: THREE.MeshStandardMaterial | null = null
    let torus: THREE.Mesh | null = null
    let particlesGeometry: THREE.BufferGeometry | null = null
    let particlesMaterial: THREE.PointsMaterial | null = null
    let particlesMesh: THREE.Points | null = null

    try {
      // Initialize scene
      scene = new THREE.Scene()
      
      // Initialize camera
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
      
      // Initialize renderer
      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      })

      // Set size based on parent container
      const container = canvasRef.current.parentElement
      const width = container?.clientWidth || window.innerWidth
      const height = container?.clientHeight || window.innerHeight
      
      renderer.setSize(width, height)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setClearColor(0x000000, 0)

      // Initialize controls
      const controls = new OrbitControls(camera, renderer.domElement)
      controlsRef.current = controls
      controls.enableDamping = true
      controls.dampingFactor = 0.05
      controls.enableZoom = false
      controls.autoRotate = true
      controls.autoRotateSpeed = 1

      // Create main torus
      geometry = new THREE.TorusGeometry(8, 2, 32, 100)
      material = new THREE.MeshStandardMaterial({
        color: 0x6366f1,
        wireframe: true,
        emissive: 0x6366f1,
        emissiveIntensity: 0.5,
        metalness: 0.8,
        roughness: 0.2,
      })
      torus = new THREE.Mesh(geometry, material)
      scene.add(torus)

      // Create particles
      particlesGeometry = new THREE.BufferGeometry()
      const particlesCount = 1000
      const posArray = new Float32Array(particlesCount * 3)
      
      for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 50
      }
      
      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
      
      particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        color: 0x6366f1,
        transparent: true,
        opacity: 0.5,
        blending: THREE.AdditiveBlending
      })
      
      particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
      scene.add(particlesMesh)

      // Add lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
      scene.add(ambientLight)

      const pointLight = new THREE.PointLight(0x6366f1, 2)
      pointLight.position.set(20, 20, 20)
      scene.add(pointLight)

      camera.position.z = 20

      // Mouse move handler
      const handleMouseMove = (event: MouseEvent) => {
        mousePosition.current = {
          x: (event.clientX / width) * 2 - 1,
          y: -(event.clientY / height) * 2 + 1
        }

        if (torus) {
          gsap.to(torus.rotation, {
            x: mousePosition.current.y * 0.5,
            y: mousePosition.current.x * 0.5,
            duration: 2,
            ease: 'power2.out'
          })
        }
      }

      // Animation loop
      const animate = () => {
        if (!mounted) return
        
        if (controlsRef.current) {
          controlsRef.current.update()
        }

        if (renderer && scene && camera) {
          renderer.render(scene, camera)
        }

        animationFrameRef.current = requestAnimationFrame(animate)
      }

      // Handle window resize
      const handleResize = () => {
        if (!camera || !renderer || !canvasRef.current) return
        
        const container = canvasRef.current.parentElement
        const width = container?.clientWidth || window.innerWidth
        const height = container?.clientHeight || window.innerHeight

        camera.aspect = width / height
        camera.updateProjectionMatrix()
        renderer.setSize(width, height)
      }

      window.addEventListener('resize', handleResize)
      window.addEventListener('mousemove', handleMouseMove)

      // Initial animations
      if (torus) {
        gsap.from(torus.scale, {
          x: 0,
          y: 0,
          z: 0,
          duration: 1,
          ease: 'power3.out',
          onComplete: () => {
            if (mounted) {
              setIsLoading(false)
            }
          }
        })
      }

      animate()

      return () => {
        mounted = false
        
        // Remove event listeners
        window.removeEventListener('resize', handleResize)
        window.removeEventListener('mousemove', handleMouseMove)
        
        // Dispose controls
        if (controlsRef.current) {
          controlsRef.current.dispose()
        }

        // Cancel animation frame
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }

        // Dispose Three.js resources
        if (scene) {
          scene.traverse((object) => {
            if (object instanceof THREE.Mesh) {
              if (object.geometry) object.geometry.dispose()
              if (object.material instanceof THREE.Material) {
                object.material.dispose()
              }
            }
          })
        }

        if (geometry) geometry.dispose()
        if (material) material.dispose()
        if (particlesGeometry) particlesGeometry.dispose()
        if (particlesMaterial) particlesMaterial.dispose()
        
        // Clear references
        scene = null
        camera = null
        renderer = null
        geometry = null
        material = null
        torus = null
        particlesGeometry = null
        particlesMaterial = null
        particlesMesh = null
      }
    } catch (error) {
      console.error('Error initializing 3D scene:', error)
      setHasError(true)
      setIsLoading(false)
    }
  }, [])

  if (hasError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-[var(--primary)]">
        <p className="text-[var(--text-secondary)]">Failed to load 3D scene</p>
      </div>
    )
  }

  return (
    <div className="relative w-full h-full">
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="absolute inset-0 z-50 flex items-center justify-center bg-[var(--primary)]"
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-t-indigo-500 border-transparent rounded-full animate-spin" />
            <p className="text-[var(--text-primary)] text-lg font-medium">Loading 3D Scene...</p>
          </div>
        </motion.div>
      )}
      <motion.canvas
        ref={canvasRef}
        className="w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      />
    </div>
  )
}

export default HeroCanvas
