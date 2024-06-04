import React, { useState } from 'react';

export default function Menu() {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    return (
        <>
            <div className="sm:hidden p-4 bg-slate-300 font-semibold">
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
                            <li><a href="#about" className="block hover:underline">SOBRE</a></li>
                            <li><a href="/blog" className="block hover:underline">BLOG</a></li>
                            <li><a href="/contato" className="block hover:underline">CONTATO</a></li>
                        </ul>
                    </div>
                )}
            </div>

            <div className="hidden sm:flex items-center justify-between bg-slate-300 font-semibold p-4">
                <a href="/" className="text-xl font-bold">
                    @JULIANO340
                </a>
                <ul className="flex space-x-4 text-gray-700">
                    <li><a href="/" className="hover:underline">HOME</a></li>
                    <li><a href="#about" className="hover:underline">SOBRE</a></li>
                    <li><a href="/blog" className="hover:underline">BLOG</a></li>
                    <li><a href="#" className="hover:underline">CONTATO</a></li>
                </ul>
            </div>
        </>
    );
}
