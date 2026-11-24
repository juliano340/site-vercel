import { getNowPlaying } from '@/lib/spotify';

// "Ouvindo agora" para o widget flutuante. Cache curto na CDN (30s) e
// stale-while-revalidate para o visitante nunca esperar a Spotify acordar.
// Qualquer falha responde 200 com track null: o widget some, sem barulho no
// console e sem quebrar a página.
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'method not allowed' });
  }

  res.setHeader('Cache-Control', 'public, s-maxage=30, stale-while-revalidate=60');

  try {
    const payload = await getNowPlaying();
    return res.status(200).json(payload);
  } catch {
    return res.status(200).json({ configured: true, track: null });
  }
}
