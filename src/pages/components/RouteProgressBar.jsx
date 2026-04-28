import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

/**
 * Top progress bar para feedback visual em transições de rota.
 * Sem dependência externa. Tema accent.
 *
 * Comportamento:
 * - sobe rápido até ~80% no routeChangeStart
 * - completa 100% e some no routeChangeComplete/error
 * - delay de 150ms antes de mostrar — evita flash em navegação instantânea
 */
const RouteProgressBar = () => {
    const router = useRouter();
    const [progress, setProgress] = useState(0);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        let showTimer;
        let creepTimer;
        let hideTimer;

        const start = () => {
            clearTimeout(hideTimer);
            // só mostra se a transição demorar mais de 150ms
            showTimer = setTimeout(() => {
                setVisible(true);
                setProgress(15);
                // sobe gradualmente até 80% enquanto carrega
                let current = 15;
                creepTimer = setInterval(() => {
                    current = Math.min(80, current + (80 - current) * 0.15);
                    setProgress(current);
                }, 200);
            }, 150);
        };

        const done = () => {
            clearTimeout(showTimer);
            clearInterval(creepTimer);
            setProgress(100);
            hideTimer = setTimeout(() => {
                setVisible(false);
                setProgress(0);
            }, 300);
        };

        router.events.on('routeChangeStart', start);
        router.events.on('routeChangeComplete', done);
        router.events.on('routeChangeError', done);

        return () => {
            router.events.off('routeChangeStart', start);
            router.events.off('routeChangeComplete', done);
            router.events.off('routeChangeError', done);
            clearTimeout(showTimer);
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
                transition: 'opacity 200ms ease-out',
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
