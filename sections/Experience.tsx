import React from 'react';
import { EXPERIENCE_DATA } from '../constants';
import { Pill } from '../components/ui';
import { goTo } from '../hooks/useSite';

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

export const Experience: React.FC = () => (
  <section id="experience" aria-labelledby="exp-title" className="mx-auto max-w-5xl px-5 py-20">
    <h2 id="exp-title" className="t-h2 text-center">Where I&apos;ve worked</h2>
    <p className="mt-3 text-center t-body text-mute">
      {duration(CAREER)} across {ROLES.length} roles
    </p>

    {/* Career ribbon */}
    <div className="mt-12">
      <div className="relative h-12 rounded-full bg-panel ring-1 ring-line">
        {ROLES.map((r, i) => (
          <a
            key={r.id}
            href={`#${r.id}`}
            title={`${r.company}, ${r.period}`}
            className="absolute inset-y-1.5 flex items-center overflow-hidden rounded-full px-3 transition-[filter] hover:brightness-110"
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
          </a>
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
    <ol className="relative mt-14 space-y-8 before:absolute before:bottom-3 before:left-[7px] before:top-3 before:w-px before:bg-line lg:before:left-[239px]">
      {ROLES.map((r) => (
        <li
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

          <article className="card sheen p-6">
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

            <ul className="mt-5 space-y-2.5">
              {r.highlights.map((h) => (
                <li key={h} className="flex gap-3 t-small text-mute">
                  <span aria-hidden className="mt-[7px] size-1.5 shrink-0 rounded-full" style={{ backgroundColor: r.color.bg }} />
                  <span>{withFigures(h)}</span>
                </li>
              ))}
            </ul>
          </article>
        </li>
      ))}
    </ol>

    <div className="mt-12 text-center">
      <Pill href="#contact" onClick={(e) => { e.preventDefault(); goTo('contact'); }}>
        Contact me
      </Pill>
    </div>
  </section>
);
