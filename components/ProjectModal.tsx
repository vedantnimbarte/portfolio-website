import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, animate, motion, useReducedMotion, type Variants } from 'framer-motion';
import { ChevronLeft, ChevronRight, ExternalLink, Github, Star, X } from 'lucide-react';
import type { Project } from '../types';
import projectsData from '../data/projects.json';
import { TechIcon, hasBrand } from './TechIcon';
import { relativeTime } from '../lib/format';
import { ProjectCover } from './ProjectCover';
import { swatch } from './LanguageBar';
import { EASE } from './motion';
import { useModalLayer } from '../hooks/useModalLayer';

const PROJECTS = projectsData as Project[];

const CATEGORY: Record<Project['category'], string> = {
  ai: 'AI and inference',
  systems: 'Systems tooling',
  apps: 'Desktop and web apps',
};

const monthYear = (iso: string) => new Date(iso).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

/** Counts up from zero when it appears. Plain number with reduced motion. */
const Count: React.FC<{ to: number }> = ({ to }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const still = useReducedMotion();
  useEffect(() => {
    if (still) return;
    const c = animate(0, to, {
      duration: 1.1,
      ease: EASE,
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = Math.round(v).toLocaleString('en-US');
      },
    });
    return () => c.stop();
  }, [to, still]);
  return <span ref={ref}>{to.toLocaleString('en-US')}</span>;
};

// Activity first: is this real, alive and shipped? Only facts the repo has.
const stats = (p: Project) =>
  [
    { value: <Count to={p.commits} />, label: 'commits' },
    p.release && { value: p.release.tag, label: `latest release, ${relativeTime(p.release.publishedAt)}` },
    { value: monthYear(p.createdAt), label: 'started' },
    { value: relativeTime(p.pushedAt), label: 'last pushed' },
    { value: p.stars, label: p.stars === 1 ? 'star on GitHub' : 'stars on GitHub' },
  ].filter((s): s is { value: React.ReactNode; label: string } => Boolean(s));

/* -------------------------------------------------------------- motion
   The panel grows out of the card that opened it. Inside, a page slides in
   the direction you move between projects, its parts settling in order. */

