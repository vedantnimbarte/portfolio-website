import React from 'react';
import { Search } from 'lucide-react';
import type { SectionId } from '../types';
import { CONTACT, HERO_DATA, SKILLS_DATA } from '../constants';
import portrait from '../assets/profile.jpg';
import { TechIcon } from '../components/TechIcon';
import { GitHubOrbit } from '../components/GitHubOrbit';
import { Marquee, Pill } from '../components/ui';
import { goTo, useSite } from '../hooks/useSite';

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

const SKILLS = SKILLS_DATA.flatMap((c) => c.skills);

export const Hero: React.FC = () => {
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

      <GitHubOrbit />

      <div id="stack" className="mt-12 scroll-mt-20 border-y border-line/60 py-6">
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
