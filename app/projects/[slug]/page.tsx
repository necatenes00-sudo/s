import Arrow from '@/components/Arrow';
import type { Metadata } from 'next';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { assetPath, projects } from '@/lib/site';

export function generateStaticParams() { return projects.map((project) => ({ slug: project.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  return { title: project ? `${project.name} — Concept study` : 'Project not found', description: project?.description };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const index = projects.findIndex((item) => item.slug === slug);
  const project = projects[index];
  if (!project) notFound();
  const next = projects[(index + 1) % projects.length];
  const style = { '--project-accent': project.accent, '--project-color': project.color } as CSSProperties;
  const hospitality = project.slug === 'limon';
  const commerce = project.slug === 'ciger-tarim';
  return <main className="interior-page interior-case" style={style}>
    <header className="interior-case-header page-wrap"><Link className="interior-back" href="/projects">← All projects</Link><div className="interior-header-top"><span className="eyebrow">{project.category.toUpperCase()}</span><span className="eyebrow">CONCEPT STUDY / {project.year}</span></div><h1 data-reveal>{project.name}</h1><div className="interior-case-subtitle"><p>{project.title}</p><span>SCROLL TO EXPLORE <span aria-hidden="true"><Arrow direction="down" /></span></span></div></header>
    <div className="interior-case-hero"><img src={assetPath(project.image)} alt={project.imageAlt} width="1536" height="1024" fetchPriority="high" /></div>
    <section className="interior-case-intro page-wrap"><div><span className="eyebrow">{project.number} / PROJECT OVERVIEW</span><p className="interior-case-status">An independent concept exploration.<br />Created to demonstrate our thinking.</p><dl><div><dt>Sector</dt><dd>{project.category}</dd></div><div><dt>Scope</dt><dd>{project.disciplines.map((discipline) => <span key={discipline}>{discipline}</span>)}</dd></div><div><dt>Year</dt><dd>{project.year}</dd></div></dl></div><h2>{project.description}</h2></section>
    <section className="interior-case-narrative page-wrap" aria-label="The design thinking">
      {[['01', 'The challenge.', project.challenge], ['02', 'Creative direction.', project.direction], ['03', 'The digital experience.', project.experience]].map(([number, title, text]) => <article key={number}><span className="eyebrow">{number} /</span><h2>{title}</h2><p>{text}</p></article>)}
    </section>
    <section className="interior-brand-system" aria-label="Visual identity exploration"><div className="page-wrap"><div className="interior-system-heading"><span className="eyebrow">A COHERENT VISUAL LANGUAGE</span><span className="eyebrow">TYPE / COLOUR / CHARACTER</span></div><div className={`interior-brand-wordmark${hospitality ? ' interior-brand-serif' : ''}`}>{project.name}<span>®</span></div><div className="interior-system-bottom"><div className="interior-type-sample"><span className="eyebrow">{hospitality ? 'AN EDITORIAL EXPRESSION' : 'A PRECISE TYPOGRAPHIC VOICE'}</span><p className={hospitality ? 'interior-brand-serif' : ''}>Aa Bb Cc 0123</p></div><div className="interior-color-samples"><div><span style={{ background: project.color }} /><p>{project.color.toUpperCase()}</p></div><div><span style={{ background: project.accent }} /><p>{project.accent.toUpperCase()}</p></div><div><span style={{ background: '#F5F7FA' }} /><p>#F5F7FA</p></div></div></div></div></section>
    <section className="interior-mobile-study page-wrap"><div className="interior-mobile-copy"><span className="eyebrow">DESIGNED FOR EVERY SCALE</span><h2>A consistent idea.<br /><span>Every screen.</span></h2><p>From a first impression to the smallest interaction, the visual system carries through. A responsive direction shaped around clear content and a natural rhythm.</p><span className="interior-concept-note">MOBILE INTERFACE CONCEPT</span></div><div className="interior-phones" aria-label={`${project.name} mobile interface design concepts`}>
      <div className="interior-phone"><div className="interior-phone-status"><span>9:41</span><span aria-hidden="true">▰ ▰</span></div><div className="interior-phone-nav"><b>{project.name}</b><span aria-hidden="true">☰</span></div><img src={assetPath(project.image)} alt={`${project.name} concept mobile hero`} width="400" height="300" loading="lazy" /><div className="interior-phone-body"><small>{project.category.toUpperCase()}</small><h3 className={hospitality ? 'interior-brand-serif' : ''}>{project.title}</h3><span className="interior-phone-cta">{hospitality ? 'Find your moment' : commerce ? 'Explore our world' : 'Discover the experience'} <span aria-hidden="true"><Arrow /></span></span></div></div>
      <div className="interior-phone interior-phone-secondary"><div className="interior-phone-status"><span>9:41</span><span aria-hidden="true">▰ ▰</span></div><div className="interior-phone-nav"><b>{project.name}</b><span aria-hidden="true">☰</span></div><div className="interior-phone-body"><small>{hospitality ? 'THOUGHTFULLY CONSIDERED' : 'A DIFFERENT PERSPECTIVE'}</small><h3 className={hospitality ? 'interior-brand-serif' : ''}>{hospitality ? 'Stay a little longer.' : commerce ? 'Better choices. Naturally.' : 'Made to move you.'}</h3><p>{hospitality ? 'Good coffee. Seasonal flavours. A space that feels like yours.' : commerce ? 'Connected to the land. Committed to what comes next.' : 'Considered details. A clear purpose. An experience of your own.'}</p><img src={assetPath(project.image)} alt="" width="300" height="240" loading="lazy" /><span className="interior-phone-cta">Explore more <span aria-hidden="true"><Arrow /></span></span></div></div>
    </div></section>
    <section className="interior-next-project"><Link href={`/projects/${next.slug}`}><img src={assetPath(next.image)} alt="" loading="lazy" width="1536" height="1024" /><div className="page-wrap"><span className="eyebrow">NEXT PERSPECTIVE / {next.number}</span><h2>{next.name}<span aria-hidden="true"><Arrow /></span></h2><p>{next.category} · Concept study</p></div></Link></section>
  </main>;
}
