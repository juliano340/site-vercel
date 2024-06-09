import React, { useState, useEffect } from 'react';

export default function Menu() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            <div className={`fixed w-full top-0 left-0 font-semibold z-50 transition-all ${scrolled ? 'bg-slate-300/70 backdrop-blur-md shadow-md' : 'bg-slate-300'}`}>
                <div className="sm:hidden p-4">
                    <div className="flex items-center justify-between">
                        <a href="/" className="text-xl font-bold">
                            @JULIANO340
                        </a>
                        <button
                            onClick={toggle}
                            className="text-2xl rounded-md p-2 bg-gray-200 hover:bg-gray-300 transition"
                            aria-expanded={isOpen}
                            aria-label="Toggle menu"
                        >
                            {isOpen ? (
                                <i className="fa-solid fa-xmark" aria-hidden="true"></i>
                            ) : (
                                <i className="fa-solid fa-bars" aria-hidden="true"></i>
                            )}
                        </button>
                    </div>

                    {isOpen && (
                        <div className="absolute top-16 right-5 bg-white p-4 rounded shadow-lg z-50 w-[150px]">
                            <ul className="space-y-2 text-gray-700">
                                <li><a href="/" className="block hover:underline">HOME</a></li>
                                <li><a href="/#about" className="block hover:underline">SOBRE</a></li>
                                <li><a href="/blog" className="block hover:underline">BLOG</a></li>
                                <li><a href="/contato" className="block hover:underline">CONTATO</a></li>
                            </ul>
                        </div>
                    )}
                </div>

                <div className="hidden sm:flex items-center justify-between p-6">
                    <a href="/" className="text-xl font-bold">
                        @JULIANO340
                    </a>
                    <ul className="flex space-x-4 text-gray-700">
                        <li><a href="/" className="hover:underline">HOME</a></li>
                        <li><a href="/#about" className="hover:underline">SOBRE</a></li>
                        <li><a href="/blog" className="hover:underline">BLOG</a></li>
                        <li><a href="/contato" className="hover:underline">CONTATO</a></li>
                    </ul>
                </div>
            </div>

            <div className="mt-16"></div> {/* Ajuste a margem superior conforme necessário */}
        </>
    );
}
