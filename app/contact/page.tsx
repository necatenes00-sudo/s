import Arrow from '@/components/Arrow';
import type { Metadata } from 'next';
import ProjectInquiry from '@/components/ProjectInquiry';
import { site } from '@/lib/site';

export const metadata: Metadata = { title: 'Start a conversation', description: 'Have a project in mind? Start a conversation with Demir Digital about your next brand, website or digital experience.' };

export default function ContactPage() {
  return <main className="interior-page page-wrap"><header className="interior-page-header interior-contact-header"><div className="interior-header-top"><span className="eyebrow">GREAT THINGS START WITH A CONVERSATION</span><span className="eyebrow">YOUR NEXT CHAPTER</span></div><h1 data-reveal>Let’s make<br /><span>it matter.</span><span className="interior-contact-star" aria-hidden="true"><Arrow /></span></h1><div className="interior-header-bottom"><p>A clear brief or an early thought.<br />We’d like to hear what you have in mind.</p></div></header><div className="interior-contact-layout"><aside className="interior-contact-info"><span className="eyebrow">PREFER A SIMPLE HELLO?</span><a className="interior-email" href={`mailto:${site.email}`}>{site.email}<span aria-hidden="true"><Arrow /></span></a><div><span className="eyebrow">OUR BASE. YOUR WORLD.</span><p>{site.location}<br /><span>Open to ideas from everywhere.</span></p></div>{site.socials.length > 0 && <div><span className="eyebrow">ELSEWHERE</span><ul>{site.socials.map((social) => <li key={social.label}><a href={social.url} target="_blank" rel="noreferrer">{social.label} ↗</a></li>)}</ul></div>}<div className="interior-contact-note"><span aria-hidden="true"><Arrow direction="down-left" /></span><p>Tell us where you are.<br />We’ll imagine what comes next.</p></div></aside><ProjectInquiry /></div></main>;
}
