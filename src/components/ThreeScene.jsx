import { useRef, useEffect, useCallback, memo } from 'react';
import * as THREE from 'three';
var ThreeScene = memo(function (_a) {
    var onSceneReady = _a.onSceneReady, onRender = _a.onRender, _b = _a.className, className = _b === void 0 ? 'w-full h-full' : _b;
    var canvasRef = useRef(null);
    var sceneRef = useRef(null);
    var cameraRef = useRef(null);
    var rendererRef = useRef(null);
    var frameIdRef = useRef();
    useEffect(function () {
        if (!canvasRef.current)
            return;
        // Scene setup
        var scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x000000, 0.1);
        sceneRef.current = scene;
        // Camera setup
        var camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 10);
        cameraRef.current = camera;
        // Renderer setup
        var renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance',
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);
        rendererRef.current = renderer;
        // Handle resize
        var handleResize = useCallback(function () {
            if (!cameraRef.current || !rendererRef.current)
                return;
            var camera = cameraRef.current;
            var renderer = rendererRef.current;
            var canvas = renderer.domElement;
            var width = canvas.clientWidth;
            var height = canvas.clientHeight;
            var needResize = canvas.width !== width || canvas.height !== height;
            if (needResize) {
                camera.aspect = width / height;
                camera.updateProjectionMatrix();
                renderer.setSize(width, height, false);
            }
        }, []);
        window.addEventListener('resize', handleResize);
        // Notify parent component
        if (onSceneReady) {
            onSceneReady({
                scene: scene,
                camera: camera,
                renderer: renderer
            });
        }
        // Animation loop with delta time
        var lastTime = 0;
        var animate = function (currentTime) {
            if (!sceneRef.current || !cameraRef.current || !rendererRef.current)
                return;
            var deltaTime = (currentTime - lastTime) * 0.001; // Convert to seconds
            lastTime = currentTime;
            frameIdRef.current = requestAnimationFrame(animate);
            handleResize();
            if (onRender) {
                onRender({
                    scene: sceneRef.current,
                    camera: cameraRef.current,
                    renderer: rendererRef.current,
                    deltaTime: deltaTime
                });
            }
            rendererRef.current.render(sceneRef.current, cameraRef.current);
        };
        animate(0);
        // Cleanup
        return function () {
            window.removeEventListener('resize', handleResize);
            if (frameIdRef.current) {
                cancelAnimationFrame(frameIdRef.current);
            }
            if (rendererRef.current) {
                rendererRef.current.dispose();
                rendererRef.current.forceContextLoss();
                rendererRef.current.domElement.remove();
            }
            if (sceneRef.current) {
                sceneRef.current.clear();
            }
            sceneRef.current = null;
            cameraRef.current = null;
            rendererRef.current = null;
        };
    }, [onSceneReady, onRender]);
    return <canvas ref={canvasRef} className={className} style={{ touchAction: 'none' }}/>;
});
export default memo(ThreeScene);
