import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { ArrowUp, Check, Copy, Github, Linkedin } from 'lucide-react';
import { CONTACT, HERO_DATA } from '../constants';
import { Marquee } from '../components/ui';
import { useCinematic } from '../components/motion';
import { goTo } from '../hooks/useSite';

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

const social =
  'flex items-center gap-2 rounded-full border border-line bg-panel/60 px-4 py-2.5 t-small transition-colors hover:border-ink';

/** Copies the address; the label swaps to a confirmation for a moment. */
const CopyEmail: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      // Non-secure context or denied permission: fall back to the mail client.
      window.location.href = `mailto:${CONTACT.email}`;
    }
  };
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? 'Email address copied' : 'Copy email address'}
      className="grid size-11 shrink-0 place-items-center rounded-full border border-line transition-colors hover:border-ink"
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={copied ? 'done' : 'copy'}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ duration: 0.18 }}
          className={copied ? 'text-[#4ade80]' : undefined}
        >
          {copied ? <Check size={17} aria-hidden /> : <Copy size={17} aria-hidden />}
        </motion.span>
      </AnimatePresence>
    </button>
  );
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

      {/* The email is the call to action, so it's the largest thing here,
          with a copy button for people who don't use a mail app. */}
      <div className="mx-auto mt-16 flex max-w-3xl flex-col items-center text-center">
        <p className="flex items-center gap-2 t-small text-mute">
          <span aria-hidden className="size-2 rounded-full bg-[#4ade80] shadow-[0_0_10px_#4ade80]" />
          Open to full-time, contract and consulting work
        </p>

        <div className="mt-6 flex max-w-full flex-wrap items-center justify-center gap-3">
          <a
            href={`mailto:${CONTACT.email}`}
            className="min-w-0 text-[clamp(1.25rem,3.6vw,2.25rem)] font-extrabold leading-tight tracking-[-0.02em] underline decoration-line decoration-2 underline-offset-[0.25em] transition-colors [font-variation-settings:'wdth'_108] hover:decoration-sun"
          >
            {/* Wraps only after the @, never mid-word. */}
            {CONTACT.email.split('@')[0]}@<wbr />{CONTACT.email.split('@')[1]}
          </a>
          <CopyEmail />
        </div>

        <ul className="mt-8 flex flex-wrap justify-center gap-3">
          <li>
            <a href={CONTACT.linkedin} target="_blank" rel="noreferrer" className={social}>
              <Linkedin size={15} aria-hidden />
              LinkedIn
            </a>
          </li>
          <li>
            <a href={CONTACT.github} target="_blank" rel="noreferrer" className={social}>
              <Github size={15} aria-hidden />
              GitHub
            </a>
          </li>
        </ul>

        <p className="mt-8 t-small text-mute">
          It&apos;s <span className="tabular-nums text-ink">{time}</span> in {CONTACT.location.split(',')[0]}, India.
        </p>
      </div>

      <footer className="mx-auto mt-24 flex max-w-6xl flex-wrap items-center justify-between gap-4 border-t border-line pb-28 pt-8 t-small text-mute">
        <p>© {new Date().getFullYear()} {HERO_DATA.name}</p>
        <button
          type="button"
          onClick={() => goTo('home')}
          className="group flex items-center gap-2 rounded-full border border-line px-4 py-2 transition-colors hover:border-ink hover:text-ink"
        >
          Back to top
          <ArrowUp size={14} aria-hidden className="transition-transform duration-300 group-hover:-translate-y-0.5" />
        </button>
      </footer>
    </section>
  );
};
