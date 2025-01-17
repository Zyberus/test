'use client';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
var ParticleBackground = function () {
    var containerRef = useRef(null);
    var canvasRef = useRef(null);
    var rendererRef = useRef(null);
    var _a = useState(false), mounted = _a[0], setMounted = _a[1];
    var _b = useState({ x: 0, y: 0 }), mousePosition = _b[0], setMousePosition = _b[1];
    var _c = useState(false), isHovering = _c[0], setIsHovering = _c[1];
    // Handle mounting state
    useEffect(function () {
        setMounted(true);
        return function () { return setMounted(false); };
    }, []);
    useEffect(function () {
        if (!mounted || !canvasRef.current || !containerRef.current)
            return;
        // Scene setup with enhanced atmosphere
        var scene = new THREE.Scene();
        scene.fog = new THREE.FogExp2(0x000000, 0.02);
        var camera = new THREE.PerspectiveCamera(60, // Reduced FOV
        window.innerWidth / window.innerHeight, 0.1, 100 // Reduced far plane
        );
        camera.position.z = 25;
        // Optimized renderer settings
        var renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            antialias: false, // Disabled for performance
            alpha: true,
            powerPreference: 'high-performance',
            precision: 'lowp' // Lower precision for better performance
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(1); // Fixed pixel ratio
        renderer.shadowMap.enabled = false; // Disabled unnecessary features
        rendererRef.current = renderer;
        // Create particles with enhanced visuals
        var geometry = new THREE.BufferGeometry();
        var particleCount = 300; // Reduced particle count for better performance
        var positions = new Float32Array(particleCount * 3);
        var colors = new Float32Array(particleCount * 3);
        var sizes = new Float32Array(particleCount);
        var phases = new Float32Array(particleCount);
        var particles = [];
        var baseRadius = 20;
        var colorPalette = [
            new THREE.Color('#3b82f6'),
            new THREE.Color('#60a5fa'),
            new THREE.Color('#93c5fd'),
            new THREE.Color('#2563eb'),
        ];
        for (var i = 0; i < particleCount; i++) {
            // Create particles in a complex double helix pattern
            var t = (i / particleCount) * Math.PI * 8;
            var strand = i % 2 === 0 ? 1 : -1;
            var radiusVariation = Math.random() * 8;
            var radius = baseRadius + radiusVariation;
            var heightVariation = Math.cos(t * 3) * 2;
            var position = new THREE.Vector3(Math.cos(t) * radius * strand, heightVariation * 5, Math.sin(t) * radius);
            positions[i * 3] = position.x;
            positions[i * 3 + 1] = position.y;
            positions[i * 3 + 2] = position.z;
            // Random color from palette with smooth transitions
            var color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
            // Dynamic size variation
            var size = Math.random() * 0.5 + 0.1;
            sizes[i] = size;
            // Random phase for animation variation
            phases[i] = Math.random() * Math.PI * 2;
            particles.push({
                position: position.clone(),
                velocity: new THREE.Vector3((Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02),
                originalPosition: position.clone(),
                targetPosition: position.clone(),
                color: color.clone(),
                size: size,
                phase: phases[i]
            });
        }
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        geometry.setAttribute('phase', new THREE.BufferAttribute(phases, 1));
        // Enhanced material with custom shader for better particle rendering
        var material = new THREE.ShaderMaterial({
            uniforms: {
                time: { value: 0 },
                mousePosition: { value: new THREE.Vector2(0, 0) },
                isHovering: { value: 0 },
            },
            vertexShader: "\n        attribute vec3 color;\n        attribute float size;\n        attribute float phase;\n        varying vec3 vColor;\n        uniform float time;\n        uniform vec2 mousePosition;\n        uniform float isHovering;\n        \n        void main() {\n          vColor = color;\n          vec3 pos = position;\n          \n          // Simplified wave motion\n          float wave = sin(time * 0.3 + phase) * 0.1;\n          pos.y += wave;\n          \n          // Optimized mouse interaction\n          if (isHovering > 0.0) {\n            vec2 mouseEffect = mousePosition - pos.xz;\n            float mouseDistance = length(mouseEffect);\n            if (mouseDistance < 2.0) {\n              pos.xz += normalize(mouseEffect) * 0.05;\n            }\n          }\n          \n          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);\n          gl_PointSize = size * (100.0 / -mvPosition.z);\n          gl_Position = projectionMatrix * mvPosition;\n        }\n      ",
            fragmentShader: "\n        varying vec3 vColor;\n        \n        void main() {\n          // Simple circle shape\n          if (length(gl_PointCoord - 0.5) > 0.5) discard;\n          gl_FragColor = vec4(vColor, 0.7);\n        }\n      ",
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        });
        var points = new THREE.Points(geometry, material);
        scene.add(points);
        // Enhanced mouse interaction
        var handleMouseMove = function (event) {
            var x = (event.clientX / window.innerWidth) * 2 - 1;
            var y = -(event.clientY / window.innerHeight) * 2 + 1;
            setMousePosition({ x: x, y: y });
            gsap.to(material.uniforms.mousePosition.value, {
                x: x * 20,
                y: y * 20,
                duration: 1,
                ease: 'power2.out'
            });
        };
        var handleMouseEnter = function () {
            setIsHovering(true);
            gsap.to(material.uniforms.isHovering, {
                value: 1,
                duration: 0.5,
                ease: 'power2.out'
            });
        };
        var handleMouseLeave = function () {
            setIsHovering(false);
            gsap.to(material.uniforms.isHovering, {
                value: 0,
                duration: 0.5,
                ease: 'power2.out'
            });
        };
        containerRef.current.addEventListener('mousemove', handleMouseMove);
        containerRef.current.addEventListener('mouseenter', handleMouseEnter);
        containerRef.current.addEventListener('mouseleave', handleMouseLeave);
        // Enhanced animation with smooth transitions
        var clock = new THREE.Clock();
        var animate = function () {
            var elapsedTime = clock.getElapsedTime();
            material.uniforms.time.value = elapsedTime;
            // Rotate the entire particle system
            points.rotation.y = elapsedTime * 0.05;
            points.rotation.z = elapsedTime * 0.02;
            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };
        animate();
        // Enhanced camera movement on scroll
        var handleScroll = function () {
            var scrollY = window.scrollY;
            gsap.to(camera.position, {
                y: -(scrollY * 0.01),
                duration: 1,
                ease: 'power2.out',
            });
        };
        window.addEventListener('scroll', handleScroll);
        // Handle resize
        var resizeTimeout;
        var handleResize = function () {
            // Debounce resize events
            if (resizeTimeout)
                clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(function () {
                if (!renderer || !camera)
                    return;
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight, false); // false prevents setting style.width/height
            }, 250);
        };
        window.addEventListener('resize', handleResize);
        return function () {
            var _a, _b, _c;
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('scroll', handleScroll);
            (_a = containerRef.current) === null || _a === void 0 ? void 0 : _a.removeEventListener('mousemove', handleMouseMove);
            (_b = containerRef.current) === null || _b === void 0 ? void 0 : _b.removeEventListener('mouseenter', handleMouseEnter);
            (_c = containerRef.current) === null || _c === void 0 ? void 0 : _c.removeEventListener('mouseleave', handleMouseLeave);
            geometry.dispose();
            material.dispose();
            renderer.dispose();
        };
    }, []);
    return (<div ref={containerRef} className="fixed inset-0 -z-10 bg-gradient-to-b from-gray-900 to-black overflow-hidden">
      {mounted && (<canvas ref={canvasRef} className="w-full h-full" style={{ background: 'transparent' }}/>)}
    </div>);
};
export default ParticleBackground;
