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
            <nav className={`fixed w-full top-0 left-0 z-50 transition-all duration-300 ${scrolled
                ? 'border-b border-subtle bg-background shadow-soft backdrop-blur-xl'
                : 'border-b border-transparent bg-background shadow-sm backdrop-blur-md'
                }`}>
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    {/* Mobile Menu */}
                    <div className="sm:hidden py-4">
                        <div className="flex items-center justify-between">
                            {/* Logo */}
                            <Link href="/home" legacyBehavior>
                                <a className="mono-focus-ring text-xl font-bold tracking-[0.18em] text-primary transition-opacity duration-300 hover:opacity-70">
                                    @JULIANO340
                                </a>
                            </Link>

                            {/* Hamburger Button */}
                            <button
                                type="button"
                                onClick={toggle}
                                className="mono-focus-ring relative flex h-10 w-10 items-center justify-center rounded-xl border border-subtle bg-background text-primary transition-all duration-300 hover:bg-surface"
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
                            <div className="mono-frame p-2">
                                <ul className="space-y-1">
                                    {navItems.map((item) => (
                                        <li key={item.name}>
                                            <Link href={item.href} legacyBehavior>
                                                <a className={`mono-focus-ring flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive(item.href)
                                                    ? 'bg-primary text-background shadow-soft'
                                                    : 'text-primary hover:bg-surface'
                                                    }`}>
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                                    </svg>
                                                    <span className="font-medium">{item.name}</span>
                                                </a>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                                <div className="mt-3 border-t border-subtle pt-3">
                                    <ThemeToggle />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden sm:flex items-center justify-between py-4">
                        {/* Logo */}
                            <Link href="/home" legacyBehavior>
                                <a className="mono-focus-ring group text-2xl font-bold flex items-center gap-2">
                                    <span className="tracking-[0.2em] text-primary transition-opacity duration-300 group-hover:opacity-70">
                                        @JULIANO340
                                    </span>
                                </a>
                            </Link>

                        {/* Navigation Links */}
                        <ul className="flex items-center gap-2">
                            {navItems.map((item) => (
                                <li key={item.name}>
                                    <Link href={item.href} legacyBehavior>
                                        <a className={`mono-focus-ring group relative px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${isActive(item.href)
                                            ? 'text-background'
                                            : 'text-primary hover:text-primary'
                                            }`}>
                                            {/* Active Background */}
                                            {isActive(item.href) && (
                                                <span className="absolute inset-0 rounded-lg bg-primary shadow-soft"></span>
                                            )}

                                            {/* Hover Background */}
                                            {!isActive(item.href) && (
                                                <span className="absolute inset-0 rounded-lg bg-surface opacity-0 transition-opacity duration-300 group-hover:opacity-100"></span>
                                            )}

                                            {/* Icon - Desktop only on hover */}
                                            <svg className={`w-4 h-4 relative z-10 transition-all duration-300 ${isActive(item.href)
                                                ? 'opacity-100'
                                                : 'opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0'
                                                }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                            </svg>

                                            <span className="relative z-10">{item.name}</span>

                                            {/* Active Indicator */}
                                            {isActive(item.href) && (
                                                <span className="absolute bottom-1 left-4 right-4 h-px bg-subtle"></span>
                                            )}
                                        </a>
                                    </Link>
                                </li>
                            ))}
                        </ul>

                        {/* Theme Toggle + CTA Button */}
                        <div className="flex items-center gap-3">
                            <ThemeToggle />
                            <Link href="/contato" legacyBehavior>
                                <a className="mono-focus-ring mono-button-primary px-6 py-2.5 flex items-center gap-2">
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
                <div className="absolute bottom-0 left-0 h-0.5 w-full bg-surface">
                    <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${scrollProgress}%` }}
                    ></div>
                </div>
            </nav>

            {/* Spacer */}
            <div className="h-16 sm:h-20"></div>
        </>
    );
}   
