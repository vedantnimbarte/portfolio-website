import React, { Suspense, lazy, useEffect, useState } from 'react';
import { HERO_DATA, STATS } from '../constants';
import { Github, Mail, ArrowUpRight, Terminal } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

// three.js is heavy — split it into its own chunk, loaded after first paint.
const HeroScene = lazy(() => import('./three/HeroScene'));

const scrollTo = (id: string) => (e: React.MouseEvent) => {
  e.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
};

const RotatingRole: React.FC = () => {
  const reduced = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => setI((v) => (v + 1) % HERO_DATA.roles.length), 2800);
    return () => clearInterval(t);
  }, [reduced]);

  return (
    <span className="relative inline-flex h-[1.5em] items-center overflow-hidden align-bottom leading-none">
      <AnimatePresence mode="wait">
        <motion.span
          key={HERO_DATA.roles[i]}
          initial={{ y: '110%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-110%', opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="whitespace-nowrap leading-none text-accent"
        >
          {HERO_DATA.roles[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export const Hero: React.FC = () => {
  return (
    <section
      id="hero"
      className="relative flex min-h-screen items-center overflow-hidden pt-28 pb-16 snap-start"
    >
      {/* Ambient background: grid + amber glow */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.12]"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black, transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black, transparent)',
        }}
      />
      <div className="pointer-events-none absolute left-1/2 top-1/3 -z-10 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-accent/10 blur-[130px]" />

      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-6 lg:grid-cols-2 lg:px-12">
        {/* LEFT: copy */}
        <div className="relative z-10 order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-surface/60 px-4 py-1.5 font-mono text-xs text-zinc-400 backdrop-blur"
          >
            <Terminal size={13} className="text-accent" />
            <span className="text-zinc-500">~/</span>vedant · available for work
            <span className="ml-1 h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="mb-4 font-display text-6xl font-black leading-[0.9] tracking-tighter text-white md:text-7xl xl:text-8xl"
          >
            VEDANT
            <br />
            <span className="text-zinc-700">NIMBARTE</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="mb-6 font-display text-xl font-medium tracking-tight text-zinc-300 md:text-2xl"
          >
            <RotatingRole />
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
            className="mb-8 max-w-md text-base leading-relaxed text-zinc-400"
          >
            {HERO_DATA.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="mb-10 flex flex-wrap items-center gap-3"
          >
            <a
              href="#projects"
              onClick={scrollTo('projects')}
              className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3.5 text-sm font-bold text-zinc-900 shadow-[0_0_24px_rgba(251,191,36,0.25)] transition-all hover:-translate-y-0.5 hover:shadow-[0_0_32px_rgba(251,191,36,0.45)]"
            >
              View Work
              <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
            <a
              href={`mailto:${HERO_DATA.email}`}
              className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-surface px-6 py-3.5 text-sm font-medium text-zinc-300 transition-all hover:border-accent/50 hover:text-white"
            >
              <Mail size={16} className="text-accent" />
              Get in touch
            </a>
            <a
              href={HERO_DATA.github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-800 bg-surface text-zinc-400 transition-all hover:scale-110 hover:text-white"
            >
              <Github size={19} />
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="grid max-w-lg grid-cols-2 gap-3 sm:grid-cols-4"
          >
            {STATS.map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-3 transition-colors hover:border-accent/30"
              >
                <div className="font-display text-lg font-bold leading-tight text-accent">{stat.value}</div>
                <div className="mt-0.5 text-[10px] font-bold uppercase tracking-widest text-zinc-500">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT: faceted crystalline core, framed like a blueprint viewport */}
        <div className="relative order-1 h-[340px] w-full overflow-hidden lg:order-2 lg:h-[560px]">
          {/* Corner ticks */}
          <span className="pointer-events-none absolute left-2 top-2 h-5 w-5 border-l border-t border-accent/40" />
          <span className="pointer-events-none absolute right-2 top-2 h-5 w-5 border-r border-t border-accent/40" />
          <span className="pointer-events-none absolute bottom-2 left-2 h-5 w-5 border-b border-l border-accent/40" />
          <span className="pointer-events-none absolute bottom-2 right-2 h-5 w-5 border-b border-r border-accent/40" />
          <span className="pointer-events-none absolute right-3 top-3 font-mono text-[10px] uppercase tracking-widest text-zinc-600">
            core.glb
          </span>
          <Suspense fallback={<div className="h-full w-full" />}>
            <HeroScene />
          </Suspense>
        </div>
      </div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
      >
        <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">Scroll</span>
        <div className="h-10 w-px bg-gradient-to-b from-accent/50 to-transparent" />
      </motion.div>
    </section>
  );
};
