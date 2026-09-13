import React, { Suspense, lazy } from 'react';
import {
  Atom, BriefcaseBusiness, Cloud, Container, Cpu, Database, Search, Terminal, Users,
} from 'lucide-react';
import { CONTACT, HERO_DATA, SKILLS_DATA, STATS } from '../constants';
import { getTechDetails } from '../components/ui/tech';
import { Marquee, Pill } from '../components/ui';
import { goTo, useSite } from '../hooks/useSite';

// Code-split so three.js never blocks first paint.
const HeroScene = lazy(() => import('../components/three/HeroScene'));

const isMac = typeof navigator !== 'undefined' && /Mac|iPhone|iPad/.test(navigator.platform);

export const Nav: React.FC = () => {
  const { dispatch } = useSite();
  return (
    <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 pt-5">
      <a href="#" onClick={(e) => { e.preventDefault(); goTo('home'); }} className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-full bg-gradient-to-br from-blue to-plum text-sm font-bold ring-2 ring-sun">
          VN
        </span>
        <span className="leading-tight">
          <span className="block t-small font-semibold">{HERO_DATA.name}</span>
          <span className="mt-0.5 inline-block rounded-full bg-blue px-2 py-px text-[10px] font-semibold">
            Open to work
          </span>
        </span>
      </a>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => dispatch({ type: 'PALETTE', open: true })}
          className="hidden items-center gap-2 rounded-full border border-line px-3 py-2 t-small text-mute transition-colors hover:border-mute hover:text-ink sm:flex"
        >
          <Search size={14} aria-hidden />
          Search
          <kbd className="rounded bg-panel px-1.5 font-sans text-[11px]">{isMac ? '⌘K' : 'Ctrl K'}</kbd>
        </button>
        <Pill href="#contact" onClick={(e) => { e.preventDefault(); goTo('contact'); }}>
          Let&apos;s Talk
        </Pill>
      </div>
    </header>
  );
};

// Decorative tool tiles scattered around the crystal, like the reference's
// floating app icons. Positions are fixed percentages of the stage.
const TILES = [
  { Icon: Cpu, color: '#f97316', pos: 'left-[8%] top-[4%] sm:left-[27%] sm:top-[2%]' },
  { Icon: Atom, color: '#61dafb', pos: 'left-[19%] top-[36%] max-sm:hidden' },
  { Icon: Terminal, color: '#ffd84a', pos: 'left-[30%] bottom-[2%] max-sm:hidden' },
  { Icon: Cloud, color: '#ff9900', pos: 'right-[8%] top-[30%] sm:right-[27%] sm:top-[2%]' },
  { Icon: Container, color: '#2496ed', pos: 'right-[20%] top-[62%] max-sm:hidden' },
  { Icon: Database, color: '#4ade80', pos: 'right-[31%] bottom-[0%] max-sm:hidden' },
];

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
  const users = STATS.find((s) => s.label === 'Daily Users');
  const years = STATS.find((s) => s.label === 'Years Exp.');

  return (
    <section id="home" className="relative">
      {/* Blue haze behind the headline — the reference's only atmospheric light. */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(20,110,245,0.22),transparent)]" />

      <Nav />

      <div className="relative mx-auto max-w-3xl px-5 pt-16 text-center sm:pt-20">
        <h1 className="t-hero text-balance">
          Full Stack Developer with a Background in Systems
        </h1>
        <p className="mx-auto mt-5 max-w-xl t-body text-mute text-pretty">
          {HERO_DATA.subtitle} Based in {CONTACT.location.split(',')[0]}, working with teams worldwide.
        </p>
        <div className="mt-8">
          <Pill href="#work" onClick={(e) => { e.preventDefault(); goTo('work'); }}>
            View Works
          </Pill>
        </div>
      </div>

      <div className="relative mx-auto mt-6 h-[380px] max-w-5xl px-5 sm:h-[340px]">
        <div className="absolute left-1/2 top-[38%] size-[240px] sm:top-1/2 -translate-x-1/2 -translate-y-1/2 sm:size-[320px]">
          <Suspense fallback={null}>
            <HeroScene />
          </Suspense>
        </div>

        {TILES.map(({ Icon, color, pos }, i) => (
          <span
            key={i}
            aria-hidden
            className={`card sheen absolute grid size-10 place-items-center rounded-xl ${pos}`}
          >
            <Icon size={18} style={{ color }} />
          </span>
        ))}

        {/* Below the crystal on phones, floating beside it from sm up. */}
        <div className="absolute inset-x-0 bottom-0 flex justify-center gap-2 px-3 sm:contents">
        {users && (
          <StatCard
            value={users.value}
            label="Daily users at Cloudairy"
            icon={<Users size={20} aria-hidden />}
            className="sm:bottom-[18%] sm:left-[4%]"
          />
        )}
        {years && (
          <StatCard
            value={years.value}
            label="Years shipping to production"
            icon={<BriefcaseBusiness size={20} aria-hidden />}
            className="sm:right-[4%] sm:top-[16%]"
          />
        )}
        </div>
      </div>

      <div id="stack" className="mt-6 border-y border-line/60 py-6">
        <h2 className="sr-only">Stack</h2>
        <Marquee seconds={55} gap="3rem">
          {SKILLS.map((skill) => {
            const { icon: Icon } = getTechDetails(skill);
            return (
              <span key={skill} className="flex items-center gap-2.5 whitespace-nowrap text-lg font-medium text-mute">
                <Icon size={18} className="text-blue" aria-hidden />
                {skill}
              </span>
            );
          })}
        </Marquee>
      </div>
    </section>
  );
};
