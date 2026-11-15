import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';

/* ===========================================================================
   Shared motion vocabulary. One curve, a 3D word rise for headings, a 3D
   block rise for content, and a cursor tilt with parallax layers. Everything
   scroll- or pointer-linked checks useCinematic(); <MotionConfig
   reducedMotion="user"> in App covers the declarative animations.
   ========================================================================= */

export const EASE = [0.22, 1, 0.36, 1] as const;

export const useCinematic = () => !useReducedMotion();

export const useMediaQuery = (query: string) => {
  const [match, setMatch] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    on();
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return match;
};

/** Thin bar pinned to the top edge that fills as the page is read. */
export const ScrollProgress: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  return (
    <motion.div aria-hidden style={{ scaleX }} className="fixed inset-x-0 top-0 z-[110] h-[3px] origin-left bg-sun" />
  );
};

/* ------------------------------------------------------------------ words
   Each word flips up from below its baseline, hinged at the bottom. */

const wordParent = (delay: number) => ({
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: delay } },
});
const wordChild = {
  hidden: { opacity: 0, y: '0.5em', rotateX: -75 },
  show: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.9, ease: EASE } },
};

export const Words: React.FC<{
  text: string;
  as?: 'h1' | 'h2' | 'h3';
  id?: string;
  className?: string;
  delay?: number;
  /** Plays on page load instead of on scroll into view. */
  onLoad?: boolean;
}> = ({ text, as = 'h2', id, className = '', delay = 0, onLoad = false }) => {
  const Tag = motion[as];
  const trigger = onLoad
    ? { animate: 'show' }
    : { whileInView: 'show', viewport: { once: true, amount: 0.6 } };
  return (
    <Tag id={id} className={`[perspective:900px] ${className}`} variants={wordParent(delay)} initial="hidden" {...trigger}>
      {text.split(' ').map((w, i) => (
        <React.Fragment key={i}>
          <motion.span variants={wordChild} className="inline-block origin-bottom">{w}</motion.span>{' '}
        </React.Fragment>
      ))}
    </Tag>
  );
};

/* ------------------------------------------------------------------- rise
   A block tips up out of the page as it scrolls into view. */

export const Rise: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: 'div' | 'li' | 'article';
  id?: string;
}> = ({ children, className, delay = 0, as = 'div', id }) => {
  const Tag = motion[as];
  return (
    <Tag
      id={id}
      className={className}
      style={{ transformPerspective: 1200 }}
      initial={{ opacity: 0, y: 70, rotateX: 14 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1, ease: EASE, delay }}
    >
      {children}
    </Tag>
  );
};

/* ------------------------------------------------------------------- tilt
   The card turns toward the cursor and a soft highlight follows it. <Depth>
   children shift with the tilt by their z, so a scene inside a card reads
   in layers. Done with x/y, not translateZ, so it survives overflow-hidden. */

const TiltCtx = createContext<{ x: MotionValue<number>; y: MotionValue<number> } | null>(null);

export const Tilt: React.FC<{
  children: React.ReactNode;
  className?: string;
  /** Classes for the turning surface; give it the card's radius. */
  inner?: string;
  max?: number;
}> = ({ children, className = '', inner = '', max = 8 }) => {
  const ok = useCinematic();
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const x = useSpring(px, { stiffness: 180, damping: 18 });
  const y = useSpring(py, { stiffness: 180, damping: 18 });
  const rotateY = useTransform(x, [0, 1], [-max, max]);
  const rotateX = useTransform(y, [0, 1], [max, -max]);
  const gx = useTransform(x, (v) => `${v * 100}%`);
  const gy = useTransform(y, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.12), transparent 55%)`;

  if (!ok) return <div className={`${className} ${inner}`}>{children}</div>;

  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width);
    py.set((e.clientY - r.top) / r.height);
  };
  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <div className={`group/tilt [perspective:1100px] ${className}`} onPointerMove={move} onPointerLeave={reset}>
      <motion.div style={{ rotateX, rotateY }} className={`relative h-full ${inner}`}>
        <TiltCtx.Provider value={{ x, y }}>{children}</TiltCtx.Provider>
        <motion.span
          aria-hidden
          style={{ background: glare }}
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/tilt:opacity-100"
        />
      </motion.div>
    </div>
  );
};

export const Depth: React.FC<{ z: number; className?: string; children: React.ReactNode }> = ({ z, className, children }) => {
  const t = useContext(TiltCtx);
  const still = useMotionValue(0.5);
  const x = useTransform(t?.x ?? still, (v: number) => (v - 0.5) * z);
  const y = useTransform(t?.y ?? still, (v: number) => (v - 0.5) * z);
  return <motion.div className={className} style={{ x, y }}>{children}</motion.div>;
};
