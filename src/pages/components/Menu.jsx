import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Menu() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const router = useRouter();

    const toggle = () => setIsOpen(!isOpen);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);

            // Calculate scroll progress
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const currentProgress = scrollHeight > 0 ? (window.scrollY / scrollHeight) * 100 : 0;
            setScrollProgress(Math.min(currentProgress, 100));
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Close mobile menu on route change
    useEffect(() => {
        setIsOpen(false);
    }, [router.pathname]);

    const navItems = [
        { name: 'HOME', href: '/', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { name: 'SOBRE', href: '/#about', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
        { name: 'PORTFÓLIO', href: '/#portfolio', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
        { name: 'BLOG', href: '/blog', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
        { name: 'CONTATO', href: '/contato', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' }
    ];

    const isActive = (href) => {
        if (href === '/') {
            return router.pathname === '/';
        }
        if (href.startsWith('/#')) {
            return router.pathname === '/' && router.asPath.includes(href);
        }
        return router.pathname === href;
    };

    return (
        <>
            <nav className={`fixed w-full top-0 left-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-200/50'
                : 'bg-white/95 backdrop-blur-md shadow-sm'
                }`}>
                <div className="container mx-auto px-4">
                    {/* Mobile Menu */}
                    <div className="sm:hidden py-4">
                        <div className="flex items-center justify-between">
                            {/* Logo */}
                            <a
                                href="/"
                                className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
                            >
                                @JULIANO340
                            </a>

                            {/* Hamburger Button */}
                            <button
                                onClick={toggle}
                                className="relative w-10 h-10 flex items-center justify-center rounded-lg bg-gradient-to-br from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100 transition-all duration-300 border border-blue-200/50"
                                aria-expanded={isOpen}
                                aria-label="Toggle menu"
                            >
                                <div className="w-5 h-4 flex flex-col justify-between">
                                    <span className={`w-full h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transform transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                                    <span className={`w-full h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
                                    <span className={`w-full h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transform transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
                                </div>
                            </button>
                        </div>

                        {/* Mobile Dropdown Menu */}
                        <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-96 mt-4' : 'max-h-0'}`}>
                            <div className="bg-gradient-to-br from-blue-50/50 to-purple-50/50 backdrop-blur-xl rounded-2xl border border-blue-200/50 shadow-xl p-2">
                                <ul className="space-y-1">
                                    {navItems.map((item) => (
                                        <li key={item.name}>
                                            <a
                                                href={item.href}
                                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${isActive(item.href)
                                                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                                                    : 'text-gray-700 hover:bg-white/80 hover:text-blue-600'
                                                    }`}
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                                </svg>
                                                <span className="font-medium">{item.name}</span>
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden sm:flex items-center justify-between py-4">
                        {/* Logo */}
                        <a
                            href="/"
                            className="group text-2xl font-bold flex items-center gap-2"
                        >
                            {/* <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300 group-hover:scale-110">
                                J
                            </div> */}
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-blue-700 group-hover:to-purple-700 transition-all duration-300">
                                @JULIANO340
                            </span>
                        </a>

                        {/* Navigation Links */}
                        <ul className="flex items-center gap-2">
                            {navItems.map((item) => (
                                <li key={item.name}>
                                    <a
                                        href={item.href}
                                        className={`group relative px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${isActive(item.href)
                                            ? 'text-white'
                                            : 'text-gray-700 hover:text-blue-600'
                                            }`}
                                    >
                                        {/* Active Background */}
                                        {isActive(item.href) && (
                                            <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-lg"></span>
                                        )}

                                        {/* Hover Background */}
                                        {!isActive(item.href) && (
                                            <span className="absolute inset-0 bg-blue-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                                        )}

                                        {/* Icon - Desktop only on hover */}
                                        <svg className={`w-4 h-4 relative z-10 transition-all duration-300 ${isActive(item.href)
                                            ? 'opacity-100'
                                            : 'opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0'
                                            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                        </svg>

                                        <span className="relative z-10">{item.name}</span>

                                        {/* Active Indicator Dot */}
                                        {isActive(item.href) && (
                                            <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"></span>
                                        )}
                                    </a>
                                </li>
                            ))}
                        </ul>

                        {/* CTA Button */}
                        <a
                            href="/contato"
                            className="px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2"
                        >
                            <span>Fale Comigo</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </a>
                    </div>
                </div>

                {/* Progress Bar (scroll indicator) */}
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-200/50">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300"
                        style={{ width: `${scrollProgress}%` }}
                    ></div>
                </div>
            </nav>

            {/* Spacer */}
            <div className="h-16 sm:h-20"></div>
        </>
    );
}   