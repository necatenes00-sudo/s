import Link from 'next/link';
import { site } from '@/lib/site';
import Arrow from './Arrow';

export function ContactCTA() {
  return <section className="contact-scene page-wrap" aria-labelledby="contact-scene-title">
    <div className="section-kicker"><span className="signal-dot" /> HAVE A PROJECT? <span className="kicker-right">THE NEXT CHAPTER STARTS HERE.</span></div>
    <Link href="/contact" className="contact-scene-link" data-cursor="LET’S TALK">
      <h2 id="contact-scene-title" data-reveal>LET’S MAKE<br /><span>SOMETHING</span><br />UNFORGETTABLE<span className="cyan">.</span></h2><Arrow />
    </Link>
    <div className="contact-scene-bottom"><p>Good things start with a conversation.<br />Tell us what you have in mind.</p><a href={`mailto:${site.email}`} className="email-link" data-magnetic>{site.email.toUpperCase()} <Arrow /></a></div>
  </section>;
}

export default function Footer() {
  return <footer className="site-footer page-wrap">
    <Link href="/" className="footer-wordmark">DEMIR DIGITAL<sup>®</sup></Link>
    <div className="footer-meta"><span>© 2026 DEMIR DIGITAL</span><span>CREATIVE AGENCY</span><span>ORDU — TÜRKİYE</span><div>{site.socials.map(social => <a href={social.url} key={social.label} target="_blank" rel="noreferrer" data-cursor="↗">{social.label}</a>)}<a href="#top" aria-label="Back to top">BACK TO TOP <Arrow direction="up-right" /></a></div></div>
  </footer>;
}
