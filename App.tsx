import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Experience } from './components/Experience';
import { Skills } from './components/Skills';
import { Projects } from './components/Projects';
import { AICloud } from './components/AICloud';
import { Contact } from './components/Contact';
import { HireMeModal } from './components/HireMeModal';

function App() {
  const [isHireModalOpen, setIsHireModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-zinc-100 selection:bg-accent/30 selection:text-white font-sans antialiased">
      <Navbar onOpenHireMe={() => setIsHireModalOpen(true)} />
      <main>
        <Hero />
        <About />
        <Experience />
        <Skills />
        <AICloud />
        <Projects />
        <Contact />
      </main>
      <HireMeModal isOpen={isHireModalOpen} onClose={() => setIsHireModalOpen(false)} />
    </div>
  );
}

export default App;