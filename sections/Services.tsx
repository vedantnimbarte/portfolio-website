import React from 'react';
import { Bot, Box, Check, Cloud, Cpu, Search, Settings, Sparkles } from 'lucide-react';
import { CAPABILITIES, CONTACT, EXPERIENCE_DATA } from '../constants';
import { Pill } from '../components/ui';
import { goTo } from '../hooks/useSite';

/* ------------------------------------------------------------ experience */

const initials = (s: string) =>
  s.split(/\s+/).filter((w) => /^[A-Z]/.test(w)).slice(0, 2).map((w) => w[0]).join('') || s[0];

const AVATAR = ['#146ef5', '#1f8a5b', '#5b4bdb', '#d97706'];

export const Experience: React.FC = () => (
  <section id="experience" aria-labelledby="exp-title" className="mx-auto max-w-5xl px-5 py-20">
    <h2 id="exp-title" className="t-h2 text-center">Where I&apos;ve worked</h2>

    <ol className="mt-12 grid gap-5 md:grid-cols-2">
      {EXPERIENCE_DATA.map((job, i) => (
        <li key={job.company} className="card sheen flex flex-col p-6">
          <div className="flex items-start gap-3">
            <span
              aria-hidden
              className="grid size-11 shrink-0 place-items-center rounded-full text-sm font-bold"
              style={{ backgroundColor: AVATAR[i % AVATAR.length] }}
            >
              {initials(job.company)}
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="t-h3">{job.role}</h3>
              <p className="t-small text-mute">
                {job.company}, {job.location}
              </p>
            </div>
            {i === 0 && (
              <span className="shrink-0 rounded-full bg-sun px-2.5 py-0.5 text-[11px] font-semibold text-navy">Current</span>
            )}
          </div>

          <p className="mt-4 t-small font-medium text-ink/80">{job.period}</p>

          <ul className="mt-3 space-y-2.5">
            {job.highlights.slice(0, 3).map((h) => (
              <li key={h} className="flex gap-2.5 t-small text-mute">
                <Check size={16} className="mt-0.5 shrink-0 text-blue" aria-hidden />
                {h}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>

    <div className="mt-10 text-center">
      <Pill href="#contact" onClick={(e) => { e.preventDefault(); goTo('contact'); }}>
        Contact me
      </Pill>
    </div>
  </section>
);

/* -------------------------------------------------------------- services */

const [AI, CLOUD, DEVOPS] = CAPABILITIES;

// Glossy tilted tiles, the reference's 3D icon art built from CSS.
const GlossTile: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <span
    className={`grid place-items-center rounded-2xl border border-white/10 bg-gradient-to-br from-[#26324d] to-[#111a2d] shadow-[0_24px_40px_-16px_rgba(0,0,0,0.7),inset_0_1px_0_rgba(255,255,255,0.12)] ${className}`}
  >
    {children}
  </span>
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
  <section id="services" aria-labelledby="services-title" className="mx-auto max-w-5xl px-5 py-20">
    <div className="flex flex-wrap items-end justify-between gap-6">
      <h2 id="services-title" className="t-h2 max-w-md">What I can build with my full stack toolkit</h2>
      <Pill href="#contact" onClick={(e) => { e.preventDefault(); goTo('contact'); }}>
        Contact me
      </Pill>
    </div>

    <div className="mt-12 grid gap-5 md:grid-cols-2">
      {/* AI — the wide card */}
      <article className="card sheen relative overflow-hidden md:col-span-2">
        <div className="grid items-center gap-6 md:grid-cols-[1fr_1.1fr]">
          <div className="p-7 md:p-9">
            <h3 className="t-h3">{AI.title}</h3>
            <p className="mt-2 max-w-sm t-small text-mute">{AI.description}</p>
          </div>
          <div aria-hidden className="relative h-56 [perspective:900px] md:h-64">
            <div className="absolute inset-0 bg-[radial-gradient(50%_60%_at_60%_50%,rgba(20,110,245,0.35),transparent)]" />
            <div className="absolute left-1/2 top-1/2 flex gap-4 [transform:translate(-50%,-50%)_rotateX(28deg)_rotateZ(-14deg)]">
              <GlossTile className="size-20"><Cpu size={34} className="text-[#7ab0ff]" /></GlossTile>
              <GlossTile className="size-20 translate-y-6"><Sparkles size={34} className="text-sun" /></GlossTile>
              <GlossTile className="size-20"><Bot size={34} className="text-[#a78bfa]" /></GlossTile>
            </div>
            <span className="absolute right-[14%] top-[18%] size-14 rounded-full bg-gradient-to-br from-blue to-plum shadow-[0_0_40px_rgba(20,110,245,0.6)]" />
          </div>
        </div>
      </article>

      {/* Cloud */}
      <article className="card sheen overflow-hidden">
        <div className="p-7">
          <h3 className="t-h3">{CLOUD.title}</h3>
          <p className="mt-2 t-small text-mute">{CLOUD.description}</p>
        </div>
        <div aria-hidden className="relative mx-5 mb-5 grid h-52 place-items-center overflow-hidden rounded-xl bg-[radial-gradient(70%_80%_at_50%_100%,#5b4bdb,#131d33_70%)]">
          <GlossTile className="size-24 rotate-[-8deg]">
            <Cloud size={44} className="text-ink" />
          </GlossTile>
        </div>
      </article>

      {/* DevOps */}
      <article className="card sheen overflow-hidden">
        <div className="p-7">
          <h3 className="t-h3">{DEVOPS.title}</h3>
          <p className="mt-2 t-small text-mute">{DEVOPS.description}</p>
        </div>
        <div aria-hidden className="mx-5 mb-5 h-52 overflow-hidden rounded-xl border border-line bg-deep">
          <div className="flex items-center gap-1.5 border-b border-line px-3 py-2">
            <span className="size-2 rounded-full bg-[#ff6159]" />
            <span className="size-2 rounded-full bg-[#ffbd2e]" />
            <span className="size-2 rounded-full bg-[#28c941]" />
            <span className="ml-3 font-mono text-[10px] text-mute">.github/workflows/deploy.yml</span>
          </div>
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
        </div>
      </article>
    </div>
  </section>
);

/* ----------------------------------------------------------------- steps */

const STEPS = [
  {
    title: 'Discovery',
    icon: Search,
    text: 'We agree on the problem, the users and the constraints before any code is written, so scope and cost are clear up front.',
  },
  {
    title: 'Development',
    icon: Settings,
    text: 'I build in small, reviewable pieces with CI from day one, so you can see and test progress every week.',
  },
  {
    title: 'Delivery',
    icon: Box,
    text: 'I deploy, set up monitoring and hand over documentation, so your team can run it without me.',
  },
];

export const Process: React.FC = () => (
  <section aria-labelledby="steps-title" className="mx-auto max-w-5xl px-5 py-16">
    <h2 id="steps-title" className="t-h2 mx-auto max-w-lg text-center">
      You&apos;re just 3 steps from a shipped product
    </h2>

    <ol className="mt-12 grid gap-5 md:grid-cols-3">
      {STEPS.map(({ title, icon: Icon, text }) => (
        <li key={title} className="card sheen p-3">
          <div aria-hidden className="grid h-40 place-items-center rounded-xl bg-[radial-gradient(80%_90%_at_50%_100%,rgba(91,75,219,0.55),#0a1120_75%)]">
            <span className="grid size-20 place-items-center rounded-[1.4rem] bg-gradient-to-br from-[#8b7bff] via-plum to-blue shadow-[0_18px_40px_-10px_rgba(91,75,219,0.9),inset_0_2px_0_rgba(255,255,255,0.35)]">
              <Icon size={36} strokeWidth={2.2} className="text-ink drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]" />
            </span>
          </div>
          <div className="px-3 pb-3 pt-5">
            <h3 className="t-h3">{title}</h3>
            <p className="mt-2 t-small text-mute">{text}</p>
          </div>
        </li>
      ))}
    </ol>

    <div className="mt-10 text-center">
      <Pill href={`mailto:${CONTACT.email}`}>Get started</Pill>
    </div>
  </section>
);
