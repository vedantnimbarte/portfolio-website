import React, { useEffect } from 'react';
import { SiteProvider, useSite } from './hooks/useSite';
import { ProjectModal } from './components/ProjectModal';
import { ChatWidget, CommandPalette } from './components/Assistant';
import { Hero, Nav } from './sections/Hero';
import { FeaturedWorks, SideProjects } from './sections/Work';
import { Experience, Process, Services } from './sections/Services';
import { Bands, Contact, Numbers } from './sections/Closing';
import projectsData from './data/projects.json';
import type { Project } from './types';

const PROJECTS = projectsData as Project[];

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
    <>
      <Nav />
      <main>
        <Hero />
        <FeaturedWorks />
        <Experience />
        <Services />
        <Process />
        <SideProjects />
        <Numbers />
        <Bands />
        <Contact />
      </main>

      <ChatWidget />
      <CommandPalette />
      <ProjectModal
        project={PROJECTS.find((p) => p.name === project) ?? null}
        isOpen={Boolean(project)}
        onClose={() => dispatch({ type: 'CLOSE_PROJECT' })}
      />
    </>
  );
};

const App: React.FC = () => (
  <SiteProvider>
    <Page />
  </SiteProvider>
);

export default App;
