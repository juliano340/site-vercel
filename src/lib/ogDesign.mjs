// Design das imagens Open Graph — espelha os tokens do design system
// (src/styles/globals.css: superfícies ink, verde accent, Poppins + mono).
// Usa React.createElement (sem JSX) para rodar tanto no script de build
// (Node puro) quanto dentro do bundle da API route.
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
const FRAME_MARGIN = 24;
const PADDING_X = 84;
const PADDING_TOP = 88;
const PADDING_BOTTOM = 64;

const poppins = (extra = {}) => ({ fontFamily: 'Brand', color: WHITE, ...extra });

const TERMINALS = {
  home: '~/juliano340 deploy --role=full-stack --since=2006',
  sobre: '~/juliano340 curriculo --formato=web',
  blog: '~/juliano340 blog --sort=recentes',
};

// Títulos podem quebrar em até 3 linhas — corta com reticências se estourar.
export const MAX_TITLE_CHARS = 78;
const clipTitle = (raw = '') => {
  const text = String(raw).replace(/\s+/g, ' ').trim();
  return text.length > MAX_TITLE_CHARS ? `${text.slice(0, MAX_TITLE_CHARS - 1).trimEnd()}…` : text;
};

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

const CONTENT = {
  home: {
    kicker: 'Porto Alegre · Brasil',
    headline: ['Desenvolvedor', 'Full Stack'],
    headlineSize: 104,
  },
  sobre: {
    kicker: 'Currículo',
    headline: ['Sobre mim'],
    headlineSize: 104,
    subtitle: 'Experiência profissional, stack e formação',
  },
  blog: {
    kicker: 'Blog Editorial',
    headline: ['Tecnologia, empreendedorismo', 'e IA aplicada'],
    headlineSize: 64,
    subtitle: 'Insights práticos, tendências e análises',
  },
};

export const getOgElement = ({
  variant = 'home',
  title = '',
  tag = '',
  date = '',
} = {}) => {
  const isArticle = variant === 'article';

  const kicker =
    isArticle
      ? `Blog${tag ? ` · ${tag}` : ''}${date ? ` · ${date}` : ''}`
      : CONTENT[variant]?.kicker || 'Porto Alegre · Brasil';

  const headlineLines = isArticle
    ? [clipTitle(title)]
    : CONTENT[variant]?.headline || ['Desenvolvedor', 'Full Stack'];

  const headlineSize = isArticle
    ? (clipTitle(title).length > 58 ? 64 : clipTitle(title).length > 28 ? 74 : 88)
    : CONTENT[variant]?.headlineSize || 104;

  const subtitle =
    isArticle
      ? null
      : CONTENT[variant]?.subtitle || null;

  const terminalLabel = isArticle
    ? 'artigo --autor=juliano340'
    : TERMINALS[variant] || TERMINALS.home;

  return h('div', {
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
      h(Kicker, null, kicker),

      h('div', {
        style: poppins({
          fontWeight: 700,
          fontSize: headlineSize,
          lineHeight: 1.08,
          letterSpacing: -2,
          display: 'flex',
          flexDirection: 'column',
        }),
      },
        headlineLines.map((line) => h('div', { key: line, style: { display: 'flex' } }, line))
      ),

      subtitle &&
        h('div', {
          style: poppins({ fontWeight: 400, fontSize: 34, color: GREY, lineHeight: 1.4 }),
        }, subtitle),

      h(Terminal, { label: terminalLabel })
    ),

    // ── Rodapé ──
    h(Footer)
  );
};
