import React, { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Box, Boxes, Cpu, Star, Terminal } from 'lucide-react';
import type { Project } from '../types';
import projectsData from '../data/projects.json';
import { relativeTime } from '../lib/format';
import { RECORD } from '../lib/knowledge';
import { getTechDetails } from '../components/ui/tech';
import { ModuleHeading } from '../components/ui/Panel';
import { useConsole } from '../hooks/useConsole';

const PROJECTS = projectsData as Project[];

const FILTERS = [
  { id: 'all', label: 'All', icon: Box },
  { id: 'ai', label: 'AI & Agents', icon: Cpu },
  { id: 'systems', label: 'Systems', icon: Terminal },
  { id: 'apps', label: 'Apps', icon: Boxes },
] as const;

export const Work: React.FC = () => {
  const { dispatch } = useConsole();
  const [filter, setFilter] = useState<string>('all');

  const filtered = useMemo(
    () => (filter === 'all' ? PROJECTS : PROJECTS.filter((p) => p.category === filter)),
    [filter]
  );

  return (
    <div>
      <ModuleHeading
        title="WORK"
        hint={`${RECORD.repos} repositories · ${RECORD.stars} stars`}
      />

      <p className="t-prose mb-6 text-ink-dim">
        Public repositories, pulled from the operator&apos;s GitHub at build time. Open
        source across AI inference, Rust systems, and cross-platform tooling.
      </p>

      <div role="group" aria-label="Filter repositories" className="mb-6 flex flex-wrap gap-px">
        {FILTERS.map((f) => {
          const count =
            f.id === 'all' ? PROJECTS.length : PROJECTS.filter((p) => p.category === f.id).length;
          const active = filter === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={active}
              className={`t-micro flex items-center gap-2 border px-3 py-2 transition-colors ${
                active
                  ? 'border-signal/50 bg-signal/10 text-signal'
                  : 'border-trace bg-hull/60 text-ink-dim hover:border-signal/30 hover:text-ink'
              }`}
            >
              <f.icon size={12} aria-hidden />
              {f.label}
              <span className={active ? 'text-signal/60' : 'text-ink-dim/60'}>{count}</span>
            </button>
          );
        })}
      </div>

      <motion.ul layout className="grid gap-px sm:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {filtered.map((project) => (
            <motion.li
              key={project.name}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16 }}
            >
              <button
                type="button"
                onClick={() => dispatch({ type: 'OPEN_PROJECT', name: project.name })}
                className="group flex h-full w-full flex-col border border-trace bg-hull/60 p-5 text-left transition-colors hover:border-signal/40"
              >
                <div className="mb-3 flex items-baseline gap-3">
                  <h3 className="t-readout text-ink group-hover:text-signal">{project.title}</h3>
                  <span aria-hidden className="h-px flex-1 bg-trace" />
                  <span className="t-micro flex items-center gap-1 text-record">
                    <Star size={10} aria-hidden />
                    <span className="sr-only">Stars: </span>
                    {project.stars}
                  </span>
                </div>

                <p className="t-prose mb-4 line-clamp-4 flex-1 text-ink-dim">
                  {project.description}
                </p>

                <ul className="mb-3 flex flex-wrap gap-1">
                  {project.tech.slice(0, 4).map((t) => {
                    const { icon: Icon, label } = getTechDetails(t);
                    return (
                      <li
                        key={t}
                        className="flex items-center gap-1 rounded-[2px] border border-trace bg-void px-1.5 py-0.5 t-micro text-ink-dim"
                      >
                        <Icon size={9} aria-hidden />
                        {label}
                      </li>
                    );
                  })}
                  {project.tech.length > 4 && (
                    <li className="t-micro px-1.5 py-0.5 text-ink-dim">
                      +{project.tech.length - 4}
                    </li>
                  )}
                </ul>

                <p className="t-micro text-ink-dim">
                  {project.language ?? 'Multi'} · updated {relativeTime(project.updatedAt)}
                </p>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
    </div>
  );
};
