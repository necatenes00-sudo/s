import Link from 'next/link';
import Arrow from '@/components/Arrow';
import HeroScene from '@/components/HeroScene';
import Showreel from '@/components/Showreel';
import ServicesList from '@/components/ServicesList';
import { ContactCTA } from '@/components/Footer';
import { assetPath, projects } from '@/lib/site';

export default function Home() {
  return <main>
    <section className="hero-stage" aria-labelledby="hero-title">
      <div className="hero-atmosphere" aria-hidden="true" />
      <div className="hero-meta"><span><i className="signal-dot" /> INDEPENDENT CREATIVE AGENCY</span><span>ORDU, TÜRKİYE <i className="meta-divider" /> WORKING WORLDWIDE</span></div>
      <HeroScene />
      <div className="hero-object-meta" aria-hidden="true"><span className="crosshair">+</span><p>DIGITAL OBJECT / 01<br /><span>TITANIUM. LIGHT. PERSPECTIVE.</span></p></div>
      <h1 id="hero-title" className="hero-heading"><span className="hero-line hero-line-a">WE CREATE</span><span className="hero-line hero-line-b">DIGITAL</span><span className="hero-line hero-line-c">IMPACT<span className="cyan">.</span></span></h1>
      <div className="hero-description"><p>Distinctive brands. Digital products.<br />Experiences that move you.</p><Link href="/projects" className="line-link hero-work-link" data-magnetic>EXPLORE OUR WORK <Arrow /></Link></div>
      <div className="hero-footer"><a href="#selected-work" className="scroll-prompt"><span /> SCROLL TO EXPLORE</a><span>DESIGN × TECHNOLOGY × IMPACT</span><span>EST. 2026</span></div>
      <div className="hero-create" aria-hidden="true">CREATE</div><div className="hero-shade" aria-hidden="true" />
    </section>

    <section className="featured-section page-wrap" id="selected-work" aria-labelledby="selected-title">
      <div className="section-kicker"><span>02 / SELECTED WORK</span><span className="kicker-right">A FEW DIFFERENT PERSPECTIVES.</span></div>
      <div className="featured-heading"><h2 id="selected-title" data-reveal>LESS EXPECTED.<br /><span className="text-dim">MORE DISTINCT.</span></h2><p>Designed to be felt.<br />Built to make a difference.</p></div>
      <div className="featured-projects">{projects.slice(0, 3).map(project => <article className="featured-project" key={project.slug} style={{ '--project-accent': project.accent } as React.CSSProperties}>
        <div className="project-eyebrow"><span>PROJECT / {project.number}</span><span>{project.category.toUpperCase()} — 2026</span></div>
        <Link href={`/projects/${project.slug}`} className="featured-image-link" data-cursor="VIEW" aria-label={`View ${project.name} concept study`}>
          <div className="featured-image"><img src={assetPath(project.image)} alt={project.imageAlt} loading="lazy" width="1800" height="1200" /></div>
          <span className="featured-image-gradient" aria-hidden="true" /><span className="project-name">{project.name}</span><span className="featured-arrow"><Arrow /></span><span className="study-tag">CONCEPT STUDY</span>
        </Link>
        <div className="project-details-line"><h3>{project.title}</h3><span>{project.disciplines.join(' / ')}</span></div>
      </article>)}</div>
      <Link href="/projects" className="all-work-link line-link">EXPLORE ALL PROJECTS <span>04 <Arrow /></span></Link>
    </section>

    <section className="exhibition-section" aria-labelledby="exhibition-title">
      <div className="exhibition-head page-wrap"><div className="section-kicker"><span>EXPANDING THE PERSPECTIVE</span><span className="kicker-right">ONE STUDIO. MULTIPLE DIMENSIONS.</span></div><h2 id="exhibition-title">NOT ONE THING.<br /><span className="text-dim">ONE WAY OF THINKING.</span></h2></div>
      <div className="exhibition-window" tabIndex={0} aria-label="Explore projects horizontally"><div className="exhibition-track">{projects.map((project, index) => <Link href={`/projects/${project.slug}`} className="exhibit" data-cursor="VIEW" key={project.slug}><div className="exhibit-image"><img src={assetPath(project.image)} alt={project.imageAlt} loading="lazy" width="1800" height="1200" /></div><div className="exhibit-label"><span>0{index + 1}</span><h3>{['BRANDING', 'WEB EXPERIENCE', 'DIGITAL COMMERCE', 'CREATIVE DIRECTION'][index]}</h3><Arrow /></div></Link>)}</div></div>
      <div className="exhibition-progress page-wrap"><span>SCROLL THROUGH THE EXHIBITION</span><div><i /></div><span>01 — 04</span></div>
    </section>

    <section className="manifesto page-wrap" aria-labelledby="manifesto-title"><div className="manifesto-aside"><span className="section-kicker">WHAT WE BELIEVE</span><span className="technical-note">DD / POINT OF VIEW<br />STRATEGY BEFORE SPECTACLE.</span></div><h2 id="manifesto-title"><span className="text-mask"><span>WE DON’T</span></span><span className="text-mask"><span className="text-dim">DECORATE</span></span><span className="text-mask"><span className="text-dim">BRANDS.</span></span><span className="manifesto-gap" /><span className="text-mask"><span>WE BUILD</span></span><span className="text-mask"><span>DIGITAL</span></span><span className="text-mask"><span className="cyan">IDENTITIES.</span></span></h2></section>

    <section className="home-services page-wrap"><div className="section-kicker"><span>03 / EXPERTISE</span><span className="kicker-right">FROM THE FIRST IDEA TO THE FINAL DETAIL.</span></div><div className="services-home-heading"><h2 data-reveal>BUILT AROUND<br /><span className="text-dim">YOUR AMBITION.</span></h2><Link href="/services" className="line-link">OUR CAPABILITIES <Arrow /></Link></div><ServicesList compact /></section>

    <section className="capabilities page-wrap" aria-labelledby="capabilities-title"><div className="section-kicker"><h2 id="capabilities-title">CONNECTED DISCIPLINES</h2><span className="kicker-right">MOVE YOUR PERSPECTIVE.</span></div><div className="capability-field"><div className="perspective-grid" aria-hidden="true" /><div className="capability-laser" aria-hidden="true" />{['DESIGN', 'CODE', 'STRATEGY', 'MOTION', 'BRANDING', '3D', 'SOCIAL', 'COMMERCE'].map((word, i) => <span className={`capability-word capability-word-${i}`} data-depth={((i % 3) + 1) * 5} key={word}>{word}</span>)}<span className="capability-centre" aria-hidden="true">+</span></div><p className="capability-note">Different skills. Shared curiosity.<br />A single, connected creative practice.</p></section>

    <section className="philosophy page-wrap" aria-labelledby="philosophy-title"><img className="philosophy-texture" src={assetPath('/media/demir.webp')} alt="" aria-hidden="true" loading="lazy" /><span className="section-kicker">NO SHORTCUTS TO SOMETHING MEANINGFUL.</span><h2 id="philosophy-title"><span data-parallax="-1">IDEAS</span><span data-parallax="1">DESERVE</span><span data-parallax="-0.5" className="text-outline">BETTER</span><span data-parallax="0.5">EXECUTION<span className="cyan">.</span></span></h2><span className="philosophy-index">THOUGHT THROUGH. CRAFTED WITH PURPOSE.</span></section>

    <Showreel />

    <section className="about-preview page-wrap"><div className="section-kicker"><span>04 / THE STUDIO</span><span className="kicker-right">INDEPENDENT BY DESIGN.</span></div><div className="about-preview-layout"><div className="about-preview-visual" data-reveal><img src={assetPath('/media/demir.webp')} alt="An original architectural material study created for Demir Digital" loading="lazy" width="1800" height="1200" /><span>ALWAYS<br />IN PROGRESS.</span><i>ORDU — TÜRKİYE / OPEN TO THE WORLD</i></div><div className="about-preview-copy"><h2 data-reveal>A SMALL STUDIO.<br /><span className="text-dim">A WIDE-OPEN<br />PERSPECTIVE.</span></h2><p>We are an independent creative agency building identities, digital products and interactive experiences for ambitious brands.</p><p>Strategy, design and technology at the same table. A shared belief that the best work happens when curiosity meets precision.</p><Link href="/about" className="line-link">ABOUT THE STUDIO <Arrow /></Link><div className="studio-numbers"><div><span>07</span><p>CREATIVE DISCIPLINES</p></div><div><span>05</span><p>PHASES OF OUR PROCESS</p></div><div><span>01</span><p>CONNECTED VISION</p></div></div></div></div></section>

    <div className="brand-marquee" aria-hidden="true"><div className="marquee-track">{[0, 1].map(index => <span key={index}>DESIGN <i>×</i> <b>TECHNOLOGY</b> <i>×</i> CULTURE <i>×</i> <b>STRATEGY</b> <i>×</i> DIGITAL <i>×</i> </span>)}</div></div>
    <ContactCTA />
  </main>;
}
