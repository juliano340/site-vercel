// Playlist exibida no card "Trilha sonora" do rodapé.
//
// Preencha SPOTIFY_PLAYLIST_ID com o ID da sua playlist (o trecho depois de
// open.spotify.com/playlist/) ou defina NEXT_PUBLIC_SPOTIFY_PLAYLIST_ID no
// ambiente. Sem ID, o card simplesmente não aparece.
export const SPOTIFY_PLAYLIST_ID = process.env.NEXT_PUBLIC_SPOTIFY_PLAYLIST_ID || '';

export const SPOTIFY_PLAYLIST_NAME = process.env.NEXT_PUBLIC_SPOTIFY_PLAYLIST_NAME || 'O que toca enquanto eu construo';

export const SPOTIFY_PLAYLIST_URL = SPOTIFY_PLAYLIST_ID
  ? `https://open.spotify.com/playlist/${SPOTIFY_PLAYLIST_ID}`
  : '';

export const SPOTIFY_EMBED_URL = SPOTIFY_PLAYLIST_ID
  ? `https://open.spotify.com/embed/playlist/${SPOTIFY_PLAYLIST_ID}?utm_source=generator&theme=0`
  : '';
