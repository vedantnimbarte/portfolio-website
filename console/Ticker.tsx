import React from 'react';
import { RECORD } from '../lib/knowledge';
import { useConsole } from '../hooks/useConsole';
import { relativeTime } from '../lib/format';

// The bottom strip. Every row is something that actually happened in this
// session, or a value read from the committed repo snapshot. Decorative to a
// screen reader, so the whole strip is hidden from it.
export const Ticker: React.FC = () => {
  const { events } = useConsole();

  const idle = [
    `${RECORD.repos} repositories`,
    `${RECORD.stars} stars`,
    `last push ${RECORD.lastPush.name} ${relativeTime(RECORD.lastPush.updatedAt)}`,
  ];

  return (
    <footer
      aria-hidden
      className="flex h-7 shrink-0 items-center gap-4 overflow-hidden border-t border-trace bg-bezel px-4"
    >
      {events.length > 0
        ? events.map((e) => (
            <span key={e.t + e.text} className="t-micro whitespace-nowrap text-ink-dim">
              <span className="text-signal/60">{e.t}</span> {e.text}
            </span>
          ))
        : idle.map((s) => (
            <span key={s} className="t-micro whitespace-nowrap text-ink-dim">
              {s}
            </span>
          ))}
    </footer>
  );
};
