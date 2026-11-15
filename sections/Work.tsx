import React, { useLayoutEffect, useRef, useState } from 'react';
import { Star } from 'lucide-react';
import { motion, useMotionValue, useScroll, useTransform, type MotionValue } from 'framer-motion';
import type { Project } from '../types';
import projectsData from '../data/projects.json';
import { CONTACT } from '../constants';
import { relativeTime } from '../lib/format';
import { ProjectCover } from '../components/ProjectCover';
import { LanguageBar, swatch } from '../components/LanguageBar';
import { Pill } from '../components/ui';
import { useSite } from '../hooks/useSite';
import { Words, useCinematic, useMediaQuery } from '../components/motion';

const PROJECTS = projectsData as Project[];
const FEATURED = 6; // the first six get full cards; the rest follow, smaller

// Whole percents, except where rounding would misstate: <1%, and 99.7% not 100%.
const share = (v: number) => (v < 1 ? '<1%' : v > 99 && v < 100 ? `${v.toFixed(1)}%` : `${Math.round(v)}%`);

const CATEGORY: Record<Project['category'], string> = {
  ai: 'AI and inference',
  systems: 'Systems tooling',
  apps: 'Desktop and web apps',
};

/* ---------------------------------------------------------------------------
   One row for every project, pinned as a coverflow. The section is as tall as
   the row is wide; scrolling down slides the row left, and each card turns on
   its vertical axis by how far it sits from the centre of the screen. Clicking
   a card at the edge brings it to the centre first; clicking the centred card
   opens it. Below md, or with reduced motion, it is a plain swipeable row. */

const TURN = 28; // degrees at the screen edge

type Centre = (el: HTMLElement) => boolean;

const WorkCard: React.FC<{
  project: Project;
  x: MotionValue<number>;
  pinned: boolean;
  compact: boolean;
  centre: Centre;
}> = ({ project: p, x, pinned, compact, centre }) => {
  const { dispatch } = useSite();
  const ref = useRef<HTMLLIElement>(null);
  // offsetLeft is the untransformed position, so adding the row's x gives
  // where the card is on screen right now.
  const rotateY = useTransform(x, (xv) => {
    const el = ref.current;
    if (!el || !pinned) return 0;
    const mid = el.offsetLeft + el.offsetWidth / 2 + xv;
    const d = (mid - window.innerWidth / 2) / window.innerWidth;
    return Math.max(-1, Math.min(1, d)) * -TURN;
  });
  const scale = useTransform(rotateY, (r) => 1 - (Math.abs(r) / TURN) * 0.1);

  const onClick = (e: React.MouseEvent) => {
    // detail is 0 for keyboard activation; focus already centred the card.
    if (e.detail !== 0 && ref.current && centre(ref.current)) return;
    dispatch({ type: 'OPEN_PROJECT', name: p.name });
  };
  const onFocus = (e: React.FocusEvent<HTMLButtonElement>) => {
    if (ref.current && e.currentTarget.matches(':focus-visible')) centre(ref.current);
  };

  return (
    <motion.li
      ref={ref}
      style={pinned ? { rotateY, scale, transformPerspective: 1400 } : undefined}
      className={`shrink-0 snap-center ${
        compact
          ? 'w-[64vw] sm:w-[17rem] md:w-[clamp(14rem,32vh,19rem)]'
          : 'w-[82vw] sm:w-[22rem] md:w-[clamp(18rem,44vh,27rem)]'
      }`}
    >
      <button
        type="button"
        onClick={onClick}
        onFocus={onFocus}
        className="card sheen group block w-full overflow-hidden text-left transition-colors duration-300 hover:border-blue/70"
      >
        <span className="relative block aspect-[4/3] overflow-hidden">
          <span className="block h-full transition-transform duration-700 ease-out group-hover:scale-[1.05]">
            <ProjectCover project={p} index={PROJECTS.indexOf(p)} compact={compact} />
          </span>
          <span className="absolute left-3 top-3 rounded-full bg-navy/85 px-2.5 py-1 text-[11px] font-semibold backdrop-blur">
            {CATEGORY[p.category]}
          </span>
          {!compact && (
            <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-navy/85 px-2.5 py-1 text-[11px] font-semibold backdrop-blur">
              <Star size={11} className="text-sun" aria-hidden />
              {p.stars}
              <span className="sr-only"> stars</span>
            </span>
          )}
        </span>

        <LanguageBar languages={p.languages} className="h-1.5" />

        {compact ? (
          <span className="block p-4">
            <span className="t-h3 block">{p.title}</span>
            <span className="mt-1 block text-xs text-mute">Updated {relativeTime(p.updatedAt)}</span>
          </span>
        ) : (
          <span className="block p-6">
            <span className="flex items-baseline justify-between gap-3">
              <span className="t-h3">{p.title}</span>
              <span className="shrink-0 text-xs text-mute">Updated {relativeTime(p.updatedAt)}</span>
            </span>
            <span className="mt-2 line-clamp-2 t-small text-mute">{p.description}</span>
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
        )}
      </button>
    </motion.li>
  );
};

