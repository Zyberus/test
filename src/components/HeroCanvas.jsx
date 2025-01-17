'use client';
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { gsap } from 'gsap';
var HeroCanvas = function () {
    var canvasRef = useRef(null);
    var _a = useState(false), isHovered = _a[0], setIsHovered = _a[1];
    useEffect(function () {
        if (!canvasRef.current)
            return;
        // Scene setup with fog for depth
        var scene = new THREE.Scene();
        scene.fog = new THREE.Fog(0x000000, 1, 15);
        var camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        camera.position.z = 5;
        var renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance',
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        canvasRef.current.appendChild(renderer.domElement);
        // Enhanced controls
        var controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enableZoom = false;
        controls.enablePan = false;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 2;
        // Create main geometric shape
        var geometry = new THREE.TorusKnotGeometry(1, 0.3, 200, 32);
        var material = new THREE.MeshPhysicalMaterial({
            color: new THREE.Color('#3b82f6'),
            metalness: 0.7,
            roughness: 0.2,
            clearcoat: 1.0,
            clearcoatRoughness: 0.4,
            transparent: true,
            opacity: 0.9,
        });
        var torusKnot = new THREE.Mesh(geometry, material);
        torusKnot.castShadow = true;
        torusKnot.receiveShadow = true;
        scene.add(torusKnot);
        // Enhanced wireframe
        var wireframeGeometry = new THREE.TorusKnotGeometry(1.2, 0.15, 200, 32);
        var wireframeMaterial = new THREE.MeshBasicMaterial({
            color: new THREE.Color('#60a5fa'),
            wireframe: true,
            transparent: true,
            opacity: 0.2,
        });
        var wireframe = new THREE.Mesh(wireframeGeometry, wireframeMaterial);
        scene.add(wireframe);
        // Particle system
        var particlesGeometry = new THREE.BufferGeometry();
        var particleCount = 2000;
        var positions = new Float32Array(particleCount * 3);
        var colors = new Float32Array(particleCount * 3);
        for (var i = 0; i < particleCount * 3; i += 3) {
            positions[i] = (Math.random() - 0.5) * 10;
            positions[i + 1] = (Math.random() - 0.5) * 10;
            positions[i + 2] = (Math.random() - 0.5) * 10;
            colors[i] = Math.random() * 0.5 + 0.5;
            colors[i + 1] = Math.random() * 0.5 + 0.5;
            colors[i + 2] = Math.random() * 0.5 + 0.5;
        }
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        var particlesMaterial = new THREE.PointsMaterial({
            size: 0.02,
            vertexColors: true,
            transparent: true,
            opacity: 0.6,
        });
        var particles = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particles);
        // Enhanced lighting
        var ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        var directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        directionalLight.shadow.mapSize.width = 1024;
        directionalLight.shadow.mapSize.height = 1024;
        scene.add(directionalLight);
        var pointLight1 = new THREE.PointLight(0x3b82f6, 2);
        pointLight1.position.set(2, 3, 4);
        scene.add(pointLight1);
        var pointLight2 = new THREE.PointLight(0x60a5fa, 2);
        pointLight2.position.set(-2, -3, -4);
        scene.add(pointLight2);
        // Mouse interaction
        var mouse = new THREE.Vector2();
        var handleMouseMove = function (event) {
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
            // Tilt the shape based on mouse position
            gsap.to(torusKnot.rotation, {
                x: mouse.y * 0.5,
                y: mouse.x * 0.5,
                duration: 2,
                ease: 'power2.out',
            });
            // Move particles
            gsap.to(particles.rotation, {
                x: mouse.y * 0.2,
                y: mouse.x * 0.2,
                duration: 2,
                ease: 'power2.out',
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        // Animation
        var clock = new THREE.Clock();
        var animate = function () {
            var elapsedTime = clock.getElapsedTime();
            requestAnimationFrame(animate);
            controls.update();
            // Smooth rotation
            torusKnot.rotation.x += 0.002;
            torusKnot.rotation.y += 0.002;
            wireframe.rotation.x += 0.001;
            wireframe.rotation.y += 0.001;
            // Particle animation
            particles.rotation.y = elapsedTime * 0.05;
            particles.position.y = Math.sin(elapsedTime * 0.5) * 0.1;
            renderer.render(scene, camera);
        };
        animate();
        // Handle resize
        var handleResize = function () {
            var container = canvasRef.current;
            if (!container)
                return;
            var width = window.innerWidth;
            var height = window.innerHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };
        window.addEventListener('resize', handleResize);
        handleResize();
        // Cleanup
        return function () {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            renderer.dispose();
            geometry.dispose();
            material.dispose();
            wireframeGeometry.dispose();
            wireframeMaterial.dispose();
            controls.dispose();
        };
    }, []);
    return <div ref={canvasRef} className="w-full h-full"/>;
};
export default HeroCanvas;
