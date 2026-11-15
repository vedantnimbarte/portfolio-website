import React from 'react';
import { Bot, Cpu, Database, Globe, Server, Sparkles } from 'lucide-react';
import { CAPABILITIES } from '../constants';
import { Pill } from '../components/ui';
import { goTo } from '../hooks/useSite';
import { Depth, Rise, Tilt, Words, useCinematic } from '../components/motion';

/* -------------------------------------------------------------- services
   Each card tilts toward the cursor; the art inside sits on <Depth> layers
   that slide by different amounts, so the scene reads in planes. */

const [AI, CLOUD, DEVOPS] = CAPABILITIES;

// Glossy tilted tiles, 3D icon art built from CSS.
const GlossTile: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <span
    className={`grid place-items-center rounded-2xl border border-white/10 bg-gradient-to-br from-[#26324d] to-[#111a2d] shadow-[0_24px_40px_-16px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.12)] ${className}`}
  >
    {children}
  </span>
);

/* An isometric exploded view of a cloud deployment: edge, services and data
   as stacked plates. Hovering the card pulls the plates apart. */
const PLATES = [
  { label: 'Data', icon: Database, z: 0, zh: 0, tone: 'from-[#1f4a92]/80 to-[#131d33]/80' },
  { label: 'Services', icon: Server, z: 30, zh: 48, tone: 'from-plum/80 to-[#26324d]/80' },
  { label: 'Edge', icon: Globe, z: 60, zh: 96, tone: 'from-blue/85 to-plum/70' },
];

const CloudStack: React.FC = () => (
  <div aria-hidden className="relative mx-5 mb-5 h-56 overflow-hidden rounded-xl bg-[radial-gradient(70%_80%_at_50%_100%,#5b4bdb,#131d33_70%)]">
    <Depth z={40} className="absolute inset-0 grid place-items-center [perspective:1000px]">
      <div className="relative size-32 translate-y-6 [transform-style:preserve-3d] [transform:rotateX(58deg)_rotateZ(-42deg)]">
        {PLATES.map(({ label, icon: Icon, z, zh, tone }) => (
          <div
            key={label}
            style={{ '--z': `${z}px`, '--zh': `${zh}px` } as React.CSSProperties}
            className={`absolute inset-0 flex items-end justify-between rounded-xl border border-white/20 bg-gradient-to-br p-3 shadow-[0_20px_30px_-10px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.25)] backdrop-blur-sm transition-transform duration-700 ease-out [transform:translateZ(var(--z))] group-hover/tilt:[transform:translateZ(var(--zh))] ${tone}`}
          >
            <span className="text-[11px] font-bold tracking-tight text-ink">{label}</span>
            <Icon size={20} className="text-ink" />
          </div>
        ))}
      </div>
    </Depth>
  </div>
);

const PIPELINE = `name: deploy
on: { push: { branches: [main] } }
jobs:
  ship:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker build -t api .
      - run: kubectl rollout status deploy/api`;

export const Services: React.FC = () => (
  <section id="services" aria-labelledby="services-title" className="shell py-section">
    <div className="flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
      <Words id="services-title" text="What I build with a full stack toolkit" className="t-h2 max-w-2xl" />
      <Pill href="#contact" onClick={(e) => { e.preventDefault(); goTo('contact'); }}>
        Contact me
      </Pill>
    </div>

    <div className="mt-16 grid gap-6 md:grid-cols-2 lg:gap-8">
      {/* AI, the wide card */}
      <Rise className="md:col-span-2">
        <Tilt inner="rounded-[1.25rem]" max={5}>
          <article className="card sheen relative overflow-hidden">
            <div className="grid items-center gap-6 md:grid-cols-[1fr_1.1fr]">
              <div className="p-8 md:p-12">
                <h3 className="t-h3 text-2xl">{AI.title}</h3>
                <p className="mt-3 max-w-sm t-body text-mute">{AI.description}</p>
              </div>
              <div aria-hidden className="relative h-60 [perspective:900px] md:h-72">
                <div className="absolute inset-0 bg-[radial-gradient(50%_60%_at_60%_50%,rgba(20,110,245,0.35),transparent)]" />
                <Depth z={-30} className="absolute inset-0">
                  <span className="absolute right-[14%] top-[16%] size-14 rounded-full bg-gradient-to-br from-blue to-plum shadow-[0_0_40px_rgba(20,110,245,0.6)]" />
                </Depth>
                <Depth z={50} className="absolute inset-0">
                  <div className="absolute left-1/2 top-1/2 flex gap-4 [transform:translate(-50%,-50%)_rotateX(28deg)_rotateZ(-14deg)]">
                    <GlossTile className="size-20"><Cpu size={34} className="text-[#7ab0ff]" /></GlossTile>
                    <GlossTile className="size-20 translate-y-6"><Sparkles size={34} className="text-sun" /></GlossTile>
                    <GlossTile className="size-20"><Bot size={34} className="text-[#a78bfa]" /></GlossTile>
                  </div>
                </Depth>
              </div>
            </div>
          </article>
        </Tilt>
      </Rise>

      {/* Cloud */}
      <Rise>
        <Tilt className="h-full" inner="rounded-[1.25rem]">
          <article className="card sheen h-full overflow-hidden">
            <div className="p-8">
              <h3 className="t-h3">{CLOUD.title}</h3>
              <p className="mt-2 t-small text-mute">{CLOUD.description}</p>
            </div>
            <CloudStack />
          </article>
        </Tilt>
      </Rise>

      {/* DevOps */}
      <Rise delay={0.1}>
        <Tilt className="h-full" inner="rounded-[1.25rem]">
          <article className="card sheen h-full overflow-hidden">
            <div className="p-8">
              <h3 className="t-h3">{DEVOPS.title}</h3>
              <p className="mt-2 t-small text-mute">{DEVOPS.description}</p>
            </div>
            <div aria-hidden className="mx-5 mb-5 h-56 overflow-hidden rounded-xl border border-line bg-deep">
              <div className="flex items-center gap-1.5 border-b border-line px-3 py-2">
                <span className="size-2 rounded-full bg-[#ff6159]" />
                <span className="size-2 rounded-full bg-[#ffbd2e]" />
                <span className="size-2 rounded-full bg-[#28c941]" />
                <span className="ml-3 font-mono text-[10px] text-mute">.github/workflows/deploy.yml</span>
              </div>
              <Depth z={18}>
                <pre className="px-4 py-3 font-mono text-[11px] leading-relaxed">
                  {PIPELINE.split('\n').map((line, i) => (
                    <div key={i}>
                      <span className="mr-4 inline-block w-3 text-right text-mute/50">{i + 1}</span>
                      <span className={line.trimStart().startsWith('- ') ? 'text-[#7ab0ff]' : line.includes(':') ? 'text-sun' : 'text-ink'}>
                        {line}
                      </span>
                    </div>
                  ))}
                </pre>
              </Depth>
            </div>
          </article>
        </Tilt>
      </Rise>
    </div>
  </section>
);
