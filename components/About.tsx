import React from 'react';
import { FadeIn } from './ui/FadeIn';
import { SectionHeading } from './ui/SectionHeading';
import { CAPABILITIES } from '../constants';
import { motion } from 'framer-motion';

export const About: React.FC = () => {
  return (
    <section id="about" className="mx-auto max-w-7xl px-6 py-28 snap-start lg:px-12">
      <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
        {/* Left: narrative */}
        <div className="lg:col-span-6">
          <SectionHeading
            eyebrow="about"
            title="Building the bridge between complex systems and human experience."
            meta="5+ yrs"
          />
          <FadeIn delay={0.1}>
            <div className="mt-8 space-y-5 text-lg leading-relaxed text-zinc-400">
              <p>
                With 5+ years across the full software lifecycle, I build scalable web
                applications on the MERN stack, Python, and modern cloud platforms — but
                lately I go deeper, writing systems software in Rust: inference engines,
                a browser from scratch, and terminal-native tools.
              </p>
              <p>
                My focus is architecting fault-tolerant solutions on AWS and GCP and
                embedding <span className="text-zinc-200">generative AI into production</span> —
                from LLM inference and agentic workflows to MCP-based memory layers. I don't
                just ship features; I optimize for performance, security, and long-term
                maintainability.
              </p>
            </div>
          </FadeIn>
        </div>

        {/* Right: capability cards */}
        <div className="lg:col-span-6">
          <div className="grid gap-4">
            {CAPABILITIES.map((cap, i) => (
              <FadeIn key={cap.title} delay={i * 0.1}>
                <motion.div
                  whileHover={{ x: 6 }}
                  className="group relative flex gap-5 overflow-hidden rounded-2xl border border-zinc-800 bg-surface/40 p-6 transition-colors hover:border-accent/30"
                >
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-900 text-accent transition-transform group-hover:scale-110">
                    <cap.icon size={22} />
                  </div>
                  <div className="relative z-10">
                    <h3 className="mb-1.5 font-display text-lg font-bold text-white">{cap.title}</h3>
                    <p className="text-sm leading-relaxed text-zinc-400">{cap.description}</p>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
