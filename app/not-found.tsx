import Arrow from '@/components/Arrow';
import Link from 'next/link';

export default function NotFound() {
  return <main className="interior-page page-wrap interior-not-found"><span className="eyebrow">404 / A DIFFERENT DIRECTION</span><h1 data-reveal>Off the<br /><span>beaten path.</span></h1><p>This page has moved, or the address took a wrong turn.<br />There’s still plenty to discover.</p><Link className="interior-submit" href="/">Back to the studio <span aria-hidden="true"><Arrow /></span></Link><Link className="line-link" href="/projects">Explore our work <span aria-hidden="true"><Arrow /></span></Link></main>;
}
