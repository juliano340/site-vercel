// Gera a imagem Open Graph do site (PNG 1200x630) em public/og/default.png.
// Roda em Node puro via ImageResponse do next/og — nenhuma dependência nova.
// Executado automaticamente pelo hook "prebuild" (ver package.json).
//
// Uma única imagem serve o site inteiro: todo og:image aponta para este PNG.
// Texts (title/description) variam por página via <SEO />, a imagem não.
import fs from 'node:fs';
import path from 'node:path';
import { ImageResponse } from 'next/og.js';
import { getOgElement, loadFonts } from '../src/lib/ogDesign.mjs';

const OUT_DIR = path.join(process.cwd(), 'public', 'og');
const FILE = path.join(OUT_DIR, 'default.png');

fs.mkdirSync(OUT_DIR, { recursive: true });

const response = new ImageResponse(getOgElement(), {
  width: 1200,
  height: 630,
  fonts: loadFonts(),
});
const png = Buffer.from(await response.arrayBuffer());

fs.writeFileSync(FILE, png);
console.log(`✓ ${FILE} (${Math.round(png.byteLength / 1024)} KB)`);
