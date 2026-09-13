import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github, Star, X } from 'lucide-react';
import { Project } from '../types';
import projectsData from '../data/projects.json';
import { getTechDetails } from './ui/tech';
import { relativeTime } from '../lib/format';
import { ProjectCover } from './ProjectCover';

const PROJECTS = projectsData as Project[];

interface ProjectModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ project, isOpen, onClose }) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  // Escape to close, and put focus back where it came from.
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
            className="fixed inset-0 z-[200] bg-deep/80 backdrop-blur-sm"
          />

          <div className="pointer-events-none fixed inset-0 z-[201] flex items-center justify-center p-4">
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="project-modal-title"
              tabIndex={-1}
              initial={{ opacity: 0, y: 16, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="card pointer-events-auto relative flex max-h-[88vh] w-full max-w-2xl flex-col overflow-hidden focus:outline-none"
            >
              <div className="relative aspect-[16/7] shrink-0">
                <ProjectCover project={project} index={PROJECTS.findIndex((p) => p.name === project.name)} />
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close"
                  className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-navy/80 text-ink transition-colors hover:bg-navy"
                >
                  <X size={16} aria-hidden />
                </button>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto p-6 sm:p-8">
                <h2 id="project-modal-title" className="t-h2">{project.title}</h2>
                <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 t-small text-mute">
                  <span className="flex items-center gap-1 text-sun">
                    <Star size={13} aria-hidden />
                    {project.stars}
                    <span className="sr-only"> stars</span>
                  </span>
                  <span>{project.language ?? 'Multi-language'}</span>
                  <span>Updated {relativeTime(project.updatedAt)}</span>
                </p>

                <p className="mt-5 t-body text-mute">{project.description}</p>

                <ul className="mt-6 flex flex-wrap gap-2" aria-label="Stack">
                  {project.tech.map((t) => {
                    const { icon: Icon, label } = getTechDetails(t);
                    return (
                      <li key={t} className="flex items-center gap-1.5 rounded-full border border-line bg-deep px-3 py-1 t-small">
                        <Icon size={13} className="text-blue" aria-hidden />
                        {label}
                      </li>
                    );
                  })}
                </ul>
              </div>

              <div className="flex shrink-0 flex-wrap gap-3 border-t border-line p-4 sm:px-8">
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 t-small font-semibold text-navy transition-colors hover:bg-sun"
                >
                  <Github size={15} aria-hidden />
                  View on GitHub
                </a>
                {project.homepageUrl && (
                  <a
                    href={project.homepageUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 rounded-full border border-line px-5 py-2.5 t-small font-semibold transition-colors hover:border-ink"
                  >
                    <ExternalLink size={15} aria-hidden />
                    Open live site
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
