'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { assetPath, projects, site } from '@/lib/site';
import Arrow from './Arrow';

const links = [{ href: '/projects', name: 'Work' }, { href: '/services', name: 'Services' }, { href: '/about', name: 'Studio' }, { href: '/contact', name: 'Contact' }];

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(0);
  const button = useRef<HTMLButtonElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    const content = document.querySelector<HTMLElement>('#page-content');
    if (content) content.inert = open;
    document.body.classList.toggle('menu-open', open);
    window.dispatchEvent(new CustomEvent('demir:scroll-lock', { detail: open }));
    if (open) menu.current?.querySelector<HTMLAnchorElement>('a')?.focus();
    function keyboard(event: KeyboardEvent) {
      if (!open) return;
      if (event.key === 'Escape') { setOpen(false); button.current?.focus(); }
      if (event.key === 'Tab') {
        const items = [button.current, ...(menu.current?.querySelectorAll<HTMLElement>('a, button') || [])].filter(Boolean) as HTMLElement[];
        const index = items.indexOf(document.activeElement as HTMLElement);
        event.preventDefault();
        items[(index + (event.shiftKey ? -1 : 1) + items.length) % items.length]?.focus();
      }
    }
    window.addEventListener('keydown', keyboard);
    return () => { if (content) content.inert = false; document.body.classList.remove('menu-open'); window.removeEventListener('keydown', keyboard); };
  }, [open]);

  return <>
    <header className={`site-header ${open ? 'menu-visible' : ''}`}>
      <Link href="/" className="wordmark" aria-label="Demir Digital home" onClick={() => setOpen(false)}>
        {site.logo ? <img src={assetPath(site.logo)} alt="Demir Digital" /> : <><span>DEMIR<span className="wordmark-light">DIGITAL</span><sup>®</sup></span><small>CREATIVE AGENCY</small></>}
      </Link>
      <nav className="header-nav" aria-label="Main navigation">{links.map(link => <Link key={link.href} href={link.href} className={pathname.startsWith(link.href) ? 'active' : ''}>{link.name}{link.name === 'Work' && <sup>04</sup>}</Link>)}</nav>
      <div className="header-actions"><Link className="header-project" href="/contact" data-magnetic>START A PROJECT <Arrow /></Link><button ref={button} className="menu-button" aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open} aria-controls="fullscreen-menu" onClick={() => setOpen(value => !value)}><span /><span /></button></div>
    </header>
    <div id="fullscreen-menu" ref={menu} className={`fullscreen-menu ${open ? 'is-open' : ''}`} inert={!open} aria-hidden={!open}>
      <div className="menu-meta"><span>INDEPENDENT BY DESIGN.</span><span>ORDU, TR / WORLDWIDE</span></div>
      <nav aria-label="Expanded navigation">{links.map((link, index) => <Link href={link.href} key={link.href} onMouseEnter={() => setHovered(index)} onFocus={() => setHovered(index)} onClick={() => setOpen(false)}><span className="menu-number">0{index + 1}</span><span>{link.name}</span><Arrow /></Link>)}</nav>
      <div className="menu-art" aria-hidden="true">{projects.map((project, index) => <img key={project.slug} className={hovered === index ? 'is-current' : ''} src={assetPath(project.image)} alt="" />)}<span>CREATIVE SYSTEM / 2026</span></div>
      <div className="menu-bottom"><a href={`mailto:${site.email}`}>{site.email}</a><span>DESIGN. TECHNOLOGY. IMPACT.</span></div>
    </div>
  </>;
}
