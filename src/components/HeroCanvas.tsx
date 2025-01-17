'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { gsap } from 'gsap'

const HeroCanvas = () => {
  const canvasRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (!canvasRef.current) return

    // Scene setup with fog for depth
    const scene = new THREE.Scene()
    scene.fog = new THREE.Fog(0x000000, 1, 15)

    const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000)
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    canvasRef.current.appendChild(renderer.domElement)

    // Enhanced controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.enableZoom = false
    controls.enablePan = false
    controls.autoRotate = true
    controls.autoRotateSpeed = 2

    // Create main geometric shape
    const geometry = new THREE.TorusKnotGeometry(1, 0.3, 200, 32)
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#3b82f6'),
      metalness: 0.7,
      roughness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.4,
      transparent: true,
      opacity: 0.9,
    })
    const torusKnot = new THREE.Mesh(geometry, material)
    torusKnot.castShadow = true
    torusKnot.receiveShadow = true
    scene.add(torusKnot)

    // Enhanced wireframe
    const wireframeGeometry = new THREE.TorusKnotGeometry(1.2, 0.15, 200, 32)
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color('#60a5fa'),
      wireframe: true,
      transparent: true,
      opacity: 0.2,
    })
    const wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial)
    scene.add(wireframe)

    // Particle system
    const particlesGeometry = new THREE.BufferGeometry()
    const particleCount = 2000
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 10
      positions[i + 1] = (Math.random() - 0.5) * 10
      positions[i + 2] = (Math.random() - 0.5) * 10

      colors[i] = Math.random() * 0.5 + 0.5
      colors[i + 1] = Math.random() * 0.5 + 0.5
      colors[i + 2] = Math.random() * 0.5 + 0.5
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.02,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
    })

    const particles = new THREE.Points(particlesGeometry, particlesMaterial)
    scene.add(particles)

    // Enhanced lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(5, 5, 5)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 1024
    directionalLight.shadow.mapSize.height = 1024
    scene.add(directionalLight)

    const pointLight1 = new THREE.PointLight(0x3b82f6, 2)
    pointLight1.position.set(2, 3, 4)
    scene.add(pointLight1)

    const pointLight2 = new THREE.PointLight(0x60a5fa, 2)
    pointLight2.position.set(-2, -3, -4)
    scene.add(pointLight2)

    // Mouse interaction
    const mouse = new THREE.Vector2()
    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

      // Tilt the shape based on mouse position
      gsap.to(torusKnot.rotation, {
        x: mouse.y * 0.5,
        y: mouse.x * 0.5,
        duration: 2,
        ease: 'power2.out',
      })

      // Move particles
      gsap.to(particles.rotation, {
        x: mouse.y * 0.2,
        y: mouse.x * 0.2,
        duration: 2,
        ease: 'power2.out',
      })
    }

    window.addEventListener('mousemove', handleMouseMove)

    // Animation
    const clock = new THREE.Clock()
    const animate = () => {
      const elapsedTime = clock.getElapsedTime()

      requestAnimationFrame(animate)
      controls.update()

      // Smooth rotation
      torusKnot.rotation.x += 0.002
      torusKnot.rotation.y += 0.002
      wireframe.rotation.x += 0.001
      wireframe.rotation.y += 0.001

      // Particle animation
      particles.rotation.y = elapsedTime * 0.05
      particles.position.y = Math.sin(elapsedTime * 0.5) * 0.1

      renderer.render(scene, camera)
    }

    animate()

    // Handle resize
    const handleResize = () => {
      const container = canvasRef.current
      if (!container) return

      const width = window.innerWidth
      const height = window.innerHeight

      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      wireframeGeometry.dispose()
      wireframeMaterial.dispose()
      controls.dispose()
    }
  }, [])

  return <div ref={canvasRef} className="w-full h-full" />
}

export default HeroCanvas
