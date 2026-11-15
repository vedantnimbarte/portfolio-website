import React, { useEffect, useRef, useState } from 'react';
import { animate, motion, useInView, useReducedMotion, useScroll, useSpring, type MotionValue } from 'framer-motion';
import { EXPERIENCE_DATA } from '../constants';
import { Pill } from '../components/ui';
import { goTo } from '../hooks/useSite';
import { EASE, Words, useCinematic } from '../components/motion';

/* ===========================================================================
   Experience as an impact ledger. Each role is a chapter: company, title,
   dates, then its highlights as ledger rows with the headline figure pulled
   into a left column in the role's colour, so the numbers line up for a
   scan. On large screens a sticky rail (the career ribbon, turned upright,
   each segment as tall as the role lasted) shows which role you're reading.
   ========================================================================= */

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// Months since year 0, so ranges subtract cleanly. "Present" is this month.
const monthIndex = (s: string) => {
  if (/present/i.test(s)) {
    const d = new Date();
    return d.getFullYear() * 12 + d.getMonth();
  }
  const [month, year] = s.trim().split(/\s+/);
  return Number(year) * 12 + MONTHS.indexOf(month);
};

const duration = (months: number) => {
  const y = Math.floor(months / 12);
  const m = months % 12;
  return [y && `${y} yr`, m && `${m} mo`].filter(Boolean).join(' ') || '1 mo';
};

const short = (s: string) => s.replace(/([A-Z][a-z]{2})[a-z]+/, '$1');
// "April 2024" → "Apr ’24", for the narrow rail.
const tiny = (s: string) => short(s).replace(/ \d{2}(\d{2})$/, ' ’$1');

// Newest first, like the data. Current role takes the yellow.
const COLORS = ['#ffd84a', '#146ef5', '#8b7bff', '#2fb67a'];

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Figures are what a recruiter scans for: every number in a highlight is set
// in white, and the first one becomes the row's headline figure.
const FIGURE = /(\d(?:[\d,.]*\d)?\+?%?(?:\/(?:day|month))?)/g;
const withFigures = (text: string) =>
  text.split(FIGURE).map((part, i) =>
    i % 2 ? <strong key={i} className="font-semibold text-ink">{part}</strong> : part
  );
const firstFigure = (text: string) => text.match(FIGURE)?.[0] ?? null;

const ROLES = EXPERIENCE_DATA.map((job, i) => {
  const [from, to] = job.period.split(/\s*[–-]\s*/);
  const start = monthIndex(from);
  const end = monthIndex(to) + 1; // inclusive of the last month
  return {
    ...job,
    id: `role-${slug(job.company)}`,
    from,
    to,
    months: end - start,
    start,
    end,
    current: /present/i.test(to),
    color: COLORS[i % COLORS.length],
  };
});
type Role = (typeof ROLES)[number];

const CAREER = Math.max(...ROLES.map((r) => r.end)) - Math.min(...ROLES.map((r) => r.start));

const initials = (s: string) =>
  s.split(/\s+/).filter((w) => /^[A-Z]/.test(w)).slice(0, 2).map((w) => w[0]).join('') || s[0];

/* ----------------------------------------------------------------- figure
   Counts up once, the first time the whole figure is on screen. Keeps the
   source's formatting: thousands separators, decimals, + and %. */

const Figure: React.FC<{ text: string }> = ({ text }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const still = useReducedMotion();
  const seen = useInView(ref, { once: true, amount: 1 });
  const m = text.match(/^([\d,]*\.?\d+)(.*)$/);

  const format = (v: number) => {
    if (!m) return text;
    const decimals = (m[1].split('.')[1] ?? '').length;
    const body = m[1].includes(',')
      ? v.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
      : v.toFixed(decimals);
    return body + m[2];
  };

  useEffect(() => {
    if (!seen || still || !m) return;
    const c = animate(0, parseFloat(m[1].replace(/,/g, '')), {
      duration: 1.3,
      ease: EASE,
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = format(v);
      },
    });
    return () => c.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seen, still]);

  return <span ref={ref}>{still || !m ? text : format(0)}</span>;
};

/* ---------------------------------------------------------------- chapter */

