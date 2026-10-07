'use client';

import { useEffect, useState } from 'react';
import { assetPath, site } from '@/lib/site';

export default function Intro() {
  const [active, setActive] = useState(false);
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    try { if (sessionStorage.getItem('demir-intro-seen')) return; sessionStorage.setItem('demir-intro-seen', '1'); } catch { /* Storage is optional. */ }
    setActive(true);
    let started = performance.now();
    const timer = window.setInterval(() => {
      const amount = Math.min((performance.now() - started) / 1450, 1);
      setProgress(Math.round(amount * 100));
    }, 45);
    const leave = window.setTimeout(() => setLeaving(true), 1650);
    const done = window.setTimeout(() => { setActive(false); clearInterval(timer); window.dispatchEvent(new Event('demir:intro-complete')); }, 2250);
    return () => { clearInterval(timer); clearTimeout(leave); clearTimeout(done); };
  }, []);
  if (!active) return null;
  return <div className={`intro-screen ${leaving ? 'is-leaving' : ''}`} aria-hidden="true"><div className="intro-beam" /><div className="intro-mark">{site.logo ? <img src={assetPath(site.logo)} alt="" /> : <span>DEMIR DIGITAL</span>}<small>CREATIVE AGENCY</small></div><span className="intro-progress">{String(progress).padStart(2, '0')}<i>/100</i></span><span className="intro-caption">INITIALISING A NEW PERSPECTIVE</span></div>;
}
