import React, { useLayoutEffect, useRef, useState } from 'react';
import { ArrowUpRight, Star } from 'lucide-react';
import { motion, useMotionValue, useScroll, useTransform, type MotionValue } from 'framer-motion';
import type { Project } from '../types';
import projectsData from '../data/projects.json';
import { CONTACT } from '../constants';
import { relativeTime } from '../lib/format';
import { ProjectCover, coverColor } from '../components/ProjectCover';
import { LanguageBar, swatch } from '../components/LanguageBar';
import { Pill } from '../components/ui';
import { useSite } from '../hooks/useSite';
import { Words, useCinematic, useMediaQuery } from '../components/motion';

const PROJECTS = projectsData as Project[];

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
   its vertical axis by how far it sits from the centre of the screen. Every
   card is the same size, and each glows in its cover colour on hover. Clicking
   a card at the edge brings it to the centre first; clicking the centred card
   opens it. Below md, or with reduced motion, it is a plain swipeable row. */

const TURN = 28; // degrees at the screen edge

type Centre = (el: HTMLElement) => boolean;

const WorkCard: React.FC<{
  project: Project;
  x: MotionValue<number>;
  pinned: boolean;
  centre: Centre;
}> = ({ project: p, x, pinned, centre }) => {
  const { dispatch } = useSite();
  const ref = useRef<HTMLLIElement>(null);
  const index = PROJECTS.indexOf(p);
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
  const onFocus = (e: React.FocusEvent<HTMLElement>) => {
    if (ref.current && e.currentTarget.matches(':focus-visible')) centre(ref.current);
  };

  const langs = p.languages.filter((l) => l.name !== 'Other').slice(0, 3);

  return (
    <motion.li
      ref={ref}
      style={pinned ? { rotateY, scale, transformPerspective: 1400 } : undefined}
      className="flex w-[82vw] shrink-0 snap-center sm:w-[22rem] md:w-[clamp(18rem,44vh,26rem)]"
    >
      {/* The card is a container, not a button, so it can hold the live-site
          link. The title button stretches an invisible hit area over the
          whole card; the link sits above it. */}
      <div
        data-project={p.name}
        style={{ '--accent': coverColor(index) } as React.CSSProperties}
        className="card sheen group relative flex w-full flex-col overflow-hidden text-left transition-[border-color,box-shadow] duration-500 hover:border-[var(--accent)] hover:shadow-[0_40px_80px_-36px_var(--accent)] has-[button:focus-visible]:outline-2 has-[button:focus-visible]:outline-offset-4 has-[button:focus-visible]:outline-sun"
      >
        <span className="relative block aspect-[4/3] w-full shrink-0 overflow-hidden">
          <ProjectCover project={p} index={index} />
          <span className="absolute left-3 top-3 rounded-full border border-white/15 bg-navy/75 px-2.5 py-1 text-[11px] font-semibold backdrop-blur-md">
            {CATEGORY[p.category]}
          </span>
        </span>

        <LanguageBar languages={p.languages} className="h-1.5 shrink-0" />

        <span className="flex flex-1 flex-col bg-[linear-gradient(180deg,var(--color-panel),var(--color-deep))] p-6">
          <button
            type="button"
            onClick={onClick}
            onFocus={onFocus}
            className="text-left text-[1.6rem] font-extrabold leading-none tracking-[-0.03em] [font-variation-settings:'wdth'_112] after:absolute after:inset-0 focus-visible:outline-none"
          >
            {p.title}
          </button>
          <span className="mt-2 flex items-center justify-between gap-3 text-xs text-mute">
            Updated {relativeTime(p.updatedAt)}
            <span className="flex items-center gap-1 font-semibold text-ink">
              <Star size={12} className="fill-sun text-sun" aria-hidden />
              {p.stars}
              <span className="sr-only"> stars</span>
            </span>
          </span>
          <span className="mb-5 mt-4 line-clamp-2 t-small text-mute">{p.description}</span>

          <span className="mt-auto flex items-center justify-between gap-3 border-t border-line/70 pt-4">
            <span className="flex min-w-0 flex-wrap gap-x-3.5 gap-y-1">
              {langs.map((l) => (
                <span key={l.name} className="flex items-center gap-1.5 text-xs">
                  <span aria-hidden className="size-2 rounded-full" style={{ backgroundColor: swatch(l.name) }} />
                  {l.name}
                  <span className="tabular-nums text-mute">{share(l.percent)}</span>
                </span>
              ))}
            </span>
            <span className="flex shrink-0 items-center gap-2">
              {p.homepageUrl && (
                <a
                  href={p.homepageUrl}
                  target="_blank"
                  rel="noreferrer"
                  onFocus={onFocus}
                  aria-label={`Open the ${p.title} live site`}
                  className="relative z-10 flex items-center gap-1.5 rounded-full border border-line bg-navy/70 py-1.5 pl-2.5 pr-3 text-xs font-semibold transition-colors hover:border-ink hover:bg-navy"
                >
                  <span aria-hidden className="size-1.5 rounded-full bg-[#4ade80] shadow-[0_0_8px_#4ade80]" />
                  Live site
                </a>
              )}
              <span aria-hidden className="grid size-8 place-items-center rounded-full bg-blue text-ink transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight size={15} />
              </span>
            </span>
          </span>
        </span>
      </div>
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
          className={`mt-10 flex gap-6 lg:gap-8 ${pinned ? 'w-max py-6' : 'snap-x snap-mandatory overflow-x-auto pb-4 scrollbar-hide'}`}
        >
          {PROJECTS.map((p) => (
            <WorkCard key={p.name} project={p} x={x} pinned={pinned} centre={centre} />
          ))}
          <li className="flex w-[64vw] shrink-0 snap-center items-center justify-center sm:w-[16rem]">
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
