import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { Linkedin, Mail } from 'lucide-react';
import { CONTACT, HERO_DATA } from '../constants';
import { Marquee } from '../components/ui';
import { useCinematic } from '../components/motion';

/* ----------------------------------------------------------------- bands */

const Band: React.FC<{ rotate: MotionValue<number> | number; reverse?: boolean; tone: string }> = ({ rotate, reverse, tone }) => (
  <motion.div style={{ rotate, y: '-50%' }} className={`absolute inset-x-[-10%] top-1/2 py-4 ${tone}`}>
    <Marquee seconds={30} reverse={reverse} gap="2rem" className="[mask-image:none]">
      {[...HERO_DATA.roles, ...HERO_DATA.roles].map((role, i) => (
        <span key={i} className="flex items-center gap-8 whitespace-nowrap text-3xl font-semibold tracking-tight sm:text-4xl">
          {role}
          <span aria-hidden className="text-2xl">✦</span>
        </span>
      ))}
    </Marquee>
  </motion.div>
);

export const Bands: React.FC = () => {
  const ok = useCinematic();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const a = useTransform(scrollYProgress, [0, 1], [-2, 9]);
  const b = useTransform(scrollYProgress, [0, 1], [2, -10]);
  return (
    <div ref={ref} aria-hidden className="relative h-64 overflow-hidden sm:h-72">
      <Band tone="bg-blue text-ink" rotate={ok ? a : 5} reverse />
      <Band tone="bg-sun text-navy" rotate={ok ? b : -6} />
    </div>
  );
};

/* --------------------------------------------------------------- contact */

const useLocalTime = () => {
  const fmt = () =>
    new Date().toLocaleTimeString('en-GB', { timeZone: CONTACT.timeZone, hour: '2-digit', minute: '2-digit' });
  const [time, setTime] = useState(fmt);
  useEffect(() => {
    const t = window.setInterval(() => setTime(fmt()), 30_000);
    return () => clearInterval(t);
  }, []);
  return time;
};

export const Contact: React.FC = () => {
  const time = useLocalTime();
  const ok = useCinematic();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center 60%'] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [55, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);
  const hire = useTransform(scrollYProgress, [0.5, 1], [0, 1]);

  return (
    <section id="contact" aria-labelledby="contact-title" className="px-5 pt-section">
      <div ref={ref} className="relative mx-auto max-w-6xl text-center [perspective:1200px]">
        <motion.h2
          id="contact-title"
          style={ok ? { rotateX, scale, opacity } : undefined}
          className="t-giant origin-bottom"
        >
          Let&apos;s work
          <br />
          together
        </motion.h2>
        <motion.a
          style={ok ? { scale: hire } : undefined}
          href={`mailto:${CONTACT.email}`}
          className="absolute left-1/2 top-1/2 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-blue text-center text-xs font-bold leading-tight shadow-[0_0_0_6px_var(--color-navy)] transition-transform hover:scale-110 sm:size-24 sm:text-sm"
        >
          Hire me
        </motion.a>
      </div>

      <div className="mx-auto mt-14 flex max-w-6xl flex-wrap items-center justify-center gap-3">
        <a
          href={`mailto:${CONTACT.email}`}
          className="flex items-center gap-2 rounded-full border border-line bg-panel px-4 py-2.5 t-small transition-colors hover:border-blue"
        >
          <Mail size={15} className="text-sun" aria-hidden />
          {CONTACT.email}
        </a>
        <a
          href={CONTACT.linkedin}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 rounded-full border border-line bg-panel px-4 py-2.5 t-small transition-colors hover:border-blue"
        >
          <Linkedin size={15} className="text-sun" aria-hidden />
          {CONTACT.linkedinHandle}
        </a>
      </div>

      <p className="mx-auto mt-10 max-w-6xl text-center t-small text-mute sm:text-right">
        Available for full-time, contract and consulting work.{' '}
        <a href={`mailto:${CONTACT.email}`} className="font-semibold text-sun underline-offset-4 hover:underline">
          Let&apos;s chat
        </a>
      </p>

      <footer className="mx-auto mt-24 grid max-w-6xl grid-cols-2 gap-8 border-t border-line py-10 t-small sm:grid-cols-3">
        <div>
          <p className="text-mute">Made by</p>
          <p className="mt-1">{HERO_DATA.name}</p>
          <p className="mt-1 text-mute">© {new Date().getFullYear()}</p>
        </div>
        <div>
          <p className="text-mute">Local time</p>
          <p className="mt-1">
            {CONTACT.location.split(',')[0]} <span className="tabular-nums">{time}</span>
          </p>
        </div>
        <div>
          <p className="text-mute">Socials</p>
          <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1">
            <li><a href={CONTACT.linkedin} target="_blank" rel="noreferrer" className="hover:text-sun">LinkedIn</a></li>
            <li><a href={CONTACT.github} target="_blank" rel="noreferrer" className="hover:text-sun">GitHub</a></li>
            <li><a href={`mailto:${CONTACT.email}`} className="hover:text-sun">Email</a></li>
          </ul>
        </div>
      </footer>
    </section>
  );
};
