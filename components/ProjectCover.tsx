import React from 'react';
import { Star } from 'lucide-react';
import type { Project } from '../types';
import { TechIcon } from './TechIcon';

// Drop `assets/projects/<repo name>.{png,jpg,webp}` in and that project shows
// the real screenshot instead of generated art.
const SHOTS = import.meta.glob<string>('../assets/projects/*.{png,jpg,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
});
const screenshot = (name: string) =>
  Object.entries(SHOTS).find(([path]) => path.split('/').pop()!.replace(/\.\w+$/, '') === name)?.[1];

// Order is fixed, so every project keeps its colour across grid and modal.
const FIELDS = ['#146ef5', '#1f5c47', '#efe8dc', '#dfe4ee', '#ffd84a', '#dbe8ff'];

// What the project is decides what the art shows, so the grid is not ten
// copies of one mock. Window wins over terminal: Arc is a desktop app that
// happens to embed a terminal.
type Motif = 'window' | 'terminal' | 'chat';
const motif = (p: Project): Motif => {
  const d = p.description.toLowerCase();
  if (/\b(desktop|app|browser|saas|platform|studio|keyboard|workspace)\b/.test(d)) return 'window';
  if (/\b(terminal|cli|engine)\b/.test(d)) return 'terminal';
  return 'chat';
};

/** Cover proportions that suit each motif: terminals run tall, app windows
 *  wide, chats square. Drives the staggered heights in the work masonry. */
export const coverAspect = (p: Project) =>
  screenshot(p.name)
    ? 'aspect-[16/10]'
    : { terminal: 'aspect-square', window: 'aspect-[4/3]', chat: 'aspect-[5/4]' }[motif(p)];

const BUILD: Record<string, [string, string]> = {
  Rust: ['cargo build --release', 'Finished `release` profile [optimized]'],
  Python: ['pip install -e .', 'Successfully installed'],
  TypeScript: ['npm install && npm run build', '✓ built'],
};

const Dots: React.FC = () => (
  <>
    <span className="size-2 rounded-full bg-[#ff6159]" />
    <span className="size-2 rounded-full bg-[#ffbd2e]" />
    <span className="size-2 rounded-full bg-[#28c941]" />
  </>
);

const frame = 'absolute inset-x-[8%] top-[17%] -bottom-6 overflow-hidden rounded-t-xl text-left';

const Terminal: React.FC<{ p: Project; compact: boolean }> = ({ p, compact }) => {
  const [cmd, out] = BUILD[p.language ?? ''] ?? ['make', 'done'];
  return (
    <div className={`${frame} bg-[#0a1120] shadow-[0_20px_40px_-12px_rgba(0,0,0,0.45)]`}>
      <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
        <Dots />
        <span className="ml-3 font-mono text-[10px] text-mute">~/{p.name}</span>
      </div>
      <div className={`space-y-1 whitespace-nowrap font-mono ${compact ? 'p-3 text-[10px]' : 'p-4 text-[11px] sm:text-xs'}`}>
        <p className="truncate text-mute"><span className="text-sun">$</span> git clone github.com/vedantnimbarte/{p.name}</p>
        <p className="truncate text-ink"><span className="text-sun">$</span> {cmd}</p>
        <p className="truncate text-[#4ade80]">{out} {p.name}</p>
        <p className={`${compact ? 'pt-2 text-lg' : 'pt-3 text-2xl sm:text-3xl'} font-sans font-bold tracking-tight text-ink`}>{p.title}</p>
        <p className="text-ink"><span className="text-sun">$</span> <span className="inline-block h-3.5 w-2 translate-y-0.5 bg-ink/80" /></p>
      </div>
    </div>
  );
};

const Window: React.FC<{ p: Project; compact: boolean; dark: boolean }> = ({ p, compact, dark }) => {
  const rule = dark ? 'border-white/10' : 'border-black/10';
  const faint = dark ? 'bg-white/10' : 'bg-black/5';
  return (
    <div className={`${frame} shadow-[0_20px_40px_-12px_rgba(0,0,0,0.35)] ${dark ? 'bg-navy text-ink' : 'bg-white text-navy'}`}>
      <div className={`flex items-center gap-1.5 border-b px-3 py-2 ${rule}`}>
        <Dots />
        <span className={`ml-3 text-[10px] font-semibold ${dark ? 'text-mute' : 'text-[#5b6780]'}`}>{p.title}</span>
      </div>
      <div className="flex h-full">
        <div className={`flex w-[22%] flex-col gap-2 border-r p-3 ${rule}`}>
          {[70, 50, 60, 40].map((w, i) => (
            <span key={w} className={`h-1.5 rounded-full ${i === 0 ? 'bg-blue' : faint}`} style={{ width: `${w}%` }} />
          ))}
        </div>
        <div className={compact ? 'flex-1 p-3' : 'flex-1 p-4 sm:p-5'}>
          <p className={`${compact ? 'text-lg' : 'text-2xl sm:text-[1.75rem]'} font-bold leading-none tracking-tight`}>{p.title}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {p.tech.slice(0, 3).map((t) => (
              <span key={t} className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${faint}`}>
                <TechIcon name={t} size={10} />
                {t}
              </span>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2">
            {[0, 1, 2].map((i) => (
              <span key={i} className={`h-10 rounded-md ${i === 0 ? 'bg-blue/80' : faint}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Chat: React.FC<{ p: Project; compact: boolean }> = ({ p, compact }) => (
  <div className={`absolute inset-x-[10%] top-[56%] flex -translate-y-1/2 flex-col gap-2 text-left ${compact ? 'text-[10px]' : 'text-xs sm:text-[13px]'}`}>
    <p className="self-end rounded-2xl rounded-br-md bg-navy px-3.5 py-2 text-ink shadow-lg">
      What is {p.title} built with?
    </p>
    <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-white px-3.5 py-3 text-navy shadow-lg">
      <p className={`${compact ? 'text-base' : 'text-xl sm:text-2xl'} font-bold leading-tight tracking-tight`}>{p.title}</p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {p.tech.slice(0, 4).map((t) => (
          <span key={t} className="flex items-center gap-1 rounded-full bg-[#eef2f8] px-2 py-0.5 text-[10px] font-semibold">
            <TechIcon name={t} size={10} />
            {t}
          </span>
        ))}
      </div>
      <p className="mt-2 flex items-center gap-1 text-[10px] text-[#5b6780]">
        <Star size={10} /> {p.stars} on GitHub
      </p>
    </div>
  </div>
);

export const ProjectCover: React.FC<{ project: Project; index: number; compact?: boolean }> = ({
  project, index, compact = false,
}) => {
  const shot = screenshot(project.name);
  return (
    <div
      aria-hidden
      className="relative h-full w-full overflow-hidden"
      style={{ backgroundColor: FIELDS[index % FIELDS.length] }}
    >
      {shot ? (
        <img
          src={shot}
          alt=""
          loading="lazy"
          className="absolute left-[8%] top-[17%] w-[84%] rounded-t-xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.45)]"
        />
      ) : {
        terminal: <Terminal p={project} compact={compact} />,
        window: <Window p={project} compact={compact} dark={index % 2 === 0} />,
        chat: <Chat p={project} compact={compact} />,
      }[motif(project)]}
    </div>
  );
};
