import React, { useRef, useState } from 'react';
import { AnimatePresence, motion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { Activity, Sparkles, Users, Zap } from 'lucide-react';
import { EXPERIENCE_DATA, STATS } from '../constants';
import { Pill } from '../components/ui';
import { goTo } from '../hooks/useSite';
import { EASE, Rise, Words, useCinematic, useMediaQuery } from '../components/motion';

/* ===========================================================================
   Experience as a career timeline. A ribbon across the top sizes each role by
   how long it actually lasted; below, a spine runs through every role with
   dates on one side and the role card on the other. One colour per role ties
   segment, dot and avatar together.
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

// Newest first, like the data. Current role takes the yellow.
const COLORS = [
  { bg: '#ffd84a', ink: '#0d1526' },
  { bg: '#146ef5', ink: '#ffffff' },
  { bg: '#8b7bff', ink: '#0d1526' },
  { bg: '#1f8a5b', ink: '#ffffff' },
];

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const ROLES = EXPERIENCE_DATA.map((job, i) => {
  const [from, to] = job.period.split(/\s*[–-]\s*/);
  const start = monthIndex(from);
  const end = monthIndex(to) + 1; // inclusive of the last month
  return {
    ...job,
    id: `role-${slug(job.company)}`,
    from,
    to,
    start,
    end,
    months: end - start,
    current: /present/i.test(to),
    color: COLORS[i % COLORS.length],
  };
});

// Roles that hand over mid-month overlap by a month; on the ribbon each one
// stops where the next begins so segments never sit on top of each other.
const ribbonEnd = (i: number) => (i > 0 ? Math.min(ROLES[i].end, ROLES[i - 1].start) : ROLES[i].end);

const T0 = Math.floor(Math.min(...ROLES.map((r) => r.start)) / 12) * 12; // January of the first year
const T1 = Math.max(...ROLES.map((r) => r.end));
const SPAN = T1 - T0;
const CAREER = T1 - Math.min(...ROLES.map((r) => r.start));
const pct = (month: number) => ((month - T0) / SPAN) * 100;
const YEARS = Array.from({ length: Math.floor((T1 - 1) / 12) - T0 / 12 + 1 }, (_, i) => T0 / 12 + i);

const initials = (s: string) =>
  s.split(/\s+/).filter((w) => /^[A-Z]/.test(w)).slice(0, 2).map((w) => w[0]).join('') || s[0];

// Figures are what a recruiter scans for, so every number in a highlight is
// set in white. Applied to all of them, not picked by hand.
const FIGURE = /(\d(?:[\d,.]*\d)?\+?%?(?:\/(?:day|month))?)/g;
const withFigures = (text: string) =>
  text.split(FIGURE).map((part, i) =>
    i % 2 ? <strong key={i} className="font-semibold text-ink">{part}</strong> : part
  );

/* ---------------------------------------------------------------- numbers
   Closes the timeline: the current role's production figures fan out as
   they scroll in, each from constants.ts. */

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
    <div aria-labelledby="numbers-title" role="group" className="mt-section">
      <Words as="h3" id="numbers-title" text={`${EXPERIENCE_DATA[0].company}, in numbers`} className="t-h2 mx-auto max-w-xl text-center" />

      <ul ref={ref} className="mx-auto mt-16 grid max-w-4xl grid-cols-2 gap-4 md:flex md:justify-center md:gap-0 md:-space-x-4">
        {CARDS.map((c, i) => (
          <FanCard key={c.label} c={c} i={i} open={scrollYProgress} fan={fan} />
        ))}
      </ul>

      <p className="mx-auto mt-20 max-w-md text-center t-small text-mute">
        Measured on production systems at {EXPERIENCE_DATA[0].company}, {EXPERIENCE_DATA[0].period.replace('–', 'to')}.
      </p>
    </div>
  );
};

/* The current role shows everything. Older roles lead with their top two
   highlights and fold the rest away, so the timeline scans quickly. */
const PREVIEW = 2;

