import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function Menu() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [currentHash, setCurrentHash] = useState('');
    const router = useRouter();

    const toggle = () => setIsOpen(!isOpen);

    useEffect(() => {
        let rafId;
        const handleScroll = () => {
            const y = window.scrollY;
            setScrolled(y > 20);

            if (rafId) return;

            rafId = requestAnimationFrame(() => {
                const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
                const currentProgress = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
                setScrollProgress(Math.min(currentProgress, 100));
                rafId = null;
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.removeEventListener('scroll', handleScroll);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, []);

    // Close mobile menu on route change (any navigation)
    useEffect(() => {
        setIsOpen(false);
    }, [router.asPath]);

    useEffect(() => {
        const syncHash = () => setCurrentHash(window.location.hash || '');
        syncHash();
        window.addEventListener('hashchange', syncHash);
        return () => window.removeEventListener('hashchange', syncHash);
    }, [router.asPath]);

    const navItems = [
        { name: 'HOME', href: '/home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { name: 'SOBRE', href: '/home#about', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
        { name: 'PORTFÓLIO', href: '/home#portfolio', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
        { name: 'BLOG', href: '/blog', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
        { name: 'CONTATO', href: '/contato', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' }
    ];

    const isActive = (href) => {
        // Para a home sem hash
        if (href === '/home') {
            return router.pathname === '/home' && !currentHash;
        }
        // Para links de âncora (/home#about, /home#portfolio)
        if (href.includes('#')) {
            const [basePath, hash] = href.split('#');
            return router.pathname === basePath && currentHash === `#${hash}`;
        }
        // Para outras páginas (/blog, /contato)
        return router.pathname === href;
    };

    return (
        <>
            <nav
                className="fixed w-full top-0 left-0 z-50 transition-all duration-300"
                style={{
                    background: 'var(--color-background)',
                    borderBottom: scrolled ? '1px solid var(--color-border)' : '1px solid transparent',
                }}
            >
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Mobile Menu */}
                    <div className="sm:hidden py-4">
                        <div className="flex items-center justify-between">
                            {/* Logo */}
                            <Link href="/home" legacyBehavior>
                                <a
                                    className="mono-focus-ring"
                                    style={{
                                        fontFamily: "'Bebas Neue', sans-serif",
                                        color: 'var(--color-accent)',
                                        fontSize: '1.5rem',
                                        letterSpacing: '0.2em',
                                        textDecoration: 'none',
                                    }}
                                >
                                    @JULIANO340
                                </a>
                            </Link>

                            {/* Hamburger Button */}
                            <button
                                type="button"
                                onClick={toggle}
                                className="mono-focus-ring relative flex h-10 w-10 items-center justify-center transition-all duration-300"
                                style={{
                                    border: '1px solid var(--color-border)',
                                    background: 'var(--color-surface)',
                                    borderRadius: '4px',
                                    color: 'var(--color-muted)',
                                }}
                                aria-expanded={isOpen}
                                aria-label="Toggle menu"
                            >
                                <div className="w-5 h-4 flex flex-col justify-between">
                                    <span className={`h-0.5 w-full rounded-full bg-current transform transition-all duration-300 ${isOpen ? 'translate-y-1.5 rotate-45' : ''}`}></span>
                                    <span className={`h-0.5 w-full rounded-full bg-current transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
                                    <span className={`h-0.5 w-full rounded-full bg-current transform transition-all duration-300 ${isOpen ? '-translate-y-1.5 -rotate-45' : ''}`}></span>
                                </div>
                            </button>
                        </div>

                        {/* Mobile Dropdown Menu */}
                        <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 mt-4' : 'max-h-0'}`}>
                            <div
                                className="p-2"
                                style={{ background: 'var(--color-surface-alt)', border: '1px solid var(--color-border)', borderRadius: '4px' }}
                            >
                                <ul className="space-y-1">
                                    {navItems.map((item) => {
                                        const active = isActive(item.href);
                                        return (
                                            <li key={item.name}>
                                                <Link href={item.href} legacyBehavior>
                                                    <a
                                                        className="mono-focus-ring flex items-center gap-3 px-4 py-3 transition-colors duration-200"
                                                        style={{
                                                            borderRadius: '4px',
                                                            color: active ? 'var(--color-accent)' : 'var(--color-muted)',
                                                            background: active ? 'rgba(var(--accent-rgb), 0.08)' : 'transparent',
                                                            borderLeft: active ? '2px solid var(--color-accent)' : '2px solid transparent',
                                                            fontSize: '0.7rem',
                                                            fontWeight: 700,
                                                            textTransform: 'uppercase',
                                                            letterSpacing: '0.15em',
                                                        }}
                                                    >
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                                        </svg>
                                                        <span>{item.name}</span>
                                                    </a>
                                                </Link>
                                            </li>
                                        );
                                    })}
                                </ul>
                                <div className="mt-3 pt-3" style={{ borderTop: '1px solid var(--color-border)' }}>
                                    <ThemeToggle />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden sm:flex items-center justify-between py-4">
                        {/* Logo */}
                        <Link href="/home" legacyBehavior>
                            <a
                                className="mono-focus-ring"
                                style={{
                                    fontFamily: "'Bebas Neue', sans-serif",
                                    color: 'var(--color-accent)',
                                    fontSize: '1.5rem',
                                    letterSpacing: '0.2em',
                                    textDecoration: 'none',
                                }}
                            >
                                @JULIANO340
                            </a>
                        </Link>

                        {/* Navigation Links */}
                        <ul className="flex items-center gap-1">
                            {navItems.map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} legacyBehavior>
                                        <a
                                            className="mono-focus-ring relative px-4 py-2 transition-all duration-300 flex items-center gap-2"
                                            style={{
                                                fontSize: '0.7rem',
                                                fontWeight: 700,
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.15em',
                                                color: isActive(item.href) ? 'var(--color-accent)' : 'var(--color-muted-dim)',
                                                borderBottom: isActive(item.href) ? '2px solid var(--color-accent)' : '2px solid transparent',
                                                textDecoration: 'none',
                                            }}
                                            onMouseEnter={(e) => {
                                                if (!isActive(item.href)) {
                                                    e.currentTarget.style.color = 'var(--color-text)';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (!isActive(item.href)) {
                                                    e.currentTarget.style.color = 'var(--color-muted-dim)';
                                                }
                                            }}
                                        >
                                            <span>{item.name}</span>
                                        </a>
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* Theme Toggle + CTA Button */}
                        <div className="flex items-center gap-3">
                            <ThemeToggle />
                            <Link href="/contato" legacyBehavior>
                                <a className="mono-focus-ring mono-button-primary flex items-center gap-2">
                                    <span>Fale Comigo</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </a>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Progress Bar (scroll indicator) */}
                <div className="absolute bottom-0 left-0 h-0.5 w-full" style={{ background: 'var(--color-border)' }}>
                    <div
                        className="h-full transition-all duration-300"
                        style={{ width: `${scrollProgress}%`, background: 'var(--color-accent)' }}
                    ></div>
                </div>
            </nav>

            {/* Spacer */}
            <div className="h-16 sm:h-20"></div>
        </>
    );
}   
