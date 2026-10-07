import Arrow from '@/components/Arrow';
import type { Metadata } from 'next';
import Link from 'next/link';
import ServicesList from '@/components/ServicesList';

export const metadata: Metadata = { title: 'Capabilities', description: 'Creative direction, brand identity, web design, development, digital campaigns and motion — one connected creative practice.' };

export default function ServicesPage() {
  return <main className="interior-page page-wrap"><header className="interior-page-header"><div className="interior-header-top"><span className="eyebrow">WHAT WE BRING TO THE TABLE</span><span className="eyebrow">CONNECTED CAPABILITIES / 07</span></div><h1 data-reveal>Built around<br /><span>your ambition.</span></h1><div className="interior-header-bottom"><p>From the first question to the final detail.<br />Strategy, design and technology, working together.</p><span className="interior-small-mark" aria-hidden="true"><Arrow direction="down-left" /></span></div></header><ServicesList /><section className="interior-approach"><div><span className="eyebrow">ONE CONNECTED PRACTICE</span><h2>Better together.<br /><span>By design.</span></h2></div><div><p>A brand does not exist in a single format. Neither should the thinking behind it. We connect disciplines from day one, so the identity, the experience and the technology speak the same language.</p><Link className="line-link" href="/about">Meet our approach <span aria-hidden="true"><Arrow /></span></Link></div></section><div className="interior-ending"><p>HAVE A CHALLENGE IN MIND?</p><Link href="/contact">Let’s find your direction. <span aria-hidden="true"><Arrow /></span></Link></div></main>;
}
