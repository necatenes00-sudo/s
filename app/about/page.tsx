import Arrow from '@/components/Arrow';
import type { Metadata } from 'next';
import Link from 'next/link';
import { assetPath, site } from '@/lib/site';

export const metadata: Metadata = { title: 'The studio', description: 'An independent creative digital practice in Türkiye. Meet the principles and process behind Demir Digital.' };

const principles = [
  ['01', 'Clarity before complexity.', 'A strong idea does not need to shout. We ask better questions, remove distractions and find the clearest expression of what makes a brand matter.'],
  ['02', 'Craft is the difference.', 'The spacing. The transition. The moment an interface makes sense. We care about the details because together, they shape how the whole experience feels.'],
  ['03', 'Curiosity, with purpose.', 'New tools create new possibilities. We explore them with an open mind and a clear question: does this make the experience more meaningful?'],
];
const process = [
  ['Discover', 'We listen before we design. Together, we define the ambition, understand the audience and ask the questions that shape the brief.'],
  ['Define', 'Research becomes a clear direction. We align on positioning, priorities and the creative idea that connects the whole project.'],
  ['Design', 'The idea takes form. Visual systems, interfaces and interactions are explored, refined and connected into one coherent experience.'],
  ['Develop', 'Design meets engineering. We build with care, test across devices and tune the details that make the experience feel right.'],
  ['Deliver', 'A thoughtful handover, a considered launch and a foundation for what comes next. We make sure the work is ready for its real world.'],
];

export default function AboutPage() {
  return <main className="interior-page"><header className="interior-page-header page-wrap"><div className="interior-header-top"><span className="eyebrow">INDEPENDENT IN SPIRIT</span><span className="eyebrow">BASED IN TÜRKİYE / THINKING BEYOND</span></div><h1 data-reveal>Different minds.<br /><span>Shared ambition.</span></h1><div className="interior-header-bottom"><p>We are Demir Digital.<br />A creative practice at the intersection of design and technology.</p><span className="interior-small-mark" aria-hidden="true"><Arrow direction="down-left" /></span></div></header><div className="interior-about-visual"><img src={assetPath('/media/demir.webp')} alt="A sculptural titanium form illuminated with electric blue light, expressing Demir Digital’s material design language" width="1536" height="1024" /><div className="page-wrap"><span className="eyebrow">FORM FOLLOWS INTENTION.</span><span>STRATEGY × DESIGN × TECHNOLOGY</span></div></div><section className="interior-about-statement page-wrap"><span className="eyebrow">THE WAY WE SEE IT</span><div><h2>We believe the most compelling digital experiences start with a <span>clear point of view.</span></h2><p>We bring strategy, identity and technology into the same conversation. Our work is shaped by a simple ambition: to help brands express who they are with clarity, confidence and character.</p><p>From {site.location.split(' — ')[0]} to wherever a good idea takes us, we approach every project as a partnership. Open dialogue, considered decisions and a shared investment in the result.</p></div></section><section className="interior-principles page-wrap"><div className="interior-section-heading"><span className="eyebrow">OUR PRINCIPLES</span><h2>What we<br /><span>stand for.</span></h2></div><div>{principles.map(([number, title, description]) => <article key={number}><span className="eyebrow">{number} /</span><div><h3>{title}</h3><p>{description}</p></div><span className="interior-principle-mark" aria-hidden="true">+</span></article>)}</div></section><section className="interior-process page-wrap"><div className="interior-section-heading"><span className="eyebrow">FROM AMBITION TO REALITY</span><h2>Good work<br /><span>has a process.</span></h2><p>Enough structure to keep us aligned.<br />Enough space to discover something unexpected.</p></div><div className="interior-process-list">{process.map(([title, description], index) => <article key={title}><span className="interior-process-number">0{index + 1}</span><h3>{title}</h3><p>{description}</p></article>)}</div></section><div className="interior-ending page-wrap"><p>A SHARED AMBITION IS A GOOD START.</p><Link href="/contact">Let’s see what’s possible. <span aria-hidden="true"><Arrow /></span></Link></div></main>;
}
