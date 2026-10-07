'use client';

import Arrow from '@/components/Arrow';

import { useState } from 'react';
import Link from 'next/link';
import { projects, assetPath } from '@/lib/site';

const categories = ['All', 'Hospitality', 'Automotive', 'Digital commerce', 'Creative identity'];

export default function ProjectFilter() {
  const [category, setCategory] = useState('All');
  const visible = category === 'All' ? projects : projects.filter((project) => project.category === category);

  return (
    <section className="interior-project-library" aria-label="Project collection">
      <div className="interior-filter" role="group" aria-label="Filter projects by discipline">
        {categories.map((item) => <button key={item} type="button" aria-pressed={category === item} onClick={() => setCategory(item)}>{item}{item === 'All' && <sup>04</sup>}</button>)}
      </div>
      <p className="interior-sr-only" aria-live="polite">{visible.length} {visible.length === 1 ? 'project' : 'projects'} shown.</p>
      <div className="interior-project-grid">
        {visible.map((project) => (
          <Link className="interior-project" href={`/projects/${project.slug}`} key={project.slug}>
            <div className="interior-project-image">
              <img src={assetPath(project.image)} alt={project.imageAlt} width="1536" height="1024" loading="lazy" />
              <span className="interior-project-label">CONCEPT STUDY — {project.year}</span>
              <span className="interior-project-view" aria-hidden="true"><Arrow /></span>
            </div>
            <div className="interior-project-caption"><div><p>{project.category}</p><h2>{project.name}</h2></div><span>{project.number} / 04</span></div>
          </Link>
        ))}
      </div>
    </section>
  );
}
