import Arrow from '@/components/Arrow';
import type { Metadata } from 'next';
import Link from 'next/link';
import ProjectFilter from '@/components/ProjectFilter';

export const metadata: Metadata = { title: 'Selected work', description: 'Explore Demir Digital’s concept studies across hospitality, automotive, digital commerce and creative identity.' };

export default function ProjectsPage() {
  return <main className="interior-page page-wrap">
    <header className="interior-page-header"><div className="interior-header-top"><span className="eyebrow">A SELECTED PERSPECTIVE</span><span className="eyebrow">INDEX / 01—04</span></div><h1 data-reveal>Work with<br /><span>intention.</span><sup>04</sup></h1><div className="interior-header-bottom"><p>A collection of ideas made tangible.<br />Different worlds. One considered approach.</p><p className="interior-disclosure">Independent concept studies.<br />Explorations of what comes next.</p></div></header>
    <ProjectFilter />
    <div className="interior-ending"><p>YOUR PROJECT COULD BE NEXT.</p><Link href="/contact">Let’s make something matter. <span aria-hidden="true"><Arrow /></span></Link></div>
  </main>;
}
