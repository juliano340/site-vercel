import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// Componente de Typing Effect
const TypingText = ({ texts, speed = 100, deleteSpeed = 50, delay = 2000 }) => {
    const [displayText, setDisplayText] = useState('');
    const [textIndex, setTextIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const currentText = texts[textIndex];
        
        if (isPaused) {
            const pauseTimer = setTimeout(() => {
                setIsPaused(false);
                setIsDeleting(true);
            }, delay);
            return () => clearTimeout(pauseTimer);
        }

        if (isDeleting) {
            if (displayText === '') {
                setIsDeleting(false);
                setTextIndex((prev) => (prev + 1) % texts.length);
            } else {
                const timer = setTimeout(() => {
                    setDisplayText(displayText.slice(0, -1));
                }, deleteSpeed);
                return () => clearTimeout(timer);
            }
        } else {
            if (displayText === currentText) {
                setIsPaused(true);
            } else {
                const timer = setTimeout(() => {
                    setDisplayText(currentText.slice(0, displayText.length + 1));
                }, speed);
                return () => clearTimeout(timer);
            }
        }
    }, [displayText, textIndex, isDeleting, isPaused, texts, speed, deleteSpeed, delay]);

    return (
        <span className="inline-flex items-center">
            {displayText}
            <span className="animate-pulse ml-1">|</span>
        </span>
    );
};

const InteractiveHero = () => {
    const fadeRef = useRef(null);
    const [sheen, setSheen] = useState({ x: 50, y: 20 });
    
    const typingTexts = [
        "Desenvolvedor Front-end",
        "Desenvolvedor Back-end", 
        "Desenvolvedor Full Stack!"
    ];

    // Efeito de fade no scroll
    useEffect(() => {
        const START = 220;
        const END = 820;
        let raf = 0;

        const update = () => {
            const y = window.scrollY || 0;
            const t = (y - START) / (END - START);
            const fadeValue = Math.max(0, Math.min(1, t));

            if (fadeRef.current) {
                fadeRef.current.style.opacity = (1 - fadeValue).toString();
                fadeRef.current.style.transform = `translateY(${fadeValue * 24}px) scale(${1 - fadeValue * 0.06})`;
                fadeRef.current.style.pointerEvents = fadeValue > 0.85 ? 'none' : 'auto';
            }
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

    const onCardMove = (e) => {
        const el = e.currentTarget;
        const rect = el.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setSheen({ x, y });
    };

    const onCardLeave = () => setSheen({ x: 50, y: 20 });

    return (
        <div className="relative w-full min-h-[calc(100dvh-4rem)] sm:min-h-[calc(100dvh-5rem)] overflow-x-hidden overflow-y-visible">
            {/* Background Animado com CSS - 0KB JS! */}
            <div className="absolute inset-0 z-0">
                {/* Camada 1: Gradiente base animado */}
                <div 
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(-45deg, #00B140, #0f172a, #1e3a5f, #00B140)',
                        backgroundSize: '400% 400%',
                        animation: 'gradientShift 15s ease infinite'
                    }}
                />
                
                {/* Camada 2: Blob animado 1 */}
                <div 
                    className="absolute w-96 h-96 rounded-full opacity-40 blur-3xl"
                    style={{
                        background: 'radial-gradient(circle, rgba(0,177,64,0.6) 0%, rgba(0,177,64,0) 70%)',
                        top: '10%',
                        left: '10%',
                        animation: 'blob1 20s infinite'
                    }}
                />
                
                {/* Camada 3: Blob animado 2 */}
                <div 
                    className="absolute w-96 h-96 rounded-full opacity-30 blur-3xl"
                    style={{
                        background: 'radial-gradient(circle, rgba(59,130,246,0.6) 0%, rgba(59,130,246,0) 70%)',
                        bottom: '20%',
                        right: '10%',
                        animation: 'blob2 25s infinite'
                    }}
                />
                
                {/* Camada 4: Blob animado 3 */}
                <div 
                    className="absolute w-80 h-80 rounded-full opacity-30 blur-3xl"
                    style={{
                        background: 'radial-gradient(circle, rgba(139,92,246,0.5) 0%, rgba(139,92,246,0) 70%)',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        animation: 'blob3 18s infinite'
                    }}
                />
                
                {/* Camada 5: Grade sutil */}
                <div 
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                        `,
                        backgroundSize: '50px 50px'
                    }}
                />
            </div>

            <style jsx>{`
                @keyframes gradientShift {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }
                
                @keyframes blob1 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(50px, -50px) scale(1.1); }
                    66% { transform: translate(-30px, 30px) scale(0.9); }
                }
                
                @keyframes blob2 {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(-40px, 40px) scale(1.2); }
                    66% { transform: translate(30px, -30px) scale(0.8); }
                }
                
                @keyframes blob3 {
                    0%, 100% { transform: translate(-50%, -50%) scale(1); }
                    50% { transform: translate(-50%, -50%) scale(1.3); }
                }
            `}</style>

            <div
                ref={fadeRef}
                className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100dvh-4rem)] sm:min-h-[calc(100dvh-5rem)] px-4 py-4 sm:py-6"
                style={{
                    opacity: 1,
                    transform: 'translateY(0px) scale(1)',
                    transition: 'opacity 120ms linear, transform 120ms linear'
                }}
            >
                <div className="mb-5 mt-2 sm:mb-6 sm:mt-4 relative group">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-60 blur transition duration-1000 group-hover:opacity-90 group-hover:duration-200"></div>
                    <Image
                        src="https://avatars.githubusercontent.com/u/87342139?v=4"
                        alt="Profile"
                        width={160}
                        height={160}
                        priority
                        loading="eager"
                        fetchPriority="high"
                        sizes="(max-width: 768px) 112px, (max-width: 1024px) 144px, 160px"
                        className="relative w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 lg:w-40 lg:h-40 rounded-full object-cover border-4 border-white/90 shadow-2xl"
                    />
                </div>

                <div
                    className="glass-card text-center space-y-4 sm:space-y-5 max-w-4xl rounded-3xl px-5 py-6 sm:px-8 sm:py-7 lg:px-10 lg:py-9 shadow-2xl"
                    onMouseMove={onCardMove}
                    onMouseLeave={onCardLeave}
                    style={{
                        '--sheen-x': `${sheen.x}%`,
                        '--sheen-y': `${sheen.y}%`
                    }}
                >
                    <h1 className="text-4xl sm:text-5xl xl:text-7xl font-bold text-white leading-tight">
                        Olá, eu sou um{' '}
                        <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                            Programador Web!
                        </span>
                    </h1>

                    <p className="text-lg sm:text-xl md:text-2xl text-blue-200 font-light min-h-[2rem]">
                        <TypingText texts={typingTexts} speed={80} deleteSpeed={40} delay={1500} />
                    </p>

                    <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
                        Criando soluções web eficientes e inovadoras.
                    </p>

                    <Link href="/contato" passHref>
                        <div className="pt-4 sm:pt-6">
                            <button className="group relative px-8 py-4 bg-blue-500 text-white font-semibold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/40">
                                <span className="relative z-10">Entre em Contato</span>
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            </button>
                        </div>
                    </Link>
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
