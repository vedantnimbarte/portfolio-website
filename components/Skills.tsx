import React from 'react';
import { SKILLS_DATA } from '../constants';
import { FadeIn } from './ui/FadeIn';
import { SectionHeading } from './ui/SectionHeading';
import { motion } from 'framer-motion';
import { 
  Terminal, 
  Monitor, 
  Server, 
  Database, 
  Cloud, 
  BrainCircuit, 
  LucideIcon 
} from 'lucide-react';

const getIcon = (title: string): LucideIcon => {
  if (title.includes('Languages')) return Terminal;
  if (title.includes('Frontend')) return Monitor;
  if (title.includes('Backend')) return Server;
  if (title.includes('Database')) return Database;
  if (title.includes('Cloud')) return Cloud;
  if (title.includes('AI')) return BrainCircuit;
  return Terminal;
};

export const Skills: React.FC = () => {
  return (
    <section id="skills" className="py-32 relative overflow-hidden snap-start max-w-7xl mx-auto px-6 lg:px-12">
        {/* Decorative background blobs for soft ambience */}
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-zinc-800/20 rounded-full blur-[120px] -z-10 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

      <div className="relative">
        <SectionHeading
          className="mb-16"
          eyebrow="stack"
          title="Technical Arsenal"
          subtitle="My production-proven toolkit for building scalable, high-performance applications — from the browser down to the metal."
          meta={`${SKILLS_DATA.length} domains`}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SKILLS_DATA.map((category, idx) => {
            const Icon = getIcon(category.title);
            return (
              <FadeIn key={idx} delay={idx * 0.1}>
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="group relative h-full bg-zinc-900/40 backdrop-blur-sm border border-zinc-800/60 rounded-2xl p-6 transition-all duration-300 hover:border-accent/30 hover:bg-zinc-900/60 hover:shadow-2xl hover:shadow-black/20"
                >
                  {/* Hover Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none" />
                  
                  {/* corner tick */}
                  <span className="pointer-events-none absolute right-3 top-3 h-3 w-3 border-r border-t border-zinc-700 transition-colors group-hover:border-accent/50" />
                  <div className="relative z-10">
                    <div className="mb-6 flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-700 bg-zinc-800/80 text-zinc-300 transition-colors group-hover:border-accent/30 group-hover:text-accent">
                            <Icon size={20} />
                        </div>
                        <h3 className="flex-1 text-lg font-semibold text-white transition-colors group-hover:text-zinc-100">
                        {category.title}
                        </h3>
                        <span className="font-mono text-xs text-zinc-600">{String(category.skills.length).padStart(2, '0')}</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {category.skills.map((skill) => (
                        <div 
                            key={skill} 
                            className="px-3 py-1.5 bg-zinc-800/50 border border-zinc-700/50 rounded-lg text-sm text-zinc-400 group-hover:text-zinc-200 group-hover:border-zinc-600 transition-all cursor-default"
                        >
                            {skill}
                        </div>
                        ))}
                    </div>
                  </div>
                </motion.div>
              </FadeIn>
            );
          })}
        </div>
      </div>
    </section>
  );
};