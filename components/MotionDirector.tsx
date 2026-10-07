'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { basePath } from '@/lib/site';

gsap.registerPlugin(ScrollTrigger);
type ViewTransitionDocument = Document & { startViewTransition?: (update: () => void | Promise<void>) => { finished: Promise<void> } };

export default function MotionDirector() {
  const pathname = usePathname();
  const router = useRouter();
  const cursor = useRef<HTMLDivElement>(null);
  const cursorText = useRef<HTMLSpanElement>(null);
  const routeDone = useRef<(() => void) | null>(null);
  const transitionOverlay = useRef<HTMLDivElement>(null);
  const lenis = useRef<Lenis | null>(null);

  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduced) {
      const smooth = new Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: 0.88, touchMultiplier: 1, anchors: { offset: -90 } });
      lenis.current = smooth;
      smooth.on('scroll', ScrollTrigger.update);
      const frame = (time: number) => smooth.raf(time * 1000);
      gsap.ticker.add(frame);
      const locking = (event: Event) => (event as CustomEvent<boolean>).detail ? smooth.stop() : smooth.start();
      window.addEventListener('demir:scroll-lock', locking);
      return () => { window.removeEventListener('demir:scroll-lock', locking); gsap.ticker.remove(frame); smooth.destroy(); lenis.current = null; };
    }
  }, []);

  useEffect(() => {
    const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const scroll = () => { document.body.classList.toggle('is-scrolled', window.scrollY > 35); const maximum = document.documentElement.scrollHeight - innerHeight; document.documentElement.style.setProperty('--scroll-progress', `${maximum > 0 ? window.scrollY / maximum * 100 : 0}%`); };
    window.addEventListener('scroll', scroll, { passive: true }); scroll();
    if (!fine || reduced || !cursor.current) return () => window.removeEventListener('scroll', scroll);
    const node = cursor.current;
    document.body.classList.add('has-custom-cursor');
    const xTo = gsap.quickTo(node, 'x', { duration: 0.17, ease: 'power2.out' });
    const yTo = gsap.quickTo(node, 'y', { duration: 0.17, ease: 'power2.out' });
    function move(event: PointerEvent) {
      xTo(event.clientX); yTo(event.clientY); node.classList.add('is-visible');
      const target = event.target as HTMLElement;
      const interactive = target.closest<HTMLElement>('a, button, summary, [data-cursor]');
      node.classList.toggle('is-interactive', !!interactive);
      const label = interactive?.dataset.cursor || '';
      node.classList.toggle('has-label', !!label);
      if (cursorText.current) cursorText.current.textContent = label;
      const magnetic = target.closest<HTMLElement>('[data-magnetic]');
      if (magnetic) { const bounds = magnetic.getBoundingClientRect(); gsap.to(magnetic, { x: (event.clientX - bounds.left - bounds.width / 2) * 0.12, y: (event.clientY - bounds.top - bounds.height / 2) * 0.15, duration: 0.4, overwrite: true }); }
      const field = target.closest<HTMLElement>('.capability-field');
      if (field) { const rect = field.getBoundingClientRect(); field.querySelectorAll<HTMLElement>('[data-depth]').forEach(word => gsap.to(word, { x: (event.clientX - rect.left - rect.width / 2) / rect.width * Number(word.dataset.depth), y: (event.clientY - rect.top - rect.height / 2) / rect.height * Number(word.dataset.depth), duration: 0.7, overwrite: true })); }
    }
    function leave() { node.classList.remove('is-visible'); }
    function reset(event: PointerEvent) { const target = (event.target as HTMLElement).closest<HTMLElement>('[data-magnetic]'); if (target) gsap.to(target, { x: 0, y: 0, duration: 0.5 }); }
    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    document.addEventListener('pointerout', reset);
    return () => { document.body.classList.remove('has-custom-cursor'); window.removeEventListener('scroll', scroll); window.removeEventListener('pointermove', move); document.removeEventListener('pointerleave', leave); document.removeEventListener('pointerout', reset); };
  }, []);

  useEffect(() => {
    function navigate(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = (event.target as HTMLElement).closest<HTMLAnchorElement>('a[href]');
      if (!target || target.target === '_blank' || target.hasAttribute('download')) return;
      const url = new URL(target.href);
      if (url.origin !== location.origin || url.pathname === location.pathname || !url.pathname.startsWith(basePath || '/')) return;
      event.preventDefault();
      const destination = `${url.pathname.slice(basePath.length) || '/'}${url.search}${url.hash}`;
      const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) { router.push(destination); return; }
      const doc = document as ViewTransitionDocument;
      if (doc.startViewTransition) {
        const transition = doc.startViewTransition(() => new Promise<void>(resolve => {
          const timer = window.setTimeout(resolve, 1400);
          routeDone.current = () => { clearTimeout(timer); resolve(); routeDone.current = null; };
          router.push(destination);
        }));
        transition.finished.catch(() => { /* Native navigation remains usable if capture is interrupted. */ });
      } else {
        gsap.to(transitionOverlay.current, { scaleY: 1, duration: 0.24, transformOrigin: 'bottom', onComplete: () => router.push(destination) });
      }
    }
    document.addEventListener('click', navigate, true);
    return () => document.removeEventListener('click', navigate, true);
  }, [router]);

  useEffect(() => {
    routeDone.current?.();
    gsap.to(transitionOverlay.current, { scaleY: 0, duration: 0.4, transformOrigin: 'top', delay: 0.05 });
    window.scrollTo(0, 0);
    lenis.current?.scrollTo(0, { immediate: true });
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const context = gsap.context(() => {
      if (reduced) return;
      gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach(element => gsap.from(element, { y: 34, opacity: 0, duration: 0.85, ease: 'power3.out', scrollTrigger: { trigger: element, start: 'top 95%', once: true } }));
      gsap.utils.toArray<HTMLElement>('.text-mask > span').forEach(element => gsap.from(element, { yPercent: 105, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: element.parentElement, start: 'top 90%', once: true } }));
      gsap.utils.toArray<HTMLElement>('.featured-image img').forEach(element => gsap.fromTo(element, { scale: 1.12, yPercent: -5 }, { scale: 1, yPercent: 5, ease: 'none', scrollTrigger: { trigger: element.parentElement, start: 'top bottom', end: 'bottom top', scrub: 1 } }));
      gsap.utils.toArray<HTMLElement>('[data-parallax]').forEach(element => gsap.fromTo(element, { xPercent: Number(element.dataset.parallax) * -6 }, { xPercent: Number(element.dataset.parallax) * 6, ease: 'none', scrollTrigger: { trigger: element, start: 'top bottom', end: 'bottom top', scrub: 1 } }));
      const hero = document.querySelector('.hero-stage');
      if (hero) {
        const mobile = innerWidth < 761;
        const timeline = gsap.timeline({ scrollTrigger: { trigger: hero, start: 'top top', end: `+=${mobile ? 65 : 125}%`, pin: true, pinSpacing: true, scrub: 0.8, anticipatePin: 1, onUpdate: self => window.dispatchEvent(new CustomEvent('demir:hero-progress', { detail: { progress: self.progress } })) } });
        timeline.to('.hero-line-a', { xPercent: -22, opacity: 0, duration: 0.8 }, 0)
          .to('.hero-line-b', { xPercent: 25, opacity: 0, duration: 0.8 }, 0)
          .to('.hero-line-c', { xPercent: -15, opacity: 0, duration: 0.7 }, 0)
          .to('.hero-description, .hero-footer, .hero-meta, .hero-object-meta', { opacity: 0, duration: 0.35 }, 0)
          .fromTo('.hero-create', { scale: 0.65, opacity: 0 }, { scale: 1.1, opacity: 0.8, duration: 0.6 }, 0.3)
          .to('.hero-create', { scale: 2.5, opacity: 0, duration: 0.5 }, 0.85)
          .to('.hero-shade', { opacity: 1, duration: 0.4 }, 1.05);
      }
      const track = document.querySelector<HTMLElement>('.exhibition-track');
      if (track && innerWidth >= 900) {
        gsap.to(track, { x: () => -(track.scrollWidth - innerWidth + 64), ease: 'none', scrollTrigger: { trigger: '.exhibition-section', pin: true, start: 'top top', end: () => `+=${track.scrollWidth - innerWidth}`, scrub: 1, invalidateOnRefresh: true, onUpdate: self => gsap.set('.exhibition-progress i', { scaleX: self.progress }) } });
      }
      if (document.querySelector('.capability-laser')) gsap.fromTo('.capability-laser', { top: '5%' }, { top: '95%', ease: 'none', scrollTrigger: { trigger: '.capabilities', start: 'top bottom', end: 'bottom top', scrub: 1 } });
    });
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 450);
    document.fonts?.ready.then(() => ScrollTrigger.refresh());
    return () => { clearTimeout(refresh); context.revert(); };
  }, [pathname]);

  return <><div className="reading-progress" aria-hidden="true" /><div ref={cursor} className="custom-cursor" aria-hidden="true"><span ref={cursorText} /></div><div ref={transitionOverlay} className="route-cover" aria-hidden="true"><span>DEMIR DIGITAL</span></div></>;
}
