import React from 'react';
import { EXPERIENCE_DATA } from '../constants';
import { FadeIn } from './ui/FadeIn';
import { Briefcase, Calendar, MapPin, TrendingUp, Sparkles } from 'lucide-react';

// Helper to highlight numbers/metrics in text
const formatHighlight = (text: string) => {
  const regex = /(\d+(?:,\d+)*(?:\.\d+)?(?:%|\+|x|k|m|bn)?)/gi;
  const parts = text.split(regex);
  
  return parts.map((part, index) => {
    if (part.match(regex)) {
      return (
        <span 
          key={index} 
          className="inline-flex items-center justify-center px-2 py-0.5 mx-1 rounded bg-zinc-800 border border-zinc-700 text-zinc-200 font-bold text-sm shadow-sm whitespace-nowrap group-hover:border-accent/50 group-hover:text-accent group-hover:bg-accent/10 transition-all duration-300"
        >
          {part}
        </span>
      );
    }
    return <span key={index}>{part}</span>;
  });
};

export const Experience: React.FC = () => {
  return (
    <section id="experience" className="py-24 max-w-7xl mx-auto px-6 lg:px-12 snap-start">
      <div className="mb-20">
        <FadeIn>
            <h2 className="text-3xl font-bold text-white mb-4">Professional Experience</h2>
            <p className="text-zinc-400 max-w-xl">
                A timeline of my impact on engineering teams and production systems.
            </p>
        </FadeIn>
      </div>

      <div className="relative">
        {/* The Timeline Rail */}
        <div className="absolute left-[19px] md:left-[27px] top-2 bottom-2 w-px bg-gradient-to-b from-accent/50 via-zinc-800 to-zinc-900" />

        <div className="space-y-12">
          {EXPERIENCE_DATA.map((job, index) => (
            <div key={index} className="relative pl-12 md:pl-20">
              {/* Timeline Marker (The Dot) */}
              <div className="absolute left-0 top-0 mt-8 -translate-y-1/2 flex items-center justify-center">
                <div className={`w-10 h-10 md:w-14 md:h-14 rounded-full border-2 bg-background flex items-center justify-center z-10 transition-colors duration-500 group-hover:border-accent ${index === 0 ? 'border-accent shadow-[0_0_15px_rgba(251,191,36,0.3)]' : 'border-zinc-800'}`}>
                  {index === 0 ? (
                    <Briefcase size={20} className="text-accent" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-zinc-700" />
                  )}
                </div>
              </div>

              <FadeIn delay={index * 0.1}>
                <div className="group relative bg-surface border border-zinc-800 rounded-2xl p-6 md:p-8 transition-all duration-300 hover:border-accent/20 hover:shadow-[0_20px_40px_-15px_rgba(251,191,36,0.15)] hover:-translate-y-1 overflow-hidden">
                  {/* Animated corner accent */}
                  <div className="absolute top-0 left-0 w-1 h-full bg-accent rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-accent/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8 relative z-10">
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-white flex items-center gap-2 group-hover:text-accent/90 transition-colors">
                        {job.role}
                      </h3>
                      <div className="text-zinc-400 font-medium mt-1 text-base md:text-lg flex items-center gap-2">
                        <span className="text-accent/80">@</span>
                        {job.company}
                      </div>
                    </div>
                    <div className="flex flex-col md:items-end gap-2 text-sm text-zinc-500 font-mono">
                      <div className="flex items-center gap-2 bg-zinc-900/50 px-3 py-1.5 rounded-full border border-zinc-800">
                        <Calendar size={14} className="text-zinc-400" /> {job.period}
                      </div>
                      <div className="flex items-center gap-2 px-3">
                        <MapPin size={14} /> {job.location}
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10">
                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <TrendingUp size={14} className="text-accent" /> Key Impacts
                    </h4>
                    <ul className="grid md:grid-cols-1 gap-3">
                      {job.highlights.map((highlight, hIdx) => (
                        <li key={hIdx} className="flex items-start gap-3 text-zinc-400 group-hover:text-zinc-300 transition-colors duration-300">
                          <div className="mt-1.5 p-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-500 group-hover:text-accent group-hover:border-accent/30 transition-colors shrink-0">
                             <Sparkles size={8} />
                          </div>
                          <span className="leading-relaxed text-sm md:text-base">
                            {formatHighlight(highlight)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </FadeIn>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};