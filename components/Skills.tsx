import React from 'react';
import { SKILLS_DATA } from '../constants';
import { FadeIn } from './ui/FadeIn';
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
        <FadeIn>
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Technical Arsenal</h2>
            <p className="text-zinc-400 max-w-2xl text-lg">
                My production-proven toolkit for building scalable, high-performance applications.
            </p>
          </div>
        </FadeIn>
        
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
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-zinc-800/80 border border-zinc-700 flex items-center justify-center text-zinc-300 group-hover:text-accent group-hover:border-accent/30 transition-colors">
                            <Icon size={20} />
                        </div>
                        <h3 className="text-lg font-semibold text-white group-hover:text-zinc-100 transition-colors">
                        {category.title}
                        </h3>
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