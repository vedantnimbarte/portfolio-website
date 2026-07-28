import React, { useState, useMemo } from 'react';
import { FadeIn } from './ui/FadeIn';
import { SectionHeading } from './ui/SectionHeading';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectModal } from './ProjectModal';
import { Project } from '../types';
import { HERO_DATA } from '../constants';
import projectsData from '../data/projects.json';
import {
  Code, Database, Cloud, Cpu, Server, Star, Github, ArrowUpRight,
  Box, Terminal, LayoutGrid, Boxes, LucideIcon, GitBranch,
} from 'lucide-react';

const PROJECTS = projectsData as Project[];

export const getTechDetails = (tech: string): { icon: LucideIcon; label: string } => {
  const l = tech.toLowerCase();
  if (l.includes('rust')) return { icon: Cpu, label: tech };
  if (l.includes('python')) return { icon: Code, label: tech };
  if (l.includes('typescript') || l.includes('javascript') || l.includes('react') || l.includes('next') || l.includes('tauri') || l.includes('vite')) return { icon: LayoutGrid, label: tech };
  if (l.includes('node') || l.includes('express') || l.includes('nest') || l.includes('go') || l.includes('c++') || l.includes('c ')) return { icon: Server, label: tech };
  if (l.includes('sql') || l.includes('mongo') || l.includes('redis') || l.includes('postgres')) return { icon: Database, label: tech };
  if (l.includes('cuda') || l.includes('gpu') || l.includes('rocm')) return { icon: Cpu, label: tech };
  if (l.includes('cloud') || l.includes('aws') || l.includes('gcp') || l.includes('kubernetes') || l.includes('docker')) return { icon: Cloud, label: tech };
  if (l.includes('ai') || l.includes('llm') || l.includes('agent') || l.includes('mcp')) return { icon: Cpu, label: tech };
  return { icon: Code, label: tech };
};

const FILTERS = [
  { id: 'all', label: 'All', icon: Box },
  { id: 'ai', label: 'AI & Agents', icon: Cpu },
  { id: 'systems', label: 'Systems', icon: Terminal },
  { id: 'apps', label: 'Apps', icon: Boxes },
] as const;

const relativeTime = (iso: string): string => {
  const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86_400_000);
  if (days < 30) return 'this month';
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
};

export const Projects: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');
  const [selected, setSelected] = useState<Project | null>(null);

  const filtered = useMemo(
    () => (filter === 'all' ? PROJECTS : PROJECTS.filter((p) => p.category === filter)),
    [filter]
  );

  return (
    <section id="projects" className="mx-auto max-w-7xl px-6 py-28 snap-start lg:px-12">
      <SectionHeading
        eyebrow="projects"
        title="Selected Work"
        meta={`${PROJECTS.length} repos · live`}
      />
      <FadeIn delay={0.1}>
        <p className="mb-10 mt-4 max-w-lg text-lg text-zinc-400">
          Open-source tools spanning AI inference, Rust systems, and cross-platform apps — pulled live from{' '}
          <a href={HERO_DATA.github} target="_blank" rel="noreferrer" className="text-zinc-300 underline decoration-zinc-700 underline-offset-4 transition-colors hover:text-accent">
            @vedantnimbarte
          </a>.
        </p>
      </FadeIn>

      {/* Filter bar */}
      <div className="mb-10 flex flex-wrap gap-2">
        {FILTERS.map((cat) => {
          const Icon = cat.icon;
          const active = filter === cat.id;
          const count = cat.id === 'all' ? PROJECTS.length : PROJECTS.filter((p) => p.category === cat.id).length;
          return (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                active
                  ? 'border-accent bg-accent text-zinc-900 shadow-[0_0_20px_rgba(251,191,36,0.2)]'
                  : 'border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
              }`}
            >
              <Icon size={14} className={active ? 'text-zinc-900' : 'text-zinc-500'} />
              {cat.label}
              <span className={`text-xs ${active ? 'text-zinc-800' : 'text-zinc-600'}`}>{count}</span>
            </button>
          );
        })}
      </div>

      <motion.div layout className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((project) => (
            <motion.article
              key={project.name}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              onClick={() => setSelected(project)}
              whileHover={{ y: -6 }}
              className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-surface/40 p-6 transition-colors hover:border-accent/50"
            >
              <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-accent/5 opacity-0 blur-3xl transition-opacity group-hover:opacity-100" />

              <div className="relative z-10 mb-4 flex items-start justify-between gap-3">
                <h3 className="font-display text-xl font-bold text-white transition-colors group-hover:text-accent">
                  {project.title}
                </h3>
                <span className="flex shrink-0 items-center gap-1 rounded-full border border-zinc-800 bg-zinc-900/70 px-2.5 py-1 text-xs font-semibold text-zinc-300">
                  <Star size={12} className="text-accent" fill="currentColor" />
                  {project.stars}
                </span>
              </div>

              <p className="relative z-10 mb-6 line-clamp-4 flex-grow text-sm leading-relaxed text-zinc-400">
                {project.description}
              </p>

              <div className="relative z-10 mt-auto space-y-4">
                <div className="flex flex-wrap gap-1.5">
                  {project.tech.slice(0, 4).map((t) => {
                    const { icon: Icon, label } = getTechDetails(t);
                    return (
                      <span key={t} className="flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900 px-2.5 py-1 text-xs text-zinc-400">
                        <Icon size={12} className="text-zinc-500" />
                        {label}
                      </span>
                    );
                  })}
                  {project.tech.length > 4 && (
                    <span className="self-center text-[10px] font-bold text-zinc-600">+{project.tech.length - 4}</span>
                  )}
                </div>

                <div className="flex items-center justify-between border-t border-zinc-800/80 pt-4 text-xs text-zinc-500">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-accent" />
                    {project.language ?? 'Multi'} · updated {relativeTime(project.updatedAt)}
                  </span>
                  <ArrowUpRight size={15} className="text-zinc-600 transition-colors group-hover:text-accent" />
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>

      <ProjectModal project={selected} isOpen={!!selected} onClose={() => setSelected(null)} />
    </section>
  );
};
