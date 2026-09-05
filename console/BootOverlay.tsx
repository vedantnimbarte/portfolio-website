import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BOOT_LINES } from '../lib/knowledge';

const CADENCE = 120; // ms per line; two lines carry an extra hold

// Cumulative reveal time for each line, so the index is derived from elapsed
// time rather than accumulated in a closure. Same reason as useTypewriter:
// StrictMode double-invokes effects, and an accumulator emits doubled output.
const MARKS = BOOT_LINES.reduce<number[]>((acc, line, i) => {
  const prev = i === 0 ? 0 : acc[i - 1];
  acc.push(prev + CADENCE + (line.hold ?? 0));
  return acc;
}, []);
const TOTAL = MARKS[MARKS.length - 1];

export const BootOverlay: React.FC<{ onDone: () => void }> = ({ onDone }) => {
  const [count, setCount] = useState(0);
  const [hint, setHint] = useState(false);

  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const step = (now: number) => {
      const dt = now - t0;
      setCount(MARKS.filter((m) => m <= dt).length);
      setHint(dt > 600);
      if (dt >= TOTAL) onDone();
      else raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    // Safety net: requestAnimationFrame does not fire in a background tab, so
    // a page opened in one would otherwise sit on a black overlay forever.
    const bail = window.setTimeout(onDone, TOTAL + 600);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(bail);
    };
  }, [onDone]);

  useEffect(() => {
    const skip = () => onDone();
    const opts = { once: true } as const;
    window.addEventListener('keydown', skip, opts);
    window.addEventListener('pointerdown', skip, opts);
    window.addEventListener('wheel', skip, opts);
    return () => {
      window.removeEventListener('keydown', skip);
      window.removeEventListener('pointerdown', skip);
      window.removeEventListener('wheel', skip);
    };
  }, [onDone]);

  return (
    <motion.div
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex flex-col justify-center bg-void px-6 py-10 console:px-16"
    >
      {/* One announcement, not twelve lines of dot leaders. */}
      <p role="status" className="sr-only">
        Loading console.
      </p>

      <pre aria-hidden className="t-readout overflow-x-auto text-ink-dim">
        {BOOT_LINES.slice(0, count).map((line, i) => (
          <div key={line.text} className={i === 0 ? 'mb-2 text-signal' : undefined}>
            {line.text}
          </div>
        ))}
        <span className="inline-block h-4 w-2 translate-y-0.5 bg-signal motion-safe:animate-pulse" />
      </pre>

      <button
        type="button"
        onClick={onDone}
        className={`t-micro mt-8 self-start border border-trace px-3 py-1.5 text-ink-dim transition-opacity hover:border-signal/50 hover:text-signal ${
          hint ? 'opacity-100' : 'opacity-0'
        }`}
      >
        Skip
      </button>
    </motion.div>
  );
};
