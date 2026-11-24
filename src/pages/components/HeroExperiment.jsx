'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import SmartImage from '@/pages/components/SmartImage';
import MenuOverlay from '@/pages/components/MenuOverlay';

const POSTER = '/video/hero/hero-poster-v1.webp';
const VIDEO = '/video/hero/hero-once-v2.mp4';

const HeroExperiment = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => {
      const video = videoRef.current;
      if (!video) return;
      if (media.matches) video.pause();
      else video.play().catch(() => {});
    };

    sync();
    media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);

  return (
    <>
      <MenuOverlay />

      <section className="relative h-[100svh] min-h-[620px] overflow-hidden bg-[#0b0b0b] text-white">
        <SmartImage
          src={POSTER}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={POSTER}
          aria-hidden="true"
        >
          <source src={VIDEO} type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/10 to-black/80" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#0b0b0b] to-transparent" />

        <div className="relative z-10 flex h-full flex-col justify-end px-5 pb-[29svh] pt-28 sm:px-8 lg:px-12">
          <div className="mx-auto w-full max-w-[1600px]">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-white/65">
              Porto Alegre · Full Stack & QA
            </p>
            <h1 className="mt-5 max-w-6xl text-[clamp(3rem,9vw,9.5rem)] font-bold leading-[0.88] tracking-[-0.07em]">
              Código que<br />
              vira produto<br />
              <span className="text-accent">e experiência.</span>
            </h1>

            <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-4">
              <a
                href="#portfolio"
                className="mono-focus-ring inline-flex min-h-12 items-center gap-3 rounded-full border border-white/35 px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:bg-white hover:text-black"
              >
                Ver projetos <span aria-hidden="true">↘</span>
              </a>
              <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-white/50">
                Role para explorar ↓
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="relative z-10 -mt-[22svh] bg-[#0b0b0b] px-5 pb-24 pt-24 text-white sm:px-8 sm:pb-32 sm:pt-32 lg:px-12 lg:pt-40">
        <section className="mx-auto max-w-5xl text-center">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-accent">
            Do primeiro chamado ao deploy
          </p>
          <h2 className="mt-6 text-[clamp(2.8rem,7vw,7rem)] font-bold leading-[0.9] tracking-[-0.065em]">
            Quase 20 anos entre suporte,<br />
            <span className="text-white/40">QA e desenvolvimento.</span>
          </h2>
          <p className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-white/60 sm:text-lg">
            Uma trajetória que conecta o que o usuário sente, o que o sistema precisa entregar e o que o
            código exige para continuar saudável.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link href="/sobre" legacyBehavior>
              <a className="mono-focus-ring inline-flex min-h-12 items-center gap-3 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-transform duration-300 hover:-translate-y-0.5">
                Conhecer trajetória <span aria-hidden="true">↗</span>
              </a>
            </Link>
            <Link href="/contato" legacyBehavior>
              <a className="mono-focus-ring inline-flex min-h-12 items-center gap-3 rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white transition-colors duration-300 hover:border-white hover:bg-white hover:text-black">
                Fale comigo <span aria-hidden="true">↗</span>
              </a>
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export default HeroExperiment;
