'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

const NAV_ITEMS = [
  { label: 'Home', href: '/home' },
  { label: 'Sobre', href: '/sobre' },
  { label: 'Projetos', href: '/home#portfolio' },
  { label: 'GitHub', href: '/home#github' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contato', href: '/contato' },
];

const MenuOverlay = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const closeRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  const close = () => setIsOpen(false);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 text-white transition-colors duration-300 ${
          scrolled && !isOpen ? 'bg-black/45 backdrop-blur-md' : 'bg-gradient-to-b from-black/60 to-transparent'
        }`}
      >
        <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between px-5 sm:px-8 lg:px-12">
          <Link href="/home" legacyBehavior>
            <a className="mono-focus-ring text-xl font-bold tracking-[-0.04em] text-white sm:text-2xl">
              Juliano Pereira<span className="text-accent">.</span>
            </a>
          </Link>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="mono-focus-ring group flex min-h-11 items-center gap-4 text-sm font-semibold uppercase tracking-[0.14em]"
            aria-expanded={isOpen}
            aria-controls="experimental-menu"
          >
            Menu
            <span className="flex w-7 flex-col gap-1.5" aria-hidden="true">
              <span className="h-px w-full bg-current transition-transform duration-300 group-hover:translate-x-1" />
              <span className="h-px w-full bg-current" />
            </span>
          </button>
        </div>
      </header>

      <button
        type="button"
        aria-label="Fechar menu"
        onClick={close}
        className={`fixed inset-0 z-[55] bg-black/20 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        tabIndex={isOpen ? 0 : -1}
      />

      <aside
        id="experimental-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu de navegação"
        aria-hidden={!isOpen}
        inert={isOpen ? undefined : ''}
        className={`fixed inset-y-0 right-0 z-[60] flex w-full flex-col bg-[#111111] text-white transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:w-[min(52vw,44rem)] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-white/10 px-6 sm:px-10">
          <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-white/45">
            Navegação
          </span>
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            className="mono-focus-ring flex min-h-11 items-center gap-3 text-sm font-semibold uppercase tracking-[0.14em] text-white/75 transition-colors hover:text-white"
          >
            Fechar
            <span className="relative flex h-5 w-5 items-center justify-center" aria-hidden="true">
              <span className="absolute h-px w-5 rotate-45 bg-current" />
              <span className="absolute h-px w-5 -rotate-45 bg-current" />
            </span>
          </button>
        </div>

        <nav className="flex flex-1 items-center px-6 py-10 sm:px-10" aria-label="Navegação principal">
          <ul className="w-full">
            {NAV_ITEMS.map((item, index) => (
              <li key={item.label} className="border-b border-white/10 first:border-t">
                <Link href={item.href} legacyBehavior>
                  <a
                    onClick={close}
                    className="mono-focus-ring group flex items-center justify-between py-3 font-bold tracking-[-0.055em] text-[clamp(2.4rem,5vw,4.8rem)] leading-none transition-colors hover:text-accent sm:py-4"
                  >
                    <span>{item.label}</span>
                    <span className="font-mono text-[0.65rem] font-normal tracking-[0.12em] text-white/35 transition-colors group-hover:text-accent">
                      0{index + 1}
                    </span>
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="shrink-0 border-t border-white/10 px-6 py-6 sm:px-10">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-white/35">Contato</p>
              <a
                href="mailto:juliano340@gmail.com"
                className="mono-focus-ring mt-2 block text-sm text-white/70 transition-colors hover:text-white"
              >
                juliano340@gmail.com
              </a>
              <p className="mt-1 text-sm text-white/45">Porto Alegre, Brasil</p>
            </div>
            <div className="sm:text-right">
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-white/35">Social</p>
              <a
                href="https://github.com/juliano340"
                target="_blank"
                rel="noopener noreferrer"
                className="mono-focus-ring mt-2 block text-sm text-white/70 transition-colors hover:text-white"
              >
                GitHub ↗
              </a>
              <a
                href="https://www.linkedin.com/in/juliano340"
                target="_blank"
                rel="noopener noreferrer"
                className="mono-focus-ring mt-1 block text-sm text-white/70 transition-colors hover:text-white"
              >
                LinkedIn ↗
              </a>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default MenuOverlay;