const Highlights: React.FC<{ role: (typeof ROLES)[number] }> = ({ role: r }) => {
  const [open, setOpen] = useState(r.current);
  const more = r.highlights.length - PREVIEW;
  const shown = open ? r.highlights : r.highlights.slice(0, PREVIEW);
  const listId = `${r.id}-highlights`;

  return (
    <>
      <ul id={listId} className="mt-5">
        <AnimatePresence initial={false}>
          {shown.map((h, i) => (
            <motion.li
              key={h}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.45, ease: EASE, delay: open && i >= PREVIEW ? (i - PREVIEW) * 0.05 : 0 }}
              className="overflow-hidden"
            >
              <span className={`flex gap-3 t-small text-mute ${i ? 'pt-2.5' : ''}`}>
                <span aria-hidden className="mt-[7px] size-1.5 shrink-0 rounded-full" style={{ backgroundColor: r.color.bg }} />
                <span>{withFigures(h)}</span>
              </span>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
      {!r.current && more > 0 && (
        <button
          type="button"
          aria-expanded={open}
          aria-controls={listId}
          onClick={() => setOpen(!open)}
          className="mt-4 rounded-full t-small font-semibold text-sun underline-offset-4 hover:underline"
        >
          {open ? 'Show less' : `Show ${more} more`}
        </button>
      )}
    </>
  );
};

export const Experience: React.FC = () => {
  const ok = useCinematic();
  const spine = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: spine, offset: ['start 65%', 'end 65%'] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.001 });

  return (
  <section id="experience" aria-labelledby="exp-title" className="shell py-section">
    <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-4">
      <Words id="exp-title" text="Where I’ve worked" className="t-h2" />
      <p className="t-lead text-mute">
        {duration(CAREER)} across {ROLES.length} roles
      </p>
    </div>

    {/* Career ribbon */}
    <div className="mt-16">
      <div className="relative h-12 rounded-full bg-panel ring-1 ring-line">
        {ROLES.map((r, i) => (
          <motion.a
            key={r.id}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.9, ease: EASE, delay: (ROLES.length - 1 - i) * 0.18 }}
            href={`#${r.id}`}
            title={`${r.company}, ${r.period}`}
            className="absolute inset-y-1.5 flex origin-left items-center overflow-hidden rounded-full px-3 transition-[filter] hover:brightness-110"
            style={{
              left: `calc(${pct(r.start)}% + 3px)`,
              width: `calc(${pct(ribbonEnd(i)) - pct(r.start)}% - 6px)`,
              backgroundColor: r.color.bg,
              color: r.color.ink,
            }}
          >
            <span className="sr-only sm:not-sr-only sm:min-w-0">
              <span className="block truncate text-xs font-bold">{r.company}</span>
            </span>
          </motion.a>
        ))}
      </div>
      <div aria-hidden className="relative mt-2 h-5 text-[11px] text-mute">
        {YEARS.map((y) => (
          <span key={y} className={`absolute tabular-nums ${y * 12 === T0 ? '' : '-translate-x-1/2'}`} style={{ left: `${pct(y * 12)}%` }}>
            {y}
          </span>
        ))}
      </div>
    </div>

    {/* Timeline */}
    <ol ref={spine} className="relative mt-20 space-y-12 before:absolute before:bottom-3 before:left-[7px] before:top-3 before:w-px before:bg-line lg:before:left-[239px]">
      {/* The spine fills in the current role's yellow as you read down it. */}
      {ok && (
        <motion.span
          aria-hidden
          style={{ scaleY: fill }}
          className="absolute bottom-3 left-[7px] top-3 w-px origin-top bg-sun lg:left-[239px]"
        />
      )}
      {ROLES.map((r) => (
        <Rise
          as="li"
          key={r.id}
          id={r.id}
          className="relative scroll-mt-24 pl-9 lg:grid lg:grid-cols-[200px_minmax(0,1fr)] lg:gap-20 lg:pl-0"
        >
          <span
            aria-hidden
            className="absolute left-0 top-1 size-[15px] rounded-full ring-4 ring-navy lg:left-[232px] lg:top-6"
            style={{ backgroundColor: r.color.bg }}
          />

          <div className="mb-3 lg:mb-0 lg:pt-5 lg:text-right">
            <p className="t-small font-semibold">
              {short(r.from)} – {r.current ? 'Present' : short(r.to)}
            </p>
            <p className="text-xs text-mute">
              {duration(r.months)}, {r.location}
            </p>
          </div>

          <article className="card sheen p-6 sm:p-8">
            <header className="flex items-start gap-3">
              <span
                aria-hidden
                className="grid size-11 shrink-0 place-items-center rounded-full text-sm font-bold"
                style={{ backgroundColor: r.color.bg, color: r.color.ink }}
              >
                {initials(r.company)}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="t-h3">{r.role}</h3>
                <p className="t-small text-mute">{r.company}</p>
              </div>
              {r.current && (
                <span className="shrink-0 rounded-full bg-sun px-2.5 py-0.5 text-[11px] font-semibold text-navy">Current</span>
              )}
            </header>

            <Highlights role={r} />
          </article>
        </Rise>
      ))}
    </ol>

    <Numbers />

    <div className="mt-16 text-center">
      <Pill href="#contact" onClick={(e) => { e.preventDefault(); goTo('contact'); }}>
        Contact me
      </Pill>
    </div>
  </section>
  );
};