const page: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir * 56 }),
  center: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.45, ease: EASE, staggerChildren: 0.06, delayChildren: 0.06 },
  },
  exit: (dir: number) => ({ opacity: 0, x: dir * -56, transition: { duration: 0.2, ease: EASE } }),
};
const part: Variants = {
  enter: { opacity: 0, y: 14 },
  center: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

// Where the opening card sits, relative to the centre of the screen. Falls
// back to a short rise when the card is off screen (opened from search).
const origin = (name: string) => {
  const r = document.querySelector(`[data-project="${CSS.escape(name)}"]`)?.getBoundingClientRect();
  const visible = r && r.bottom > 0 && r.top < window.innerHeight && r.right > 0 && r.left < window.innerWidth;
  return visible
    ? { x: r.left + r.width / 2 - window.innerWidth / 2, y: r.top + r.height / 2 - window.innerHeight / 2, scale: 0.45 }
    : { x: 0, y: 24, scale: 0.96 };
};

/* --------------------------------------------------------------- content */

const Page: React.FC<{ p: Project }> = ({ p }) => {
  const index = PROJECTS.findIndex((x) => x.name === p.name);
  const langNames = new Set(p.languages.map((l) => l.name.toLowerCase()));
  const topics = p.topics.filter((t) => !langNames.has(t.toLowerCase()));

  return (
    <>
      <motion.div variants={part} className="relative aspect-[16/8] overflow-hidden sm:aspect-[12/5]">
        <ProjectCover project={p} index={index} />
        <span className="absolute left-4 top-4 rounded-full border border-white/15 bg-navy/75 px-3 py-1 text-xs font-semibold backdrop-blur-md">
          {CATEGORY[p.category]}
        </span>
      </motion.div>

      <div className="px-6 pb-8 pt-7 sm:px-10">
        <motion.h2 variants={part} id="project-modal-title" className="t-h2">
          {p.title}
        </motion.h2>
        <motion.p variants={part} className="mt-4 max-w-[65ch] t-body text-mute text-pretty">
          {p.description}
        </motion.p>

        {/* One strip, hairline-divided: the repo's activity at a glance. */}
        <motion.dl
          variants={part}
          className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-y border-line/70 py-5 sm:flex sm:gap-0 sm:divide-x sm:divide-line/70"
        >
          {stats(p).map((s) => (
            <div key={s.label} className="flex flex-col-reverse sm:px-6 sm:first:pl-0 sm:last:pr-0">
              <dt className="mt-1 text-xs leading-snug text-mute">{s.label}</dt>
              <dd className="text-xl font-extrabold leading-none tracking-tight tabular-nums [font-variation-settings:'wdth'_112]">
                {s.value}
              </dd>
            </div>
          ))}
        </motion.dl>

        <motion.div variants={part} className="mt-8 grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <section aria-labelledby="pm-langs">
            <h3 id="pm-langs" className="t-small font-semibold">Languages</h3>
            <div aria-hidden className="mt-3 flex h-2.5 gap-[3px] overflow-hidden rounded-full">
              {p.languages.map((l, i) => (
                <motion.span
                  key={l.name}
                  variants={{
                    enter: { scaleX: 0 },
                    center: { scaleX: 1, transition: { duration: 0.8, ease: EASE, delay: 0.3 + i * 0.08 } },
                  }}
                  className="h-full min-w-[3px] origin-left"
                  style={{ flex: `${l.percent} 1 0`, backgroundColor: swatch(l.name) }}
                />
              ))}
            </div>
            <ul className="mt-3 space-y-1.5">
              {p.languages.map((l) => (
                <li key={l.name} className="flex items-center gap-2 t-small">
                  <span aria-hidden className="size-2 rounded-full" style={{ backgroundColor: swatch(l.name) }} />
                  {l.name}
                  <span className="ml-auto tabular-nums text-mute">{l.percent}%</span>
                </li>
              ))}
            </ul>
          </section>

          {topics.length > 0 && (
            <section aria-labelledby="pm-topics">
              <h3 id="pm-topics" className="t-small font-semibold">Topics</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {topics.map((t) => (
                  <li key={t} className="flex items-center gap-1.5 rounded-full border border-line bg-deep/60 px-3 py-1 text-xs">
                    {hasBrand(t) && <TechIcon name={t} size={12} color />}
                    {t}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </motion.div>
      </div>
    </>
  );
};

/* ----------------------------------------------------------------- modal */

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (name: string) => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose, onNavigate }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const [dir, setDir] = useState(0);
  useModalLayer(isOpen && Boolean(project));

  const i = project ? PROJECTS.findIndex((p) => p.name === project.name) : -1;
  const n = PROJECTS.length;
  const prev = PROJECTS[(i - 1 + n) % n];
  const next = PROJECTS[(i + 1) % n];
  const go = (d: 1 | -1) => {
    setDir(d);
    onNavigate((d === 1 ? next : prev).name);
  };

  // Latest handlers for the key listener, so it binds once per open.
  const keys = useRef({ onClose, go });
  keys.current = { onClose, go };

  // Escape closes, arrows move between projects; focus returns to the opener.
  useEffect(() => {
    if (!isOpen) return;
    setDir(0);
    opener.current = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        keys.current.onClose();
      } else if (e.key === 'ArrowRight') keys.current.go(1);
      else if (e.key === 'ArrowLeft') keys.current.go(-1);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      opener.current?.focus?.();
    };
  }, [isOpen]);

  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="scrim"
            data-layer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-[200] bg-deep/80 backdrop-blur-md"
          />

          <div key="frame" data-layer className="pointer-events-none fixed inset-0 z-[201] flex items-center justify-center p-3 sm:p-6">
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-modal-title"
              tabIndex={-1}
              initial={{ opacity: 0, ...origin(project.name) }}
              animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97, transition: { duration: 0.2, ease: EASE } }}
              transition={{ type: 'spring', stiffness: 260, damping: 30, mass: 0.9 }}
              className="card sheen pointer-events-auto relative flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden focus:outline-none"
            >
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="absolute right-4 top-4 z-10 grid size-10 place-items-center rounded-full border border-white/15 bg-navy/75 text-ink backdrop-blur-md transition-transform duration-300 hover:rotate-90"
              >
                <X size={17} aria-hidden />
              </button>

              <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain">
                <AnimatePresence mode="wait" initial={false} custom={dir}>
                  <motion.div
                    key={project.name}
                    custom={dir}
                    variants={page}
                    initial="enter"
                    animate="center"
                    exit="exit"
                  >
                    <Page p={project} />
                  </motion.div>
                </AnimatePresence>
              </div>

              <footer className="flex shrink-0 flex-wrap items-center gap-3 border-t border-line bg-deep/40 px-6 py-4 sm:px-10">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 t-small font-semibold text-navy transition-colors hover:bg-sun"
                >
                  <Github size={15} aria-hidden />
                  View source
                </a>
                {project.homepageUrl && (
                  <a
                    href={project.homepageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-full border border-line px-5 py-2.5 t-small font-semibold transition-colors hover:border-ink"
                  >
                    <ExternalLink size={15} aria-hidden />
                    Open live site
                  </a>
                )}

                <div className="ml-auto flex items-center gap-2">
                  {project.license && <span className="mr-2 hidden text-xs text-mute sm:inline">{project.license} license</span>}
                  <button
                    type="button"
                    onClick={() => go(-1)}
                    aria-label={`Previous project: ${prev.title}`}
                    title={prev.title}
                    className="grid size-10 place-items-center rounded-full border border-line transition-colors hover:border-ink"
                  >
                    <ChevronLeft size={17} aria-hidden />
                  </button>
                  <span className="min-w-[3.5rem] text-center text-xs tabular-nums text-mute">
                    {i + 1} of {n}
                  </span>
                  <button
                    type="button"
                    onClick={() => go(1)}
                    aria-label={`Next project: ${next.title}`}
                    title={next.title}
                    className="grid size-10 place-items-center rounded-full border border-line transition-colors hover:border-ink"
                  >
                    <ChevronRight size={17} aria-hidden />
                  </button>
                </div>
              </footer>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
