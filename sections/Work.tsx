import React from 'react';
import type { Project } from '../types';
import projectsData from '../data/projects.json';
import { CONTACT } from '../constants';
import { ProjectCover } from '../components/ProjectCover';
import { Marquee, Pill } from '../components/ui';
import { useSite } from '../hooks/useSite';

const PROJECTS = projectsData as Project[];
const FEATURED = PROJECTS.slice(0, 6);
const SIDE = PROJECTS.slice(6);

const CATEGORY: Record<Project['category'], string> = {
  ai: 'AI and inference',
  systems: 'Systems tooling',
  apps: 'Desktop and web apps',
};

export const FeaturedWorks: React.FC = () => {
  const { dispatch } = useSite();
  return (
    <section id="work" aria-labelledby="work-title" className="mx-auto max-w-5xl px-5 py-24">
      <h2 id="work-title" className="t-h2 text-center">Some of My Featured Works</h2>

      <ul className="mt-12 grid gap-5 sm:grid-cols-2">
        {FEATURED.map((p, i) => (
          <li key={p.name}>
            <button
              type="button"
              onClick={() => dispatch({ type: 'OPEN_PROJECT', name: p.name })}
              className="card sheen group block h-full w-full p-3 text-left transition-colors hover:border-blue/60"
            >
              <div className="aspect-[16/10] overflow-hidden rounded-xl">
                <div className="h-full transition-transform duration-500 group-hover:scale-[1.03]">
                  <ProjectCover project={p} index={i} />
                </div>
              </div>
              <div className="px-2 pb-2 pt-4">
                <p className="text-[11px] text-mute">{CATEGORY[p.category]}</p>
                <h3 className="mt-1 t-h3">{p.title}</h3>
                <p className="mt-1 line-clamp-2 t-small text-mute">{p.description}</p>
              </div>
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-10 text-center">
        <Pill href={CONTACT.github} target="_blank" rel="noreferrer">
          View All Works
        </Pill>
      </div>
    </section>
  );
};

const SideTile: React.FC<{ project: Project; index: number }> = ({ project, index }) => {
  const { dispatch } = useSite();
  return (
    <button
      type="button"
      onClick={() => dispatch({ type: 'OPEN_PROJECT', name: project.name })}
      className="block h-[180px] w-[290px] shrink-0 overflow-hidden rounded-2xl sm:h-[200px] sm:w-[330px]"
    >
      <span className="sr-only">{project.title}</span>
      <ProjectCover project={project} index={index} compact />
    </button>
  );
};

export const SideProjects: React.FC = () => (
  <section aria-labelledby="side-title" className="py-24">
    <h2 id="side-title" className="t-h2 px-5 text-center">My Side Projects</h2>
    {/* Four tiles are narrower than a wide screen, so each row repeats the set.
        Only the first set in the first row is focusable; the rest is scenery. */}
    <div className="mt-12 space-y-4">
      <Marquee seconds={45}>
        {SIDE.map((p, i) => <SideTile key={p.name} project={p} index={i + FEATURED.length} />)}
        <div className="contents" aria-hidden inert>
          {SIDE.map((p, i) => <SideTile key={p.name} project={p} index={i + FEATURED.length} />)}
        </div>
      </Marquee>
      <div aria-hidden inert>
        <Marquee seconds={45} reverse>
          {[...SIDE, ...SIDE].reverse().map((p, i) => (
            <SideTile key={i} project={p} index={PROJECTS.indexOf(p)} />
          ))}
        </Marquee>
      </div>
    </div>
  </section>
);
