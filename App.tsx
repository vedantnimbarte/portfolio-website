import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Projects } from './components/Projects';
import { Experience } from './components/Experience';
import { Skills } from './components/Skills';
import { Contact } from './components/Contact';
import { HireMeModal } from './components/HireMeModal';

function App() {
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background font-sans text-zinc-100 antialiased selection:bg-accent/30 selection:text-white">
      <Navbar onOpenHireMe={() => setIsHireModalOpen(true)} />
      <main>
        <Hero />
        <About />
        <Projects />
        <Experience />
        <Skills />
        <Contact />
      </main>
      <HireMeModal isOpen={isHireModalOpen} onClose={() => setIsHireModalOpen(false)} />
    </div>
  );
}

export default App;
