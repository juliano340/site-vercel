import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import Link from 'next/link';


const InteractiveHero = () => {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const particlesRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(
            75,
            containerRef.current.clientWidth / containerRef.current.clientHeight,
            0.1,
            1000
        );
        camera.position.z = 50;

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        containerRef.current.appendChild(renderer.domElement);

        // Particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 3000;
        const posArray = new Float32Array(particlesCount * 3);

        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 100;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.15,
            color: 0x60a5fa,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        particlesRef.current = particlesMesh;
        scene.add(particlesMesh);

        // Mouse interaction
        let mouseX = 0;
        let mouseY = 0;

        const handleMouseMove = (event) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        };

        window.addEventListener('mousemove', handleMouseMove);

        // Animation
        const clock = new THREE.Clock();

        const animate = () => {
            const elapsedTime = clock.getElapsedTime();

            // Rotate particles
            particlesMesh.rotation.y = elapsedTime * 0.05;

            // Mouse interaction
            particlesMesh.rotation.x = mouseY * 0.3;
            particlesMesh.rotation.y = mouseX * 0.5 + elapsedTime * 0.05;

            renderer.render(scene, camera);
            requestAnimationFrame(animate);
        };

        animate();

        // Handle resize
        const handleResize = () => {
            if (!containerRef.current) return;

            camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            if (containerRef.current && renderer.domElement) {
                containerRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
            particlesGeometry.dispose();
            particlesMaterial.dispose();
        };
    }, []);

    return (
        <div className="relative w-full h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
            {/* Three.js Canvas */}
            <div ref={containerRef} className="absolute inset-0 z-0" />

            {/* Content Overlay */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-4">
                {/* Profile Image */}
                <div className="mb-8 mt-8 relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-75 group-hover:opacity-100 blur transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                    <img
                        src="https://media.licdn.com/dms/image/v2/D4D03AQHlmedGmdAk-g/profile-displayphoto-scale_400_400/B4DZu348JpIAAg-/0/1768316741138?e=1770249600&v=beta&t=5s32tcMIMJfPk9fGuDCk3RgcagsMNRvD3I3tUaFiU3k"
                        alt="Profile"
                        className="relative w-40 h-40 rounded-full object-cover border-4 border-white shadow-2xl"
                    />
                </div>

                {/* Text Content */}
                <div className="text-center space-y-6 max-w-4xl">
                    <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                        Olá, eu sou um{' '}
                        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                            Programador Web!
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-blue-200 font-light">
                        Desenvolvedor Full Stack!
                    </p>

                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
                        Criando soluções web eficientes e inovadoras.
                    </p>

                    {/* CTA Button */}
                    <Link href="/contato" passHref>
                        <div className="pt-8">
                            <button className="group relative px-8 py-4 bg-blue-500 text-white font-semibold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50">
                                <span className="relative z-10">Entre em Contato</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </button>
                        </div>
                    </Link>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <svg
                        className="w-6 h-6 text-blue-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 14l-7 7m0 0l-7-7m7 7V3"
                        />
                    </svg>
                </div>
            </div>

            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 to-transparent pointer-events-none"></div>
        </div>
    );
};

export default InteractiveHero;