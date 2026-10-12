import fs from 'node:fs';
import path from 'node:path';
import { ImageResponse } from 'next/og';
import { getOgElement, loadFonts, MAX_TITLE_CHARS } from '@/lib/ogDesign.mjs';

// Imagem OG dinâmica para artigos: /api/og?title=...&tag=...&date=...
// Mesmo design das imagens estáticas (src/lib/ogDesign.mjs), com cache longo:
// crawlers e CDN servem sem re-render; output é determinístico por query.

const FALLBACK_PNG = path.join(process.cwd(), 'public', 'og', 'default.png');

const fromDate = (raw) => {
  if (!raw) return '';
  // 'yyyy-mm-dd' puro parseia como UTC meia-noite e volta um dia no fuso -3.
  // Meio-dia local neutraliza o offset para qualquer timezone.
  const iso = /^\d{4}-\d{2}-\d{2}$/.test(raw) && !raw.includes('T') && !raw.includes('Z');
  const d = new Date(iso ? `${raw}T12:00:00` : raw);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('pt-BR');
};

const sanitize = (value, max) =>
  String(value || '')
    // remove caracteres de controle/bidi que satori não renderiza
    .replace(/[\u0000-\u001F\u007F\u200B-\u200F\u2028-\u202F\uFEFF]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);

export default async function handler(req, res) {
  try {
    const title = sanitize(req.query.title, MAX_TITLE_CHARS) || 'Artigo';
    const tag = sanitize(req.query.tag, 40);
    const date = fromDate(sanitize(req.query.date, 32));

    const element = getOgElement({ variant: 'article', title, tag, date });
    const response = new ImageResponse(element, {
      width: 1200,
      height: 630,
      fonts: loadFonts(),
    });

    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, immutable');
    res.end(Buffer.from(await response.arrayBuffer()));
  } catch (error) {
    // Qualquer problema (título com glifo inexistente etc.) devolve a
    // imagem padrão — o crawler nunca fica sem preview.
    console.error('api/og:', error);
    try {
      res.setHeader('Content-Type', 'image/png');
      res.setHeader('Cache-Control', 'public, max-age=3600');
      res.end(fs.readFileSync(FALLBACK_PNG));
    } catch (_) {
      res.status(302).setHeader('Location', '/og/default.png');
      res.end();
    }
  }
}
