import React from 'react';
import type { Project } from '../types';
import projectsData from '../data/projects.json';
import { CONTACT } from '../constants';
import { ProjectCover } from '../components/ProjectCover';
import { Pill } from '../components/ui';
import { useSite } from '../hooks/useSite';

const PROJECTS = projectsData as Project[];
const FEATURED = PROJECTS.slice(0, 6);
const SIDE = PROJECTS.slice(6);

const CATEGORY: Record<Project['category'], string> = {
  ai: 'AI and inference',
  systems: 'Systems tooling',
  apps: 'Desktop and web apps',
};

const ProjectCard: React.FC<{ project: Project; compact?: boolean }> = ({ project, compact = false }) => {
  const { dispatch } = useSite();
  return (
    <button
      type="button"
      onClick={() => dispatch({ type: 'OPEN_PROJECT', name: project.name })}
      className={`card sheen group block h-full w-full text-left transition-colors hover:border-blue/60 ${compact ? 'p-2.5' : 'p-3'}`}
    >
      <div className={`overflow-hidden rounded-xl ${compact ? 'aspect-[4/3]' : 'aspect-[16/10]'}`}>
        <div className="h-full transition-transform duration-500 group-hover:scale-[1.03]">
          <ProjectCover project={project} index={PROJECTS.indexOf(project)} compact={compact} />
        </div>
      </div>
      <div className={compact ? 'px-1.5 pb-1.5 pt-3' : 'px-2 pb-2 pt-4'}>
        <p className="text-[11px] text-mute">{CATEGORY[project.category]}</p>
        <h3 className={`mt-1 ${compact ? 't-body font-semibold' : 't-h3'}`}>{project.title}</h3>
        {!compact && <p className="mt-1 line-clamp-2 t-small text-mute">{project.description}</p>}
      </div>
    </button>
  );
};

export const FeaturedWorks: React.FC = () => (
  <section id="work" aria-labelledby="work-title" className="mx-auto max-w-5xl px-5 pb-20 pt-24">
    <h2 id="work-title" className="t-h2 text-center">Some of my featured work</h2>

    <ul className="mt-12 grid gap-5 sm:grid-cols-2">
      {FEATURED.map((p) => (
        <li key={p.name}>
          <ProjectCard project={p} />
        </li>
      ))}
    </ul>

    <div className="mt-10 text-center">
      <Pill href={CONTACT.github} target="_blank" rel="noreferrer">
        See everything on GitHub
      </Pill>
    </div>
  </section>
);

export const SideProjects: React.FC = () => (
  <section aria-labelledby="side-title" className="mx-auto max-w-5xl px-5 py-20">
    <h2 id="side-title" className="t-h2 text-center">My side projects</h2>
    <ul className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {SIDE.map((p) => (
        <li key={p.name}>
          <ProjectCard project={p} compact />
        </li>
      ))}
    </ul>
  </section>
);
