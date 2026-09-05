import {
  Boxes, Cpu, Download, HelpCircle, Layers, Mail, Power, Send, Terminal, User,
} from 'lucide-react';
import type { Command, ModuleId, Project } from '../types';
import projectsData from '../data/projects.json';

const PROJECTS = projectsData as Project[];

export type CommandRun =
  | { kind: 'module'; module: ModuleId }
  | { kind: 'project'; name: string }
  | { kind: 'ask'; text: string }
  | { kind: 'boot' };

export interface ConsoleCommand extends Command {
  run: CommandRun;
}

const moduleCommands: ConsoleCommand[] = [
  { id: 'cmd/identity', group: 'module', label: 'Identity', hint: 'who and where', icon: User, keywords: ['about', 'bio', 'home', 'operator'], run: { kind: 'module', module: 'identity' } },
  { id: 'cmd/ops', group: 'module', label: 'Operations', hint: 'employment history', icon: Layers, keywords: ['experience', 'jobs', 'career', 'work history'], run: { kind: 'module', module: 'ops' } },
  { id: 'cmd/work', group: 'module', label: 'Work', hint: `${PROJECTS.length} repositories`, icon: Boxes, keywords: ['projects', 'repos', 'github', 'code'], run: { kind: 'module', module: 'work' } },
  { id: 'cmd/stack', group: 'module', label: 'Stack', hint: 'tools and domains', icon: Cpu, keywords: ['skills', 'tech', 'toolkit'], run: { kind: 'module', module: 'stack' } },
];

const actionCommands: ConsoleCommand[] = [
  { id: 'cmd/hire', group: 'action', label: 'Hire', hint: 'availability', icon: Send, keywords: ['available', 'recruit', 'freelance', 'contract'], run: { kind: 'ask', text: 'hire' } },
  { id: 'cmd/contact', group: 'action', label: 'Contact', hint: 'channels', icon: Mail, keywords: ['email', 'linkedin', 'reach', 'message'], run: { kind: 'ask', text: 'contact' } },
  { id: 'cmd/resume', group: 'action', label: 'Resume', hint: 'credentials', icon: Download, keywords: ['cv', 'pdf', 'download'], run: { kind: 'ask', text: 'resume' } },
  { id: 'cmd/help', group: 'action', label: 'Help', hint: 'what this index covers', icon: HelpCircle, keywords: ['commands', 'usage', 'index'], run: { kind: 'ask', text: 'help' } },
  { id: 'cmd/boot', group: 'action', label: 'Replay boot', hint: 'run the init sequence', icon: Power, keywords: ['restart', 'init', 'post'], run: { kind: 'boot' } },
];

// Generated, not hand-listed — adding a repo to FEATURED in
// scripts/fetch-projects.mjs adds a command here for free.
const projectCommands: ConsoleCommand[] = PROJECTS.map((p) => ({
  id: `cmd/project/${p.name}`,
  group: 'project',
  label: p.title,
  hint: `${p.language ?? 'multi'} · ${p.stars}*`,
  icon: Terminal,
  keywords: [p.name, ...(p.language ? [p.language] : []), ...p.tech, p.category],
  run: { kind: 'project', name: p.name },
}));

export const COMMANDS: ConsoleCommand[] = [
  ...moduleCommands,
  ...actionCommands,
  ...projectCommands,
];

/**
 * Substring tiers, deliberately NOT the IDF scorer from knowledge.ts.
 * Command labels are one to three words; IDF over nineteen short strings is
 * noise. Ties break by group order, then by curated array order.
 */
export const filterCommands = (query: string): ConsoleCommand[] => {
  const q = query.trim().toLowerCase();
  if (!q) return COMMANDS;

  const rank = (c: ConsoleCommand): number => {
    const label = c.label.toLowerCase();
    if (label.startsWith(q)) return 4;
    if (label.split(/\s+/).some((w) => w.startsWith(q))) return 3;
    if (label.includes(q)) return 2;
    if ((c.keywords ?? []).some((k) => k.toLowerCase().includes(q))) return 1;
    return 0;
  };

  return COMMANDS.map((c, i) => ({ c, r: rank(c), i }))
    .filter((x) => x.r > 0)
    .sort((a, b) => b.r - a.r || a.i - b.i)
    .map((x) => x.c);
};

/** A sentence, not a command — send it to the assistant instead. */
export const looksLikeQuestion = (query: string): boolean => {
  const q = query.trim();
  return q.endsWith('?') || q.split(/\s+/).length > 3;
};
