import React, { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { Bot, Box, Cloud, Cpu, Search, Settings, Sparkles } from 'lucide-react';
import { CAPABILITIES, CONTACT } from '../constants';
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
            <div aria-hidden className="relative mx-5 mb-5 grid h-56 place-items-center overflow-hidden rounded-xl bg-[radial-gradient(70%_80%_at_50%_100%,#5b4bdb,#131d33_70%)]">
              <Depth z={60}>
                <GlossTile className="size-24 rotate-[-8deg]">
                  <Cloud size={44} className="text-ink" />
                </GlossTile>
              </Depth>
            </div>
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

/* ----------------------------------------------------------------- steps
   A real sequence, so the cards stack: each one pins below the last, and
   the ones underneath shrink back as the next slides over them. */

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

const Step: React.FC<{ step: (typeof STEPS)[number]; i: number; progress: MotionValue<number>; ok: boolean }> = ({
  step: { title, icon: Icon, text }, i, progress, ok,
}) => {
  const n = STEPS.length;
  const scale = useTransform(progress, [i / n, 1], [1, 1 - (n - 1 - i) * 0.06]);
  const filter = useTransform(progress, [i / n, 1], [1, 1 - (n - 1 - i) * 0.25], { clamp: true });
  const brightness = useTransform(filter, (v) => `brightness(${v})`);
  return (
    <li className="sticky" style={{ top: `calc(7rem + ${i * 1.75}rem)` }}>
      <motion.div
        style={ok ? { scale, filter: brightness } : undefined}
        className="card sheen grid origin-top gap-6 p-3 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)] md:items-center"
      >
        <div aria-hidden className="grid h-44 place-items-center rounded-xl bg-[radial-gradient(80%_90%_at_50%_100%,rgba(91,75,219,0.55),#0a1120_75%)] md:h-64">
          <span className="grid size-24 place-items-center rounded-[1.6rem] bg-gradient-to-br from-[#8b7bff] via-plum to-blue shadow-[0_18px_40px_-10px_rgba(91,75,219,0.9),inset_0_2px_0_rgba(255,255,255,0.35)] [transform:perspective(600px)_rotateX(14deg)_rotateY(-16deg)]">
            <Icon size={42} strokeWidth={2.2} className="text-ink drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)]" />
          </span>
        </div>
        <div className="px-4 pb-5 md:px-8 md:pb-0">
          <p className="t-small font-semibold text-sun">Step {i + 1} of {n}</p>
          <h3 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">{title}</h3>
          <p className="mt-3 max-w-md t-body text-mute">{text}</p>
        </div>
      </motion.div>
    </li>
  );
};

export const Process: React.FC = () => {
  const ok = useCinematic();
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 15%', 'end end'] });

  return (
    <section aria-labelledby="steps-title" className="shell py-section">
      <Words id="steps-title" text="Three steps to a shipped product" className="t-h2 max-w-2xl" />

      <ol ref={ref} className="mt-16 space-y-[18vh] pb-[6vh]">
        {STEPS.map((s, i) => (
          <Step key={s.title} step={s} i={i} progress={scrollYProgress} ok={ok} />
        ))}
      </ol>

      <div className="mt-16 text-center">
        <Pill href={`mailto:${CONTACT.email}`}>Get started</Pill>
      </div>
    </section>
  );
};
