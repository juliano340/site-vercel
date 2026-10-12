// Gera as imagens Open Graph estáticas (PNG 1200x630) em public/og/.
// Roda em Node puro via ImageResponse do next/og — nenhuma dependência nova.
// Executado automaticamente pelo hook "prebuild" (ver package.json).
import fs from 'node:fs';
import path from 'node:path';
import { ImageResponse } from 'next/og.js';
import { getOgElement, loadFonts } from '../src/lib/ogDesign.mjs';

const OUT_DIR = path.join(process.cwd(), 'public', 'og');

const VARIANTS = [
  { name: 'default', variant: 'home' },
  { name: 'sobre', variant: 'sobre' },
  { name: 'blog', variant: 'blog' },
];

fs.mkdirSync(OUT_DIR, { recursive: true });

for (const { name, variant } of VARIANTS) {
  const jsx = getOgElement({ variant });
  const response = new ImageResponse(jsx, {
    width: 1200,
    height: 630,
    fonts: loadFonts(),
  });
  const png = await response.arrayBuffer();

  const file = path.join(OUT_DIR, `${name}.png`);
  fs.writeFileSync(file, Buffer.from(png));
  console.log(`✓ ${file} (${Math.round(png.byteLength / 1024)} KB)`);
}
