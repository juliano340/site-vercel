# Design System — juliano340.com

Single source of truth: `src/styles/globals.css`. Primitives: `src/pages/components/ds/`.
Lab: `/design-system` (dev only, 404 in production).

## Token layers

- `--primitive-*`: raw values, no meaning. Brand identity lives here.
  Acid, ink (dark), paper (light), greys, black/white/coal.
- `--color-*`, `--btn-*`, `--inv-*`, `--chip-*`, `--tag-*`: semantic aliases.
  Components use these. Never primitives, never hex.
- `--radius-sm/md/pill/full`, `--shadow-lift/overlay`, `--motion-*`,
  `--z-raised/overlay/nav/modal`, `--container-max`, `--effect-*`.

Dark IS `:root` (dark-first). Light overrides in `html.light` only.
There is no `html.dark` block — do not reintroduce it.

## Type scale (globals.css, @layer components)

`ds-display`, `ds-h1`…`ds-h4` (Rajdhani 600, one clamp each),
`ds-body-lg`, `ds-body`, `ds-body-sm`, `ds-caption`, `ds-label`
(0.65rem/700/uppercase/0.2em/accent), `ds-code`.

## Primitives (src/pages/components/ds/)

- `DsContainer` — the only content width (max-w-7xl + gutters).
- `DsSection` — section rhythm; `tone="default"|"surface"`. Hero-type
  sections may skip it with a comment explaining why.
- `DsSectionHeader` — `SectionHeader` (eyebrow/title/rule/description)
  plus parts `Eyebrow`, `SectionTitle`, `SectionDescription`, `SectionRule`.
- `DsButton` — `Button variant="primary|secondary|ghost"`,
  `IconButton` (requires `label`).
- `DsCard` — `variant="default|interactive|featured"`.
- `DsMeta` — `Badge` (accent), `Tag` (muted stack), `Divider`, `TextLink`.

## Motion

Durations/easings are `--motion-*` vars. `Reveal` reads them and
honors `prefers-reduced-motion` (content appears instantly; loops and
smooth scroll also go static via the CSS guard).

## Experimenting with identity

To shift clean/minimal → tech/futurista, edit tokens, not components.
Example: change `--primitive-acid-*` to a cyan/violet pair, lower
`--radius-*` toward 2px, raise glow via `--shadow-*`, tighten
`--motion-duration-*`. The lab page shows the result instantly.

## MUST

- Use existing tokens; add a token instead of a one-off value.
- Reuse ds/ primitives; compose, don't duplicate.
- Respect `DsContainer` and the type scale.
- Use `Button`/`Card` variants that already exist.
- Keep `mono-focus-ring` on every interactive element.
- Check the lab (`/design-system`) before creating a new visual.

## MUST NOT

- No hardcoded hex/rgba outside `globals.css` token layer
  (legacy `glass-card` values are quarantined, not a pattern).
- No new border-radius, shadow, or font-size outside the scales.
- No second Button/Card/Nav/Container implementation.
- No `font-bebas` or `'Bebas Neue'` references (removed; display
  face is Rajdhani via `--font-display`).
- No animation that ignores `prefers-reduced-motion`.
- No new page-specific visual language without updating this doc.

## Migration status (phase 1)

Migrated: section headers (About, Portfolio, CtaSection, blog, contato,
home FeaturedProject). Pending: full card/button swap per page,
`homePresentation.js` HOME_* consolidation into ds/, legacy hero
triage (InteractiveHero/HeroSection vs HeroSectionView), Menu vs
HomeNavigation unification decision. Visual redesign is phase 2.
