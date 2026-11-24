#!/usr/bin/env node
// Gera o SPOTIFY_REFRESH_TOKEN usado por /api/spotify/now-playing — uma vez só.
//
// Passo a passo:
//   1. Crie um app em https://developer.spotify.com/dashboard
//   2. No app, em "Redirect URIs", adicione exatamente:
//        http://127.0.0.1:8888/callback
//   3. Coloque SPOTIFY_CLIENT_ID e SPOTIFY_CLIENT_SECRET no .env.local
//   4. Rode: node scripts/spotify-auth.mjs
//   5. Abra a URL impressa, autorize com a sua conta e copie o refresh token
//      para o .env.local como SPOTIFY_REFRESH_TOKEN
//
// Escopos pedidos: ler o que está tocando agora. Nada de escrever na conta.

import { createServer } from 'node:http';
import { randomBytes } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PORT = 8888;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/callback`;
const SCOPES = ['user-read-currently-playing', 'user-read-playback-state'];
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// Lê .env.local sem dependência: só pares KEY=VALUE simples.
const readEnvLocal = () => {
  try {
    const raw = readFileSync(join(ROOT, '.env.local'), 'utf8');
    return Object.fromEntries(
      raw
        .split(/\r?\n/)
        .filter((line) => line && !line.startsWith('#') && line.includes('='))
        .map((line) => {
          const index = line.indexOf('=');
          return [line.slice(0, index).trim(), line.slice(index + 1).trim()];
        }),
    );
  } catch {
    return {};
  }
};

const env = { ...readEnvLocal(), ...process.env };
const clientId = env.SPOTIFY_CLIENT_ID;
const clientSecret = env.SPOTIFY_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error('Faltando SPOTIFY_CLIENT_ID e/ou SPOTIFY_CLIENT_SECRET no .env.local');
  process.exit(1);
}

const state = randomBytes(12).toString('hex');
const authorizeUrl = `https://accounts.spotify.com/authorize?${new URLSearchParams({
  client_id: clientId,
  response_type: 'code',
  redirect_uri: REDIRECT_URI,
  scope: SCOPES.join(' '),
  state,
  show_dialog: 'true',
})}`;

const server = createServer(async (req, res) => {
  const url = new URL(req.url ?? '/', REDIRECT_URI);
  if (url.pathname !== '/callback') {
    res.writeHead(404).end();
    return;
  }

  const error = url.searchParams.get('error');
  const code = url.searchParams.get('code');

  if (error || !code) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`Autorização recusada: ${error ?? 'sem code'}`);
    server.close();
    process.exitCode = 1;
    return;
  }

  if (url.searchParams.get('state') !== state) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Estado inválido — tente de novo.');
    server.close();
    process.exitCode = 1;
    return;
  }

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end(`Falha ao trocar o code: ${JSON.stringify(data)}`);
      console.error(data);
      server.close();
      process.exitCode = 1;
      return;
    }

    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end('<h1 style="font:16px system-ui">Pronto. Pode fechar esta aba e voltar ao terminal.</h1>');

    console.log('\n✓ Refresh token gerado. Cole no .env.local:\n');
    console.log(`SPOTIFY_REFRESH_TOKEN=${data.refresh_token}\n`);
    if (!data.refresh_token) {
      console.log('(A Spotify não devolveu refresh_token. Revogue o app e rode de novo com show_dialog.)');
    }
  } catch (error_) {
    console.error(error_);
  } finally {
    server.close();
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`\nAbrindo servidor em ${REDIRECT_URI}`);
  console.log('Autorize com a sua conta abrindo a URL abaixo:\n');
  console.log(`${authorizeUrl}\n`);
  console.log('(Aguarde o redirecionamento; o refresh token aparece aqui.)');
});