const Chapter: React.FC<{ role: Role; onActive: () => void }> = ({ role: r, onActive }) => {
  const ref = useRef<HTMLElement>(null);
  // A role with no figures at all drops the figure column.
  const figures = r.highlights.some(firstFigure);
  // Active while the chapter crosses the middle band of the screen.
  const reading = useInView(ref, { margin: '-40% 0px -55% 0px' });
  useEffect(() => {
    if (reading) onActive();
  }, [reading, onActive]);

  return (
    <article ref={ref} id={r.id} className="scroll-mt-28" aria-labelledby={`${r.id}-title`}>
      <div className="flex items-center gap-3">
        <span
          aria-hidden
          className="grid size-10 shrink-0 place-items-center rounded-full text-xs font-bold text-navy"
          style={{ backgroundColor: r.color }}
        >
          {initials(r.company)}
        </span>
        <p className="t-small font-semibold">{r.company}</p>
        {r.current && (
          <span className="rounded-full bg-sun px-2.5 py-0.5 text-[11px] font-semibold text-navy">Current</span>
        )}
      </div>

      <h3
        id={`${r.id}-title`}
        className="mt-5 text-[clamp(1.75rem,3.2vw,2.6rem)] font-extrabold leading-[1.02] tracking-[-0.03em] [font-variation-settings:'wdth'_112] text-balance"
      >
        {r.role}
      </h3>
      <p className="mt-3 t-small text-mute">
        {short(r.from)} {r.current ? 'to now' : `to ${short(r.to)}`}, {duration(r.months)}, {r.location}
      </p>

      <ul className="mt-8 border-t border-line/70">
        {r.highlights.map((h) => {
          const fig = firstFigure(h);
          return (
            <li
              key={h}
              className={`grid gap-x-8 gap-y-1 border-b border-line/70 py-5 ${figures ? 'sm:grid-cols-[9.5rem_minmax(0,1fr)] sm:items-baseline' : ''}`}
            >
              {figures && (
              <span
                className="text-2xl font-extrabold leading-none tracking-tight tabular-nums [font-variation-settings:'wdth'_112] sm:text-3xl"
                style={{ color: r.color }}
              >
                {fig ? <Figure text={fig} /> : <span aria-hidden className="inline-block h-px w-6 translate-y-[-0.35em] bg-current align-middle" />}
              </span>
              )}
              <span className="max-w-[60ch] t-body text-ink/75">{withFigures(h)}</span>
            </li>
          );
        })}
      </ul>
    </article>
  );
};

/* ------------------------------------------------------------------- rail
   The career ribbon, upright. Segment height follows tenure; the marker
   glides to the role being read; the sun line fills as you read down. */

const PX_PER_MONTH = 4.2;

const Rail: React.FC<{ active: number; progress: MotionValue<number> }> = ({ active, progress }) => (
  <nav aria-label="Roles" className="sticky top-28">
    <ol className="relative">
      <motion.span
        aria-hidden
        style={{ scaleY: progress }}
        className="absolute bottom-0 left-[3px] top-0 w-px origin-top bg-sun/60"
      />
      {ROLES.map((r, i) => {
        const on = i === active;
        return (
          <li key={r.id} style={{ minHeight: Math.max(64, r.months * PX_PER_MONTH) }} className="relative flex">
            <span
              aria-hidden
              className="w-[7px] shrink-0 rounded-full transition-[opacity,box-shadow] duration-500"
              style={{
                backgroundColor: r.color,
                opacity: on ? 1 : 0.28,
                boxShadow: on ? `0 0 16px ${r.color}` : 'none',
                marginBlock: 3,
              }}
            />
            <a
              href={`#${r.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(r.id)?.scrollIntoView({ block: 'start' });
              }}
              aria-current={on ? 'true' : undefined}
              className="relative ml-4 block w-full self-start rounded-xl px-3 py-2.5"
            >
              {on && (
                <motion.span
                  layoutId="exp-rail-marker"
                  transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                  className="absolute inset-0 rounded-xl border border-line bg-panel"
                />
              )}
              <span className="relative block">
                <span className={`block t-small font-semibold transition-colors ${on ? 'text-ink' : 'text-mute'}`}>
                  {r.company}
                </span>
                <span className="mt-0.5 block text-xs text-mute">
                  {tiny(r.from)} – {r.current ? 'now' : tiny(r.to)}
                </span>
              </span>
            </a>
          </li>
        );
      })}
    </ol>
  </nav>
);

/* ----------------------------------------------------------------- section */

export const Experience: React.FC = () => {
  const ok = useCinematic();
  const [active, setActive] = useState(0);
  const body = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: body, offset: ['start 45%', 'end 55%'] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
    <section id="experience" aria-labelledby="exp-title" className="shell py-section">
      <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
        <Words id="exp-title" text="Where I’ve worked" className="t-h2" />
        <p className="t-lead text-mute">
          {duration(CAREER)} across {ROLES.length} roles
        </p>
      </div>

      <div className="mt-16 lg:grid lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-20">
        <div className="hidden lg:block">
          <Rail active={active} progress={ok ? progress : scrollYProgress} />
        </div>

        <div ref={body} className="space-y-24">
          {ROLES.map((r, i) => (
            <Chapter key={r.id} role={r} onActive={() => setActive(i)} />
          ))}
        </div>
      </div>

      <div className="mt-20 text-center">
        <Pill href="#contact" onClick={(e) => { e.preventDefault(); goTo('contact'); }}>
          Contact me
        </Pill>
      </div>
    </section>
  );
};
