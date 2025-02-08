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

  useEffect(() => {
    if (!canvasRef.current) return

    const scene = new THREE.Scene()
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({
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
    const geometry = new THREE.TorusGeometry(8, 2, 32, 100)
    const material = new THREE.MeshStandardMaterial({
      color: 0x6366f1,
      wireframe: true,
      emissive: 0x6366f1,
      emissiveIntensity: 0.5,
      metalness: 0.8,
      roughness: 0.2,
    })
    const torus = new THREE.Mesh(geometry, material)
    scene.add(torus)

    // Create particles
    const particlesGeometry = new THREE.BufferGeometry()
    const particlesCount = 1000
    const posArray = new Float32Array(particlesCount * 3)
    
    for(let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 50
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3))
    
    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0x6366f1,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending
    })
    
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial)
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
      // Calculate normalized mouse position (-1 to 1)
      mousePosition.current = {
        x: (event.clientX / width) * 2 - 1,
        y: -(event.clientY / height) * 2 + 1
      }

      // Move torus based on mouse position
      gsap.to(torus.rotation, {
        x: mousePosition.current.y * 0.5,
        y: mousePosition.current.x * 0.5,
        duration: 2,
        ease: 'power2.out'
      })

      // Move particles based on mouse
      gsap.to(particlesMesh.rotation, {
        x: -mousePosition.current.y * 0.2,
        y: -mousePosition.current.x * 0.2,
        duration: 2,
        ease: 'power2.out'
      })
    }

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate)
      
      // Optimize performance by checking if canvas is visible
      const rect = canvasRef.current?.getBoundingClientRect()
      if (rect && (rect.bottom < 0 || rect.top > window.innerHeight)) {
        return
      }

      // Rotate particles
      particlesMesh.rotation.x += 0.0005
      particlesMesh.rotation.y += 0.0005

      // Update torus
      torus.rotation.x += 0.001
      torus.rotation.y += 0.001
      
      if (controlsRef.current) {
        controlsRef.current.update()
      }
      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      if (!canvasRef.current) return
      
      const container = canvasRef.current.parentElement
      const newWidth = container?.clientWidth || window.innerWidth
      const newHeight = container?.clientHeight || window.innerHeight
      
      camera.aspect = newWidth / newHeight
      camera.updateProjectionMatrix()
      renderer.setSize(newWidth, newHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('mousemove', handleMouseMove)

    // Initial animations
    gsap.to(torus.rotation, {
      duration: 8,
      x: Math.PI * 2,
      y: Math.PI * 2,
      ease: 'power1.inOut',
      repeat: -1,
    })

    gsap.to(camera.position, {
      duration: 1.5,
      z: 15,
      ease: 'power2.out',
      onComplete: () => setIsLoading(false),
    })

    return () => {
      // Cleanup all resources
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      
      if (controlsRef.current) {
        controlsRef.current.dispose()
      }
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }

      // Dispose of all Three.js resources
      renderer.dispose()
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose()
          if (object.material instanceof THREE.Material) {
            object.material.dispose()
          } else if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose())
          }
        }
      })
      
      geometry.dispose()
      material.dispose()
      particlesGeometry.dispose()
      particlesMaterial.dispose()
    }
  }, [])

  return (
    <>
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
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
    </>
  )
}

export default HeroCanvas
