import Head from 'next/head';
import Container from '@/pages/components/ds/DsContainer';
import { SectionHeader } from '@/pages/components/ds/DsSectionHeader';
import { Button, IconButton } from '@/pages/components/ds/DsButton';
import Card from '@/pages/components/ds/DsCard';
import { Badge, Tag, Divider, TextLink } from '@/pages/components/ds/DsMeta';
import Reveal from '@/pages/components/Reveal';

// Visual lab for juliano340.com. DEV ONLY — returns 404 in production.
const Swatch = ({ name, cssVar, fg = '#fff' }) => (
  <div className="overflow-hidden rounded-sm border border-subtle">
    <div className="h-16" style={{ background: `var(${cssVar})` }} />
    <div className="bg-surface p-2">
      <p className="ds-code" style={{ color: fg }}>{name}</p>
      <p className="ds-caption text-muted">{cssVar}</p>
    </div>
  </div>
);

const LabSection = ({ title, children }) => (
  <section className="border-t border-subtle py-12">
    <h2 className="ds-h3 mb-6">{title}</h2>
    {children}
  </section>
);

const DesignSystemPage = () => (
  <>
    <Head>
      <title>Design System Lab | Juliano</title>
      <meta name="robots" content="noindex, nofollow" />
    </Head>
    <main className="bg-background text-primary">
      <Container>
        <div className="py-12">
          <SectionHeader
            align="left"
            rule={false}
            eyebrow="Laboratório visual · dev only"
            title="Design System"
            description="Tokens, escala tipográfica e primitivas do juliano340.com. Mude os valores em src/styles/globals.css e veja esta página reagir."
          />
        </div>

        <LabSection title="Colors · superfícies e texto">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Swatch name="background" cssVar="--color-background" />
            <Swatch name="surface" cssVar="--color-surface" />
            <Swatch name="surface alt" cssVar="--color-surface-alt" />
            <Swatch name="raised" cssVar="--color-surface-raised" />
            <Swatch name="text" cssVar="--color-text" fg="var(--color-muted)" />
            <Swatch name="muted" cssVar="--color-muted" />
            <Swatch name="border" cssVar="--color-border" />
            <Swatch name="accent" cssVar="--color-accent" />
          </div>
        </LabSection>

        <LabSection title="Colors · ações e metadados">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <Swatch name="btn bg" cssVar="--btn-bg" />
            <Swatch name="btn text" cssVar="--btn-text" fg="var(--color-muted)" />
            <Swatch name="inverted bg" cssVar="--inv-bg" />
            <Swatch name="chip bg" cssVar="--chip-bg" />
            <Swatch name="chip text" cssVar="--chip-text" fg="var(--color-muted)" />
            <Swatch name="tag bg" cssVar="--tag-bg" />
            <Swatch name="focus" cssVar="--color-focus" />
            <Swatch name="shadow" cssVar="--color-shadow" />
          </div>
        </LabSection>

        <LabSection title="Typography · escala">
          <div className="space-y-4">
            <p className="ds-display">Display — Produtos do conceito ao deploy</p>
            <p className="ds-h1">H1 — Tecnologia e IA aplicada</p>
            <p className="ds-h2">H2 — Projetos selecionados</p>
            <p className="ds-h3">H3 — Detalhes do projeto</p>
            <p className="ds-h4">H4 — Cargo e período</p>
            <p className="ds-body-lg">Body LG — subtítulos de seção com presença.</p>
            <p className="ds-body">Body — texto corrido padrão do site.</p>
            <p className="ds-body-sm">Body SM — descrições de cards e bios.</p>
            <p className="ds-caption">Caption — metadados, contadores, notas.</p>
            <p className="ds-label">Label — eyebrows e kickers</p>
            <p className="ds-code">code — var(--color-accent)</p>
          </div>
        </LabSection>

        <LabSection title="Buttons">
          <div className="flex flex-wrap items-center gap-4">
            <Button variant="primary" href="#x">Primary</Button>
            <Button variant="secondary" href="#x">Secondary</Button>
            <Button variant="ghost" href="#x">Ghost</Button>
            <IconButton label="Exemplo">
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14" />
              </svg>
            </IconButton>
          </div>
        </LabSection>

        <LabSection title="Cards">
          <div className="grid gap-4 md:grid-cols-3">
            <Card><p className="ds-h4 mb-2">Default</p><p className="ds-body-sm text-muted">Superfície elevada, borda sutil.</p></Card>
            <Card variant="interactive"><p className="ds-h4 mb-2">Interactive</p><p className="ds-body-sm text-muted">Hover: borda acid + lift. Passe o mouse.</p></Card>
            <Card variant="featured"><p className="ds-h4 mb-2">Featured</p><p className="ds-body-sm text-muted">Interactive + filete accent no topo.</p></Card>
          </div>
        </LabSection>

        <LabSection title="Badge · Tag · Divider · TextLink">
          <div className="flex flex-wrap items-center gap-3">
            <Badge>Case digital</Badge>
            <Tag>Next.js</Tag>
            <TextLink href="#x">Ver projeto ↗</TextLink>
          </div>
          <Divider className="mt-6" />
        </LabSection>

        <LabSection title="Radius · Shadows">
          <div className="flex flex-wrap items-end gap-4">
            <div className="rounded-sm bg-surface p-4"><p className="ds-code">rounded-sm</p></div>
            <div className="rounded-md bg-surface p-4"><p className="ds-code">rounded-md</p></div>
            <div className="rounded-pill bg-surface px-6 py-3"><p className="ds-code">rounded-pill</p></div>
            <div className="rounded-full bg-surface p-4"><p className="ds-code">rounded-full</p></div>
            <div className="bg-surface p-4 shadow-lift"><p className="ds-code">shadow-lift</p></div>
            <div className="bg-surface p-4 shadow-overlay"><p className="ds-code">shadow-overlay</p></div>
          </div>
        </LabSection>

        <LabSection title="Motion">
          <div className="flex flex-wrap gap-3">
            <Tag>fast · var(--motion-duration-fast)</Tag>
            <Tag>base · var(--motion-duration-base)</Tag>
            <Tag>slow · var(--motion-duration-slow)</Tag>
            <Tag>standard easing · var(--motion-ease-standard)</Tag>
          </div>
          <Reveal className="mt-6">
            <Card variant="interactive"><p className="ds-body">Este card revelou com os tokens de motion. Role para fora e volte.</p></Card>
          </Reveal>
        </LabSection>
      </Container>
    </main>
  </>
);

export async function getServerSideProps() {
  if (process.env.NODE_ENV === 'production') {
    return { notFound: true };
  }
  return { props: {} };
}

export default DesignSystemPage;
