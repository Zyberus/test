import { useRef, useEffect, useCallback, memo } from 'react'
import * as THREE from 'three'

interface ThreeSceneProps {
  onSceneReady?: (params: {
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
  }) => void
  onRender?: (params: {
    scene: THREE.Scene
    camera: THREE.PerspectiveCamera
    renderer: THREE.WebGLRenderer
    deltaTime: number
  }) => void
  className?: string
}

const ThreeScene = memo(({ onSceneReady, onRender, className = 'w-full h-full' }: ThreeSceneProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const frameIdRef = useRef<number>()

  useEffect(() => {
    if (!canvasRef.current) return

    // Scene setup
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x000000, 0.1)
    sceneRef.current = scene

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      50,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    )
    camera.position.set(0, 0, 10)
    cameraRef.current = camera

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(window.innerWidth, window.innerHeight)
    rendererRef.current = renderer

    // Handle resize
    const handleResize = useCallback(() => {
      if (!cameraRef.current || !rendererRef.current) return
      const camera = cameraRef.current
      const renderer = rendererRef.current
      const canvas = renderer.domElement
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      const needResize = canvas.width !== width || canvas.height !== height
      
      if (needResize) {
        camera.aspect = width / height
        camera.updateProjectionMatrix()
        renderer.setSize(width, height, false)
      }
    }, [])
    window.addEventListener('resize', handleResize)

    // Notify parent component
    if (onSceneReady) {
      onSceneReady({
        scene,
        camera,
        renderer
      })
    }

    // Animation loop with delta time
    let lastTime = 0
    const animate = (currentTime: number) => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return
      
      const deltaTime = (currentTime - lastTime) * 0.001 // Convert to seconds
      lastTime = currentTime
      
      frameIdRef.current = requestAnimationFrame(animate)
      handleResize()
      
      if (onRender) {
        onRender({
          scene: sceneRef.current,
          camera: cameraRef.current,
          renderer: rendererRef.current,
          deltaTime
        })
      }
      
      rendererRef.current.render(sceneRef.current, cameraRef.current)
    }
    animate(0)

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize)
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current)
      }

      if (rendererRef.current) {
        rendererRef.current.dispose()
        rendererRef.current.forceContextLoss()
        rendererRef.current.domElement.remove()
      }

      if (sceneRef.current) {
        sceneRef.current.clear()
      }

      sceneRef.current = null
      cameraRef.current = null
      rendererRef.current = null
    }
  }, [onSceneReady, onRender])

  return <canvas ref={canvasRef} className={className} style={{ touchAction: 'none' }} />
})

export default memo(ThreeScene)
