import React from 'react';
import { StatusBar } from './StatusBar';
import { Viewport } from './Viewport';
import { ModuleDock } from './ModuleDock';
import { useConsole } from '../hooks/useConsole';
import { RECORD } from '../lib/knowledge';
import { clockDuration } from '../lib/format';
import { useTelemetry } from '../hooks/useTelemetry';

// A different chassis, not a squashed desktop: one module at a time, the
// telemetry column collapsed to a single strip, and a dock instead of a rail.
export const HandheldShell: React.FC = () => {
  const { active } = useConsole();
  const { sessionMs } = useTelemetry();

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-void">
      {/* The page identity lives here, not in a module: deep-linking to #work
          must not leave the document without an h1. */}
      <h1 className="sr-only">Vedant Nimbarte — Senior Full Stack Developer</h1>
      <a
        href={`#panel-${active}`}
        onClick={(e) => {
          // Never let the hash become #panel-*; the router only knows module
          // ids and would bounce the visitor back to Identity.
          e.preventDefault();
          document.getElementById(`panel-${active}`)?.focus();
        }}
        className="sr-only focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:border focus:border-signal focus:bg-hull focus:px-3 focus:py-2 focus:text-signal"
      >
        Skip to module content
      </a>
      <StatusBar compact />
      <Viewport />
      <div
        aria-hidden
        className="flex shrink-0 items-center gap-3 overflow-hidden border-t border-trace bg-bezel px-3 py-1.5"
      >
        <span className="t-micro whitespace-nowrap text-signal">
          {clockDuration(sessionMs)}
        </span>
        <span className="t-micro whitespace-nowrap text-record">
          {RECORD.repos} repos · {RECORD.stars} stars
        </span>
        <span className="t-micro whitespace-nowrap text-ink-dim">0 external calls</span>
      </div>
      <ModuleDock />
    </div>
  );
};
