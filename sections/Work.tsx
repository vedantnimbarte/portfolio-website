import React from 'react';
import { Star } from 'lucide-react';
import type { Project } from '../types';
import projectsData from '../data/projects.json';
import { CONTACT } from '../constants';
import { relativeTime } from '../lib/format';
import { ProjectCover, coverAspect } from '../components/ProjectCover';
import { LanguageBar, swatch } from '../components/LanguageBar';
import { Pill } from '../components/ui';
import { useSite } from '../hooks/useSite';

const PROJECTS = projectsData as Project[];
const FEATURED = PROJECTS.slice(0, 6);
const SIDE = PROJECTS.slice(6);

// Whole percents, except where rounding would misstate: <1%, and 99.7% not 100%.
const share = (v: number) => (v < 1 ? '<1%' : v > 99 && v < 100 ? `${v.toFixed(1)}%` : `${Math.round(v)}%`);

const CATEGORY: Record<Project['category'], string> = {
  ai: 'AI and inference',
  systems: 'Systems tooling',
  apps: 'Desktop and web apps',
};

/* ---------------------------------------------------------------- featured
   Masonry of project cards. Cover proportions follow what each project is
   (terminal tools tall, apps wide, chat square), so the columns stagger on
   their own. The language bar runs across every card as the divider between
   cover and text: each card carries its own strip of real data. */

const MasonryCard: React.FC<{ project: Project }> = ({ project: p }) => {
  const { dispatch } = useSite();
  return (
    <button
      type="button"
      onClick={() => dispatch({ type: 'OPEN_PROJECT', name: p.name })}
      className="card sheen group mb-5 block w-full break-inside-avoid overflow-hidden text-left transition-colors duration-300 hover:border-blue/70"
    >
      <span className={`relative block overflow-hidden ${coverAspect(p)}`}>
        <span className="block h-full transition-transform duration-500 ease-out group-hover:scale-[1.04]">
          <ProjectCover project={p} index={PROJECTS.indexOf(p)} />
        </span>
        <span className="absolute left-3 top-3 rounded-full bg-navy/85 px-2.5 py-1 text-[11px] font-semibold backdrop-blur">
          {CATEGORY[p.category]}
        </span>
        <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-navy/85 px-2.5 py-1 text-[11px] font-semibold backdrop-blur">
          <Star size={11} className="text-sun" aria-hidden />
          {p.stars}
          <span className="sr-only"> stars</span>
        </span>
      </span>

      <LanguageBar languages={p.languages} className="h-1.5" />

      <span className="block p-5">
        <span className="flex items-baseline justify-between gap-3">
          <span className="t-h3">{p.title}</span>
          <span className="shrink-0 text-xs text-mute">Updated {relativeTime(p.updatedAt)}</span>
        </span>
        <span className="mt-2 line-clamp-3 t-small text-mute">{p.description}</span>
        <span className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
          {p.languages.map((l) => (
            <span key={l.name} className="flex items-center gap-1.5 text-xs">
              <span aria-hidden className="size-2 rounded-full" style={{ backgroundColor: swatch(l.name) }} />
              {l.name}
              <span className="tabular-nums text-mute">{share(l.percent)}</span>
            </span>
          ))}
        </span>
      </span>
    </button>
  );
};

export const FeaturedWorks: React.FC = () => (
  <section id="work" aria-labelledby="work-title" className="mx-auto max-w-6xl px-5 pb-20 pt-24">
    <h2 id="work-title" className="t-h2 text-center">Some of my featured work</h2>

    <ul className="mt-12 gap-5 sm:columns-2 lg:columns-3">
      {FEATURED.map((p) => (
        <li key={p.name} className="break-inside-avoid">
          <MasonryCard project={p} />
        </li>
      ))}
    </ul>

    <div className="mt-6 text-center">
      <Pill href={CONTACT.github} target="_blank" rel="noreferrer">
        See everything on GitHub
      </Pill>
    </div>
  </section>
);

/* ------------------------------------------------------------ side projects */

const SideCard: React.FC<{ project: Project }> = ({ project }) => {
  const { dispatch } = useSite();
  return (
    <button
      type="button"
      onClick={() => dispatch({ type: 'OPEN_PROJECT', name: project.name })}
      className="card sheen group block h-full w-full p-2.5 text-left transition-colors hover:border-blue/60"
    >
      <div className="aspect-[4/3] overflow-hidden rounded-xl">
        <div className="h-full transition-transform duration-500 group-hover:scale-[1.03]">
          <ProjectCover project={project} index={PROJECTS.indexOf(project)} compact />
        </div>
      </div>
      <div className="px-1.5 pb-1.5 pt-3">
        <p className="text-[11px] text-mute">{CATEGORY[project.category]}</p>
        <h3 className="mt-1 t-body font-semibold">{project.title}</h3>
      </div>
    </button>
  );
};

export const SideProjects: React.FC = () => (
  <section aria-labelledby="side-title" className="mx-auto max-w-5xl px-5 py-20">
    <h2 id="side-title" className="t-h2 text-center">My side projects</h2>
    <ul className="mt-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
      {SIDE.map((p) => (
        <li key={p.name}>
          <SideCard project={p} />
        </li>
      ))}
    </ul>
  </section>
);
