'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls as OrbitControlsImpl } from 'three/examples/jsm/controls/OrbitControls.js'
import { gsap } from 'gsap'
import { motion } from 'framer-motion'

const HeroCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!canvasRef.current) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x000000)
    scene.background.setAlpha(0)

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
    })

    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)

    const controls = new OrbitControlsImpl(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.enableZoom = false
    controls.autoRotate = true
    controls.autoRotateSpeed = 2

    // Create a more complex geometry
    const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16)
    
    // Create a more interesting material
    const material = new THREE.MeshPhongMaterial({
      color: 0x6366f1,
      wireframe: true,
      emissive: 0x6366f1,
      emissiveIntensity: 0.2,
      shininess: 100,
    })

    const torus = new THREE.Mesh(geometry, material)
    scene.add(torus)

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0x6366f1, 2)
    pointLight.position.set(20, 20, 20)
    scene.add(pointLight)

    camera.position.z = 30

    const animate = () => {
      requestAnimationFrame(animate)
      torus.rotation.x += 0.001
      torus.rotation.y += 0.002
      controls.update()
      renderer.render(scene, camera)
    }

    animate()

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    }

    window.addEventListener('resize', handleResize)

    // Add smooth animation
    gsap.to(torus.rotation, {
      duration: 8,
      x: Math.PI * 2,
      y: Math.PI * 2,
      ease: 'power1.inOut',
      repeat: -1,
    })

    // Add camera animation
    gsap.to(camera.position, {
      duration: 2,
      z: 25,
      ease: 'power2.out',
      onComplete: () => setIsLoading(false),
    })

    return () => {
      window.removeEventListener('resize', handleResize)
      scene.remove(torus)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
      controls.dispose()
    }
  }, [])

  return (
    <>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 1.5 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--primary)]"
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-t-indigo-500 border-transparent rounded-full animate-spin" />
            <p className="text-[var(--text-primary)] text-lg font-medium">Loading 3D Scene...</p>
          </div>
        </motion.div>
      )}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full -z-10 bg-transparent"
      />
    </>
  )
}

export default HeroCanvas
