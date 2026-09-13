import React from 'react';
import { BriefcaseBusiness, GitCommitHorizontal, Search } from 'lucide-react';
import type { SectionId } from '../types';
import { CONTACT, HERO_DATA, SKILLS_DATA, STATS } from '../constants';
import github from '../data/github.json';
import portrait from '../assets/profile.jpg';
import { TechIcon } from '../components/TechIcon';
import { Marquee, Pill } from '../components/ui';
import { goTo, useSite } from '../hooks/useSite';

const BADGES = import.meta.glob<string>('../assets/github/*.png', {
  eager: true,
  query: '?url',
  import: 'default',
});
const badge = (slug: string) => BADGES[`../assets/github/${slug}.png`];

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

const LINKS: { id: SectionId; label: string }[] = [
  { id: 'work', label: 'Work' },
  { id: 'experience', label: 'Experience' },
  { id: 'services', label: 'Services' },
  { id: 'contact', label: 'Contact' },
];

const jump = (id: SectionId) => (e: React.MouseEvent) => {
  e.preventDefault();
  goTo(id);
};

export const Nav: React.FC = () => {
  const { dispatch } = useSite();
  return (
    <header className="sticky top-0 z-[100] border-b border-line/60 bg-navy/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5">
        <a href="#" onClick={jump('home')} className="flex items-center gap-3">
          <img src={portrait} alt="" className="size-9 rounded-full object-cover ring-2 ring-sun" />
          <span className="leading-tight">
            <span className="block t-small font-semibold">{HERO_DATA.name}</span>
            <span className="mt-0.5 inline-block rounded-full bg-blue px-2 py-px text-[10px] font-semibold">
              Open to work
            </span>
          </span>
        </a>

        <nav aria-label="Sections" className="hidden md:block">
          <ul className="flex gap-1">
            {LINKS.map((l) => (
              <li key={l.id}>
                <a
                  href={`#${l.id}`}
                  onClick={jump(l.id)}
                  className="rounded-full px-3.5 py-2 t-small text-mute transition-colors hover:bg-panel hover:text-ink"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => dispatch({ type: 'PALETTE', open: true })}
            aria-label="Search"
            className="flex items-center gap-2 rounded-full border border-line p-2.5 t-small text-mute transition-colors hover:border-mute hover:text-ink lg:px-3 lg:py-2"
          >
            <Search size={15} aria-hidden />
            <kbd className="hidden rounded bg-panel px-1.5 font-sans text-[11px] lg:inline">{isMac ? '⌘K' : 'Ctrl K'}</kbd>
          </button>
          <Pill href="#contact" onClick={jump('contact')}>
            Let&apos;s talk
          </Pill>
        </div>
      </div>
    </header>
  );
};

// Achievement badges orbit the portrait the way the reference's app icons
// float around its hero. Slots are fixed percentages of the stage; phones use
// the four corners beside the portrait.
const SLOTS = [
  'left-[3%] top-[4%] sm:left-[25%] sm:top-[0%]',
  'right-[3%] top-[4%] sm:right-[26%] sm:top-[2%]',
  'left-[3%] top-[44%] sm:left-[17%] sm:top-[34%]',
  'right-[3%] top-[44%] sm:right-[19%] sm:top-[60%]',
  'hidden sm:block sm:left-[30%] sm:bottom-[0%]',
  'hidden sm:block sm:right-[31%] sm:bottom-[-2%]',
];

const achievementsUrl = `${github.url}?tab=achievements`;

const StatCard: React.FC<{ value: string; label: string; icon: React.ReactNode; className: string }> = ({
  value, label, icon, className,
}) => (
  <div className={`card sheen flex items-center gap-3 px-3 py-2.5 sm:absolute sm:px-4 sm:py-3 ${className}`}>
    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-sun text-navy sm:size-10">{icon}</span>
    <span>
      <span className="block text-xl font-bold leading-none sm:text-2xl">{value}</span>
      <span className="mt-1 block text-[11px] text-mute">{label}</span>
    </span>
  </div>
);

const SKILLS = SKILLS_DATA.flatMap((c) => c.skills);

export const Hero: React.FC = () => {
  const years = STATS.find((s) => s.label === 'Years Exp.');

  return (
    <section id="home" className="relative">
      {/* Blue haze behind the headline — the reference's only atmospheric light. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-16 h-[520px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(20,110,245,0.22),transparent)]" />

      <div className="relative mx-auto max-w-3xl px-5 pt-14 text-center sm:pt-16">
        <h1 className="t-hero text-balance">
          Full stack developer with a background in systems
        </h1>
        <p className="mx-auto mt-5 max-w-xl t-body text-mute text-pretty">
          {HERO_DATA.subtitle} Based in {CONTACT.location.split(',')[0]}, working with teams worldwide.
        </p>
        <div className="mt-8">
          <Pill href="#work" onClick={jump('work')}>
            View my work
          </Pill>
        </div>
      </div>

      <div className="relative mx-auto mt-6 h-[400px] max-w-5xl px-5 sm:h-[360px]">
        {/* Portrait with a blue-to-yellow ring and a soft glow behind it. */}
        <div className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 sm:top-1/2">
          <div aria-hidden className="absolute inset-[-18%] rounded-full bg-blue/25 blur-3xl" />
          <div className="relative rounded-full bg-[conic-gradient(from_200deg,var(--color-blue),var(--color-plum),var(--color-sun),var(--color-blue))] p-1.5">
            <img
              src={portrait}
              alt={`Illustrated portrait of ${HERO_DATA.name}`}
              width={460}
              height={460}
              className="size-[200px] rounded-full border-4 border-navy object-cover sm:size-[260px]"
            />
          </div>
          <a
            href={github.url}
            target="_blank"
            rel="noreferrer"
            className="absolute -bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border border-line bg-panel px-3 py-1 text-xs font-semibold transition-colors hover:border-blue"
          >
            <TechIcon name="github" size={13} />
            @{github.login}
          </a>
        </div>

        <ul aria-label="GitHub achievements">
          {github.achievements.slice(0, SLOTS.length).map((a, i) => (
            <li key={a.slug} className={`absolute ${SLOTS[i]}`}>
              <a
                href={achievementsUrl}
                target="_blank"
                rel="noreferrer"
                className="group relative block"
              >
                <span className="card sheen grid size-14 place-items-center rounded-2xl sm:size-16">
                  <img src={badge(a.slug)} alt="" className="size-11 sm:size-12" />
                </span>
                {a.tier && (
                  <span className="absolute -bottom-1 -right-1 rounded-full bg-sun px-1.5 text-[10px] font-bold text-navy">
                    {a.tier}
                  </span>
                )}
                <span className="sr-only">
                  {a.name}{a.tier ? ` ${a.tier}` : ''}{a.description ? `: ${a.description}` : ''}
                </span>
                {/* Name on hover or focus. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 w-44 -translate-x-1/2 rounded-xl border border-line bg-panel px-3 py-2 text-center opacity-0 shadow-xl transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                >
                  <span className="block text-xs font-semibold">{a.name}</span>
                  {a.description && <span className="mt-0.5 block text-[11px] leading-snug text-mute">{a.description}</span>}
                </span>
              </a>
            </li>
          ))}
        </ul>

        {/* Below the portrait on phones, floating beside it from sm up. The
            production figures live in the numbers section, not here. */}
        <div className="absolute inset-x-0 bottom-0 flex justify-center gap-2 px-3 sm:contents">
          <StatCard
            value={github.contributionsLastYear.toLocaleString('en-US')}
            label="GitHub contributions, past year"
            icon={<GitCommitHorizontal size={20} aria-hidden />}
            className="sm:bottom-[18%] sm:left-[3%]"
          />
          {years && (
            <StatCard
              value={years.value}
              label="Years shipping to production"
              icon={<BriefcaseBusiness size={20} aria-hidden />}
              className="sm:right-[3%] sm:top-[14%]"
            />
          )}
        </div>
      </div>

      <div id="stack" className="mt-6 scroll-mt-20 border-y border-line/60 py-6">
        <h2 className="sr-only">Stack</h2>
        <Marquee seconds={60} gap="3rem">
          {SKILLS.map((skill) => (
            <span key={skill} className="flex items-center gap-2.5 whitespace-nowrap text-lg font-medium text-mute">
              <TechIcon name={skill} size={20} />
              {skill}
            </span>
          ))}
        </Marquee>
      </div>
    </section>
  );
};
