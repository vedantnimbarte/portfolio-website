import React from 'react';
import { Star } from 'lucide-react';
import type { Project } from '../types';

// The reference's covers are bright website screenshots against the navy page.
// Repos have no screenshots, so each gets a coloured field with a mock window
// showing its real name, tagline and stack. Order is fixed, so every project
// keeps its colour across the grid, the strip and the modal.
const SWATCHES = [
  { field: '#146ef5', win: '#0d1526', ink: '#ffffff', mute: '#93a0ba', chip: '#ffd84a', chipInk: '#0d1526' },
  { field: '#1f5c47', win: '#f3eee4', ink: '#14231c', mute: '#5c6b62', chip: '#dff27a', chipInk: '#0d1526' },
  { field: '#efe8dc', win: '#ffffff', ink: '#161b26', mute: '#6b7280', chip: '#146ef5', chipInk: '#ffffff' },
  { field: '#dfe4ee', win: '#0d1526', ink: '#ffffff', mute: '#93a0ba', chip: '#8b7bff', chipInk: '#ffffff' },
  { field: '#ffd84a', win: '#0d1526', ink: '#ffffff', mute: '#93a0ba', chip: '#ffd84a', chipInk: '#0d1526' },
  { field: '#dbe8ff', win: '#ffffff', ink: '#0d1526', mute: '#5b6780', chip: '#146ef5', chipInk: '#ffffff' },
];

// First sentence, or the first clause if the sentence runs long.
const tagline = (d: string) => {
  const s = d.split(/(?<=\.)\s/)[0].replace(/\.$/, '');
  return s.length <= 90 ? s : s.slice(0, s.lastIndexOf(' ', 86)) + '…';
};

export const ProjectCover: React.FC<{ project: Project; index: number; compact?: boolean }> = ({
  project, index, compact = false,
}) => {
  const c = SWATCHES[index % SWATCHES.length];
  return (
    <div
      aria-hidden
      className="relative h-full w-full overflow-hidden"
      style={{ backgroundColor: c.field }}
    >
      <div
        className="absolute left-[8%] right-[8%] top-[12%] -bottom-6 rounded-t-xl text-left shadow-[0_20px_40px_-12px_rgba(0,0,0,0.35)]"
        style={{ backgroundColor: c.win, color: c.ink }}
      >
        <div className="flex items-center gap-1.5 border-b px-3 py-2" style={{ borderColor: `${c.mute}33` }}>
          <span className="size-2 rounded-full bg-[#ff6159]" />
          <span className="size-2 rounded-full bg-[#ffbd2e]" />
          <span className="size-2 rounded-full bg-[#28c941]" />
          <span className="ml-3 truncate font-mono text-[10px]" style={{ color: c.mute }}>
            github.com/vedantnimbarte/{project.name}
          </span>
        </div>

        <div className={compact ? 'p-4' : 'p-5 sm:p-6'}>
          <p className={`${compact ? 'text-xl' : 'text-2xl sm:text-[1.75rem]'} font-bold leading-none tracking-tight`}>
            {project.title}
          </p>
          <p
            className={`mt-2 max-w-[30ch] ${compact ? 'text-[11px]' : 'text-xs sm:text-[13px]'} leading-snug`}
            style={{ color: c.mute }}
          >
            {tagline(project.description)}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-1.5">
            {project.tech.slice(0, 3).map((t) => (
              <span
                key={t}
                className="rounded-full px-2 py-0.5 text-[10px] font-semibold"
                style={{ backgroundColor: c.chip, color: c.chipInk }}
              >
                {t}
              </span>
            ))}
            <span className="ml-1 flex items-center gap-1 text-[10px]" style={{ color: c.mute }}>
              <Star size={10} /> {project.stars}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
