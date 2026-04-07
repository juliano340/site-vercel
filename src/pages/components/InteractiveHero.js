import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// ── Typing Effect ──────────────────────────────────────────
const TypingText = ({ texts, speed = 100, deleteSpeed = 50, delay = 2000 }) => {
    const [displayText, setDisplayText] = useState('');
    const [textIndex, setTextIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const currentText = texts[textIndex];

        if (isPaused) {
            const t = setTimeout(() => { setIsPaused(false); setIsDeleting(true); }, delay);
            return () => clearTimeout(t);
        }

        if (isDeleting) {
            if (displayText === '') {
                setIsDeleting(false);
                setTextIndex((prev) => (prev + 1) % texts.length);
            } else {
                const t = setTimeout(() => setDisplayText(displayText.slice(0, -1)), deleteSpeed);
                return () => clearTimeout(t);
            }
        } else {
            if (displayText === currentText) {
                setIsPaused(true);
            } else {
                const t = setTimeout(
                    () => setDisplayText(currentText.slice(0, displayText.length + 1)),
                    speed
                );
                return () => clearTimeout(t);
            }
        }
    }, [displayText, textIndex, isDeleting, isPaused, texts, speed, deleteSpeed, delay]);

    return (
        <span className="inline-flex items-center">
            {displayText}
            <span className="animate-pulse ml-1" style={{ color: '#C8FF00' }}>|</span>
        </span>
    );
};

