import React from 'react';

/** Registration marks. Decorative — instrument panels carry them, so this one
 *  does too, and a screen reader never hears about it. */
export const Ticks: React.FC = () => (
  <div aria-hidden className="pointer-events-none absolute inset-0">
    <span className="absolute left-0 top-0 h-3 w-3 border-l border-t border-trace" />
    <span className="absolute right-0 top-0 h-3 w-3 border-r border-t border-trace" />
    <span className="absolute bottom-0 left-0 h-3 w-3 border-b border-l border-trace" />
    <span className="absolute bottom-0 right-0 h-3 w-3 border-b border-r border-trace" />
  </div>
);

/** `role ········ senior full stack developer` — the datasheet row. */
export const Leader: React.FC<{
  label: string;
  children: React.ReactNode;
  tone?: 'signal' | 'record' | 'ink';
}> = ({ label, children, tone = 'ink' }) => (
  <div className="leader t-readout">
    <span className="t-label text-ink-dim">{label}</span>
    <span
      className={
        tone === 'signal' ? 'text-signal' : tone === 'record' ? 'text-record' : 'text-ink'
      }
    >
      {children}
    </span>
  </div>
);

/** Every module panel opens with this. The heading is a real <h2> — console
 *  styling must never turn structure into divs. */
export const ModuleHeading: React.FC<{ title: string; hint: string }> = ({ title, hint }) => (
  <header className="mb-8">
    <div className="flex items-baseline gap-4">
      <h2 className="t-module text-ink">{title}</h2>
      <span aria-hidden className="h-px flex-1 bg-trace" />
      <span className="t-micro hidden text-ink-dim sm:block">{hint}</span>
    </div>
  </header>
);
