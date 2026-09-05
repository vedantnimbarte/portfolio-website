import React, { Suspense, lazy, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ABOUT_PARAGRAPHS, CAPABILITIES, CONTACT, HERO_DATA } from '../constants';
import { RECORD } from '../lib/knowledge';
import { Leader, ModuleHeading, Ticks } from '../components/ui/Panel';

// Code-split so three.js never blocks first paint. Identity unmounts when you
// switch modules, releasing the WebGL context — a live rAF loop behind four
// hidden panels is pure battery drain.
const HeroScene = lazy(() => import('../components/three/HeroScene'));

const WORKING_SET = ['React', 'TypeScript', 'Rust', 'Node.js', 'Python', 'AWS', 'Docker', 'Three.js'];

const item = { hidden: { opacity: 0, y: 6 }, show: { opacity: 1, y: 0 } };

export const Identity: React.FC = () => {
  // Mount the reactor only after the panel enter animation settles. react-three-fiber
  // measures its container once on mount; doing that mid-transition makes it miss and
  // fall back to the default 300x150 canvas, which reads as a blank frame. Waiting also
  // keeps WebGL init off the same frames as the module swap.
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setReady(true), 260);
    return () => clearTimeout(t);
  }, []);

  // react-three-fiber sizes its canvas from a ResizeObserver, which only
  // delivers during a rendering frame. If the module mounts while the tab is
  // throttled the observation never lands and the canvas is left at its
  // unstyled 300x150 default, which reads as an empty frame. A single resize
  // event routes through the same measure path and is not frame-dependent.
  useEffect(() => {
    if (!ready) return;
    const kick = () => window.dispatchEvent(new Event('resize'));
    const t = window.setTimeout(kick, 60);
    return () => clearTimeout(t);
  }, [ready]);

  return (
  <div className="space-y-12">
    <ModuleHeading title="IDENTITY" hint={`operator record · ${RECORD.posts} posts indexed`} />

    <div className="grid items-center gap-10 lg:grid-cols-[1fr_minmax(0,320px)]">
      <motion.div variants={item}>
        <p className="t-nameplate text-ink">
          VEDANT
          <br />
          <span className="text-ink-dim">NIMBARTE</span>
        </p>

        <div className="mt-8 max-w-lg space-y-2">
          <Leader label="role" tone="signal">{HERO_DATA.title}</Leader>
          <Leader label="station">{HERO_DATA.location}</Leader>
          <Leader label="runtime">{`5+ yrs continuous · since ${RECORD.since}`}</Leader>
          <Leader label="status" tone="signal">accepting inbound</Leader>
        </div>
      </motion.div>

      {/* The reactor. Fixed aspect so the panel never reflows around it. */}
      <motion.div variants={item} className="relative mx-auto aspect-square w-full max-w-[320px]">
        <Ticks />
        {ready && (
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>
        )}
      </motion.div>
    </div>

    <div className="grid gap-10 lg:grid-cols-2">
      <motion.div variants={item} className="space-y-4">
        {ABOUT_PARAGRAPHS.map((para) => (
          <p key={para.slice(0, 24)} className="t-prose text-ink-dim">
            {para}
          </p>
        ))}

        <div className="pt-4">
          <p className="t-label mb-3 text-ink-dim">Working set</p>
          <ul className="flex flex-wrap gap-1.5">
            {WORKING_SET.map((tech) => (
              <li
                key={tech}
                className="rounded-[2px] border border-trace bg-hull px-2 py-1 t-micro text-ink-dim"
              >
                {tech}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      <ul className="space-y-3">
        {CAPABILITIES.map((cap) => (
          <motion.li
            key={cap.title}
            variants={item}
            className="bevel chamfer-sm relative flex gap-4 border border-trace bg-hull/60 p-5"
          >
            <cap.icon size={18} className="mt-0.5 shrink-0 text-signal" aria-hidden />
            <div>
              <h3 className="t-label mb-1.5 text-ink">{cap.title}</h3>
              <p className="t-prose text-ink-dim">{cap.description}</p>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>

    <motion.p variants={item} className="t-micro text-ink-dim">
      Direct channels: {CONTACT.email} · {CONTACT.linkedinHandle} · {CONTACT.githubHandle}
    </motion.p>
  </div>
  );
};
