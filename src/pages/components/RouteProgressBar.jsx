import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

/**
 * Top progress bar para feedback visual em transições de rota.
 * Sem dependência externa. Tema accent.
 *
 * Comportamento:
 * - mostra imediatamente no routeChangeStart (sem delay)
 * - garante tempo mínimo visível (MIN_SHOW_MS) para que rotas
 *   muito rápidas (cache hit, página estática) ainda dêem sinal
 * - sobe gradualmente até 80% enquanto carrega
 * - completa 100% no done e some
 */
const MIN_SHOW_MS = 400;
const FADE_OUT_MS = 220;

const RouteProgressBar = () => {
    const router = useRouter();
    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        let creepTimer;
        let hideTimer;
        let startedAt = 0;

        const start = () => {
            clearTimeout(hideTimer);
            clearInterval(creepTimer);
            startedAt = performance.now();
            setVisible(true);
            setProgress(8);
            // sobe gradualmente até 80% enquanto carrega
            let current = 8;
            creepTimer = setInterval(() => {
                current = Math.min(80, current + (80 - current) * 0.15);
                setProgress(current);
            }, 200);
        };

        const done = () => {
            clearInterval(creepTimer);
            const elapsed = performance.now() - startedAt;
            const remainingMin = Math.max(0, MIN_SHOW_MS - elapsed);

            // pula pra 100% mas só esconde após cumprir tempo mínimo visível
            setProgress(100);
            hideTimer = setTimeout(() => {
                setVisible(false);
                // reset progress depois do fade-out terminar
                setTimeout(() => setProgress(0), FADE_OUT_MS);
            }, remainingMin + 150);
        };

        router.events.on('routeChangeStart', start);
        router.events.on('routeChangeComplete', done);
        router.events.on('routeChangeError', done);

        return () => {
            router.events.off('routeChangeStart', start);
            router.events.off('routeChangeComplete', done);
            router.events.off('routeChangeError', done);
            clearTimeout(hideTimer);
            clearInterval(creepTimer);
        };
    }, [router.events]);

    return (
        <div
            aria-hidden="true"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                pointerEvents: 'none',
                zIndex: 9999,
                opacity: visible ? 1 : 0,
                // fade-in rápido (sinal imediato), fade-out smooth
                transition: visible
                    ? 'opacity 80ms ease-out'
                    : `opacity ${FADE_OUT_MS}ms ease-out`,
            }}
        >
            <div
                style={{
                    height: '100%',
                    width: `${progress}%`,
                    background:
                        'linear-gradient(90deg, transparent 0%, var(--color-accent) 50%, var(--color-accent) 100%)',
                    boxShadow: '0 0 12px rgba(var(--accent-rgb), 0.7), 0 0 4px rgba(var(--accent-rgb), 0.9)',
                    transition: 'width 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                }}
            />
        </div>
    );
};

export default RouteProgressBar;
