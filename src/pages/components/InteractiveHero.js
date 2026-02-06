import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import Link from 'next/link';

const InteractiveHero = () => {
    const containerRef = useRef(null);

    // 0 = visível, 1 = escondido
    const [fade, setFade] = useState(0);

    // sheen (reflexo) seguindo o mouse dentro do card
    const [sheen, setSheen] = useState({ x: 50, y: 20 });

    // Fade progressivo por faixa de scroll (mais lento)
    useEffect(() => {
        const START = 220;
        const END = 820;
        let raf = 0;

        const update = () => {
            const y = window.scrollY || 0;
            const t = (y - START) / (END - START);
            setFade(Math.max(0, Math.min(1, t)));
            raf = 0;
        };

        const onScroll = () => {
            if (!raf) raf = requestAnimationFrame(update);
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        update();

        return () => {
            window.removeEventListener('scroll', onScroll);
            if (raf) cancelAnimationFrame(raf);
        };
    }, []);

    // Three.js (mesmo efeito “quântico” e alpha controlado)
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const scene = new THREE.Scene();

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

        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 3000;

        const positions = new Float32Array(particlesCount * 3);
        const home = new Float32Array(particlesCount * 3);
        const phase = new Float32Array(particlesCount);

        for (let i = 0; i < particlesCount; i++) {
            const i3 = i * 3;

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

        const material = new THREE.ShaderMaterial({
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            uniforms: {
                uTime: { value: 0 },
                uObserver: { value: new THREE.Vector3(0, 0, 0) },
                uStrength: { value: 0 },
                uPointSize: { value: 2.0 },
                uColorA: { value: new THREE.Color(0x60a5fa) },
                uColorB: { value: new THREE.Color(0xa78bfa) }
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

          p.x += sin(uTime * 0.35 + aPhase) * 0.18;
          p.y += cos(uTime * 0.28 + aPhase) * 0.18;
          p.z += sin(uTime * 0.22 + aPhase) * 0.12;

          vWave = wave;
          vFade = field;

          vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
          gl_Position = projectionMatrix * mvPosition;

          float size = uPointSize * (1.0 + vFade * 1.2);
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
          float glow = smoothstep(0.5, 0.0, r) * 0.55;

          float t = 0.5 + 0.5 * sin(vWave + uTime * 0.15);
          vec3 col = mix(uColorA, uColorB, t);

          // menos “estouro” quando observado
          col += vFade * 0.20;

          // reduz alpha quando observador está forte (não ofusca o texto)
          float damp = 1.0 - (vFade * 0.50);
          float alpha = (core * 0.48 + glow) * (0.42 + vFade * 0.38) * damp;

          if (alpha < 0.01) discard;
          gl_FragColor = vec4(col, alpha);
        }
      `
        });

        const particles = new THREE.Points(particlesGeometry, material);
        scene.add(particles);

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

        const handleResize = () => {
            if (!containerRef.current) return;

            const w = containerRef.current.clientWidth;
            const h = containerRef.current.clientHeight;

            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        };

        window.addEventListener('resize', handleResize);

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

    const onCardMove = (e) => {
        const el = e.currentTarget;
        const rect = el.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setSheen({ x, y });
    };

    const onCardLeave = () => setSheen({ x: 50, y: 20 });

    return (
        <div className="relative w-full h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
            <div ref={containerRef} className="absolute inset-0 z-0" />

            <div
                className="relative z-10 flex flex-col items-center justify-center h-full px-4"
                style={{
                    opacity: 1 - fade,
                    transform: `translateY(${fade * 24}px) scale(${1 - fade * 0.06})`,
                    pointerEvents: fade > 0.85 ? 'none' : 'auto',
                    transition: 'opacity 120ms linear, transform 120ms linear'
                }}
            >
                <div className="mb-8 mt-8 relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-60 blur transition duration-1000 group-hover:opacity-90 group-hover:duration-200"></div>
                    <img
                        src="https://avatars.githubusercontent.com/u/87342139?v=4"
                        alt="Profile"
                        className="relative w-40 h-40 rounded-full object-cover border-4 border-white/90 shadow-2xl"
                    />
                </div>

                <div
                    className="glass-card text-center space-y-6 max-w-4xl rounded-3xl px-6 py-8 md:px-10 md:py-10 shadow-2xl"
                    onMouseMove={onCardMove}
                    onMouseLeave={onCardLeave}
                >
                    <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                        Olá, eu sou um{' '}
                        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Programador Web!
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-blue-200 font-light">Desenvolvedor Full Stack!</p>

                    <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
                        Criando soluções web eficientes e inovadoras.
                    </p>

                    <Link href="/contato" passHref>
                        <div className="pt-8">
                            <button className="group relative px-8 py-4 bg-blue-500 text-white font-semibold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/40">
                                <span className="relative z-10">Entre em Contato</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </button>
                        </div>
                    </Link>

                    <style jsx>{`
            .glass-card {
              position: relative;
              overflow: hidden;
              border: 1px solid rgba(255, 255, 255, 0.14);
              background: rgba(15, 23, 42, 0.28);
              backdrop-filter: blur(18px);
              -webkit-backdrop-filter: blur(18px);
              box-shadow: 0 20px 70px rgba(0, 0, 0, 0.45);
            }

            /* borda “premium” suave (sem neon) */
            .glass-card::before {
              content: '';
              position: absolute;
              inset: 0;
              pointer-events: none;
              background: linear-gradient(
                135deg,
                rgba(255, 255, 255, 0.14),
                rgba(255, 255, 255, 0.02) 40%,
                rgba(96, 165, 250, 0.05) 65%,
                rgba(167, 139, 250, 0.05)
              );
              opacity: 0.65;
            }

            /* sheen interativo (reflexo de vidro) */
            .glass-card::after {
              content: '';
              position: absolute;
              inset: -60px;
              pointer-events: none;
              background: radial-gradient(
                420px 180px at ${sheen.x}% ${sheen.y}%,
                rgba(255, 255, 255, 0.20),
                rgba(255, 255, 255, 0.06) 35%,
                rgba(255, 255, 255, 0.0) 70%
              );
              opacity: 0.8;
              mix-blend-mode: screen;
              transition: background 80ms linear;
            }
          `}</style>
                </div>

                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent pointer-events-none"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/30 to-transparent pointer-events-none"></div>
        </div>
    );
};

export default InteractiveHero;
