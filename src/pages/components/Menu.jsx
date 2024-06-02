import React, { useState } from 'react';

export default function Menu() {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    return (
        <>
            <div className='sm:hidden p-2 bg-slate-300 font-semibold'>
                <div className='flex items-center justify-between'>
                    <a href="/">
                        <h1>@JULIANO340</h1>
                    </a>
                    <button onClick={toggle} className="text-2xl rounded-md p-0">
                        {isOpen ? (
                            <i className="fa-solid fa-xmark p-1 fa-border border-gray-400"></i>
                        ) : (
                            <i className="fa-solid fa-bars p-1 fa-border border-gray-400"></i>
                        )}
                    </button>
                </div>

                {isOpen && (
                    <div className="absolute top-15 right-5 bg-white p-4 rounded shadow-lg z-50 w-[150px]">

                        <ul className="space-y-2">
                            <li><a href="/" className="hover:underline">HOME</a></li>
                            <li><a href="/sobre" className="hover:underline">SOBRE</a></li>
                            <li><a href="/blog" className="hover:underline">Blog</a></li>
                            <li><a href="/contato" className="hover:underline">Contato</a></li>
                        </ul>
                    </div>
                )}
            </div>

            <div className='hidden sm:flex items-center justify-between bg-slate-300 font-semibold p-4'>
                <a href="/">
                    <h1>@JULIANO340</h1>
                </a>
                <ul className="flex justify-end space-x-4">
                    <li><a href="/" className="hover:underline">HOME</a></li>
                    <li><a href="/sobre" className="hover:underline">SOBRE</a></li>
                    <li><a href="/blog" className="hover:underline">BLOG</a></li>
                    <li><a href="/contato" className="hover:underline">CONTATO</a></li>
                </ul>
            </div>
        </>
    );
}
