import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import Link from 'next/link';

const InteractiveHero = () => {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const particlesRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        // ========= Scene / Camera / Renderer =========
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(
            75,
            container.clientWidth / container.clientHeight,
            0.1,
            1000
        );
        camera.position.z = 50;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setClearColor(0x000000, 0);
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.appendChild(renderer.domElement);

        // ========= Particles Geometry =========
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 3000;

        const positions = new Float32Array(particlesCount * 3);
        const home = new Float32Array(particlesCount * 3);
        const phase = new Float32Array(particlesCount);

        for (let i = 0; i < particlesCount; i++) {
            const i3 = i * 3;

            // Nuvem mais densa no centro (melhor pra "ondas")
            const r = Math.pow(Math.random(), 0.65) * 50;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            const x = r * Math.sin(phi) * Math.cos(theta);
            const y = r * Math.sin(phi) * Math.sin(theta);
            const z = (Math.random() - 0.5) * 40;

            positions[i3 + 0] = x;
            positions[i3 + 1] = y;
            positions[i3 + 2] = z;

            home[i3 + 0] = x;
            home[i3 + 1] = y;
            home[i3 + 2] = z;

            phase[i] = Math.random() * Math.PI * 2;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particlesGeometry.setAttribute('aHome', new THREE.BufferAttribute(home, 3));
        particlesGeometry.setAttribute('aPhase', new THREE.BufferAttribute(phase, 1));

        // ========= Shader Material (Observer -> Waves) =========
        const material = new THREE.ShaderMaterial({
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            uniforms: {
                uTime: { value: 0 },
                uObserver: { value: new THREE.Vector3(0, 0, 0) },
                uStrength: { value: 0 },
                uPointSize: { value: 2.1 },
                uColorA: { value: new THREE.Color(0x60a5fa) },
                uColorB: { value: new THREE.Color(0xa78bfa) },
                uResolution: { value: new THREE.Vector2(container.clientWidth, container.clientHeight) }
            },
            vertexShader: `
        uniform float uTime;
        uniform vec3 uObserver;
        uniform float uStrength;
        uniform float uPointSize;

        attribute vec3 aHome;
        attribute float aPhase;

        varying float vWave;
        varying float vFade;

        void main() {
          vec3 p = aHome;

          float d = length(p.xy - uObserver.xy);
          float field = uStrength * smoothstep(55.0, 0.0, d);

          float k1 = 0.33;
          float k2 = 0.18;

          float w1 = sin(d * k1 - uTime * 2.3 + aPhase);
          float w2 = sin((p.x + p.y) * k2 + uTime * 1.6 + aPhase * 0.7);

          float wave = (w1 * 0.75 + w2 * 0.55);

          vec3 dir = normalize(vec3(p.xy - uObserver.xy, 14.0));

          float amp = field * 3.0;

          p += dir * wave * amp;

          // micro "flutuação" sempre ligada
          p.x += sin(uTime * 0.35 + aPhase) * 0.18;
          p.y += cos(uTime * 0.28 + aPhase) * 0.18;
          p.z += sin(uTime * 0.22 + aPhase) * 0.12;

          vWave = wave;
          vFade = field;

          vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mvPosition;

          float size = uPointSize * (1.0 + vFade * 1.4);
          gl_PointSize = size * (300.0 / -mvPosition.z);
        }
      `,
            fragmentShader: `
        uniform float uTime;
        uniform vec3 uColorA;
        uniform vec3 uColorB;

        varying float vWave;
        varying float vFade;

        void main() {
          vec2 uv = gl_PointCoord.xy - 0.5;
          float r = length(uv);

          float core = smoothstep(0.5, 0.18, r);
          float glow = smoothstep(0.5, 0.0, r) * 0.65;

          float t = 0.5 + 0.5 * sin(vWave + uTime * 0.15);
          vec3 col = mix(uColorA, uColorB, t);

          col += vFade * 0.35;

          float alpha = (core * 0.55 + glow) * (0.55 + vFade * 0.6);

          if (alpha < 0.01) discard;

          gl_FragColor = vec4(col, alpha);
        }
      `
        });

        const particles = new THREE.Points(particlesGeometry, material);
        particlesRef.current = particles;
        scene.add(particles);

        // ========= Pointer -> Observer point =========
        const mouseNDC = new THREE.Vector2(0, 0);
        const observerTarget = new THREE.Vector3(0, 0, 0);
        const observerCurrent = new THREE.Vector3(0, 0, 0);

        const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
        const raycaster = new THREE.Raycaster();

        let strengthTarget = 0;
        let strengthCurrent = 0;
        let lastMoveAt = performance.now();

        const setPointerFromEvent = (clientX, clientY) => {
            const rect = container.getBoundingClientRect();
            const x = ((clientX - rect.left) / rect.width) * 2 - 1;
            const y = -(((clientY - rect.top) / rect.height) * 2 - 1);

            mouseNDC.set(x, y);

            raycaster.setFromCamera(mouseNDC, camera);
            const hit = new THREE.Vector3();
            const ok = raycaster.ray.intersectPlane(plane, hit);

            if (ok) observerTarget.copy(hit);

            lastMoveAt = performance.now();
            strengthTarget = 1;
        };

        const onMouseMove = (e) => setPointerFromEvent(e.clientX, e.clientY);

        const onTouchMove = (e) => {
            if (!e.touches || e.touches.length === 0) return;
            const t = e.touches[0];
            setPointerFromEvent(t.clientX, t.clientY);
        };

        window.addEventListener('mousemove', onMouseMove, { passive: true });
        window.addEventListener('touchmove', onTouchMove, { passive: true });

        // ========= Animation =========
        const clock = new THREE.Clock();
        let raf = 0;

        const animate = () => {
            const elapsed = clock.getElapsedTime();

            const now = performance.now();
            if (now - lastMoveAt > 700) strengthTarget = 0;

            observerCurrent.lerp(observerTarget, 0.08);
            strengthCurrent = THREE.MathUtils.lerp(strengthCurrent, strengthTarget, 0.06);

            material.uniforms.uTime.value = elapsed;
            material.uniforms.uObserver.value.copy(observerCurrent);
            material.uniforms.uStrength.value = strengthCurrent;

            particles.rotation.y = elapsed * 0.06;
            particles.rotation.x = Math.sin(elapsed * 0.15) * 0.06;

            renderer.render(scene, camera);
            raf = requestAnimationFrame(animate);
        };

        animate();

        // ========= Resize =========
        const handleResize = () => {
            if (!containerRef.current) return;

            const w = containerRef.current.clientWidth;
            const h = containerRef.current.clientHeight;

            camera.aspect = w / h;
            camera.updateProjectionMatrix();

            renderer.setSize(w, h);
            material.uniforms.uResolution.value.set(w, h);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        };

        window.addEventListener('resize', handleResize);

        // ========= Cleanup =========
        return () => {
            cancelAnimationFrame(raf);

            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('resize', handleResize);

            if (containerRef.current && renderer.domElement) {
                containerRef.current.removeChild(renderer.domElement);
            }

            renderer.dispose();
            particlesGeometry.dispose();
            material.dispose();
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

                    <p className="text-xl md:text-2xl text-blue-200 font-light">Desenvolvedor Full Stack!</p>

                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
                        Criando soluções web eficientes e inovadoras.
                    </p>

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
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
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
