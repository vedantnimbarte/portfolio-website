import React, { Suspense, lazy, useEffect } from 'react';
import { MotionConfig } from 'framer-motion';
import { ScrollProgress } from './components/motion';
import { SiteProvider, useSite } from './hooks/useSite';
import { Hero, Nav } from './sections/Hero';
import { FeaturedWorks } from './sections/Work';
import { Experience } from './sections/Experience';
import { Services } from './sections/Services';
import { Bands, Contact } from './sections/Closing';
import projectsData from './data/projects.json';
import type { Project } from './types';

const PROJECTS = projectsData as Project[];

// Overlays aren't on the first screen, so they load in their own chunk.
const ProjectModal = lazy(() => import('./components/ProjectModal').then((m) => ({ default: m.ProjectModal })));
const ChatWidget = lazy(() => import('./components/Assistant').then((m) => ({ default: m.ChatWidget })));
const CommandPalette = lazy(() => import('./components/Assistant').then((m) => ({ default: m.CommandPalette })));

const Page: React.FC = () => {
  const { project, dispatch } = useSite();

  // Cmd-K / Ctrl-K opens the palette. preventDefault is not optional: Chrome
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

  return (
    <MotionConfig reducedMotion="user">
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <FeaturedWorks />
        <Experience />
        <Services />
        <Bands />
        <Contact />
      </main>

      <Suspense fallback={null}>
      <ChatWidget />
      <CommandPalette />
      <ProjectModal
        project={PROJECTS.find((p) => p.name === project) ?? null}
        isOpen={Boolean(project)}
        onClose={() => dispatch({ type: 'CLOSE_PROJECT' })}
        onNavigate={(name) => dispatch({ type: 'OPEN_PROJECT', name })}
      />
      </Suspense>
    </MotionConfig>
  );
};

const App: React.FC = () => (
  <SiteProvider>
    <Page />
  </SiteProvider>
);

export default App;
