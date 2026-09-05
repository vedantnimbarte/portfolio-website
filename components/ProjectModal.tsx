import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Star, X } from 'lucide-react';
import { Project } from '../types';
import { getTechDetails } from './ui/tech';
import { relativeTime } from '../lib/format';
import { Ticks } from './ui/Panel';

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  // Escape to close, and put focus back where it came from. Shipping a fake OS
  // with a modal you cannot escape would be the worst kind of irony.
  useEffect(() => {
    if (!isOpen) return;
    opener.current = document.activeElement as HTMLElement | null;
    panelRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      opener.current?.focus?.();
    };
  }, [isOpen, onClose]);

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
            className="fixed inset-0 z-[200] bg-void/85"
          />

          <div className="pointer-events-none fixed inset-0 z-[201] flex items-center justify-center p-4">
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-modal-title"
              tabIndex={-1}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              className="bevel pointer-events-auto relative flex max-h-[85vh] w-full max-w-2xl flex-col border border-trace bg-hull focus:outline-none"
            >
              <Ticks />

              <div className="shrink-0 border-b border-trace p-6">
                <div className="mb-3 flex items-start gap-4">
                  <h2 id="project-modal-title" className="t-module text-ink">
                    {project.title}
                  </h2>
                  <span aria-hidden className="mt-3 h-px flex-1 bg-trace" />
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="-mr-1 -mt-1 p-1.5 text-ink-dim transition-colors hover:text-signal"
                  >
                    <X size={16} aria-hidden />
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="t-micro flex items-center gap-1 text-record">
                    <Star size={10} aria-hidden />
                    {project.stars}
                    <span className="sr-only"> stars</span>
                  </span>
                  <span className="t-micro text-ink-dim">{project.language ?? 'Multi'}</span>
                  <span className="t-micro text-ink-dim">
                    updated {relativeTime(project.updatedAt)}
                  </span>
                </div>
              </div>

              <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto p-6">
                <p className="t-prose mb-6 text-ink-dim">{project.description}</p>

                <p className="t-label mb-2 text-ink-dim">Stack</p>
                <ul className="mb-6 flex flex-wrap gap-1.5">
                  {project.tech.map((t) => {
                    const { icon: Icon, label } = getTechDetails(t);
                    return (
                      <li
                        key={t}
                        className="t-micro flex items-center gap-1.5 rounded-[2px] border border-trace bg-void px-2 py-1 text-ink-dim"
                      >
                        <Icon size={10} aria-hidden />
                        {label}
                      </li>
                    );
                  })}
                </ul>

                {project.topics.length > 0 && (
                  <>
                    <p className="t-label mb-2 text-ink-dim">Topics</p>
                    <ul className="flex flex-wrap gap-1.5">
                      {project.topics.map((t) => (
                        <li key={t} className="t-micro text-ink-dim">
                          #{t}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>

              <div className="flex shrink-0 gap-px border-t border-trace">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="t-micro flex flex-1 items-center justify-center gap-2 bg-signal/10 py-3 text-signal transition-colors hover:bg-signal/20"
                >
                  <Github size={12} aria-hidden />
                  View on GitHub
                </a>
                {project.homepageUrl && (
                  <a
                    href={project.homepageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="t-micro flex flex-1 items-center justify-center gap-2 py-3 text-ink-dim transition-colors hover:text-signal"
                  >
                    <ExternalLink size={12} aria-hidden />
                    Live demo
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
