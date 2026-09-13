import React, { useEffect, useState } from 'react';
import { Award, Linkedin, Mail } from 'lucide-react';
import { CONTACT, EXPERIENCE_DATA, HERO_DATA, STATS } from '../constants';
import { Marquee } from '../components/ui';

/* ---------------------------------------------------------------- numbers
   The reference fans out certificates. There are none to show, so the fan
   holds production figures instead, each one verbatim from constants.ts. */

const CARDS = [
  ...STATS.map((s) => ({ value: s.value, label: s.label })),
  { value: '40%', label: 'Faster API responses' },
];

const FAN = [
  { rot: -16, y: 44, bg: '#146ef5', ink: '#ffffff', sub: 'rgba(255,255,255,0.7)' },
  { rot: -8, y: 12, bg: '#1f8a5b', ink: '#ffffff', sub: 'rgba(255,255,255,0.7)' },
  { rot: 0, y: 0, bg: '#f3f5fa', ink: '#0d1526', sub: '#5b6780' },
  { rot: 8, y: 12, bg: '#ffffff', ink: '#0d1526', sub: '#5b6780' },
  { rot: 16, y: 44, bg: '#146ef5', ink: '#ffffff', sub: 'rgba(255,255,255,0.7)' },
];

export const Numbers: React.FC = () => (
  <section aria-labelledby="numbers-title" className="overflow-hidden px-5 pb-10 pt-24">
    <h2 id="numbers-title" className="t-h2 mx-auto max-w-md text-center">
      My Collection of Production Numbers
    </h2>

    <ul className="mx-auto mt-14 flex max-w-5xl justify-center max-md:flex-wrap max-md:gap-4 md:-space-x-6">
      {CARDS.map((c, i) => {
        const f = FAN[i % FAN.length];
        return (
          <li
            key={c.label}
            className="w-[46%] shrink-0 transition-transform duration-300 hover:z-10 hover:-translate-y-4 md:w-48 md:[transform:translateY(var(--y))_rotate(var(--r))]"
            style={{ '--r': `${f.rot}deg`, '--y': `${f.y}px` } as React.CSSProperties}
          >
            <div
              className="flex aspect-[3/4] flex-col justify-between rounded-2xl p-5 shadow-[0_30px_50px_-20px_rgba(0,0,0,0.6)]"
              style={{ backgroundColor: f.bg, color: f.ink }}
            >
              <span className="text-[11px] font-semibold" style={{ color: f.sub }}>
                Production record
              </span>
              <span>
                <span className="block text-4xl font-bold leading-none tracking-tight">{c.value}</span>
                <span className="mt-2 block t-small font-medium">{c.label}</span>
              </span>
              <Award size={26} aria-hidden style={{ color: f.sub }} />
            </div>
          </li>
        );
      })}
    </ul>

    <p className="mx-auto mt-16 max-w-md text-center t-small text-mute">
      Usage and performance figures come from production systems at {EXPERIENCE_DATA[0].company}, {EXPERIENCE_DATA[0].period.replace('–', 'to')}.
    </p>
  </section>
);

/* ----------------------------------------------------------------- bands */

const Band: React.FC<{ className: string; reverse?: boolean; tone: string }> = ({ className, reverse, tone }) => (
  <div className={`absolute inset-x-[-10%] py-4 ${tone} ${className}`}>
    <Marquee seconds={30} reverse={reverse} gap="2rem" className="[mask-image:none]">
      {[...HERO_DATA.roles, ...HERO_DATA.roles].map((role, i) => (
        <span key={i} className="flex items-center gap-8 whitespace-nowrap text-3xl font-semibold tracking-tight sm:text-4xl">
          {role}
          <span aria-hidden className="text-2xl">✦</span>
        </span>
      ))}
    </Marquee>
  </div>
);

export const Bands: React.FC = () => (
  <div aria-hidden className="relative h-56 overflow-hidden sm:h-64">
    <Band tone="bg-blue text-ink" className="top-1/2 -translate-y-1/2 rotate-[5deg]" reverse />
    <Band tone="bg-sun text-navy" className="top-1/2 -translate-y-1/2 -rotate-[6deg]" />
  </div>
);

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
  return (
    <section id="contact" aria-labelledby="contact-title" className="px-5 pt-16">
      <div className="relative mx-auto max-w-6xl text-center">
        <h2 id="contact-title" className="t-giant">
          Let&apos;s Work
          <br />
          Together
        </h2>
        <a
          href={`mailto:${CONTACT.email}`}
          className="absolute left-1/2 top-1/2 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-blue text-center text-xs font-bold leading-tight shadow-[0_0_0_6px_var(--color-navy)] transition-transform hover:scale-110 sm:size-24 sm:text-sm"
        >
          Hire Me
        </a>
      </div>

      <div className="mx-auto mt-10 flex max-w-6xl flex-wrap items-center justify-center gap-3">
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
          Let&apos;s Chat
        </a>
      </p>

      <footer className="mx-auto mt-16 grid max-w-6xl grid-cols-2 gap-8 border-t border-line py-10 t-small sm:grid-cols-3">
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
