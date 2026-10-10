# Design System — juliano340.com

Single source of truth: `src/styles/globals.css`. Primitives: `src/pages/components/ds/`.
Lab: `/design-system` (dev only, 404 in production).

Identity: dark-only, inspired by the Spotify web player (see `/DESIGN.md`).
Near-black immersion, achromatic UI, green as the single functional accent.

## Token layers

- `--primitive-*`: raw values, no meaning. Brand identity lives here.
  Green (brand), ink (dark surfaces), greys, black/white.
- `--color-*`, `--btn-*`, `--inv-*`, `--chip-*`, `--tag-*`: semantic aliases.
  Components use these. Never primitives, never hex.
- `--radius-xs/sm/md/pill/full`, `--shadow-lift/overlay/inset-input`, `--motion-*`,
  `--z-raised/overlay/nav/modal`, `--container-max`.

Dark IS `:root` and the only theme (`color-scheme: dark`).
There is no `html.light` and no theme toggle — do not reintroduce either.

## Color rules

- Background `#121212`; surfaces `#181818` / `#1f1f1f` / `#252525` (elevation by shade).
- Text: white primary, `#b3b3b3` secondary, `#7c7c7c` muted links.
- Green `#1ed760` is **functional only**: primary CTAs, active/live states,
  focus rings, progress. Never decorative text or backgrounds.
- Semantic states: `--color-negative` `#f3727f`, `--color-warning` `#ffa42b`,
  `--color-announcement` `#539df5`.
- Cards have no borders — elevation via background shade and heavy shadows
  (`--shadow-lift` 0.5 / `--shadow-overlay` 0.3). Inputs use `--shadow-inset-input`.

## Type scale (globals.css)

Compact app-like range (10px–24px), single family (Poppins via `--font-poppins`,
the free Circular substitute). Hierarchy is weight, not size: 700 vs 400.

`ds-display`, `ds-h1`, `ds-h2` (24px/700), `ds-h3` (18px/600), `ds-h4` (16px/700),
`ds-body-lg`, `ds-body` (16px), `ds-body-sm` (14px), `ds-caption` (12px),
`ds-label` (12px/700/uppercase/0.07em/**muted**, not green), `ds-code`.

## Buttons & geometry

- Pill everything: `--radius-pill` buttons, `--radius-full` icon buttons/avatars.
- Primary: green pill, black text, uppercase 14px/700, tracking 0.1em, hover
  `--btn-hover` + `scale(1.04)`.
- Secondary: outlined pill (`#7c7c7c`), white text, hover border white.
- Cards/album art: `--radius-sm` 6px; panels/dialogs `--radius-md` 8px; tags 2px.

## Primitives (src/pages/components/ds/)

- `DsContainer` — the only content width (max-w-7xl + gutters).
- `DsSectionHeader` — `SectionHeader` (eyebrow/title/rule/description)
  plus parts `Eyebrow`, `SectionTitle`, `SectionDescription`, `SectionRule`.
- `DsButton` — `Button variant="primary|secondary|ghost"`,
  `IconButton` (requires `label`).
- `DsCard` — `variant="default|interactive|featured"`.
- `DsMeta` — `Badge` (chip), `Tag`, `Divider`, `TextLink`.

## Motion

Durations/easings are `--motion-*` vars. `Reveal` reads them and
honors `prefers-reduced-motion` (content appears instantly; smooth scroll
also goes static via the CSS guard).

## MUST

- Use existing tokens; add a token instead of a one-off value.
- Reuse ds/ primitives; compose, don't duplicate.
- Respect `DsContainer` and the type scale.
- Keep `mono-focus-ring` on every interactive element.
- Check the lab (`/design-system`) before creating a new visual.

## MUST NOT

- No hardcoded hex/rgba outside `globals.css` token layer.
- No new border-radius, shadow, or font-size outside the scales.
- No second Button/Card/Nav/Container implementation.
- No light theme, no green used decoratively.
- No animation that ignores `prefers-reduced-motion`.
- No new page-specific visual language without updating this doc.

## Scope notes

- `/runlab/*`, `/privacidade-runlab` and `/terminal` keep their own product
  identities (green gradient landing / green CRT easter egg) — out of the
  site design system on purpose.
