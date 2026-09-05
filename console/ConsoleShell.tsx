import React from 'react';
import { StatusBar } from './StatusBar';
import { ModuleRail } from './ModuleRail';
import { Viewport } from './Viewport';
import { Telemetry } from './Telemetry';
import { Ticker } from './Ticker';
import { useConsole } from '../hooks/useConsole';

// min-h-0 on every ancestor of the scroller is mandatory. Without it the grid
// default of min-height:auto lets panel content push the track taller than the
// viewport, and the whole page scrolls instead of the panel.
export const ConsoleShell: React.FC = () => {
  const { active } = useConsole();
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
      <StatusBar />
      <div className="flex min-h-0 flex-1">
        <ModuleRail />
        <Viewport />
        <Telemetry />
      </div>
      <Ticker />
    </div>
  );
};
