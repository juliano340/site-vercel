// Integração com a Spotify Web API — usada só no servidor (API route).
//
// Variáveis de ambiente necessárias:
//   SPOTIFY_CLIENT_ID
//   SPOTIFY_CLIENT_SECRET
//   SPOTIFY_REFRESH_TOKEN   (gerado uma vez por `node scripts/spotify-auth.mjs`)
//
// Sem elas o site continua funcionando: a rota responde `configured: false` e
// os componentes escondem o que depende dela.

const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const NOW_PLAYING_ENDPOINT = 'https://api.spotify.com/v1/me/player/currently-playing';

// O access token vale ~1h. Guardamos em memória do processo para não pedir um
// novo a cada request (a rota é chamada a cada 60s por visitante).
let cachedToken = { value: null, expiresAt: 0 };

export const isSpotifyConfigured = () => Boolean(
  process.env.SPOTIFY_CLIENT_ID
  && process.env.SPOTIFY_CLIENT_SECRET
  && process.env.SPOTIFY_REFRESH_TOKEN,
);

const basicAuth = () => Buffer
  .from(`${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`)
  .toString('base64');

const getAccessToken = async () => {
  if (cachedToken.value && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.value;
  }

  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basicAuth()}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: process.env.SPOTIFY_REFRESH_TOKEN,
    }),
    cache: 'no-store',
  });

  if (!response.ok) throw new Error(`spotify token ${response.status}`);

  const data = await response.json();
  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000,
  };

  // A Spotify pode devolver um refresh token novo (rotação). Se isso acontecer,
  // a env precisa ser atualizada — senão o widget para quando o antigo expira.
  if (data.refresh_token && data.refresh_token !== process.env.SPOTIFY_REFRESH_TOKEN) {
    console.warn('[spotify] refresh token rotacionado: atualize SPOTIFY_REFRESH_TOKEN.');
  }

  return cachedToken.value;
};

// Podcasts usam show/name em vez de artists/album; normalizamos os dois.
const normalizeTrack = (item, playback) => {
  const isEpisode = item.type === 'episode';
  const images = (isEpisode ? item.show?.images : item.album?.images) ?? [];
  const cover = images[1]?.url || images[0]?.url || '';

  return {
    id: item.id,
    title: item.name,
    artist: isEpisode
      ? (item.show?.name ?? 'Podcast')
      : (item.artists ?? []).map(({ name }) => name).join(', '),
    album: isEpisode ? (item.show?.publisher ?? '') : (item.album?.name ?? ''),
    cover,
    url: isEpisode
      ? (item.external_urls?.spotify ?? '')
      : (item.external_urls?.spotify ?? ''),
    isPlaying: Boolean(playback.is_playing),
    progressMs: playback.progress_ms ?? 0,
    durationMs: item.duration_ms ?? 0,
  };
};

export const getNowPlaying = async () => {
  if (!isSpotifyConfigured()) return { configured: false, track: null };

  const token = await getAccessToken();
  const response = await fetch(NOW_PLAYING_ENDPOINT, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  // 204 = nada tocando agora (ou conta parada). Não é erro.
  if (response.status === 204) return { configured: true, track: null };
  if (!response.ok) throw new Error(`spotify now-playing ${response.status}`);

  const data = await response.json();
  if (!data?.item) return { configured: true, track: null };

  return { configured: true, track: normalizeTrack(data.item, data) };
};
