'use client';

import { useEffect, useRef, useState } from 'react';
import { assetPath } from '@/lib/site';
import Arrow from './Arrow';

export default function Showreel() {
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    dialog.current?.showModal();
    document.body.classList.add('dialog-open');
    window.dispatchEvent(new CustomEvent('demir:scroll-lock', { detail: true }));
    video.current?.play().catch(() => { /* Native controls allow user playback. */ });
    return () => { video.current?.pause(); document.body.classList.remove('dialog-open'); window.dispatchEvent(new CustomEvent('demir:scroll-lock', { detail: false })); };
  }, [open]);
  function close() { dialog.current?.close(); setOpen(false); trigger.current?.focus({ preventScroll: true }); }
  return <section className="showreel page-wrap">
    <div className="section-kicker"><span>IN MOTION</span><span className="kicker-right">DEMIR DIGITAL / 2026</span></div>
    <button className="reel-frame" ref={trigger} onClick={() => setOpen(true)} data-cursor="PLAY" aria-label="Play Demir Digital design study film">
      <img src={assetPath('/media/reel-poster.webp')} alt="Demir Digital motion design study in titanium and electric blue" loading="lazy" width="1600" height="900" />
      <div className="reel-titles"><span className="eyebrow">A STUDY IN MOVEMENT</span><h2>FEEL THE<br /><span>DIFFERENCE.</span></h2></div><span className="reel-play"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 11 7-11 7Z" fill="currentColor" /></svg></span><span className="reel-bottom"><span>DEMIR DIGITAL — SHOWREEL</span><span>00:08 <Arrow /></span></span>
    </button>
    <dialog ref={dialog} className="reel-dialog" aria-label="Demir Digital design study film" onCancel={() => setOpen(false)} onClose={() => setOpen(false)}>
      <button className="reel-close" aria-label="Close showreel" onClick={close}>CLOSE <span>×</span></button>
      {open && <video ref={video} src={assetPath('/media/showreel.webm')} controls playsInline preload="metadata" poster={assetPath('/media/reel-poster.webp')} aria-label="Eight second silent Demir Digital motion design study" />}
      <p>DEMIR DIGITAL / ORIGINAL DESIGN STUDY / SILENT FILM</p>
    </dialog>
  </section>;
}
