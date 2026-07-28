import React from 'react';
import { FadeIn } from './FadeIn';

interface SectionHeadingProps {
  eyebrow: string;      // section id, e.g. "about"
  title: string;
  subtitle?: string;
  meta?: string;        // right-aligned mono descriptor stating a fact about the section
  className?: string;
}

// The "blueprint spec line" motif: a mono eyebrow, a hairline rule, and an
// optional factual descriptor — shared across every section for one identity.
export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  subtitle,
  meta,
  className = '',
}) => (
  <FadeIn className={className}>
    <div className="mb-6 flex items-center gap-4">
      <span className="whitespace-nowrap font-mono text-xs font-bold uppercase tracking-[0.2em] text-accent">
        <span className="text-accent/50">//</span> {eyebrow}
      </span>
      <span className="h-px flex-1 bg-gradient-to-r from-accent/40 via-zinc-800 to-transparent" />
      {meta && (
        <span className="hidden whitespace-nowrap font-mono text-[11px] uppercase tracking-widest text-zinc-600 sm:block">
          {meta}
        </span>
      )}
    </div>
    <h2 className="max-w-2xl font-display text-4xl font-bold tracking-tight text-white md:text-5xl">
      {title}
    </h2>
    {subtitle && <p className="mt-4 max-w-xl text-lg text-zinc-400">{subtitle}</p>}
  </FadeIn>
);
