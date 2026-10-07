'use client';

import { useEffect, useId, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { services, assetPath } from '@/lib/site';

export default function ServicesList({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState<number | null>(2);
  const id = useId();
  useEffect(() => { const frame = requestAnimationFrame(() => ScrollTrigger.refresh()); return () => cancelAnimationFrame(frame); }, [open]);

  return (
    <div className={`interior-services-list${compact ? ' interior-services-compact' : ''}`}>
      {services.map((service, index) => (
        <article className={`interior-service${open === index ? ' is-open' : ''}`} key={service.title} onPointerEnter={(event) => { if (event.pointerType === 'mouse') setOpen(index); }}>
          <h3><button type="button" aria-expanded={open === index} aria-controls={`${id}-${index}`} onClick={() => setOpen(open === index ? null : index)}>
            <span className="interior-service-number">0{index + 1}</span>
            <span className="interior-service-title">{service.title}</span>
            <span className="interior-service-tag">{service.tag}</span>
            <span className="interior-service-toggle" aria-hidden="true">{open === index ? '−' : '+'}</span>
          </button></h3>
          <div className="interior-service-content" id={`${id}-${index}`} hidden={open !== index}>
            <div className="interior-service-visual"><img src={assetPath(service.image)} alt="" loading="lazy" width="600" height="400" /><span aria-hidden="true">DD / 0{index + 1}</span></div>
            <div className="interior-service-copy"><p>{service.description}</p><ul>{service.items.map((item) => <li key={item}>{item}</li>)}</ul></div>
          </div>
        </article>
      ))}
    </div>
  );
}
