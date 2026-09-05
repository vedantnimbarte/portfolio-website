import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MODULES } from '../modules';
import { useConsole } from '../hooks/useConsole';

// A real tablist: one Tab stop, arrows to move, automatic activation (the
// panels are cheap, so selection follows focus per the APG guidance).
export const ModuleRail: React.FC = () => {
  const { active, select } = useConsole();
  const railRef = useRef<HTMLDivElement>(null);
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Follow the roving index with real focus, but only when focus was already
  // inside the rail — otherwise the palette would steal it on every command.
  useEffect(() => {
    const rail = railRef.current;
    if (rail && rail.contains(document.activeElement)) refs.current[active]?.focus();
  }, [active]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const i = MODULES.findIndex((m) => m.id === active);
    let next = -1;
    if (e.key === 'ArrowDown') next = (i + 1) % MODULES.length;
    else if (e.key === 'ArrowUp') next = (i - 1 + MODULES.length) % MODULES.length;
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
      className="hidden w-[200px] shrink-0 flex-col border-r border-trace bg-bezel console:flex"
    >
      <div
        ref={railRef}
        role="tablist"
        aria-orientation="vertical"
        onKeyDown={onKeyDown}
        className="flex flex-col p-2"
      >
        {MODULES.map((m) => {
          const on = m.id === active;
          return (
            <button
              key={m.id}
              ref={(el) => {
                refs.current[m.id] = el;
              }}
              role="tab"
              id={`tab-${m.id}`}
              aria-selected={on}
              aria-controls={`panel-${m.id}`}
              tabIndex={on ? 0 : -1}
              onClick={() => select(m.id, 'rail')}
              className={`relative flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                on ? 'text-signal' : 'text-ink-dim hover:text-ink'
              }`}
            >
              {on && (
                <motion.span
                  layoutId="rail-active"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  className="absolute inset-0 border-l-2 border-signal bg-signal/10"
                />
              )}
              <m.icon size={14} className="relative z-10 shrink-0" aria-hidden />
              <span className="t-label relative z-10">{m.label}</span>
            </button>
          );
        })}
      </div>
      <span aria-hidden className="mx-4 h-px bg-trace" />
    </nav>
  );
};
