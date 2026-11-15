import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { Activity, Linkedin, Mail, Sparkles, Users, Zap } from 'lucide-react';
import { CONTACT, EXPERIENCE_DATA, HERO_DATA, STATS } from '../constants';
import { Marquee } from '../components/ui';
import { Words, useCinematic, useMediaQuery } from '../components/motion';

/* ---------------------------------------------------------------- numbers
   The reference fans out certificates. There are none to show, so the fan
   holds Cloudairy production figures, each from constants.ts. Years of
   experience lives in the hero, so it isn't repeated here. */

const stat = (label: string) => STATS.find((s) => s.label === label)?.value ?? '';

const CARDS = [
  { value: stat('Daily Users'), label: 'Daily users', note: 'On MERN apps I architected', icon: Users },
  { value: stat('System Uptime'), label: 'Uptime', note: 'Across those same systems', icon: Activity },
  { value: stat('AI Ops/Mo'), label: 'OpenAI calls a month', note: 'Powering generative features', icon: Sparkles },
  { value: '40%', label: 'Faster API responses', note: 'From indexing and caching', icon: Zap },
];

const FAN = [
  { rot: -12, y: 28, bg: '#146ef5', ink: '#ffffff', sub: 'rgba(255,255,255,0.72)' },
  { rot: -4, y: 4, bg: '#1f8a5b', ink: '#ffffff', sub: 'rgba(255,255,255,0.72)' },
  { rot: 4, y: 4, bg: '#f3f5fa', ink: '#0d1526', sub: '#5b6780' },
  { rot: 12, y: 28, bg: '#ffd84a', ink: '#0d1526', sub: '#5b5222' },
];

const CARD_STEP = 192; // md card width (13rem) minus the 1rem overlap

const FanCard: React.FC<{ c: (typeof CARDS)[number]; i: number; open: MotionValue<number>; fan: boolean }> = ({ c, i, open, fan }) => {
  const f = FAN[i];
  const toCentre = ((CARDS.length - 1) / 2 - i) * CARD_STEP;
  const x = useTransform(open, [0, 1], [toCentre, 0]);
  const y = useTransform(open, [0, 1], [60, f.y]);
  const rotate = useTransform(open, [0, 1], [i * 3 - 4, f.rot]);
  return (
    <motion.li
      style={fan ? { x, y, rotate, zIndex: i } : undefined}
      className="group md:w-52 md:shrink-0"
    >
      <div
        className="flex aspect-[3/4] flex-col justify-between rounded-2xl p-5 shadow-[0_40px_60px_-24px_rgba(0,0,0,0.7)] transition-transform duration-300 group-hover:-translate-y-4"
        style={{ backgroundColor: f.bg, color: f.ink }}
      >
        <c.icon size={24} aria-hidden style={{ color: f.sub }} />
        <span>
          <span className="block text-4xl font-bold leading-none tracking-tight sm:text-5xl">{c.value}</span>
          <span className="mt-2 block t-body font-semibold">{c.label}</span>
          <span className="mt-1 block text-xs" style={{ color: f.sub }}>{c.note}</span>
        </span>
      </div>
    </motion.li>
  );
};

export const Numbers: React.FC = () => {
  const ref = useRef<HTMLUListElement>(null);
  const wide = useMediaQuery('(min-width: 768px)');
  const fan = useCinematic() && wide;
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center 55%'] });

  return (
    <section aria-labelledby="numbers-title" className="overflow-hidden py-section">
      <div className="shell">
        <Words id="numbers-title" text="Numbers from production" className="t-h2 mx-auto max-w-xl text-center" />
      </div>

      <ul ref={ref} className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-4 px-5 md:flex md:justify-center md:gap-0 md:-space-x-4 md:px-0">
        {CARDS.map((c, i) => (
          <FanCard key={c.label} c={c} i={i} open={scrollYProgress} fan={fan} />
        ))}
      </ul>

      <p className="mx-auto mt-20 max-w-md px-5 text-center t-small text-mute">
        Measured on production systems at {EXPERIENCE_DATA[0].company}, {EXPERIENCE_DATA[0].period.replace('–', 'to')}.
      </p>
    </section>
  );
};

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
