import React, { useEffect, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { moduleById } from '../modules';
import { useConsole } from '../hooks/useConsole';

/*
 * The scroll container IS the animated element, and it is keyed by module id.
 * Two consequences worth keeping:
 *   - remounting resets scrollTop for free, no refs, no effect;
 *   - mode="wait" means one child at a time, so the exiting panel never needs
 *     absolute positioning, which is what causes the double-scrollbar jump.
 * Only opacity and transform animate. Never height, never layout.
 */
export const Viewport: React.FC = () => {
  const { active, origin } = useConsole();
  const reduced = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  const { Component } = moduleById(active);
  const d = reduced ? 0 : 1;

  // Move focus into the panel only when the swap came from the palette or a
  // link. Rail selections keep focus in the rail, per the tabs pattern.
  useEffect(() => {
    if (origin === 'command') panelRef.current?.focus();
  }, [active, origin]);

  return (
    <main id="viewport" className="relative min-h-0 min-w-0 flex-1 overflow-hidden bg-void">
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={active}
          ref={panelRef}
          id={`panel-${active}`}
          role="tabpanel"
          tabIndex={-1}
          aria-labelledby={`tab-${active}`}
          initial="hidden"
          animate="show"
          exit="out"
          variants={{
            hidden: { opacity: 0, y: 6 },
            show: {
              opacity: 1,
              y: 0,
              transition: { duration: 0.18 * d, staggerChildren: 0.04 * d },
            },
            out: { opacity: 0, y: -4, transition: { duration: 0.1 * d } },
          }}
          className="custom-scrollbar h-full overflow-y-auto overscroll-contain p-6 focus:outline-none console:p-10"
        >
          <Component />
        </motion.div>
      </AnimatePresence>
    </main>
  );
};