// Lines the row's first card up with the page container (shell: 72rem, 2rem gutter).
const GUTTER = 'max(1.25rem, calc((100vw - 72rem) / 2 + 2rem))';

export const FeaturedWorks: React.FC = () => {
  const wide = useMediaQuery('(min-width: 768px)');
  const ok = useCinematic();
  const pinned = wide && ok;

  const section = useRef<HTMLElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const distance = useMotionValue(0);
  const [height, setHeight] = useState<string>();

  useLayoutEffect(() => {
    if (!pinned) {
      distance.set(0);
      setHeight(undefined);
      return;
    }
    const measure = () => {
      const d = Math.max(0, (track.current?.scrollWidth ?? 0) - window.innerWidth);
      distance.set(d);
      setHeight(`calc(100vh + ${d}px)`);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (track.current) ro.observe(track.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [pinned, distance]);

  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end end'] });
  const x = useTransform([scrollYProgress, distance], ([p, d]: number[]) => -p * d);

  // Scrolls the page so the card sits mid-screen. Returns false when it is
  // already as central as the row allows, so the caller can open it instead.
  const centre: Centre = (el) => {
    const s = section.current;
    if (!pinned || !s) return false;
    const shift = el.offsetLeft + el.offsetWidth / 2 - window.innerWidth / 2;
    const top = s.offsetTop + Math.max(0, Math.min(distance.get(), shift));
    if (Math.abs(top - window.scrollY) < window.innerWidth * 0.12) return false;
    window.scrollTo({ top });
    return true;
  };

  return (
    <section id="work" ref={section} aria-labelledby="work-title" className="relative" style={{ height }}>
      {/* overflow-clip, not hidden: a hidden box can still be scrolled by
          focus, which would fight the row's transform. */}
      <div className={pinned ? 'sticky top-0 flex h-screen flex-col justify-center overflow-clip' : 'py-section'}>
        <div className="shell flex w-full flex-wrap items-end justify-between gap-x-10 gap-y-4">
          <Words id="work-title" text="What I’ve built" className="t-h2" />
          <p className="max-w-xs t-small text-mute">
            {PROJECTS.length} projects from GitHub, most recently updated first. Open one for the details.
          </p>
        </div>

        <motion.ul
          ref={track}
          style={pinned ? { x, paddingInline: GUTTER } : { paddingInline: GUTTER, scrollPaddingInline: GUTTER }}
          className={`mt-10 flex items-center gap-6 lg:gap-8 ${pinned ? 'w-max py-6' : 'snap-x snap-mandatory overflow-x-auto pb-4 scrollbar-hide'}`}
        >
          {PROJECTS.map((p, i) => (
            <WorkCard key={p.name} project={p} x={x} pinned={pinned} compact={i >= FEATURED} centre={centre} />
          ))}
          <li className="flex w-[64vw] shrink-0 snap-center items-center justify-center sm:w-[17rem]">
            <Pill href={CONTACT.github} target="_blank" rel="noreferrer">
              See everything on GitHub
            </Pill>
          </li>
        </motion.ul>

        {pinned && (
          <div aria-hidden className="shell mt-8 w-full">
            <div className="h-px bg-line">
              <motion.div style={{ scaleX: scrollYProgress }} className="h-px origin-left bg-sun" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
