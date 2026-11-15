import React, { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import { motion, useMotionValue, useMotionValueEvent, useScroll, useSpring, useTransform } from 'framer-motion';
import type { SectionId } from '../types';
import { EXPERIENCE_DATA, HERO_DATA, SKILLS_DATA, STATS } from '../constants';
import portrait from '../assets/profile.jpg';
import { TechIcon } from '../components/TechIcon';
import { GitHubOrbit } from '../components/GitHubOrbit';
import { Marquee, Pill } from '../components/ui';
import { goTo, useSite } from '../hooks/useSite';
import { EASE, Words, useCinematic } from '../components/motion';

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

const LINKS: { id: SectionId; label: string }[] = [
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'services', label: 'Services' },
  { id: 'contact', label: 'Contact' },
];

const jump = (id: SectionId) => (e: React.MouseEvent) => {
  e.preventDefault();
  goTo(id);
};

export const Nav: React.FC = () => {
  const { dispatch } = useSite();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(y > prev && y > 240);
  });

  return (
    <motion.header
      animate={{ y: hidden ? '-130%' : '0%' }}
      transition={{ duration: 0.45, ease: EASE }}
      onFocusCapture={() => setHidden(false)}
      className="fixed inset-x-0 top-3 z-[100] px-3"
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 rounded-full border border-white/10 bg-navy/65 pl-2 pr-2 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl sm:pl-3">
        <a href="#" onClick={jump('home')} className="flex items-center gap-3">
          <img src={portrait} alt="" className="size-9 rounded-full object-cover ring-2 ring-sun" />
          <span className="leading-tight">
            <span className="block t-small font-semibold">{HERO_DATA.name}</span>
            <span className="mt-0.5 inline-block rounded-full bg-blue px-2 py-px text-[10px] font-semibold">
              Open to work
            </span>
          </span>
        </a>

        <nav aria-label="Sections" className="hidden md:block">
          <ul className="flex gap-1">
            {LINKS.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  onClick={jump(l.id)}
                  className="rounded-full px-3.5 py-2 t-small text-mute transition-colors hover:bg-panel hover:text-ink"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => dispatch({ type: 'PALETTE', open: true })}
            aria-label="Search"
            className="flex items-center gap-2 rounded-full border border-line p-2.5 t-small text-mute transition-colors hover:border-mute hover:text-ink lg:px-3 lg:py-2"
          >
            <Search size={15} aria-hidden />
            <kbd className="hidden rounded bg-panel px-1.5 font-sans text-[11px] lg:inline">{isMac ? '⌘K' : 'Ctrl K'}</kbd>
          </button>
          <Pill href="#contact" onClick={jump('contact')}>
            Let&apos;s talk
          </Pill>
        </div>
      </div>
    </motion.header>
  );
};

const SKILLS = SKILLS_DATA.flatMap((c) => c.skills);
const NOW = EXPERIENCE_DATA[0];
const USERS = STATS.find((s) => s.label === 'Daily Users')?.value;
// The headline already says "full stack", so the proof line keeps only rank.
const SENIORITY = /^senior/i.test(NOW.role) ? 'Senior engineer' : 'Engineer';

/* The page's orchestrated moment: the headline flips up word by word, then
   the orbit sweeps in. Scrolling away tips the orbit back into the page. */
export const Hero: React.FC = () => {
  const ref = useRef<HTMLElement>(null);
  const ok = useCinematic();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });

  const textY = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const stageScale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const stageOpacity = useTransform(scrollYProgress, [0.35, 0.95], [1, 0.15]);

  // The orbit leans toward the cursor; scroll adds a backward tilt on top.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const scrollTilt = useTransform(scrollYProgress, [0, 1], [0, 32]);
  const rotateX = useTransform([scrollTilt, sy], ([t, p]: number[]) => t - p * 8);
  const rotateY = useTransform(sx, (v) => v * 10);

  useEffect(() => {
    if (!ok) return;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      mx.set(e.clientX / window.innerWidth - 0.5);
      my.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener('pointermove', move);
    return () => window.removeEventListener('pointermove', move);
  }, [ok, mx, my]);

  return (
    <section id="home" ref={ref} className="relative pt-32 sm:pt-40">
      {/* Blue haze behind the headline. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[640px] bg-[radial-gradient(55%_60%_at_50%_0%,rgba(20,110,245,0.26),transparent)]" />

      <motion.div style={ok ? { y: textY, opacity: textOpacity } : undefined} className="shell relative text-center">
        <Words
          as="h1"
          onLoad
          delay={0.15}
          text="Full stack developer with a background in systems"
          className="t-hero mx-auto max-w-4xl text-balance"
        />
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.75 }}
          className="mx-auto mt-6 max-w-xl t-lead text-mute"
        >
          Cloud, AI and Rust, shipped to production.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE, delay: 0.9 }}
          className="mt-10"
        >
          <Pill href="#work" onClick={jump('work')}>
            View my work
          </Pill>
          {/* Proof before the scroll: where now, and at what scale. */}
          <p className="mt-6 flex items-center justify-center gap-2 t-small text-mute">
            <span aria-hidden className="size-2 rounded-full bg-sun shadow-[0_0_12px_rgba(255,216,74,0.8)]" />
            <span>
              {SENIORITY} at <span className="font-semibold text-ink">{NOW.company}</span>
              {USERS && <>, {USERS} users a day</>}
            </span>
          </p>
        </motion.div>
      </motion.div>

      <div className="[perspective:1400px]">
        <motion.div
          style={ok ? { rotateX, rotateY, scale: stageScale, opacity: stageOpacity } : undefined}
          className="origin-[50%_30%]"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: EASE, delay: 0.5 }}
          >
            <GitHubOrbit />
          </motion.div>
        </motion.div>
      </div>

      <div id="stack" className="mt-20 scroll-mt-20 border-y border-line/60 py-7">
        <h2 className="sr-only">Stack</h2>
        <Marquee seconds={60} gap="3.5rem">
          {SKILLS.map((skill) => (
            <span key={skill} className="flex items-center gap-2.5 whitespace-nowrap text-lg font-medium text-mute">
              <TechIcon name={skill} size={20} />
              {skill}
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
};
