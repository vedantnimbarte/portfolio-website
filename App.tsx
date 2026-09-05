import React, { useCallback, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ConsoleProvider, useConsole } from './hooks/useConsole';
import { useIsConsole } from './hooks/useMediaQuery';
import { ConsoleShell } from './console/ConsoleShell';
import { HandheldShell } from './console/HandheldShell';
import { BootOverlay } from './console/BootOverlay';
import { ProjectModal } from './components/ProjectModal';
import projectsData from './data/projects.json';
import type { Project } from './types';

const PROJECTS = projectsData as Project[];

const Console: React.FC = () => {
  const { booted, project, dispatch } = useConsole();
  const wide = useIsConsole();

  // Cmd-K / Ctrl-K opens the prompt. preventDefault is not optional: Chrome
  // sends Ctrl-K to the address bar and Firefox opens quick-find.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.activeElement;
      const typing =
        el instanceof HTMLElement &&
        (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable);

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        dispatch({ type: 'PALETTE', open: true });
      } else if (e.key === '/' && !typing) {
        e.preventDefault();
        dispatch({ type: 'PALETTE', open: true });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dispatch]);

  const onBootDone = useCallback(() => dispatch({ type: 'BOOT_DONE' }), [dispatch]);

  return (
    <>
      {/* The shell mounts at frame zero and the boot sequence overlays it, so
          real content is in the DOM for crawlers, LCP is not delayed, and
          there is nothing to re-layout when the sequence ends. */}
      <div inert={!booted}>
        {wide ? <ConsoleShell key="console" /> : <HandheldShell key="handheld" />}
      </div>

      <AnimatePresence>
        {!booted && <BootOverlay key="boot" onDone={onBootDone} />}
      </AnimatePresence>

      <ProjectModal
        project={PROJECTS.find((p) => p.name === project) ?? null}
        isOpen={Boolean(project)}
        onClose={() => dispatch({ type: 'CLOSE_PROJECT' })}
      />
    </>
  );
};

const App: React.FC = () => (
  <ConsoleProvider>
    <Console />
  </ConsoleProvider>
);

export default App;
