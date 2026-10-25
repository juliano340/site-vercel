# Hero em vídeo — pipeline de encode

O hero usa um vídeo gerado por IA com **dois regimes**:

| Onde | Asset | Comportamento |
|---|---|---|
| Desktop (ponteiro fino) | `hero-scrub-v2.mp4` (5,2 s) | a roda avança `currentTime` (pin de 2,25 viewports) |
| Mobile | `hero-once-v2.mp4` (5,2 s) | toca uma vez e congela no último frame; replay ao voltar ao hero |
| Todos | `hero-poster-v1.webp` | LCP; também fallback de `reduced-motion` / `save-data` |

Arquivos em `public/video/hero/`. `next.config.mjs` serve `/video/*` com
`Cache-Control: immutable` por 1 ano — **ao trocar o vídeo, suba a versão no
nome do arquivo e em `HeroVideoBackdrop.jsx`.**

## Por que o vídeo é normalizado

O master tem uma abertura de proporção embutida: começa em 2,26:1 (tarja de
116 px) e abre até 1,79:1 em ~3,5 s. Cortar a tarja fixa decepa o teto e o
tampo da mesa na segunda metade. A solução é o inverso: **zoom 1,264× → 1,0×
entre 2,0 s e 3,5 s**, que preenche o quadro desde o primeiro frame e cancela
parcialmente o push-in da câmera.

## Comandos (ffmpeg)

`MASTER` = arquivo original. Tudo sem áudio (`-an`).

### 1. Scrub desktop — 1920x1072, all-intra

```bash
ffmpeg -y -i "$MASTER" -an -t 5.2 \
  -vf "zoompan=z='if(lt(in_time,2),1.2644,if(lt(in_time,3.5),1.2644-(in_time-2)*0.1763,1))':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1920x1072:fps=24" \
  -c:v libx264 -preset slow -crf 26 -g 1 -keyint_min 1 -sc_threshold 0 \
  -pix_fmt yuv420p -movflags +faststart \
  public/video/hero/hero-scrub-v2.mp4
```

`-t 5.2` corta o plano antes da virada de cabeça para a câmera (que começa
~6,5 s no master). `-g 1` = keyframe em todo frame: é o que permite seek
instantâneo no scrub. Resultado atual: **4,4 MB**, 125 frames.

### 2. One-shot mobile — 1280x714, só o trecho para frente

```bash
ffmpeg -y -t 5.2 -i "$MASTER" -an \
  -vf "zoompan=z='if(lt(in_time,2),1.2644,if(lt(in_time,3.5),1.2644-(in_time-2)*0.1763,1))':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1920x1072:fps=24,scale=1280:-2" \
  -c:v libx264 -preset slow -crf 24 -g 48 \
  -pix_fmt yuv420p -movflags +faststart \
  public/video/hero/hero-once-v2.mp4
```

**Nada de ping-pong.** A versão anterior invertia o clipe para fechar o loop,
mas o plano tem um dolly de câmera: a volta lia como "rebobinando" e o sujeito
parecia desfazer o gesto. Agora toca uma vez e congela no último frame.
Resultado: **0,7 MB**.

### 3. Poster — frame 0 normalizado

```bash
ffmpeg -y -i "$MASTER" -frames:v 1 \
  -vf "zoompan=z='1.2644':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=1920x1072:fps=24" \
  -c:v libwebp -quality 74 \
  public/video/hero/hero-poster-v1.webp
```

Use sempre o **frame 0**: é o que o vídeo mostra no primeiro instante, então o
poster não "salta" quando o vídeo assume. Resultado: **50 KB**.

## Transporte do scrub

- **Pin de 2,25 viewports** (~2,3 s de vídeo por viewport). Percurso curto
  demais faz cada notch da roda valer 12+ frames e o vídeo nunca acompanha a
  mão. Ao mudar a duração do clipe, recalibre: `duração / 2,3`.
- **Mesmo teto nos dois sentidos** (2,4 s de vídeo por segundo real). Voltar
  custa o mesmo esforço de rolagem que avançar.
- **A página só desce com o vídeo no fim.** `canRelease()` segura o pin até o
  `currentTime` assentar no último frame (tolerância de 80 ms, com trava de 2 s).
- **Ao voltar ao topo, o pin re-arma no ponto onde o vídeo parou** — subir
  rebobina o plano em vez de cortar para o primeiro frame.
- Sem blur, sem filtro no vídeo: o `currentTime` é o único que muda.

## Camadas de progresso (desktop)

O texto do hero não fica plantado enquanto o vídeo corre: três camadas
acompanham o mesmo `progress` do pin. **Tudo é derivado de `progress`** —
nada de timeline por evento — então subir a roda desfaz exatamente o que
descer fez, sem ping-pong.

| Camada | Implementação | Faixa |
|---|---|---|
| Parallax do conteúdo | `translate3d(0, -28px * p, 0)` no bloco de texto | pin inteiro |
| Terminal que se escreve | `clip-path: inset(0 X% 0 0)` (inclui o `$`) | 0,02 → 0,42 |
| Stepper | 3 segmentos, cada um enche no seu terço | pin inteiro |

Regras que não mudam:

- Escrita de DOM direta em `applyPinProgress` — **sem `setState` por frame**.
  O React só re-renderiza o `pinProgress` do stepper (limiar de 0,02).
- Só `opacity`, `transform` e `clip-path`. Nada de `filter`/`blur` no vídeo.
- Sem cards, conversas ou outras ilustrações sobre o vídeo: a composição fica
  apenas com o backdrop e o conteúdo textual do hero.

## One-shot mobile

- Toca uma vez no carregamento e **congela no último frame** (`loop` desligado).
- Pausa quando o hero sai da viewport ou a aba é ocultada.
- O replay só dispara depois de uma **saída completa** do hero (`threshold: 0`):
  scroll curto não reinicia o clipe no meio. Ao voltar, recomeça do zero.

## Frame parado: drift e composição

Um frame 100% imóvel lê como "vídeo travado". Duas coisas resolvem isso sem
seek, sem filtro e sem re-encode:

- **Drift** (`.animate-hero-frame-drift`): `scale(1) → scale(1.06)` em 26 s,
  **linear**. Entra no `ended`, pausa quando o hero sai de cena e reseta no
  replay. É transform no compositor — custo zero de decode. Com `ease-out` o
  zoom acontecia quase todo nos primeiros 3 s e depois estacionava, o que
  trazia de volta a sensação de congelado.
- **Texto sobre o card**: o hero mobile usa card de `clamp(14rem,42svh,24rem)`
  e o conteúdo sobe `calc(var(--hero-media-height) - 3.5rem)`, com o degradê
  do scrim fechando a base (transparente até 38%, 0.55 em 70%, 0.96 no fim).
  O frame deixa de ser um player parado e passa a ser o fundo do bloco.

## Regras de performance

- O poster é o LCP (`priority` + `sizes="100vw"`). O vídeo só é baixado depois
  do evento `load`, via `requestIdleCallback`.
- `prefers-reduced-motion` → poster no toque (one-shot é movimento autônomo) e
  **scrub normal no desktop** (o movimento é dirigido pelo usuário).
- `save-data` e rede 2G → só poster, zero vídeo.
- Erro de rede no vídeo → volta para o poster e o pin é desligado.
- Se o arquivo passar de ~8 MB no scrub, reduza para 1280x714 all-intra
  (~3,4 MB) antes de considerar CDN de vídeo.
