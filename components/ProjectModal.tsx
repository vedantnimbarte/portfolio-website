import React, { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Code, Layout, Server, Database, Cloud, Cpu, Activity, Box, Chrome, Package, Video, HardDrive, Layers, Globe, LucideIcon, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Project } from '../types';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

const getTechDetails = (tech: string): { icon: LucideIcon; label: string } => {
  const lower = tech.toLowerCase();
  if (lower.includes('react') || lower.includes('next') || lower.includes('frontend') || lower.includes('ui')) return { icon: Layout, label: tech };
  if (lower.includes('node') || lower.includes('express') || lower.includes('nest')) return { icon: Server, label: tech };
  if (lower.includes('data') || lower.includes('sql') || lower.includes('mongo') || lower.includes('redis')) return { icon: Database, label: tech };
  if (lower.includes('aws') || lower.includes('cloud') || lower.includes('gcp') || lower.includes('azure')) return { icon: Cloud, label: tech };
  if (lower.includes('ai') || lower.includes('gpt') || lower.includes('openai') || lower.includes('intelligence')) return { icon: Cpu, label: tech };
  if (lower.includes('kafka') || lower.includes('message') || lower.includes('stream') || lower.includes('zookeeper')) return { icon: Activity, label: tech };
  if (lower.includes('docker') || lower.includes('container')) return { icon: Box, label: tech };
  if (lower.includes('chrome') || lower.includes('extension')) return { icon: Chrome, label: tech };
  if (lower.includes('webpack') || lower.includes('build')) return { icon: Package, label: tech };
  if (lower.includes('video') || lower.includes('ffmpeg')) return { icon: Video, label: tech };
  if (lower.includes('s3') || lower.includes('storage')) return { icon: HardDrive, label: tech };
  if (lower.includes('mern') || lower.includes('stack')) return { icon: Layers, label: tech };
  if (lower.includes('web')) return { icon: Globe, label: tech };
  return { icon: Code, label: tech };
};

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!project) return null;

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 1.5 : scrollLeft + clientWidth / 1.5;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-[200]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-[201] p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="bg-surface border border-zinc-800 w-full max-w-3xl rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden pointer-events-auto flex flex-col max-h-[90vh]"
            >
              {/* Header / Main Image */}
              <div className="relative h-64 bg-zinc-900 overflow-hidden border-b border-zinc-800 shrink-0">
                {project.snapshots && project.snapshots.length > 0 ? (
                  <img 
                    src={project.snapshots[0]} 
                    alt={project.title} 
                    className="w-full h-full object-cover opacity-60"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-900 to-zinc-950">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-50" />
                    <Code size={64} className="text-zinc-800 relative z-10" />
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent" />
                
                <button 
                  onClick={onClose}
                  className="absolute top-6 right-6 p-2 bg-black/40 hover:bg-black/60 text-zinc-400 hover:text-white rounded-full backdrop-blur-md transition-all z-20"
                >
                  <X size={20} />
                </button>

                <div className="absolute bottom-6 left-8 z-10">
                   <h3 className="text-3xl font-display font-bold text-white mb-2">{project.title}</h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 overflow-y-auto custom-scrollbar">
                <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                  {project.description}
                </p>

                {/* Snapshots Gallery */}
                {project.snapshots && project.snapshots.length > 1 && (
                  <div className="mb-10 group/gallery">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                        <ImageIcon size={14} /> Project Interface
                      </h4>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => scroll('left')}
                          className="p-1.5 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-accent hover:border-accent/40 rounded-lg transition-all"
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <button 
                          onClick={() => scroll('right')}
                          className="p-1.5 bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-accent hover:border-accent/40 rounded-lg transition-all"
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="relative">
                      <div 
                        ref={scrollRef}
                        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
                      >
                        {project.snapshots.map((snap, idx) => (
                          <div key={idx} className="min-w-[320px] h-48 rounded-xl overflow-hidden border border-zinc-800 shrink-0 hover:border-accent/40 transition-colors snap-center">
                            <img src={snap} alt={`Snapshot ${idx}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid md:grid-cols-2 gap-8 mb-10">
                  {/* Metrics */}
                  <div>
                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Impact & Metrics</h4>
                    <div className="space-y-3">
                      {project.metrics.map((metric, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                          <span className="text-zinc-300 font-medium">{metric}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tech Stack */}
                  <div>
                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-4">Technology Used</h4>
                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((t, idx) => {
                        const { icon: Icon, label } = getTechDetails(t);
                        return (
                          <div key={idx} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 text-sm hover:border-zinc-700 transition-colors">
                            <Icon size={14} className="text-zinc-500" />
                            {label}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* CTA */}
                <div className="pt-6 border-t border-zinc-800 flex flex-col sm:flex-row gap-4 shrink-0">
                  {project.link && (
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 bg-accent text-zinc-900 font-bold py-4 px-6 rounded-xl hover:bg-white transition-all duration-300 flex items-center justify-center gap-2 group shadow-[0_0_20px_rgba(251,191,36,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                    >
                      Visit Project <ExternalLink size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </a>
                  )}
                  <button 
                    onClick={onClose}
                    className="flex-1 bg-zinc-800 text-white font-bold py-4 px-6 rounded-xl hover:bg-zinc-700 transition-all duration-300"
                  >
                    Back to Portfolio
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};