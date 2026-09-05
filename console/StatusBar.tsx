import React from 'react';
import { Github, Linkedin, Mail, Search } from 'lucide-react';
import { CONTACT } from '../constants';
import { istTime, useTelemetry } from '../hooks/useTelemetry';
import { useConsole } from '../hooks/useConsole';

// Chrome, not a module. The channel cluster lives here so a visitor is never
// more than one click from a way to reach the operator, even though contact
// itself is answered by the QUERY module.
const Channels: React.FC = () => (
  <div className="flex items-center gap-1">
    <a
      href={`mailto:${CONTACT.email}`}
      aria-label={`Email ${CONTACT.email}`}
      className="p-1.5 text-ink-dim transition-colors hover:text-signal"
    >
      <Mail size={13} aria-hidden />
    </a>
    <a
      href={CONTACT.linkedin}
      target="_blank"
      rel="noreferrer"
      aria-label="LinkedIn profile"
      className="p-1.5 text-ink-dim transition-colors hover:text-signal"
    >
      <Linkedin size={13} aria-hidden />
    </a>
    <a
      href={CONTACT.github}
      target="_blank"
      rel="noreferrer"
      aria-label="GitHub profile"
      className="p-1.5 text-ink-dim transition-colors hover:text-signal"
    >
      <Github size={13} aria-hidden />
    </a>
  </div>
);

export const StatusBar: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { now } = useTelemetry();
  const { dispatch } = useConsole();

  return (
    <header className="flex h-11 shrink-0 items-center gap-4 border-b border-trace bg-bezel px-3">
      <span className="t-label text-ink">
        VN<span className="text-signal">-</span>OS
      </span>

      <span className="flex items-center gap-1.5">
        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-signal motion-safe:animate-pulse" />
        <span className="t-micro text-ink-dim">
          <span className="sr-only">Console status: </span>online
        </span>
      </span>

      <span aria-hidden className="hidden h-px flex-1 bg-trace sm:block" />

      {!compact && (
        <span aria-hidden className="t-micro tabular-nums text-ink-dim">
          {istTime(now)} IST
        </span>
      )}

      <Channels />

      <button
        type="button"
        onClick={() => dispatch({ type: 'PALETTE', open: true })}
        className="t-micro flex items-center gap-1.5 border border-trace px-2 py-1 text-ink-dim transition-colors hover:border-signal/50 hover:text-signal"
      >
        <Search size={11} aria-hidden />
        <span className="hidden sm:inline">Commands</span>
        <kbd className="hidden font-mono text-[10px] opacity-70 console:inline">Cmd K</kbd>
      </button>
    </header>
  );
};
