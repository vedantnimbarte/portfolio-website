import { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

const MS_PER_CHAR = 16; // ~62 chars/sec

/**
 * Char-by-char reveal driven by elapsed time, not by an accumulator.
 *
 * The classic implementation is setInterval + setShown(s => s + text[i++]) with
 * a closure-held index. Under StrictMode that mounts twice, runs two intervals,
 * and emits doubled characters — visible only in dev, which is maximally
 * confusing. Deriving the index from elapsed time and slicing makes a second
 * invocation converge to the same string. It also self-corrects after a
 * throttled frame instead of dumping 400 characters at once.
 */
export const useTypewriter = (text: string, skip = false) => {
  const reduced = useReducedMotion();
  const instant = reduced || skip;
  const [shown, setShown] = useState(() => (instant ? text : ''));

  useEffect(() => {
    if (instant) {
      setShown(text);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const step = (now: number) => {
      const n = Math.ceil((now - t0) / MS_PER_CHAR);
      setShown(text.slice(0, n));
      if (n < text.length) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    // Same background-tab guard as the boot sequence: rAF is paused when the
    // tab is hidden, and a reply that never renders is worse than one that
    // skips its animation.
    const bail = window.setTimeout(() => setShown(text), text.length * MS_PER_CHAR + 600);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(bail);
    };
  }, [text, instant]);

  return { shown, done: shown.length >= text.length };
};