// ── InteractiveHero ────────────────────────────────────────
const InteractiveHero = () => {
    const fadeRef = useRef(null);
    const [sheen, setSheen] = useState({ x: 50, y: 20 });

    const typingTexts = [
        'Desenvolvedor Front-end',
        'Desenvolvedor Back-end',
        'Desenvolvedor Full Stack!',
    ];

    // Fade-out ao rolar
    useEffect(() => {
        const START = 220;
        const END = 820;
        let raf = 0;

        const update = () => {
            const y = window.scrollY || 0;
            const t = Math.max(0, Math.min(1, (y - START) / (END - START)));
            if (fadeRef.current) {
                fadeRef.current.style.opacity = (1 - t).toString();
                fadeRef.current.style.transform = `translateY(${t * 24}px) scale(${1 - t * 0.06})`;
                fadeRef.current.style.pointerEvents = t > 0.85 ? 'none' : 'auto';
            }
            raf = 0;
        };

        const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
        window.addEventListener('scroll', onScroll, { passive: true });
        update();
        return () => {
            window.removeEventListener('scroll', onScroll);
            if (raf) cancelAnimationFrame(raf);
        };
    }, []);

    // Efeito sheen no card
    const onCardMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setSheen({
            x: ((e.clientX - rect.left) / rect.width) * 100,
            y: ((e.clientY - rect.top) / rect.height) * 100,
        });
    };
    const onCardLeave = () => setSheen({ x: 50, y: 20 });

    return (
        <div className="relative w-full min-h-[calc(100dvh-4rem)] sm:min-h-[calc(100dvh-5rem)] overflow-x-hidden overflow-y-visible">

            {/* ── Background animado — sempre escuro (identidade da hero) ── */}
            <div className="absolute inset-0 z-0">
                {/* Gradiente base */}
                <div
                    className="absolute inset-0"
                    style={{
                        background: 'linear-gradient(-45deg, #0a1a00, #080808, #0d1200, #050505)',
                        backgroundSize: '400% 400%',
                        animation: 'heroGradientShift 15s ease infinite',
                    }}
                />

                {/* Blob acid green — top left */}
                <div
                    className="absolute w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 rounded-full blur-3xl"
                    style={{
                        background: 'radial-gradient(circle, rgba(200,255,0,0.45) 0%, transparent 70%)',
                        top: '8%', left: '5%',
                        opacity: 0.28,
                        animation: 'heroBlob1 20s infinite',
                    }}
                />

                {/* Blob verde escuro — bottom right */}
                <div
                    className="absolute w-56 h-56 sm:w-72 sm:h-72 md:w-96 md:h-96 rounded-full blur-3xl"
                    style={{
                        background: 'radial-gradient(circle, rgba(0,140,50,0.55) 0%, transparent 70%)',
                        bottom: '12%', right: '5%',
                        opacity: 0.22,
                        animation: 'heroBlob2 25s infinite',
                    }}
                />

                {/* Blob centro */}
                <div
                    className="absolute w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 rounded-full blur-3xl"
                    style={{
                        background: 'radial-gradient(circle, rgba(184,238,0,0.35) 0%, transparent 70%)',
                        top: '50%', left: '50%',
                        transform: 'translate(-50%, -50%)',
                        opacity: 0.18,
                        animation: 'heroBlob3 18s infinite',
                    }}
                />

                {/* Grade sutil acid green */}
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `
                            linear-gradient(rgba(200,255,0,0.04) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(200,255,0,0.04) 1px, transparent 1px)
                        `,
                        backgroundSize: '50px 50px',
                    }}
                />
            </div>

            {/* ── Keyframes ── */}
            <style jsx>{`
                @keyframes heroGradientShift {
                    0%   { background-position: 0% 50%;   }
                    50%  { background-position: 100% 50%; }
                    100% { background-position: 0% 50%;   }
                }
                @keyframes heroBlob1 {
                    0%, 100% { transform: translate(0, 0) scale(1);     }
                    33%      { transform: translate(50px, -50px) scale(1.1); }
                    66%      { transform: translate(-30px, 30px) scale(0.9); }
                }
                @keyframes heroBlob2 {
                    0%, 100% { transform: translate(0, 0) scale(1);     }
                    33%      { transform: translate(-40px, 40px) scale(1.2); }
                    66%      { transform: translate(30px, -30px) scale(0.8); }
                }
                @keyframes heroBlob3 {
                    0%, 100% { transform: translate(-50%, -50%) scale(1);   }
                    50%      { transform: translate(-50%, -50%) scale(1.25); }
                }
            `}</style>

            {/* ── Conteúdo ── */}
            <div
                ref={fadeRef}
                className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100dvh-4rem)] sm:min-h-[calc(100dvh-5rem)] px-4 py-8 sm:py-10 md:py-12"
                style={{
                    opacity: 1,
                    transform: 'translateY(0px) scale(1)',
                    transition: 'opacity 120ms linear, transform 120ms linear',
                }}
            >
                {/* Avatar */}
                <div className="mb-5 sm:mb-6 md:mb-8 relative group">
                    <div
                        className="absolute -inset-1 rounded-full blur opacity-60 transition-opacity duration-1000 group-hover:opacity-90"
                        style={{ background: 'linear-gradient(135deg, #C8FF00, #00B140, #C8FF00)' }}
                    />
                    <Image
                        src="https://avatars.githubusercontent.com/u/87342139?v=4"
                        alt="Juliano340"
                        width={160}
                        height={160}
                        priority
                        loading="eager"
                        fetchPriority="high"
                        sizes="(max-width: 640px) 112px, (max-width: 1024px) 144px, 160px"
                        className="relative rounded-full object-cover"
                        style={{
                            width: 'clamp(96px, 14vw, 160px)',
                            height: 'clamp(96px, 14vw, 160px)',
                            border: '4px solid rgba(200,255,0,0.75)',
                        }}
                    />
                </div>

                {/* Glass Card */}
                <div
                    className="glass-card text-center w-full rounded-2xl sm:rounded-3xl shadow-2xl"
                    style={{
                        maxWidth: 'min(90vw, 860px)',
                        padding: 'clamp(1.25rem, 4vw, 2.5rem) clamp(1.25rem, 5vw, 3rem)',
                        '--sheen-x': `${sheen.x}%`,
                        '--sheen-y': `${sheen.y}%`,
                    }}
                    onMouseMove={onCardMove}
                    onMouseLeave={onCardLeave}
                >
                    {/* Chip de disponibilidade */}
                    <div className="flex justify-center mb-4 sm:mb-5">
                        <span
                            className="inline-flex items-center gap-2 px-3 py-1 text-xs font-bold uppercase tracking-widest rounded-full"
                            style={{
                                background: 'rgba(200,255,0,0.1)',
                                border: '1px solid rgba(200,255,0,0.3)',
                                color: '#C8FF00',
                            }}
                        >
                            <span
                                className="w-1.5 h-1.5 rounded-full animate-pulse"
                                style={{ background: '#C8FF00' }}
                            />
                            Disponível para projetos
                        </span>
                    </div>

                    {/* Título */}
                    <h1
                        className="font-bold leading-tight mb-3 sm:mb-4"
                        style={{
                            fontSize: 'clamp(1.75rem, 5.5vw, 3.75rem)',
                            color: '#FFFFFF',
                        }}
                    >
                        Olá, eu sou um{' '}
                        <span style={{ color: '#C8FF00' }}>Programador Web!</span>
                    </h1>

                    {/* Typing */}
                    <p
                        className="font-light min-h-[2rem] mb-2 sm:mb-3"
                        style={{
                            fontSize: 'clamp(0.95rem, 2.5vw, 1.4rem)',
                            color: 'rgba(200,255,0,0.75)',
                        }}
                    >
                        <TypingText texts={typingTexts} speed={80} deleteSpeed={40} delay={1500} />
                    </p>

                    {/* Subtítulo */}
                    <p
                        className="mx-auto mb-5 sm:mb-6"
                        style={{
                            fontSize: 'clamp(0.85rem, 1.8vw, 1.1rem)',
                            color: 'rgba(255,255,255,0.6)',
                            maxWidth: '36rem',
                        }}
                    >
                        Criando soluções web eficientes e inovadoras.
                    </p>

                    {/* Botões */}
                    <div className="flex flex-col xs:flex-row items-center justify-center gap-3 sm:gap-4">
                        <Link href="/contato" passHref>
                            <button
                                className="w-full xs:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 font-extrabold text-xs uppercase tracking-[0.12em] rounded-full transition-all duration-300 hover:scale-105"
                                style={{ background: '#C8FF00', color: '#000000' }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#B8EE00'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = '#C8FF00'; }}
                            >
                                Fale Comigo
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        </Link>

                        <Link href="/home#portfolio" passHref>
                            <button
                                className="w-full xs:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 font-bold text-xs uppercase tracking-[0.12em] rounded-full transition-all duration-300 hover:scale-105"
                                style={{
                                    background: 'transparent',
                                    border: '1px solid rgba(200,255,0,0.4)',
                                    color: '#C8FF00',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = 'rgba(200,255,0,0.08)';
                                    e.currentTarget.style.borderColor = 'rgba(200,255,0,0.7)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.borderColor = 'rgba(200,255,0,0.4)';
                                }}
                            >
                                Ver Portfólio
                            </button>
                        </Link>
                    </div>
                </div>

                {/* Scroll indicator */}
                <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                    <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="#C8FF00"
                        strokeOpacity="0.6"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                </div>
            </div>

            {/* Vinhetas */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none z-[1]" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent pointer-events-none z-[1]" />
        </div>
    );
};

export default InteractiveHero;
