import React from 'react';
import github from '../data/github.json';
import portrait from '../assets/profile.jpg';
import { HERO_DATA, STATS } from '../constants';
import { TechIcon } from './TechIcon';

/* ===========================================================================
   The hero's centrepiece: the real GitHub contribution calendar wrapped into
   a ring around the portrait (53 weeks around, 7 days deep), achievement
   badges stuck over its edge like laptop stickers, and the totals pinned to
   the ring as diagram callouts rather than boxed in cards.

   Two coordinate spaces, both fixed so SVG and HTML line up at any size:
   - ring box: 400×400, centre (200,200). The calendar and stickers live here.
   - stage:    980×480, lg+ only. The ring box sits at (290,20); callout
               leaders and labels live here.
   ========================================================================= */

const BADGES = import.meta.glob<string>('../assets/github/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
});

const WEEKS = 54;   // 53 calendar columns plus one empty week: the gap at the top
const INNER = 142;  // radius of the Sunday track
const STEP = 8.2;   // track spacing, Sunday inner to Saturday outer
const LEVEL = ['#1c2a47', '#1f4a92', '#2a6ff0', '#6aa5ff', '#ffd84a'];

const polar = (deg: number, r: number, cx = 200, cy = 200) => {
  const a = (deg * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
};

// GitHub's columns start on Sunday, so the first day is offset by its weekday.
const CELLS = (() => {
  const { start, levels } = github.calendar;
  const offset = new Date(`${start}T00:00:00Z`).getUTCDay();
  return [...levels].map((level, i) => {
    const week = Math.floor((i + offset) / 7);
    const day = (i + offset) % 7;
    // Week 0 sits just clockwise of 12 o'clock; the empty week is the gap.
    const { x, y } = polar(-90 + ((week + 1) * 360) / WEEKS, INNER + day * STEP);
    return { x, y, level: Number(level), week };
  });
})();

/* ------------------------------------------------------------------ stickers
   Index-based so a newly earned badge still lands somewhere sensible. Angles
   and radii differ on purpose: stuck on by hand, not arranged. */
const STICKERS = [
  { deg: -112, r: 194, rot: -12, size: 74, drift: '7s' },
  { deg: 62, r: 198, rot: 10, size: 62, drift: '8.5s' },
  { deg: -62, r: 184, rot: 7, size: 58, drift: '6.5s' },
  { deg: 118, r: 186, rot: -8, size: 60, drift: '9s' },
  { deg: -165, r: 190, rot: 14, size: 54, drift: '7.5s' },
  { deg: 165, r: 190, rot: -6, size: 54, drift: '8s' },
];

/* ------------------------------------------------------------------ callouts
   dot on the ring → elbow → end, in stage units. `align` is which side of the
   label the leader arrives from. Years isn't GitHub data, so its leader is
   dashed and its dot yellow. */
const n = (v: number) => v.toLocaleString('en-US');
const years = STATS.find((s) => s.label === 'Years Exp.')?.value ?? '';

const CALLOUTS = [
  { value: n(github.commits), label: 'commits to public repos', deg: 200, elbow: [256, 108], end: [186, 108], align: 'right' as const },
  { value: n(github.pullRequests), label: `pull requests, ${n(github.mergedPullRequests)} merged`, deg: -38, elbow: [694, 52], end: [770, 52], align: 'left' as const },
  { value: n(github.contributionsLastYear), label: 'contributions in the past year', deg: 148, elbow: [270, 384], end: [196, 384], align: 'right' as const },
  { value: years, label: 'years shipping to production', deg: 16, elbow: [728, 318], end: [800, 318], align: 'left' as const, offGitHub: true },
];

const STAGE_W = 980;
const STAGE_H = 480;

export const GitHubOrbit: React.FC = () => {
  const achievementsUrl = `${github.url}?tab=achievements`;

  return (
    <div className="relative mx-auto mt-10 max-w-5xl px-5">
      <div className="relative lg:aspect-[980/480]">
        {/* Leader lines, lg+ only. */}
        <svg
          aria-hidden
          viewBox={`0 0 ${STAGE_W} ${STAGE_H}`}
          className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
        >
          {CALLOUTS.map((c) => {
            const dot = polar(c.deg, 200, 490, 220);
            return (
              <g key={c.label}>
                <path
                  d={`M${dot.x} ${dot.y} L${c.elbow[0]} ${c.elbow[1]} L${c.end[0]} ${c.end[1]}`}
                  fill="none"
                  stroke="#3a5080"
                  strokeWidth={1.25}
                  strokeDasharray={c.offGitHub ? '4 5' : undefined}
                />
                <circle cx={dot.x} cy={dot.y} r={4.5} fill="#0d1526" stroke={c.offGitHub ? '#ffd84a' : '#146ef5'} strokeWidth={2} />
              </g>
            );
          })}
        </svg>

        {/* Ring box */}
        <div className="relative mx-auto aspect-square w-[min(400px,86vw)] lg:absolute lg:left-[29.59%] lg:top-[4.17%] lg:mx-0 lg:w-[40.82%]">
          <svg
            role="img"
            aria-label={`Contribution calendar for the past year: ${n(github.contributionsLastYear)} contributions`}
            viewBox="0 0 400 400"
            className="absolute inset-0 h-full w-full overflow-visible"
          >
            {CELLS.map((c, i) => (
              <circle
                key={i}
                cx={c.x}
                cy={c.y}
                r={c.level ? 3 : 2.4}
                fill={LEVEL[c.level]}
                className="orbit-cell"
                style={{ animationDelay: `${c.week * 20}ms` }}
              />
            ))}
          </svg>

          <div aria-hidden className="absolute inset-[22%] rounded-full bg-blue/30 blur-3xl" />
          <img
            src={portrait}
            alt={`Illustrated portrait of ${HERO_DATA.name}`}
            width={460}
            height={460}
            className="absolute inset-[17%] h-[66%] w-[66%] rounded-full border-4 border-panel object-cover shadow-[0_20px_60px_-20px_rgba(20,110,245,0.6)]"
          />

          <ul aria-label="GitHub achievements">
            {github.achievements.slice(0, STICKERS.length).map((a, i) => {
              const s = STICKERS[i];
              const { x, y } = polar(s.deg, s.r);
              return (
                <li
                  key={a.slug}
                  className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${x / 4}%`, top: `${y / 4}%`, width: `${s.size / 4}%` }}
                >
                  <a
                    href={achievementsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="orbit-drift group relative block rounded-full"
                    style={{ '--drift': s.drift } as React.CSSProperties}
                  >
                    <span
                      className="relative block rounded-full bg-ink p-[4%] shadow-[0_12px_24px_-10px_rgba(0,0,0,0.8)] transition-transform duration-300 [transform:rotate(var(--rot))] group-hover:[transform:rotate(0deg)_scale(1.12)] group-focus-visible:[transform:rotate(0deg)_scale(1.12)]"
                      style={{ '--rot': `${s.rot}deg` } as React.CSSProperties}
                    >
                      <img src={BADGES[`../assets/github/${a.slug}.png`]} alt="" className="block aspect-square w-full rounded-full" />
                      {a.tier && (
                        <span className="absolute -bottom-1 -right-2 rounded-full bg-sun px-1.5 text-[10px] font-extrabold text-navy shadow">
                          {a.tier}
                        </span>
                      )}
                    </span>
                    <span className="sr-only">
                      {a.name}{a.tier ? ` ${a.tier}` : ''}{a.description ? `: ${a.description}` : ''}
                    </span>
                    <span
                      aria-hidden
                      className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 w-40 -translate-x-1/2 rounded-xl border border-line bg-panel px-3 py-2 text-center opacity-0 shadow-xl transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                    >
                      <span className="block text-xs font-semibold">{a.name}{a.tier ? ` ${a.tier}` : ''}</span>
                      {a.description && <span className="mt-0.5 block text-[11px] leading-snug text-mute">{a.description}</span>}
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        <a
          href={github.url}
          target="_blank"
          rel="noreferrer"
          className="mx-auto mt-3 flex w-fit items-center gap-1.5 rounded-full border border-line bg-panel px-3 py-1 text-xs font-semibold transition-colors hover:border-blue lg:absolute lg:left-1/2 lg:top-[92.5%] lg:mt-0 lg:-translate-x-1/2"
        >
          <TechIcon name="github" size={13} />
          @{github.login}
        </a>

        {/* One list for every size: a quiet 2×2 under the ring on small
            screens, labels pinned to their leader lines from lg. The inline
            offsets only take effect once lg makes each item absolute. */}
        <ul
          aria-label="GitHub and career totals"
          className="mx-auto mt-10 grid max-w-sm grid-cols-2 gap-x-8 gap-y-6 lg:contents"
        >
          {CALLOUTS.map((c) => (
            <li
              key={c.label}
              className={`lg:absolute lg:w-44 lg:-translate-y-1/2 ${c.align === 'right' ? 'lg:text-right' : ''}`}
              style={{
                top: `${(c.end[1] / STAGE_H) * 100}%`,
                ...(c.align === 'right'
                  ? { right: `${((STAGE_W - c.end[0] + 10) / STAGE_W) * 100}%` }
                  : { left: `${((c.end[0] + 10) / STAGE_W) * 100}%` }),
              }}
            >
              <span className="t-count block">{c.value}</span>
              <span className="mt-1.5 block t-small leading-snug text-mute">{c.label}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
