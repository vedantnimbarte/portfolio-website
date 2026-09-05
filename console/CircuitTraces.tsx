import React from 'react';

// Decorative. Static traces are inline SVG paths at zero runtime cost; the
// pulses are transform-only so they ride the compositor rather than repainting
// the path every frame the way stroke-dashoffset would. Three at a time, max.
export const CircuitTraces: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    aria-hidden
    viewBox="0 0 120 240"
    preserveAspectRatio="xMidYMax meet"
    className={className}
    fill="none"
  >
    <g stroke="currentColor" strokeWidth="1" opacity="0.5">
      <path d="M14 0 V96 h30 V150 h34 V240" />
      <path d="M44 0 V60 h44 V210" />
      <path d="M88 0 V38 h-62 V204 h58" />
      <path d="M14 96 h-14" />
      <path d="M78 150 h42" />
    </g>
    <g fill="currentColor" opacity="0.35">
      <circle cx="14" cy="96" r="2.5" />
      <circle cx="44" cy="60" r="2.5" />
      <circle cx="88" cy="38" r="2.5" />
      <circle cx="78" cy="150" r="2.5" />
    </g>
    <circle className="trace-pulse trace-pulse-a" cx="14" cy="0" r="2" fill="currentColor" />
    <circle className="trace-pulse trace-pulse-b" cx="44" cy="0" r="2" fill="currentColor" />
    <circle className="trace-pulse trace-pulse-c" cx="88" cy="0" r="2" fill="currentColor" />
  </svg>
);
