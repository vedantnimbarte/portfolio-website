import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Github, Star, Code2 } from 'lucide-react';
import { Project } from '../types';
import { getTechDetails } from './Projects';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose }) => {
  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[200] bg-black/80 backdrop-blur-md"
          />

          <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 24 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-zinc-800 bg-surface shadow-[0_0_60px_rgba(0,0,0,0.6)]"
            >
              {/* Header */}
              <div className="relative shrink-0 border-b border-zinc-800 p-8">
                <div
                  className="pointer-events-none absolute inset-0 opacity-[0.15]"
                  style={{
                    backgroundImage:
                      'linear-gradient(rgba(251,191,36,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.4) 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                    maskImage: 'radial-gradient(ellipse 70% 100% at 0% 0%, black, transparent)',
                    WebkitMaskImage: 'radial-gradient(ellipse 70% 100% at 0% 0%, black, transparent)',
                  }}
                />
                <button
                  onClick={onClose}
                  className="absolute right-6 top-6 rounded-full bg-black/30 p-2 text-zinc-400 transition-all hover:rotate-90 hover:text-white"
                >
                  <X size={20} />
                </button>

                <div className="relative z-10 flex flex-wrap items-center gap-2">
                  <span className="flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/70 px-2.5 py-1 text-xs font-semibold text-zinc-300">
                    <Star size={12} className="text-accent" fill="currentColor" /> {project.stars}
                  </span>
                  {project.language && (
                    <span className="flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/70 px-2.5 py-1 text-xs font-semibold text-zinc-300">
                      <span className="h-2 w-2 rounded-full bg-accent" /> {project.language}
                    </span>
                  )}
                  {project.private && (
                    <span className="rounded-full border border-zinc-800 bg-zinc-900/70 px-2.5 py-1 text-xs font-semibold text-zinc-500">
                      Private
                    </span>
                  )}
                </div>
                <h3 className="relative z-10 mt-4 font-display text-3xl font-bold text-white">{project.title}</h3>
              </div>

              {/* Content */}
              <div className="custom-scrollbar overflow-y-auto p-8">
                <p className="mb-8 text-lg leading-relaxed text-zinc-300">{project.description}</p>

                <h4 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-500">
                  <Code2 size={14} className="text-accent" /> Stack
                </h4>
                <div className="mb-8 flex flex-wrap gap-2">
                  {project.tech.map((t) => {
                    const { icon: Icon, label } = getTechDetails(t);
                    return (
                      <div key={t} className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-400">
                        <Icon size={14} className="text-zinc-500" />
                        {label}
                      </div>
                    );
                  })}
                </div>

                {project.topics.length > 0 && (
                  <div className="mb-8 flex flex-wrap gap-2">
                    {project.topics.map((topic) => (
                      <span key={topic} className="rounded-md bg-accent/10 px-2 py-1 font-mono text-xs text-accent/90">
                        #{topic}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex flex-col gap-3 border-t border-zinc-800 pt-6 sm:flex-row">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex flex-1 items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3.5 font-bold text-zinc-900 shadow-[0_0_20px_rgba(251,191,36,0.2)] transition-all hover:bg-white"
                  >
                    <Github size={18} /> View on GitHub
                  </a>
                  {project.homepageUrl && (
                    <a
                      href={project.homepageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800 px-6 py-3.5 font-bold text-white transition-all hover:border-accent/50"
                    >
                      Live Demo <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
