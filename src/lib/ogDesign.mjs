// Design da imagem Open Graph do site — espelha os tokens do design system
// (src/styles/globals.css: superfícies ink, verde accent, Poppins + mono).
// Usa React.createElement (sem JSX) para rodar no script de build (Node puro).
//
// Uma única imagem serve todas as páginas do site (public/og/default.png),
// então o conteúdo é fixo: não há variantes nem título dinâmico.
import fs from 'node:fs';
import path from 'node:path';
import { createElement as h } from 'react';

const FONT_DIR = path.join(process.cwd(), 'src', 'assets', 'fonts');

const fontCache = new Map();

const loadFont = (file) => {
  if (!fontCache.has(file)) {
    const buf = fs.readFileSync(path.join(FONT_DIR, file));
    fontCache.set(file, buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
  }
  return fontCache.get(file);
};

export const loadFonts = () => [
  { name: 'Brand', weight: 700, data: loadFont('Poppins-Bold.ttf') },
  { name: 'Brand', weight: 600, data: loadFont('Poppins-SemiBold.ttf') },
  { name: 'Brand', weight: 400, data: loadFont('Poppins-Regular.ttf') },
  { name: 'Mono', weight: 400, data: loadFont('JetBrainsMono-Regular.ttf') },
];

// Tokens (equivalentes às primitivas do globals.css)
const BG = '#121212';
const ACCENT = '#1ed760';
const BORDER = '#292929';
const WHITE = '#ffffff';
const GREY = '#b3b3b3';
const DIM = '#7c7c7c';

const WIDTH = 1200;
const HEIGHT = 630;
const PADDING_X = 84;
const PADDING_TOP = 88;
const PADDING_BOTTOM = 64;

const poppins = (extra = {}) => ({ fontFamily: 'Brand', color: WHITE, ...extra });

const Kicker = ({ children }) =>
  h('div', {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      fontFamily: 'Mono',
      fontSize: 22,
      letterSpacing: 4,
      color: DIM,
      textTransform: 'uppercase',
    },
  },
    h('div', { style: { display: 'flex', width: 10, height: 10, borderRadius: 999, background: ACCENT } }),
    children
  );

const Terminal = ({ label }) =>
  h('div', {
    style: {
      display: 'flex',
      fontFamily: 'Mono',
      fontSize: 24,
      color: DIM,
    },
  },
    h('span', { style: { color: ACCENT, marginRight: 12 } }, '$'),
    h('span', null, label)
  );

const Footer = () =>
  h('div', {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
    },
  },
    h('div', { style: poppins({ display: 'flex', fontWeight: 600, fontSize: 42, letterSpacing: -0.5 }) },
      'Juliano Pereira',
      h('span', { style: { color: ACCENT } }, '.')
    ),
    h('div', { style: { fontFamily: 'Mono', fontSize: 22, color: GREY, letterSpacing: 2 } }, 'juliano340.com')
  );

export const getOgElement = () =>
  h('div', {
    style: {
      width: WIDTH,
      height: HEIGHT,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: `${PADDING_TOP}px ${PADDING_X}px ${PADDING_BOTTOM}px`,
      background: BG,
      position: 'relative',
    },
  },
    // Glow da marca — mesmo radial verde sutil do hero
    h('div', {
      style: {
        position: 'absolute',
        top: -220,
        right: -140,
        width: 900,
        height: 560,
        borderRadius: 999,
        background: 'radial-gradient(closest-side, rgba(30, 215, 96, 0.16), rgba(30, 215, 96, 0))',
      },
    }),
    // Moldura fina da identidade (radius-md do DS)
    h('div', {
      style: {
        position: 'absolute',
        top: 28,
        left: 28,
        right: 28,
        bottom: 28,
        border: `1px solid ${BORDER}`,
        borderRadius: 18,
      },
    }),

    // ── Bloco superior ──
    h('div', {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 34,
      },
    },
      h(Kicker, null, 'Porto Alegre · Brasil'),

      h('div', {
        style: poppins({
          fontWeight: 700,
          fontSize: 104,
          lineHeight: 1.08,
          letterSpacing: -2,
          display: 'flex',
          flexDirection: 'column',
        }),
      },
        ['Desenvolvedor', 'Full Stack'].map((line) => h('div', { key: line, style: { display: 'flex' } }, line))
      ),

      h(Terminal, { label: '~/juliano340 deploy --role=full-stack --since=2006' })
    ),

    // ── Rodapé ──
    h(Footer)
  );
