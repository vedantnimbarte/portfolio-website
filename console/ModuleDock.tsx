import React from 'react';
import { motion } from 'framer-motion';
import { MODULES } from '../modules';
import { useConsole } from '../hooks/useConsole';

// The handheld chassis nav. Same tablist semantics as the desktop rail, but a
// distinct layoutId — sharing the string produces a ghost indicator for one
// frame when the two shells swap at the breakpoint.
export const ModuleDock: React.FC = () => {
  const { active, select } = useConsole();

  const onKeyDown = (e: React.KeyboardEvent) => {
    const i = MODULES.findIndex((m) => m.id === active);
    let next = -1;
    if (e.key === 'ArrowRight') next = (i + 1) % MODULES.length;
    else if (e.key === 'ArrowLeft') next = (i - 1 + MODULES.length) % MODULES.length;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = MODULES.length - 1;
    if (next >= 0) {
      e.preventDefault();
      select(MODULES[next].id, 'rail');
    }
  };

  return (
    <nav
      aria-label="Modules"
      className="shrink-0 border-t border-trace bg-bezel pb-[env(safe-area-inset-bottom)]"
    >
      <div role="tablist" aria-orientation="horizontal" onKeyDown={onKeyDown} className="flex">
        {MODULES.map((m) => {
          const on = m.id === active;
          return (
            <button
              key={m.id}
              role="tab"
              id={`tab-${m.id}`}
              aria-selected={on}
              aria-controls={`panel-${m.id}`}
              tabIndex={on ? 0 : -1}
              onClick={() => select(m.id, 'rail')}
              className={`relative flex flex-1 flex-col items-center gap-1 py-2.5 transition-colors ${
                on ? 'text-signal' : 'text-ink-dim'
              }`}
            >
              {on && (
                <motion.span
                  layoutId="dock-active"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  className="absolute inset-x-1 top-0 h-0.5 bg-signal"
                />
              )}
              <m.icon size={16} aria-hidden />
              <span className="t-micro">{m.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
